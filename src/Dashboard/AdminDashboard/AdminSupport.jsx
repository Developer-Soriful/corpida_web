import { useState, useEffect, useRef, useMemo } from 'react';
import { FiMessageSquare, FiSend, FiArrowLeft, FiSearch, FiMoreHorizontal, FiStar, FiMail, FiChevronDown, FiMinimize2, FiMaximize2, FiX, FiPaperclip, FiLink, FiSmile, FiType, FiClock, FiEdit3, FiTrash2 } from "react-icons/fi";
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
    const { socket, onlineUsers } = useSocket();
    const isOnline = (id) => onlineUsers?.includes(id);
    const [view, setView] = useState('list'); // 'list', 'chat'
    const [tickets, setTickets] = useState([]);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isComposeOpen, setIsComposeOpen] = useState(false);
    const [starredTickets, setStarredTickets] = useState(new Set());
    const [isUnseenExpanded, setIsUnseenExpanded] = useState(false);

    // --- Data Fetching ---
    const fetchAllTickets = async () => {
        try {
            const res = await api.get('/support/tickets?limit=100');
            const data = res.response?.data?.docs || res.data?.docs || [];
            // Sort by most recent activity
            const sorted = Array.isArray(data) ? data.sort((a, b) => new Date(b.lastMessageAt || b.updatedAt) - new Date(a.lastMessageAt || a.updatedAt)) : [];
            setTickets(sorted);
        } catch (error) {
            console.error("Failed to fetch tickets:", error);
            try {
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
                toast.info("New support message.");
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
        // If we move to chat, we can optionally collapse the sidebar list
    };

    const toggleStar = (e, ticketId) => {
        e.stopPropagation();
        setStarredTickets(prev => {
            const next = new Set(prev);
            if (next.has(ticketId)) next.delete(ticketId);
            else next.add(ticketId);
            return next;
        });
    };

    const unseenTickets = useMemo(() => {
        // Tickets that are 'open' and where the last message is NOT from an admin
        return tickets.filter(t => t.status === 'open' && t.lastMessage?.isAdminMessage === false);
    }, [tickets]);

    const filteredTickets = useMemo(() => {
        return tickets.filter(ticket =>
            ticket.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            ticket.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            ticket.lastMessage?.content?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [tickets, searchQuery]);

    const { logOut } = useAuth();

    if (loading && view === 'list') return <Spinner text="Loading Support..." className="text-[#6657E2]" />;

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col relative">
            {view === 'list' ? (
                <div className="flex h-full">
                    {/* Left Inner Sidebar */}
                    <div className="w-[20%] border-r border-gray-100 p-4 flex flex-col bg-gray-50/50 overflow-y-auto custom-scrollbar">
                        <div className="flex items-center justify-between">
                            <h1 className="text-xl font-bold text-gray-800">Inbox</h1>
                        </div>

                        <div className="flex flex-col gap-1">
                            {/* Email Expandable Item */}
                            <div
                                onClick={() => setIsUnseenExpanded(!isUnseenExpanded)}
                                className={`flex items-center justify-between p-1 rounded-xl cursor-pointer transition-all duration-300 bg-white shadow-sm hover:bg-gray-50 border border-gray-100`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-lg flex items-center justify-center shadow-xs">
                                        <FiMail size={19} color='#FFC107' />
                                    </div>
                                    <span className={`font-bold text-sm ${isUnseenExpanded ? 'text-[#6657E2]' : 'text-gray-700'}`}>Email</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    {unseenTickets.length > 0 && (
                                        <span className="w-6 h-6 flex items-center justify-center bg-red-500 text-white text-[10px] font-black rounded-full shadow-lg border-2 border-white">
                                            {unseenTickets.length > 99 ? '99+' : unseenTickets.length}
                                        </span>
                                    )}
                                    <FiChevronDown
                                        className={`text-gray-400 transition-transform duration-300 ${isUnseenExpanded ? 'rotate-180 text-[#6657E2]' : ''}`}
                                        size={18}
                                    />
                                </div>
                            </div>

                            {/* Expanded Unseen List */}
                            <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isUnseenExpanded ? 'max-h-[500px] opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
                                <div className="pl-4 pr-1 space-y-1 py-1">
                                    {unseenTickets.length > 0 ? (
                                        unseenTickets.slice(0, 10).map(ticket => (
                                            <div
                                                key={ticket._id}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleOpenTicket(ticket);
                                                }}
                                                className="group flex items-center gap-3 p-2.5 rounded-lg hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-100 cursor-pointer transition-all"
                                            >
                                                <div className="relative shrink-0">
                                                    <img
                                                        src={ticket.user?.avatar || `https://ui-avatars.com/api/?name=${ticket.user?.name || 'U'}&background=random`}
                                                        className="w-8 h-8 rounded-full border border-gray-100 object-cover"
                                                        alt=""
                                                    />
                                                    <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex justify-between items-center mb-0.5">
                                                        <h4 className="text-[12px] font-bold text-gray-800 truncate">{ticket.user?.name || "User"}</h4>
                                                        <span className="text-[9px] font-medium text-gray-400">{new Date(ticket.lastMessageAt || ticket.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                    </div>
                                                    <p className="text-[11px] text-gray-500 truncate italic">
                                                        {ticket.lastMessage?.content || "New conversation"}
                                                    </p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="py-8 text-center bg-gray-50/50 rounded-lg border border-dashed border-gray-200">
                                            <p className="text-[11px] text-gray-400">All caught up!</p>
                                        </div>
                                    )}
                                    {unseenTickets.length > 10 && (
                                        <button className="w-full py-2 text-[11px] font-bold text-[#6657E2] hover:underline">
                                            View all {unseenTickets.length} unseen
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="mt-4">
                            <div className="relative group">
                                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#6657E2] transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Search here ..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-11 pr-4 py-2 bg-white border border-gray-100 rounded-xl shadow-xs outline-none focus:border-[#6657E2] focus:ring-4 focus:ring-[#6657E2]/5 text-sm transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Main Content Area - Ticket List */}
                    <div className="flex-1 flex flex-col bg-white relative">
                        <TicketList
                            tickets={filteredTickets}
                            onOpen={handleOpenTicket}
                            starredTickets={starredTickets}
                            toggleStar={toggleStar}
                        />

                        {/* Compose Floating Button */}
                        <button
                            onClick={() => setIsComposeOpen(true)}
                            className="flex absolute bottom-4 right-4 items-center justify-between gap-2 bg-linear-to-r from-[#6366F1] to-[#A855F7] text-white px-4 py-2 rounded-[4px] font-bold shadow-lg hover:shadow-purple-200 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-70"
                        >
                            <div className="p-1 bg-white/20 rounded-lg group-hover:rotate-12 transition-transform">
                                <FiEdit3 size={20} />
                            </div>
                            <span className="font-bold tracking-wide">Compose</span>
                        </button>
                    </div>
                </div>
            ) : (
                <TicketChat
                    ticket={selectedTicket}
                    onBack={() => setView('list')}
                    isOnline={isOnline}
                />
            )}

            {/* Compose Modal */}
            {isComposeOpen && (
                <ComposeModal
                    onClose={() => setIsComposeOpen(false)}
                    onSuccess={fetchAllTickets}
                />
            )}
        </div>
    );
}

// --- Sub-Components ---

function TicketList({ tickets, onOpen, starredTickets, toggleStar }) {
    if (tickets.length === 0) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 bg-white">
                <FiMessageSquare size={48} className="mb-4 opacity-30" />
                <p>No messages found.</p>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto">
            {tickets.map((ticket) => (
                <div
                    key={ticket._id}
                    onClick={() => onOpen(ticket)}
                    className="group border-b border-gray-100 p-5 hover:bg-[#FAF9FF] cursor-pointer transition-all flex items-center justify-between"
                >
                    <div className="flex items-center gap-8 flex-1">
                        <button
                            onClick={(e) => toggleStar(e, ticket._id)}
                            className={`p-1 transition-colors ${starredTickets.has(ticket._id) ? 'text-yellow-400' : 'text-gray-300 hover:text-gray-400'}`}
                        >
                            <FiStar size={20} fill={starredTickets.has(ticket._id) ? "currentColor" : "none"} />
                        </button>

                        <div className="flex items-center gap-12 flex-1">
                            <h4 className="w-32 font-bold text-gray-800 text-sm truncate">{ticket.user?.name || "Unknown User"}</h4>
                            <p className="flex-1 text-sm text-gray-600 truncate max-w-2xl">
                                {ticket.lastMessage?.content || ticket.subject || "No content"}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <span className="text-[12px] font-medium text-gray-500">
                            {new Date(ticket.lastMessageAt || ticket.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
}

function ComposeModal({ onClose, onSuccess }) {
    const [recipients, setRecipients] = useState('');
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const [sending, setSending] = useState(false);
    const [users, setUsers] = useState([]);
    const [showUserDropdown, setShowUserDropdown] = useState(false);
    const [loadingUsers, setLoadingUsers] = useState(false);

    const fetchUsers = async (query) => {
        if (!query) {
            setUsers([]);
            return;
        }
        setLoadingUsers(true);
        try {
            const res = await api.get(`/user/all?name=${query}&limit=5`);
            const data = res.response?.data?.docs || res.data?.docs || [];
            setUsers(data);
        } catch (error) {
            console.error("Failed to fetch users:", error);
        } finally {
            setLoadingUsers(false);
        }
    };

    const handleRecipientChange = (val) => {
        setRecipients(val);
        if (val.length > 1) {
            fetchUsers(val);
            setShowUserDropdown(true);
        } else {
            setShowUserDropdown(false);
        }
    };

    const selectUser = (user) => {
        setRecipients(user.email);
        setShowUserDropdown(false);
    };

    const handleSend = async () => {
        if (!recipients || !subject || !body) {
            toast.warning("Please fill all fields");
            return;
        }
        setSending(true);
        try {
            // Backend endpoint: POST /support/tickets accepts subject and initialMessage
            await api.post('/support/tickets', {
                subject: subject,
                initialMessage: body,
                // In a real scenario we'd pass the userId if we could, 
                // but the current API auto-links to the logged-in user usually.
                // If it's admin composing TO a user, we might need a different endpoint or logic.
                // Assuming it's starting a conversation.
            });
            toast.success("Message sent successfully");
            onSuccess();
            onClose();
        } catch (error) {
            toast.error("Failed to send message");
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-white w-[80vw] min-h-[80vh] flex flex-col justify-between shadow-2xl overflow-hidden animate-fadeIn">
                {/* Header */}
                <div className="bg-white px-6 py-4 flex items-center justify-between border-b border-gray-100">
                    <h2 className="text-lg font-bold text-gray-800">New Message</h2>
                    <div className="flex items-center gap-4 text-gray-400">
                        <button className="hover:text-gray-600 transition-colors"><FiMinimize2 size={18} /></button>
                        <button className="hover:text-gray-600 transition-colors"><FiMaximize2 size={18} /></button>
                        <button onClick={onClose} className="hover:text-red-500 transition-colors"><FiX size={20} /></button>
                    </div>
                </div>

                {/* Body */}
                <div className="p-6 flex flex-col gap-4">
                    <div className="flex items-center gap-4 border-b border-gray-100 pb-3 relative">
                        <span className="text-sm font-semibold text-gray-500 w-20">Recipients</span>
                        <input
                            type="text"
                            value={recipients}
                            onChange={(e) => handleRecipientChange(e.target.value)}
                            className="flex-1 outline-none text-sm text-gray-800"
                            placeholder="Email address..."
                        />
                        <div className="flex items-center gap-4 text-xs font-bold text-gray-400">
                            <button className="hover:text-[#6657E2]">Cc</button>
                            <button className="hover:text-[#6657E2]">Bcc</button>
                        </div>

                        {/* User Search Dropdown */}
                        {showUserDropdown && users.length > 0 && (
                            <div className="absolute top-full left-24 right-0 mt-1 bg-white border border-gray-100 rounded-xl shadow-xl z-50 overflow-hidden">
                                {users.map(u => (
                                    <div
                                        key={u._id}
                                        onClick={() => selectUser(u)}
                                        className="p-3 hover:bg-[#FAF9FF] cursor-pointer flex items-center gap-3 transition-colors border-b border-gray-50 last:border-0"
                                    >
                                        <img src={u.avatar} className="w-8 h-8 rounded-full" alt="" />
                                        <div>
                                            <p className="text-sm font-bold text-gray-800">{u.name}</p>
                                            <p className="text-[11px] text-gray-500">{u.email}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-4 border-b border-gray-100 pb-3">
                        <span className="text-sm font-semibold text-gray-500 w-20">Subject</span>
                        <input
                            type="text"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            className="flex-1 outline-none text-sm text-gray-800"
                        />
                    </div>

                    <div className="flex-1 min-h-[400px]">
                        <textarea
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                            placeholder="Body Text"
                            className="w-full h-full min-h-[400px] outline-none text-sm text-gray-700 leading-relaxed resize-none p-2"
                        ></textarea>
                    </div>
                </div>

                {/* Footer Toolbar */}
                <div className="px-6 py-3 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <button
                            disabled={sending}
                            onClick={handleSend}
                            className="flex items-center gap-2 bg-linear-to-r from-[#6366F1] to-[#A855F7] text-white px-10 py-4 rounded-[4px] font-bold shadow-lg hover:shadow-purple-200 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-70"
                        >
                            {sending ? 'Sending...' : 'Send'}
                        </button>

                        <div className="h-6 w-px bg-gray-200 mx-2"></div>

                        <div className="flex items-center gap-4 text-gray-400">
                            <button className="hover:text-[#6657E2] transition-colors"><FiType size={18} /></button>
                            <button className="hover:text-[#6657E2] transition-colors"><FiPaperclip size={18} /></button>
                            <button className="hover:text-[#6657E2] transition-colors"><FiLink size={18} /></button>
                            <button className="hover:text-[#6657E2] transition-colors"><FiSmile size={18} /></button>
                            <button className="hover:text-[#6657E2] transition-colors"><FiMail size={18} /></button>
                            <button className="hover:text-[#6657E2] transition-colors"><FiClock size={18} /></button>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 text-gray-400">
                        <button className="hover:text-gray-600 transition-colors"><FiMoreHorizontal size={18} /></button>
                        <button className="hover:text-red-500 transition-colors"><FiTrash2 size={18} /></button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function TicketChat({ ticket: initialTicket, onBack, isOnline }) {
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
                        if (prev.some(m => m._id === message._id)) return prev;
                        const isFromMe = message.isAdminMessage === true;
                        if (isFromMe) {
                            const match = prev.find(m => m.isOptimistic && m.content === message.content);
                            if (match) return prev.map(m => m._id === match._id ? message : m);
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
                            <div className="flex items-center gap-1">
                                <span className={`w-2 h-2 rounded-full ${isOnline(ticket.user?._id || ticket.user?.id) ? "bg-green-500" : "bg-gray-300"}`}></span>
                                <span className="text-xs text-gray-500">{isOnline(ticket.user?._id || ticket.user?.id) ? "Online" : "Offline"}</span>
                            </div>
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

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white">
                {messages.map((msg, i) => {
                    const isMe = msg.isAdminMessage;
                    return (
                        <div key={msg._id || i} className={`flex w-full ${isMe ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[70%] lg:max-w-[60%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                {!isMe && <span className="text-[10px] text-gray-500 mb-1 ml-1">{msg.sender?.name || ticket.user?.name}</span>}
                                <div
                                    className={`px-5 py-3 rounded-2xl text-[14px] leading-relaxed shadow-xs ${isMe
                                        ? 'bg-[#8B5CF6] text-white rounded-br-none'
                                        : 'bg-[#F3F4F6] text-gray-700 rounded-bl-none'
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

