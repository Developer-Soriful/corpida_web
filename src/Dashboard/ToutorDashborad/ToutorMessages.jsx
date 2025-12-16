import React, { useState, useEffect, useRef, useContext } from "react";
import logo from '../../assets/send-svgrepo-com 2.png';
import { useSocket } from "../../context/SocketContext";
import MessageService from "../../services/message.service";
import { toast } from "react-toastify";
import { useLocation } from "react-router";
import api from "../../services/api";
import { useAuth } from "../../context/UseAuth";

export default function ToutorMessages() {
    const { socket, onlineUsers } = useSocket();
    const [conversations, setConversations] = useState([]);
    const [activeConversation, setActiveConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const messagesEndRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const { user } = useAuth(); // Assuming UseAuth hook works for tutors too

    // Fetch conversations on mount
    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const res = await MessageService.getConversations();
                const fetchedConversations = res?.response?.data?.docs || [];
                setConversations(fetchedConversations);

                if (targetConvId) {
                    // Check if it exists in list
                    const found = fetchedConversations.find(c => c._id === targetConvId);
                    if (found) {
                        handleSelectConversation(found);
                    } else if (state?.conversation) {
                         // If not found in fetch (e.g. new), use the passed populated object
                        setConversations(prev => [state.conversation, ...prev]);
                        handleSelectConversation(state.conversation);
                    }
                }
            } catch (error) {
                console.error("Error fetching conversations:", error);
            }
        };

        fetchConversations();
    }, []);

    // Scroll to bottom of chat
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Handle incoming messages
    useEffect(() => {
        if (!socket) return;

        const handleNewMessage = (message) => {
            // Update messages list if viewing this conversation
            if (activeConversation && (message.conversation === activeConversation._id || message.conversation?._id === activeConversation._id)) {
                setMessages((prev) => [...prev, message]);
                
                // Mark as read immediately if window is open
                socket.emit("read-message", { conversationId: activeConversation._id, messageId: message._id });
            }

            // Update conversations list (latest message)
            setConversations((prev) => {
                const updated = prev.map(conv => {
                    if (conv._id === message.conversation || conv._id === message.conversation?._id) {
                        return { 
                            ...conv, 
                            lastMessage: message.content, 
                            lastMessageAt: message.createdAt 
                        };
                    }
                    return conv;
                });
                // Optional: Re-sort by lastMessageAt
                return updated.sort((a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt));
            });
        };

        socket.on("new-message", handleNewMessage);

        return () => {
            socket.off("new-message", handleNewMessage);
        };
    }, [socket, activeConversation]);

    const handleSelectConversation = async (conv) => {
        setActiveConversation(conv);
        setLoading(true);

        // Join conversation room
        if (socket) {
            socket.emit("join-conversation", { conversationId: conv._id });
        }

        try {
            const res = await MessageService.getMessages(conv._id);
            let msgs = [];
            const data = res?.response?.data || res?.data;
            
            if (Array.isArray(data)) {
                msgs = data;
            } else if (data?.docs && Array.isArray(data.docs)) {
                msgs = data.docs;
            }
            setMessages(msgs);
            
            // Mark last message read?
            // socket.emit("read-message", ...)
        } catch (error) {
            console.error("Error fetching messages:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !activeConversation) return;

        try {
            // Optimistic update? Or wait for socket? API response usually returns the message.
            const payload = {
                type: "text",
                content: newMessage
            };

            const res = await MessageService.sendMessage(activeConversation._id, payload);
            setNewMessage("");
            
            // If the API returns the created message, append it
            // AND/OR socket will broadcast it. If socket broadcasts to sender too, we might get duplicate if we append here.
            // Usually sender appends from API response, socket events filter out own messages OR we rely purely on socket.
            // User requirement: "Note: Do not manually append the message to the UI immediately if you want to rely on the socket new-message event for consistency, OR append optimistically."
            // I will NOT append manually and rely on socket, as it's cleaner for now, assuming backend emits to sender too.
            // If backend doesn't emit to sender, I should append `res.data` here.
            
            // Safer: Append response data (it's authoritative)
            const createdMsg = res?.data || res?.response?.data;
            if(createdMsg) {
                 // Check if socket already added it to avoid dupes? 
                 // Simple check: if last message id != createdMsg id
                 setMessages((prev) => {
                     if (prev.some(m => m._id === createdMsg._id)) return prev;
                     return [...prev, createdMsg];
                 });
                 
                 // Update conversation list
                 setConversations((prev) => {
                    const updated = prev.map(c => {
                        if (c._id === activeConversation._id) {
                            return { ...c, lastMessage: createdMsg.content, lastMessageAt: createdMsg.createdAt };
                        }
                        return c;
                    });
                     return updated.sort((a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt));
                });
            }

        } catch (error) {
            console.error("Error sending message:", error);
            toast.error("Failed to send message");
        }
    };

    // Helper to get other participant
    const getOtherParticipant = (conv) => {
        const myId = user?._id || user?.id;
        if (!myId || !conv.participants) return {};
        
        // Find someone who is NOT me
        // Ensure to handle case where participant might not be populated (though it should be)
        const participant = conv.participants.find(p => {
             const pId = p._id || p; // Handle populated object or direct ID
             return String(pId) !== String(myId);
        });
        
        if (!participant) {
            // If only I am in the conversation, or logic fails, try to return valid 'other' info if possible
            // But don't default to 'me' if avoidable. 
            // If data is bad, return empty/placeholder
            return {}; 
        }
        
        return participant;
    };
    
    // Helper to check online status
    const isOnline = (userId) => {
        return onlineUsers.includes(userId);
    }

    return (
        <div className="">
            {/* Header */}
            <h2 className="text-[#6657E2] font-semibold text-xl mb-1">
                Messages
            </h2>
            <p className="text-gray-500 text-sm mb-6">
                Communicate with your tutors and stay connected.
            </p>
            <div className="flex  h-[700px] ">

                {/* Left Sidebar */}
                <div className="w-64 bg-white rounded-xl p-4 shadow-lg space-y-4 overflow-y-auto">
                    <div>
                        <h2 className="text-[#6657E2] font-semibold text-xl mb-1">Conversations</h2>
                    </div>

                    {/* Conversations List */}
                    <div className="flex flex-col space-y-2">
                        {!user ? (
                             <p className="text-center text-gray-400 text-sm mt-4">Loading user data...</p>
                        ) : (
                            conversations.map((conv, i) => {
                                const other = getOtherParticipant(conv);
                                const isActive = activeConversation?._id === conv._id;
                                
                                return (
                                    <button
                                        key={conv._id || i}
                                        onClick={() => handleSelectConversation(conv)}
                                        className={`flex items-center gap-3 p-3 rounded-lg  cursor-pointer text-left
                                        ${isActive
                                                ? "bg-gray-200 text-[#3D3D3D] font-bold"
                                                : "hover:bg-gray-100 text-[#3D3D3D]"
                                            }`}
                                    >
                                        <img
                                            src={other.avatar || "https://placehold.co/40"}
                                            alt={other.name}
                                            className="w-10 h-10 rounded-full object-cover"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-center">
                                                <p className="text-sm truncate font-medium">{other.name || "Unknown User"}</p>
                                                {other._id && isOnline(other._id) && <span className="w-2 h-2 bg-green-500 rounded-full"></span>}
                                            </div>
                                            <p className="text-xs text-gray-400 truncate">
                                                {typeof conv.lastMessage === 'string' 
                                                    ? conv.lastMessage 
                                                    : conv.lastMessage?.content || "No messages yet"
                                                }
                                            </p>
                                        </div>
                                    </button>
                                );
                            })
                        )}
                        {user && conversations.length === 0 && <p className="text-center text-gray-400 text-sm">No conversations found</p>}
                    </div>

                </div>

                {/* Chat Area */}
                {activeConversation ? (
                    <div className="flex-1 bg-white rounded-xl p-6 shadow-lg ml-6 flex flex-col">
                        {/* Header */}
                        <div className="flex items-center gap-3 mb-6 border-b pb-4">
                            <img
                                src={getOtherParticipant(activeConversation).avatar || "https://placehold.co/40"}
                                alt="User"
                                className="w-10 h-10 rounded-full object-cover"
                            />
                            <div>
                                <p className="font-semibold text-gray-900">{getOtherParticipant(activeConversation).name}</p>
                                <p className="text-xs text-gray-500">
                                    {isOnline(getOtherParticipant(activeConversation)._id) ? "Online" : "Offline"}
                                </p>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                            {loading && <p className="text-center text-gray-400">Loading messages...</p>}
                            {!loading && messages.length === 0 && (
                                <p className="text-gray-400 text-center mt-10">No messages yet.</p>
                            )}

                            {messages.map((msg, i) => {
                                const myId = user?._id || user?.id;
                                const isMe = msg.sender === myId || msg.sender?._id === myId;
                                
                                return (
                                    <div
                                        key={msg._id || i}
                                        className={`max-w-xs p-3 rounded-lg text-sm ${isMe ? "ml-auto text-white" : "bg-gray-200 text-gray-800"
                                            }`}
                                        style={
                                            isMe
                                                ? {
                                                    background:
                                                        "linear-gradient(90deg, #6657E2 0%, #903CD1 100%)",
                                                }
                                                : {}
                                        }
                                    >
                                        <p>{msg.content}</p> {/* Handle file attachments later? */}
                                        <span
                                            className={`block mt-1 text-xs opacity-70 ${isMe ? "text-[#ffffff]" : "text-gray-500"
                                                }`}
                                        >
                                            {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ""}
                                        </span>
                                    </div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>


                        {/* Input Box */}
                        <div className="mt-6 flex items-center justify-center">
                            <div className="relative w-full max-w-4xl"> 
                                {/* Plus Icon (Left Outside) - Placeholder for File Upload */}
                                <button className="absolute -left-10 top-1/2 -translate-y-1/2 bg-white shadow-md w-10 h-10 rounded-full flex items-center justify-center text-purple-600 text-2xl font-bold hover:bg-gray-50">
                                    +
                                </button>

                                {/* Input Box */}
                                <div className="border border-gray-300 rounded-full pl-6 pr-6 py-3 flex items-center bg-white">
                                    <input
                                        type="text"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                        placeholder="Type a message..."
                                        className="flex-1 outline-none border-none text-[15px]"
                                    />
                                </div>

                                {/* Send Icon (Right Outside) */}
                                <button 
                                    onClick={handleSendMessage}
                                    className="absolute -right-10 top-1/2 -translate-y-1/2 bg-white shadow-md w-10 h-10 rounded-full flex items-center justify-center text-purple-600 text-xl hover:bg-gray-50 transition-colors">
                                    <img src={logo} alt="Send" />
                                </button>

                            </div>
                        </div>

                    </div>
                ) : (
                    <div className="flex-1 bg-white rounded-xl p-6 shadow-lg ml-6 flex flex-col justify-center items-center text-gray-400">
                        <p>Select a conversation to start chatting</p>
                    </div>
                )}
            </div>
        </div>
    );
}
