import React, { useState, useEffect, useRef } from 'react';
import { FiMessageSquare, FiSend, FiPlus, FiMoreVertical, FiArrowLeft } from "react-icons/fi";
import api from "../services/api";
import { useSocket } from "../context/SocketContext";
import Spinner from './Spinner';
import { toast } from 'react-toastify';

// --- Assets ---
// Assuming user placeholder if not available
const USER_AVATAR = "https://ui-avatars.com/api/?name=Admin+Support&background=random";

export default function SupportSystem() {
    const { socket } = useSocket();
    const [view, setView] = useState('list'); // 'list', 'chat'
    const [tickets, setTickets] = useState([]);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [loading, setLoading] = useState(true);

    // --- Fetch Tickets ---
    const fetchTickets = async () => {
        try {
            const res = await api.get('/support/tickets');
            const data = res.response?.data?.docs || res.data?.docs || [];
            // Postman response structure: data.docs array
            // Or data array if mapped differently. Let's assume docs based on Postman.
            setTickets(data);
        } catch (error) {
            console.error("Failed to fetch tickets:", error);
            toast.error("Could not load support tickets.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTickets();

        if (socket) {
            socket.on('support-ticket-updated', () => {
                fetchTickets();
            });
        }
        return () => {
            if (socket) socket.off('support-ticket-updated');
        };
    }, [socket]);

    const handleCreateTicket = async () => {
        // For simplicity, let's auto-create a ticket if one doesn't exist or if user wants new. 
        // But matching the UI, it looks like a single continuous chat or list of chats.
        // Let's stick to list -> chat flow for robustness.
        const subject = prompt("Enter ticket subject:");
        if (!subject) return;

        try {
            const res = await api.post('/support/tickets', { subject, initialMessage: "Chat started" });
            const newTicket = res.response?.data || res.data;
            // Postman: data object directly
            setTickets(prev => [newTicket, ...prev]);
            setSelectedTicket(newTicket);
            setView('chat');
        } catch (error) {
            toast.error("Failed to create ticket");
        }
    };

    const handleOpenTicket = (ticket) => {
        setSelectedTicket(ticket);
        setView('chat');
    };

    if (loading) return <Spinner text="Loading Support..." />;

    return (
        <div className="w-full h-[calc(95vh-196px)] flex flex-col bg-[#F9FAFB]">
            {/* Top Header */}

            <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden relative flex flex-col">
                {view === 'list' && (
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold text-gray-800">Your Tickets</h2>
                            <button onClick={handleCreateTicket} className="text-[#6657E2] hover:text-[#5043b3] font-medium flex items-center gap-1">
                                <FiPlus /> New Ticket
                            </button>
                        </div>

                        {tickets.length === 0 ? (
                            <div className="text-center py-20 text-gray-400">
                                <p>No support tickets yet.</p>
                                <button onClick={handleCreateTicket} className="mt-4 px-4 py-2 bg-[#6657E2] text-white rounded-lg">Start a Chat</button>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {tickets.map(ticket => (
                                    <div key={ticket._id} onClick={() => handleOpenTicket(ticket)} className="p-4 border rounded-xl hover:bg-gray-50 cursor-pointer transition flex justify-between items-center">
                                        <div>
                                            <h3 className="font-semibold text-gray-800">{ticket.subject}</h3>
                                            <p className="text-sm text-gray-500 line-clamp-1">{ticket.lastMessage?.content || "No messages"}</p>
                                        </div>
                                        <span className={`px-2 py-1 rounded text-xs capitalize ${ticket.status === 'open' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>{ticket.status}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {view === 'chat' && selectedTicket && (
                    <ChatInterface
                        ticket={selectedTicket}
                        onBack={() => setView('list')}
                    />
                )}
            </div>
        </div>
    );
}

function ChatInterface({ ticket, onBack }) {
    const { socket } = useSocket();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef(null);
    const [page, setPage] = useState(1);

    // Fetch Messages
    const fetchMessages = async () => {
        try {
            // Using Postman endpoint logic
            const res = await api.get(`/support/tickets/${ticket._id}/messages?page=${page}&limit=50&sort=createdAt asc`);
            const data = res.response?.data?.docs || res.data?.docs || [];
            // Postman response: data.docs array
            // Ensure sorting is correct (oldest top, newest bottom)
            const sorted = data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            setMessages(sorted);
        } catch (error) {
            console.error("Message fetch error:", error);
        }
    };

    const handleSend = async (e) => {
        e.preventDefault();
        const content = newMessage.trim();
        if (!content) return;

        // 1. Optimistic Update
        const tempId = "temp-" + Date.now();
        const optimisticMsg = {
            _id: tempId,
            content: content,
            isAdminMessage: false, // User is sending
            sender: { name: "Me" },
            createdAt: new Date().toISOString(),
            isOptimistic: true
        };

        setMessages(prev => [...prev, optimisticMsg]);
        setNewMessage("");
        setSending(true);

        try {
            const res = await api.post(`/support/tickets/${ticket._id}/messages`, { content });
            const realMsg = res.response?.data?.data || res.data?.data || res.data; // Handle various response wrappers

            // 2. Replace optimistic with real ID
            setMessages(prev => prev.map(m => m._id === tempId ? realMsg : m));

        } catch (error) {
            console.error("Send failed", error);
            toast.error("Failed to send");
            // Remove optimistic message on failure
            setMessages(prev => prev.filter(m => m._id !== tempId));
        } finally {
            setSending(false);
        }
    };

    useEffect(() => {
        fetchMessages();

        // Join room
        if (socket) {
            socket.emit('join-support-ticket', { ticketId: ticket._id });

            socket.on('new-support-message', ({ ticketId, message }) => {
                if (ticketId === ticket._id) {
                    setMessages(prev => {
                        // 3. Deduplication Logic

                        // Check if we already have this real ID
                        if (prev.some(m => m._id === message._id)) return prev;

                        // Check race condition: Do we have an optimistic message that matches this?
                        // (Same content, sender, and recent) - assuming User is "Me"
                        // Since we can't easily check sender ID here without auth context, we look at isAdminMessage
                        // User sending -> message.isAdminMessage === false
                        const isFromMe = message.isAdminMessage === false;

                        if (isFromMe) {
                            const match = prev.find(m =>
                                m.isOptimistic &&
                                m.content === message.content
                            );
                            if (match) {
                                // Replace the optimistic match with the real one
                                return prev.map(m => m._id === match._id ? message : m);
                            }
                        }

                        return [...prev, message];
                    });
                    scrollToBottom();
                }
            });
        }
        return () => {
            if (socket) {
                socket.emit('leave-support-ticket', { ticketId: ticket._id });
                socket.off('new-support-message');
            }
        };
    }, [ticket._id, socket]);

    return (
        <div className="flex flex-col h-full bg-white relative">
            {/* Chat Chat Header - Matching Image */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white z-10">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="text-gray-400 hover:text-gray-600 lg:hidden">
                        <FiArrowLeft size={20} />
                    </button>
                    <div className="relative">
                        <img
                            src="https://ui-avatars.com/api/?name=Admin&background=0D8ABC&color=fff"
                            alt="Admin"
                            className="w-10 h-10 rounded-full object-cover"
                        />
                        {/* Online Status Dot */}
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-800 text-[16px]">Admin</h3>
                        <p className="text-xs text-gray-500">Online</p>
                    </div>
                </div>
                {/* Options Icon (placeholder) */}
                <button className="text-gray-400 hover:text-gray-600">
                    <FiMoreVertical size={20} />
                </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white">
                {/* Intro date or divider could go here */}

                {messages.map((msg, i) => {
                    const isMe = !msg.isAdminMessage; // If I am user, isAdminMessage=false is ME. 
                    return (
                        <div key={msg._id || i} className={`flex w-full ${isMe ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[70%] lg:max-w-[60%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                <div
                                    className={`px-5 py-3 rounded-2xl text-[14px] leading-relaxed shadow-xs ${isMe
                                        ? 'bg-[#8B5CF6] text-white rounded-br-none' // Matching the purple in image (approx #8B5CF6 or #6657E2)
                                        : 'bg-[#F3F4F6] text-gray-700 rounded-bl-none' // Gray bubble
                                        }`}
                                >
                                    {msg.content}
                                </div>
                                <span className="text-[11px] text-gray-400 mt-1.5 px-1">
                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area - Matching Image */}
            <div className="p-6 bg-white">
                <form
                    onSubmit={handleSend}
                    className="flex items-center gap-3 w-full border border-gray-200 rounded-full px-4 py-2 focus-within:ring-2 focus-within:ring-[#6657E2]/20 transition-all shadow-sm"
                >
                    <button type="button" className="text-[#6657E2] p-2 hover:bg-purple-50 rounded-full transition">
                        <FiPlus size={24} />
                    </button>

                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 bg-transparent border-none focus:ring-0 outline-none text-gray-700 placeholder-gray-400 h-10"
                    />

                    <button
                        type="submit"
                        disabled={sending || !newMessage.trim()}
                        className={`p-2 rounded-full transition-all ${newMessage.trim()
                            ? 'bg-[#6657E2] text-white shadow-md hover:shadow-lg transform hover:scale-105'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            }`}
                    >
                        {sending ? <Spinner size="small" showText={false} className="border-white w-5 h-5" /> : <FiSend size={20} className={newMessage.trim() ? "translate-x-0.5 translate-y-0.5" : ""} />}
                    </button>
                </form>
            </div>
        </div>
    );
}
