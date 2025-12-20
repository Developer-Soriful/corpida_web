import { useEffect, useState, useRef, useMemo } from "react";
import { FiArrowLeft, FiChevronDown, FiChevronUp, FiTrash2, FiEdit, FiPlus, FiX } from "react-icons/fi";
import { useNavigate } from "react-router";
import JoditEditor from "jodit-react";
import { toast } from "react-toastify";
import api from "../../../services/api";

const FAQ = () => {
    const navigate = useNavigate();
    const [faqs, setFaqs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeIndex, setActiveIndex] = useState(null);

    // Modal states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("add"); // "add" or "edit"
    const [currentFaqIndex, setCurrentFaqIndex] = useState(null);
    const [formData, setFormData] = useState({ question: "", answer: "" });
    const editor = useRef(null);

    // Fetch FAQs
    useEffect(() => {
        const fetchFAQ = async () => {
            setLoading(true);
            try {
                const res = await api.get('/settings/faq');
                if (res.status === 200) {
                    setFaqs(res.response?.data?.faqs || []);
                }
            } catch (error) {
                console.error("Fetch Error:", error);
                toast.error("Failed to fetch FAQs.");
            } finally {
                setLoading(false);
            }
        };
        fetchFAQ();
    }, []);

    const handleBack = () => navigate(-1);

    const toggleAccordion = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    const handleUpdateBackend = async (newFaqs) => {
        setLoading(true);
        try {
            const res = await api.post('/settings/faq', { faqs: newFaqs });
            if (res.status === 200 || res.status === 201) {
                toast.success("FAQs updated successfully!");
                setFaqs(newFaqs);
                setIsModalOpen(false);
            }
        } catch (error) {
            console.error("Update Error:", error);
            toast.error("Failed to update FAQs.");
        } finally {
            setLoading(false);
        }
    };

    const openAddModal = () => {
        setModalMode("add");
        setFormData({ question: "", answer: "" });
        setIsModalOpen(true);
    };

    const openEditModal = (index, faq) => {
        setModalMode("edit");
        setCurrentFaqIndex(index);
        setFormData({ ...faq });
        setIsModalOpen(true);
    };

    const handleDelete = (index) => {
        if (window.confirm("Are you sure you want to delete this FAQ?")) {
            const newFaqs = faqs.filter((_, i) => i !== index);
            handleUpdateBackend(newFaqs);
        }
    };

    const handleModalSubmit = (e) => {
        e.preventDefault();
        if (!formData.question || !formData.answer) {
            toast.error("Both question and answer are required.");
            return;
        }

        let newFaqs = [...faqs];
        if (modalMode === "add") {
            newFaqs.push(formData);
        } else {
            newFaqs[currentFaqIndex] = formData;
        }
        handleUpdateBackend(newFaqs);
    };

    // Jodit Configuration
    const config = useMemo(() => ({
        readonly: false,
        placeholder: 'Enter answer here...',
        buttons: ['bold', 'italic', 'underline', 'strikethrough', 'ul', 'ol', 'link', 'undo', 'redo'],
        height: 250,
        theme: 'default'
    }), []);

    return (
        <div className="flex flex-col gap-6 p-6 min-h-screen bg-transparent">
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-4">
                    <button className="cursor-pointer p-2 hover:bg-white rounded-full transition-colors" onClick={handleBack}>
                        <FiArrowLeft size={24} />
                    </button>
                    <h1 className="text-2xl font-semibold text-gray-800">FAQ</h1>
                </div>
                <button
                    onClick={openAddModal}
                    className="flex items-center gap-2 px-8 py-3 bg-linear-to-r from-[#614EFE] to-[#9235BD] text-white font-semibold rounded-xl shadow-lg hover:shadow-purple-200 transition-all active:scale-[0.98]"
                >
                    <FiPlus /> Add New FAQ
                </button>
            </div>

            {/* FAQ Accordion List */}
            <div className="space-y-4">
                {faqs.length === 0 && !loading && (
                    <div className="text-center p-10 bg-white rounded-2xl text-gray-500">No FAQs found. Add some!</div>
                )}
                {faqs.map((item, index) => (
                    <div key={index} className="bg-white rounded-2xl shadow-[0_4px_25px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden">
                        <button
                            onClick={() => toggleAccordion(index)}
                            className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                        >
                            <span className="font-semibold text-gray-800 text-lg">{item.question}</span>
                            {activeIndex === index ? <FiChevronUp size={24} className="text-gray-400" /> : <FiChevronDown size={24} className="text-gray-400" />}
                        </button>

                        {activeIndex === index && (
                            <div className="px-6 pb-6 animate-fadeIn">
                                <div className="border-t border-gray-100 pt-4 mb-6">
                                    <div
                                        className="prose prose-slate max-w-none text-gray-600"
                                        dangerouslySetInnerHTML={{ __html: item.answer }}
                                    />
                                </div>
                                <div className="flex justify-end gap-3">
                                    <button
                                        onClick={() => handleDelete(index)}
                                        className="flex items-center gap-2 px-6 py-2 border border-red-200 text-red-500 rounded-lg font-medium hover:bg-red-50 transition-all"
                                    >
                                        Delete
                                    </button>
                                    <button
                                        onClick={() => openEditModal(index, item)}
                                        className="flex items-center gap-2 px-6 py-2 border border-purple-200 text-purple-600 rounded-lg font-medium hover:bg-purple-50 transition-all"
                                    >
                                        Edit
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Add/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50 p-4 animate-fadeIn">
                    <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden">
                        <div className="flex items-center justify-between p-6 border-b border-gray-100">
                            <h2 className="text-xl font-bold text-gray-800">{modalMode === "add" ? "Add New FAQ" : "Edit FAQ"}</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <FiX size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleModalSubmit} className="p-6 space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-500 mb-2">Question</label>
                                <input
                                    type="text"
                                    value={formData.question}
                                    onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                                    placeholder="Enter the question"
                                    className="w-full px-5 py-4 rounded-xl border border-purple-100 focus:ring-2 focus:ring-purple-400 outline-none transition-all text-gray-700 font-medium"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-500 mb-2">Answer</label>
                                <JoditEditor
                                    ref={editor}
                                    value={formData.answer}
                                    config={config}
                                    tabIndex={1}
                                    onBlur={newContent => setFormData({ ...formData, answer: newContent })}
                                />
                            </div>

                            <div className="flex justify-end gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-8 py-3 rounded-xl font-semibold text-gray-600 hover:bg-gray-100 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-12 py-3 bg-linear-to-r from-[#614EFE] to-[#9235BD] text-white font-semibold rounded-xl shadow-lg hover:shadow-purple-200 transition-all active:scale-[0.98] disabled:opacity-70"
                                >
                                    {loading ? "Saving..." : "Save"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FAQ;
