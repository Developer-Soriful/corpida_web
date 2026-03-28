import { useState, useEffect, useRef } from "react";
import { useSocket } from "../../context/SocketContext";
import MessageService from "../../services/message.service";
import { toast } from "react-toastify";
import { useLocation } from "react-router";
import { useAuth } from "../../context/UseAuth";

export default function Messages() {
    const { socket, onlineUsers } = useSocket();
    const [conversations, setConversations] = useState([]);
    const [activeConversation, setActiveConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const textareaRef = useRef(null);
    const messagesEndRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [showMobileChat, setShowMobileChat] = useState(false);
    const location = useLocation();
    const { user } = useAuth(); 
    // Fetch conversations on mount
    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const res = await MessageService.getConversations();
                const fetchedConversations = res?.response?.data?.docs || [];
                setConversations(fetchedConversations);

                const state = location.state;
                const targetConvId = state?.conversation?._id || state?.conversationId;

                if (targetConvId) {
                    const found = fetchedConversations.find(c => c._id === targetConvId);
                    if (found) {
                        handleSelectConversation(found);
                    } else if (state?.conversation) {
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
        setShowMobileChat(true); // Show chat on mobile when conversation selected
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
            // Sort messages by createdAt ascending (oldest first, newest at bottom)
            msgs.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            setMessages(msgs);

            // Scroll to bottom after loading messages
            setTimeout(() => {
                messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
            }, 100);

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
            const payload = {
                type: "text",
                content: newMessage.trim()
            };

            const res = await MessageService.sendMessage(activeConversation._id, payload);
            setNewMessage("");
            setIsTyping(false);

            // Reset textarea height
            if (textareaRef.current) {
                textareaRef.current.style.height = 'auto';
            }

            const createdMsg = res?.data || res?.response?.data;
            if (createdMsg) {
                setMessages((prev) => {
                    if (prev.some(m => m._id === createdMsg._id)) return prev;
                    return [...prev, createdMsg];
                });

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

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        setNewMessage(value);
        setIsTyping(value.trim().length > 0);

        // Auto-resize textarea
        const textarea = e.target;
        textarea.style.height = 'auto';
        const newHeight = Math.min(textarea.scrollHeight, 120); 
        textarea.style.height = newHeight + 'px';
    };

    // Helper to get other participant
    const getOtherParticipant = (conv) => {
        const myId = user?.id;
        if (!myId || !conv.participants) return {};

        const participant = conv.participants.find(p => {
            const pId = p._id || p; 
            return String(pId) !== String(myId);
        });

        if (!participant) {
            return {};
        }

        console.log(participant);

        return participant;
    };

    // Helper to check online status
    const isOnline = (userId) => {
        return onlineUsers.includes(userId);
    }

    return (
        <div className="h-full flex flex-col -mx-4 md:-mx-6 lg:-mx-8">
            {/* Mobile Header - Only visible on small screens */}
            <div className="md:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shrink-0">
                <h2 className="text-lg font-bold text-gray-900">Messages</h2>
                {activeConversation && showMobileChat && (
                    <button
                        onClick={() => setShowMobileChat(false)}
                        className="p-2 -mr-2 hover:bg-gray-100 rounded-lg"
                    >
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                )}
            </div>

            {/* Desktop Header - Compact */}
            <div className="hidden md:flex bg-white border-b border-gray-200 px-6 py-3 items-center justify-between shrink-0">
                <div>
                    <h2 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                        Messages
                    </h2>
                    <p className="text-gray-500 text-sm">
                        Communicate with your tutors and stay connected.
                    </p>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden bg-white rounded-b-2xl">
                {/* Left Sidebar - Conversations List */}
                <div className={`${showMobileChat && activeConversation ? 'hidden' : 'flex'} md:flex w-full md:w-80 lg:w-96 bg-white border-r border-gray-200 flex-col overflow-hidden`}>
                    {/* Search / Filter */}
                    <div className="p-4 border-b border-gray-100">
                        <div className="relative">
                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Search conversations..."
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-100 border-0 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:bg-white transition-all"
                            />
                        </div>
                    </div>

                    {/* Conversations List */}
                    <div className="flex-1 overflow-y-auto p-3 space-y-1">
                        {!user ? (
                            <p className="text-center text-gray-400 text-sm mt-4">Loading user data...</p>
                        ) : (
                            conversations.map((conv, i) => {
                                const other = getOtherParticipant(conv);
                                const isActive = activeConversation?._id === conv._id;
                                if (!other || !other._id) return null;

                                return (
                                    <button
                                        key={conv._id || i}
                                        onClick={() => handleSelectConversation(conv)}
                                        className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 text-left ${isActive
                                                ? "bg-purple-50 border border-purple-200"
                                                : "hover:bg-gray-50 border border-transparent"
                                            }`}
                                    >
                                        <div className="relative">
                                            <img
                                                src={other.avatar || "https://placehold.co/48"}
                                                alt={other.name}
                                                className="w-12 h-12 rounded-full object-cover"
                                            />
                                            {isOnline(other._id || other.id) && (
                                                <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white"></span>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-center mb-0.5">
                                                <p className="text-sm font-semibold text-gray-900 truncate">{other.name || "Unknown User"}</p>
                                                {conv.lastMessageAt && (
                                                    <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
                                                        {new Date(conv.lastMessageAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xs text-gray-500 truncate">
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
                        {user && conversations.length === 0 && (
                            <div className="text-center py-8">
                                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                </div>
                                <p className="text-gray-500 text-sm">No conversations yet</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Chat Area */}
                {activeConversation ? (
                    <div className={`${!showMobileChat ? 'hidden' : 'flex'} md:flex flex-1 bg-gray-50 flex-col overflow-hidden rounded-br-2xl`}>
                        {/* Chat Header */}
                        <div className="flex items-center gap-3 px-4 md:px-6 py-4 border-b border-gray-200 shrink-0 bg-white">
                            {/* Back button for mobile */}
                            <button
                                onClick={() => setShowMobileChat(false)}
                                className="md:hidden p-2 -ml-2 hover:bg-gray-100 rounded-xl transition-colors"
                            >
                                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>

                            <div className="relative">
                                <img
                                    src={getOtherParticipant(activeConversation).avatar || "https://placehold.co/40"}
                                    alt="User"
                                    className="w-10 h-10 md:w-11 md:h-11 rounded-full object-cover"
                                />
                                <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${isOnline(getOtherParticipant(activeConversation)._id || getOtherParticipant(activeConversation).id) ? "bg-green-500" : "bg-gray-300"}`}></span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-gray-900 truncate">{getOtherParticipant(activeConversation).name}</p>
                                <p className="text-xs text-gray-500">
                                    {isOnline(getOtherParticipant(activeConversation)._id || getOtherParticipant(activeConversation).id) ? "Online" : "Offline"}
                                </p>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4 space-y-3">
                            {loading && (
                                <div className="flex items-center justify-center py-8">
                                    <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            )}
                            {!loading && messages.length === 0 && (
                                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                    <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                                        <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                        </svg>
                                    </div>
                                    <p className="text-gray-500 font-medium">No messages yet</p>
                                    <p className="text-sm text-gray-400 mt-1">Start the conversation!</p>
                                </div>
                            )}

                            {messages.map((msg, i) => {
                                const myId = user?._id || user?.id;
                                const isMe = msg.sender === myId || msg.sender?._id === myId;
                                const showAvatar = !isMe && (i === 0 || messages[i - 1]?.sender !== msg.sender);

                                return (
                                    <div
                                        key={msg._id || i}
                                        className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                                    >
                                        <div className={`flex gap-2 max-w-[85%] md:max-w-[70%] lg:max-w-[60%] ${isMe ? "flex-row-reverse" : "flex-row"}`}>
                                            {!isMe && (
                                                <div className="w-8 h-8 shrink-0">
                                                    {showAvatar ? (
                                                        <img
                                                            src={getOtherParticipant(activeConversation).avatar || "https://placehold.co/32"}
                                                            alt=""
                                                            className="w-8 h-8 rounded-full object-cover"
                                                        />
                                                    ) : <div className="w-8" />}
                                                </div>
                                            )}
                                            <div
                                                className={`px-4 py-2.5 rounded-2xl text-sm ${isMe
                                                        ? "bg-gradient-to-r from-[#6657E2] to-[#903CD1] text-white rounded-br-md"
                                                        : "bg-white text-gray-800 rounded-bl-md shadow-sm"
                                                    }`}
                                            >
                                                <p className="leading-relaxed">{msg.content}</p>
                                                <span className={`block mt-1 text-xs opacity-70 ${isMe ? "text-white/80" : "text-gray-500"}`}>
                                                    {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Box */}
                        <div className="px-4 md:px-6 py-4 border-t border-gray-200 bg-white shrink-0">
                            <div className="flex items-end gap-2 md:gap-3 max-w-4xl mx-auto">
                                <button
                                    className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:text-purple-600 hover:bg-purple-50 transition-all duration-200">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                    </svg>
                                </button>

                                <div className="flex-1 flex items-end gap-2 bg-gray-100 rounded-2xl px-4 py-2.5 focus-within:bg-white focus-within:ring-2 focus-within:ring-purple-500/20 transition-all duration-200">
                                    <textarea
                                        ref={textareaRef}
                                        value={newMessage}
                                        onChange={handleInputChange}
                                        onKeyDown={handleKeyDown}
                                        placeholder="Type a message..."
                                        rows={1}
                                        className="flex-1 bg-transparent outline-none resize-none text-[15px] text-gray-800 placeholder-gray-400 min-h-[24px] max-h-[120px] py-1.5 leading-relaxed"
                                    />
                                </div>

                                <button
                                    onClick={handleSendMessage}
                                    disabled={!newMessage.trim()}
                                    className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${newMessage.trim()
                                            ? 'bg-gradient-to-r from-[#6657E2] to-[#903CD1] text-white shadow-lg shadow-purple-200 hover:shadow-xl hover:scale-105 active:scale-95'
                                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                        }`}>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="hidden md:flex flex-1 bg-gray-50 flex-col justify-center items-center text-gray-400 rounded-br-2xl">
                        <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center mb-4 shadow-sm">
                            <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                        </div>
                        <p className="text-gray-600 font-medium text-lg">Select a conversation</p>
                        <p className="text-gray-400 text-sm mt-1">Choose someone to start messaging</p>
                    </div>
                )}
            </div>
        </div>
    );
}
