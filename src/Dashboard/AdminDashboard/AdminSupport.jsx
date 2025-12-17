import React, { useState, useEffect, useRef } from 'react';
import { FiMessageSquare, FiSend, FiArrowLeft, FiSearch, FiMoreHorizontal } from "react-icons/fi";
import api from "../../services/api";
import { useSocket } from "../../context/SocketContext";
import Spinner from '../../Components/Spinner';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/UseAuth';

// --- Helper Components ---
const StatusBadge = ({ status }) => {
    const colors = {
        open: "bg-blue-50 text-blue-600 border border-blue-100",
        "in-progress": "bg-yellow-50 text-yellow-600 border border-yellow-100",
        resolved: "bg-green-50 text-green-600 border border-green-100",
        closed: "bg-gray-50 text-gray-600 border border-gray-100",
    };
    return (
        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide ${colors[status] || colors.open}`}>
            {status}
        </span>
    );
};

export default function AdminSupport() {
    const { socket } = useSocket();
    const [view, setView] = useState('list'); // 'list', 'chat'
    const [tickets, setTickets] = useState([]);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [loading, setLoading] = useState(true);
    // --- Data Fetching ---
    const fetchAllTickets = async () => {
        try {
            const res = await api.get('/support/tickets?limit=100');
            const data = res.response?.data?.docs || res.data?.docs || [];
            const sorted = Array.isArray(data) ? data.sort((a, b) => new Date(b.lastMessageAt || b.updatedAt) - new Date(a.lastMessageAt || a.updatedAt)) : [];
            setTickets(sorted);
        } catch (error) {
            console.error("Failed to fetch tickets:", error);
            try {
                // Fallback attempt
                const res = await api.get('/support/tickets');
                const data = res.response?.data?.docs || res.data?.docs || [];
                setTickets(Array.isArray(data) ? data.reverse() : []);
            } catch (e) {
                toast.error("Failed to load tickets.");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllTickets();

        if (socket) {
            socket.on('support-ticket-updated', () => {
                fetchAllTickets();
            });
            socket.on('support-new-ticket', () => {
                fetchAllTickets();
                toast.info("New support ticket.");
            });
        }

        return () => {
            if (socket) {
                socket.off('support-ticket-updated');
                socket.off('support-new-ticket');
            }
        };
    }, [socket]);

    const handleOpenTicket = (ticket) => {
        setSelectedTicket(ticket);
        setView('chat');
    };

    if (loading && view === 'list') return <Spinner text="Loading Admin Support..." className="text-[#6657E2]" />;
    const { logOut } = useAuth()
    return (
        <div className="h-[calc(100vh-140px)] bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
            {view === 'list' ? (
                <TicketList tickets={tickets} onOpen={handleOpenTicket} logOut={logOut} />
            ) : (
                <TicketChat
                    ticket={selectedTicket}
                    onBack={() => setView('list')}
                    logOut={logOut}
                />
            )}
        </div>
    );
}

// --- Sub-Components ---

function TicketList({ tickets, onOpen, logOut }) {

    if (tickets.length === 0) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-gray-400">
                <FiMessageSquare size={48} className="mb-4 opacity-30" />
                <p>No tickets found.</p>
            </div>
        );
    }


    // this is for handle logout 
    const handleLogout = () => {
        const confirmToast = ({ closeToast }) => (
            <div className="flex flex-col gap-3 p-1">
                <p className="font-medium text-gray-800">Are you sure you want to log out?</p>
                <div className="flex gap-2 justify-end">
                    <button
                        onClick={closeToast}
                        className="px-3 py-1.5 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => {
                            logOut();
                            closeToast();
                        }}
                        className="px-3 py-1.5 text-xs font-semibold text-white bg-red-500 hover:bg-red-600 rounded-md transition-colors shadow-sm"
                    >
                        Confirm
                    </button>
                </div>
            </div>
        );

        toast.info(confirmToast, {
            position: "top-center",
            autoClose: false,
            closeOnClick: false,
            draggable: false,
            closeButton: false,
            className: 'border-l-4 border-[#6657E2]'
        });
    }
    return (
        <div className="flex flex-col h-full">
            <div className='p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50'>
                <h1 className="text-2xl font-bold text-[#6657E2] mb-6">Admin Dashboard</h1>
                <button onClick={handleLogout} className="px-4 py-1.5 text-sm text-white bg-[#6657E2] rounded-lg hover:bg-[#5245D1] transition-colors">Logout</button>
            </div>
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h2 className="font-semibold text-gray-700">All Scoket Tickets</h2>
                <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" placeholder="Search..." className="pl-9 pr-4 py-1.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-[#6657E2]" />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto">
                {tickets.map((ticket) => (
                    <div
                        key={ticket._id}
                        onClick={() => onOpen(ticket)}
                        className="group border-b border-gray-100 p-4 hover:bg-[#FAF9FF] cursor-pointer transition-colors flex items-center justify-between"
                    >
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <img
                                    src={ticket.user?.avatar || "https://ui-avatars.com/api/?name=User&background=random"}
                                    className="w-10 h-10 rounded-full object-cover border border-gray-200"
                                    alt=""
                                />
                                {ticket.user?.isOnline && <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>}
                            </div>

                            <div>
                                <div className="flex items-center gap-2 mb-0.5">
                                    <h4 className="font-semibold text-gray-800 text-sm">{ticket.user?.name || "Unknown User"}</h4>
                                    <span className="text-gray-300">•</span>
                                    <span className="text-xs text-gray-500">{ticket.subject}</span>
                                </div>
                                <p className={`text-sm line-clamp-1 ${ticket.status === 'open' ? 'text-gray-800 font-medium' : 'text-gray-500'}`}>
                                    {ticket.lastMessage?.content || "No messages yet"}
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col items-end gap-1.5">
                            <span className="text-[10px] text-gray-400">
                                {new Date(ticket.lastMessageAt || ticket.createdAt).toLocaleDateString()}
                            </span>
                            <StatusBadge status={ticket.status} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function TicketChat({ ticket: initialTicket, onBack }) {
    const { socket } = useSocket();
    const [ticket, setTicket] = useState(initialTicket);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef(null);

    const fetchMessages = async () => {
        try {
            const res = await api.get(`/support/tickets/${initialTicket._id}/messages`);
            const data = res.response?.data?.docs || res.data?.docs || [];
            // Ensure sorting
            const sorted = data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            setMessages(sorted);
        } catch (error) {
            console.error("Failed to load messages:", error);
        }
    };

    const handleStatusChange = async (newStatus) => {
        try {
            await api.patch(`/support/tickets/${ticket._id}/status`, { status: newStatus });
            setTicket(prev => ({ ...prev, status: newStatus }));
            toast.success(`Status updated to ${newStatus}`);
        } catch (error) {
            toast.error("Failed to update status.");
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
            isAdminMessage: true,
            sender: { name: "Admin" },
            createdAt: new Date().toISOString(),
            isOptimistic: true
        };

        setMessages(prev => [...prev, optimisticMsg]);
        setNewMessage('');
        setSending(true);

        try {
            socket.emit('send-support-message', {
                ticketId: ticket._id,
                content
            });

            // Note: The optimistic message will be replaced by the real one 
            // via the 'new-support-message' event listener in useEffect.
        } catch (error) {
            console.error("Admin send failed", error);
            toast.error("Failed to send message.");
            setMessages(prev => prev.filter(m => m._id !== tempId));
        } finally {
            setSending(false);
        }
    };

    useEffect(() => {
        fetchMessages();

        if (socket) {
            socket.emit('join-support-ticket', { ticketId: initialTicket._id });

            socket.on('new-support-message', ({ ticketId, message }) => {
                if (ticketId === initialTicket._id) {
                    setMessages(prev => {
                        // 3. Deduplication Logic

                        // Check if we already have this real ID
                        if (prev.some(m => m._id === message._id)) return prev;

                        // Check race condition for Admin (isAdminMessage === true)
                        const isFromMe = message.isAdminMessage === true;

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

            socket.on('support-status-changed', ({ ticketId, status }) => {
                if (ticketId === initialTicket._id) {
                    setTicket(prev => ({ ...prev, status }));
                }
            });
        }

        return () => {
            if (socket) {
                socket.emit('leave-support-ticket', { ticketId: initialTicket._id });
                socket.off('new-support-message');
                socket.off('support-status-changed');
            }
        };
    }, [initialTicket._id, socket]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return (
        <div className="flex flex-col h-full bg-white relative">
            {/* Chat Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white shadow-sm z-20">
                <div className="flex items-center gap-3">
                    <button onClick={onBack} className="p-1.5 hover:bg-gray-100 rounded-full text-gray-500 transition">
                        <FiArrowLeft size={20} />
                    </button>
                    <img
                        src={ticket.user?.avatar || "https://ui-avatars.com/api/?name=User&background=random"}
                        className="w-10 h-10 rounded-full object-cover"
                        alt=""
                    />
                    <div>
                        <h3 className="font-bold text-gray-800 text-sm">{ticket.user?.name || "Unknown User"}</h3>
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">{ticket.user?.email}</span>
                            <span className="text-gray-300">•</span>
                            <StatusBadge status={ticket.status} />
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <div className="flex bg-gray-100 rounded-lg p-1">
                        {['open', 'resolved', 'closed'].map(status => (
                            <button
                                key={status}
                                onClick={() => handleStatusChange(status)}
                                className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${ticket.status === status
                                    ? 'bg-white text-[#6657E2] shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Messages Area - Matching Image Style */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white">
                {messages.map((msg, i) => {
                    // Admin View: isAdminMessage=true is ME (Right).
                    const isMe = msg.isAdminMessage;
                    return (
                        <div key={msg._id || i} className={`flex w-full ${isMe ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[70%] lg:max-w-[60%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                {/* Name label for user side only */}
                                {!isMe && <span className="text-[10px] text-gray-500 mb-1 ml-1">{msg.sender?.name || ticket.user?.name}</span>}

                                <div
                                    className={`px-5 py-3 rounded-2xl text-[14px] leading-relaxed shadow-xs ${isMe
                                        ? 'bg-[#8B5CF6] text-white rounded-br-none' // Admin is Purple (Right)
                                        : 'bg-[#F3F4F6] text-gray-700 rounded-bl-none' // User is Gray (Left)
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

            {/* Input Area */}
            <div className="p-6 bg-white border-t border-gray-100">
                {ticket.status !== 'closed' ? (
                    <form
                        onSubmit={handleSend}
                        className="flex items-center gap-3 w-full border border-gray-200 rounded-full px-4 py-2 focus-within:ring-2 focus-within:ring-[#6657E2]/20 transition-all shadow-sm"
                    >
                        {/* Admin might want to attach files? Keeping it simple for now as per image */}
                        <div className="text-gray-400 p-2">
                            <FiMoreHorizontal size={24} />
                        </div>

                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Reply as Admin..."
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
                ) : (
                    <div className="text-center text-gray-400 text-sm py-2 bg-gray-50 rounded-lg">
                        This conversation is closed.
                    </div>
                )}
            </div>
        </div>
    );
}

