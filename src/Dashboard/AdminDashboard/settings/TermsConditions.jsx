import { useEffect, useState, useRef, useMemo } from "react";
import { FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router";
import JoditEditor from "jodit-react";
import { toast } from "react-toastify";
import api from "../../../services/api";

const TermsConditions = () => {
  const editor = useRef(null);
  const navigate = useNavigate();

  const [content, setContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch terms and conditions
  useEffect(() => {
    const fetchTerms = async () => {
      setLoading(true);
      try {
        const res = await api.get('/settings/terms');
        if (res.status === 200) {
          setContent(res.response?.data?.content || "");
        }
      } catch (error) {
        console.error("Fetch Error:", error);
        toast.error("Failed to fetch terms and conditions.");
      } finally {
        setLoading(false);
      }
    };
    fetchTerms();
  }, []);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const res = await api.post('/settings/terms', { content });
      if (res.status === 200 || res.status === 201) {
        toast.success("Terms & Conditions updated successfully!");
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Update Error:", error);
      toast.error(error.response?.data?.message || "Failed to update terms.");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => navigate(-1);

  // Jodit Configuration
  const config = useMemo(() => ({
    readonly: false,
    placeholder: 'Start typing...',
    buttons: [
      'fontsize', 'paragraph', 'brush', '|',
      'bold', 'italic', 'underline', 'strikethrough', '|',
      'align', '|',
      'ul', 'ol', '|',
      'image', 'link', '|',
      'undo', 'redo'
    ],
    height: 400,
    theme: 'default'
  }), []);

  if (loading && !content && !isEditing) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  return (
    <div className="flex flex-col gap-6 p-6 min-h-screen bg-transparent">
      {/* Header */}
      <div className="flex items-center gap-4 mb-2">
        <button className="cursor-pointer p-2 hover:bg-white rounded-full transition-colors" onClick={handleBack}>
          <FiArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-semibold text-gray-800">Terms & Conditions</h1>
      </div>

      <div className="bg-white rounded-2xl p-8 shadow-[0_4px_25px_rgba(0,0,0,0.05)] border border-gray-100">
        {!isEditing ? (
          <>
            <div
              className="prose prose-slate max-w-none mb-10 overflow-hidden"
              dangerouslySetInnerHTML={{ __html: content }}
            />
            <div className="flex justify-end">
              <button
                onClick={() => setIsEditing(true)}
                className="w-full max-w-[400px] cursor-pointer bg-linear-to-r from-[#614EFE] to-[#9235BD] text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-purple-200 transition-all active:scale-[0.98]"
              >
                Edit
              </button>
            </div>
          </>
        ) : (
          <div className="animate-fadeIn">
            <JoditEditor
              ref={editor}
              value={content}
              config={config}
              tabIndex={1}
              onBlur={newContent => setContent(newContent)}
              onChange={newContent => { }}
            />
            <div className="flex justify-end mt-10 gap-4">
              <button
                onClick={() => setIsEditing(false)}
                className="px-8 py-3 rounded-xl font-semibold text-gray-600 hover:bg-gray-100 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                disabled={loading}
                className="w-full max-w-[400px] cursor-pointer bg-linear-to-r from-[#614EFE] to-[#9235BD] text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-purple-200 transition-all active:scale-[0.98] disabled:opacity-70"
              >
                {loading ? "Updating..." : "Update"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TermsConditions;
