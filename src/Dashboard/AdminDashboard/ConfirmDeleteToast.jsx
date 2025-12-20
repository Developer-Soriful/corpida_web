const ConfirmDeleteToast = ({ onConfirm, onCancel }) => (
    <div>
        <p className="mb-2 font-semibold">Are you sure you want to delete?</p>
        <div className="flex gap-3">
            <button
                onClick={onConfirm}
                className="px-3 py-1 bg-red-500 text-white rounded cursor-pointer"
            >
                Delete
            </button>
            <button
                onClick={onCancel}
                className="px-3 py-1 bg-gray-300 rounded cursor-pointer"
            >
                Cancel
            </button>
        </div>
    </div>
);

export default ConfirmDeleteToast