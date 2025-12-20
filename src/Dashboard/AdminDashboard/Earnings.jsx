import { useState, useEffect, useCallback, useMemo } from 'react';
import { FiSearch, FiEye, FiTrash2, FiDownload, FiPrinter, FiX } from 'react-icons/fi';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import api from '../../services/api';
import SummaryCard from './SummaryCard';
import ConfirmDeleteToast from './ConfirmDeleteToast';

const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

const Earnings = () => {
    const [summaryData, setSummaryData] = useState({
        totalEarnings: 0,
        totalUsers: 0,
        totalProviders: 0
    });

    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(14);
    const [searchFilters, setSearchFilters] = useState({
        date: '',
        studentName: '',
        tutorName: ''
    });

    const [showModal, setShowModal] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [loadingTransaction, setLoadingTransaction] = useState(false);

    // API Integration Functions
    const fetchSummaryData = async () => {
        try {
            const res = await api.get('/dashboard');
            setSummaryData(res.response.data);
        } catch (error) {
            console.error('Error fetching summary data:', error);
            toast.error('Failed to load summary data');

        }
    };
    const fetchTransactions = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();

            // Add filters to params
            if (searchFilters.date) params.append('date', searchFilters.date);
            if (searchFilters.studentName) params.append('studentName', searchFilters.studentName);
            if (searchFilters.tutorName) params.append('tutorName', searchFilters.tutorName);
            params.append('page', currentPage);
            params.append('limit', 10);

            const res = await api.get(`/transaction/all?${params.toString()}`);
            const responseData = res.response?.data || res.data || {};

            const transactionData = responseData.docs || [];
            const mappedTransactions = transactionData.map(transaction => ({
                id: transaction._id,
                transactionId: transaction.transactionId,
                studentId: transaction.performedBy,
                tutorId: transaction.receivedBy,
                amount: transaction.amount,
                date: transaction.createdAt,
                status: transaction.status,
                type: transaction.type,
                description: transaction.description,
                platformFee: transaction.platformFee,
                teacherEarnings: transaction.teacherEarnings,
                performedBy: transaction.performedBy,
                receivedBy: transaction.receivedBy,
                _id: transaction._id
            }));

            setTransactions(mappedTransactions);

            // Update pagination from response
            setTotalPages(responseData.totalPages || 1);

        } catch (error) {
            console.error('Error fetching transactions:', error);
            toast.error('Failed to load transactions');
        } finally {
            setLoading(false);
        }
    };

    // Load data on component mount and when filters/page change
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            await Promise.all([
                fetchSummaryData(),
                fetchTransactions()
            ]);
            setLoading(false);
        };

        loadData();
    }, [currentPage, searchFilters]);

    // Event handlers
    const handleSearch = () => {
        debouncedSearch();
    };

    const handleFilterChange = (field, value) => {
        setSearchFilters(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleViewTransaction = async (transactionId) => {
        try {
            setLoadingTransaction(true);
            const res = await api.get(`/transaction/${transactionId}`);
            const transactionData = res.response?.data || res.data;
            setSelectedTransaction(transactionData);
            setShowModal(true);
        } catch (error) {
            console.error('Error fetching transaction details:', error);
            toast.error('Failed to load transaction details');
        } finally {
            setLoadingTransaction(false);
        }
    };

    const handleDeleteTransaction = (transactionId) => {
        toast(
            ({ closeToast }) => (
                <ConfirmDeleteToast
                    onConfirm={async () => {
                        try {
                            await api.delete(`/transaction/delete/${transactionId}`);

                            setTransactions(prev =>
                                prev.filter(t => t.id !== transactionId)
                            );

                            toast.success("Transaction deleted successfully");
                            closeToast();
                        } catch (error) {
                            console.error("Error deleting transaction:", error);
                            toast.error("Failed to delete transaction");
                            closeToast();
                        }
                    }}
                    onCancel={closeToast}
                />
            ),
            {
                autoClose: false,
                closeOnClick: false,
                closeButton: false,
            }
        );
    };

    // Debounced search to avoid excessive API calls
    const debouncedSearch = useCallback(
        debounce(() => {
            setCurrentPage(1);
            fetchTransactions();
        }, 500),
        [fetchTransactions]
    );

    // Filtered transactions (client-side filtering as backup)
    const filteredTransactions = useMemo(() => {
        return transactions.filter(transaction => {
            const matchesDate = !searchFilters.date || transaction.date === searchFilters.date;
            const matchesStudent = !searchFilters.studentName ||
                transaction.studentName?.toLowerCase().includes(searchFilters.studentName?.toLowerCase());
            const matchesTutor = !searchFilters.tutorName ||
                transaction.tutorName?.toLowerCase().includes(searchFilters.tutorName?.toLowerCase());

            return matchesDate && matchesStudent && matchesTutor;
        });
    }, [transactions, searchFilters]);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handlePageInput = (e) => {
        const page = parseInt(e.target.value);
        if (!isNaN(page)) {
            handlePageChange(page);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedTransaction(null);
    };

    const handleDownload = () => {
        if (!selectedTransaction) return;

        const transactionData = {
            'Transaction ID': selectedTransaction.transactionId || selectedTransaction._id,
            'Date': format(new Date(selectedTransaction.createdAt), 'MM-dd-yyyy'),
            'Student Name': selectedTransaction.performedBy?.name || 'N/A',
            'A/C Number': '**** **** **** *545',
            'A/C Holder Name': selectedTransaction.performedBy?.name || 'N/A',
            'Transaction Amount': `$${selectedTransaction.amount}`,
            'Tutor Name': selectedTransaction.receivedBy?.name || 'N/A'
        };

        const dataStr = JSON.stringify(transactionData, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

        const exportFileDefaultName = `transaction_${selectedTransaction.transactionId || selectedTransaction._id}.json`;

        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();

        toast.success('Transaction details downloaded successfully');
    };

    const handlePrint = () => {
        if (!selectedTransaction) return;

        const printContent = `
            <div style="padding: 20px; font-family: Arial, sans-serif;">
                <h2 style="margin-bottom: 20px;">Transaction Details</h2>
                <div style="margin-bottom: 10px;"><strong>Transaction ID:</strong> #${selectedTransaction.transactionId || selectedTransaction._id}</div>
                <div style="margin-bottom: 10px;"><strong>Date:</strong> ${format(new Date(selectedTransaction.createdAt), 'MM-dd-yyyy')}</div>
                <div style="margin-bottom: 10px;"><strong>Student name:</strong> ${selectedTransaction.performedBy?.name || 'N/A'}</div>
                <div style="margin-bottom: 10px;"><strong>A/C number:</strong> **** **** **** *545</div>
                <div style="margin-bottom: 10px;"><strong>A/C holder name:</strong> ${selectedTransaction.performedBy?.name || 'N/A'}</div>
                <div style="margin-bottom: 10px;"><strong>Transaction amount:</strong> $${selectedTransaction.amount}</div>
                <div style="margin-bottom: 10px;"><strong>Tutor name:</strong> ${selectedTransaction.receivedBy?.name || 'N/A'}</div>
            </div>
        `;

        const printWindow = window.open('', '', 'width=600,height=600');
        printWindow.document.write(printContent);
        printWindow.document.close();
        printWindow.print();

        toast.success('Print dialog opened');
    };

    const TransactionDetailsModal = () => {
        if (!showModal || !selectedTransaction) return null;

        return (
            <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4">
                    <div className="bg-linear-to-r from-[#614EFE] to-[#7D359F] text-white p-6 rounded-t-xl">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-semibold">Transaction Details</h3>
                            <button
                                onClick={handleCloseModal}
                                className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-colors"
                            >
                                <FiX size={20} />
                            </button>
                        </div>
                    </div>

                    <div className="p-6">
                        <div className="space-y-4">
                            <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                <span className="text-gray-600 text-sm">Transaction ID:</span>
                                <span className="font-medium text-gray-800">#{selectedTransaction.transactionId || selectedTransaction._id}</span>
                            </div>

                            <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                <span className="text-gray-600 text-sm">Date:</span>
                                <span className="font-medium text-gray-800">{format(new Date(selectedTransaction.createdAt), 'MM-dd-yyyy')}</span>
                            </div>

                            <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                <span className="text-gray-600 text-sm">Student name:</span>
                                <span className="font-medium text-gray-800">{selectedTransaction.performedBy?.name || 'N/A'}</span>
                            </div>

                            <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                <span className="text-gray-600 text-sm">A/C number:</span>
                                <span className="font-medium text-gray-800">**** **** **** *545</span>
                            </div>

                            <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                <span className="text-gray-600 text-sm">A/C holder name:</span>
                                <span className="font-medium text-gray-800">{selectedTransaction.performedBy?.name || 'N/A'}</span>
                            </div>

                            <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                <span className="text-gray-600 text-sm">Transaction amount:</span>
                                <span className="font-medium text-green-600 text-lg">${selectedTransaction.amount}</span>
                            </div>

                            <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                <span className="text-gray-600 text-sm">Tutor name:</span>
                                <span className="font-medium text-gray-800">{selectedTransaction.receivedBy?.name || 'N/A'}</span>
                            </div>
                        </div>

                        <div className="flex space-x-3 mt-6">
                            <button
                                onClick={handleDownload}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-linear-to-r from-[#614EFE] to-[#7D359F] text-white rounded-lg hover:opacity-90 transition-opacity"
                            >
                                <FiDownload size={16} />
                                Download
                            </button>
                            <button
                                onClick={handlePrint}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                <FiPrinter size={16} />
                                Print
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Summary Cards */}
            <SummaryCard summaryData={summaryData} />
            {/* Search and Filter Bar */}
            {/* Recent Transactions Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 mt-6">
                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-800">Recent Transactions</h3>
                    <div>
                        <div className="flex gap-4 items-end">
                            <div className="flex-1 min-w-[200px]">
                                <input
                                    type="date"
                                    value={searchFilters.date}
                                    onChange={(e) => handleFilterChange('date', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </div>

                            <div className="flex-1 min-w-[200px]">
                                <input
                                    type="text"
                                    placeholder="Student name"
                                    value={searchFilters.studentName}
                                    onChange={(e) => handleFilterChange('studentName', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </div>

                            <div className="flex-1 min-w-[200px]">
                                <input
                                    type="text"
                                    placeholder="Tutor name"
                                    value={searchFilters.tutorName}
                                    onChange={(e) => handleFilterChange('tutorName', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </div>

                            <button
                                onClick={handleSearch}
                                className="px-6 py-2 bg-linear-to-r from-[#614EFE] to-[#7D359F] text-white rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
                            >
                                <FiSearch size={18} />
                                Search
                            </button>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-linear-to-r from-[#614EFE] to-[#7D359F] text-white">
                            <tr>
                                <th className="text-left py-3 px-4 text-sm font-medium">#Tr.ID</th>
                                <th className="text-left py-3 px-4 text-sm font-medium">Student ID</th>
                                <th className="text-left py-3 px-4 text-sm font-medium">Tutor ID</th>
                                <th className="text-left py-3 px-4 text-sm font-medium">Amount</th>
                                <th className="text-left py-3 px-4 text-sm font-medium">Date</th>
                                <th className="text-left py-3 px-4 text-sm font-medium">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-8">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                                    </td>
                                </tr>
                            ) : filteredTransactions.length > 0 ? (
                                filteredTransactions.map((transaction) => (
                                    <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="py-3 px-4 text-sm text-gray-800">{transaction.transactionId || transaction.id}</td>
                                        <td className="py-3 px-4 text-sm text-gray-800">{transaction.studentId}</td>
                                        <td className="py-3 px-4 text-sm text-gray-800">{transaction.tutorId}</td>
                                        <td className="py-3 px-4 text-sm font-medium text-gray-800">${transaction.amount.toFixed(2)}</td>
                                        <td className="py-3 px-4 text-sm text-gray-600">
                                            {format(new Date(transaction.date), 'MMM dd, yyyy')}
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => handleViewTransaction(transaction.id)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="View"
                                                >
                                                    <FiEye size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteTransaction(transaction.id)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Delete"
                                                >
                                                    <FiTrash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center py-8 text-gray-500">
                                        No transactions found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="p-6 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Back
                            </button>

                            <div className="flex items-center space-x-1">
                                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                    let pageNum;
                                    if (totalPages <= 5) {
                                        pageNum = i + 1;
                                    } else if (currentPage <= 3) {
                                        pageNum = i + 1;
                                    } else if (currentPage >= totalPages - 2) {
                                        pageNum = totalPages - 4 + i;
                                    } else {
                                        pageNum = currentPage - 2 + i;
                                    }

                                    return (
                                        <button
                                            key={pageNum}
                                            onClick={() => handlePageChange(pageNum)}
                                            className={`px-3 py-2 text-sm font-medium rounded-lg ${currentPage === pageNum
                                                ? 'bg-linear-to-r from-[#614EFE] to-[#7D359F] text-white'
                                                : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                                                }`}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}
                            </div>

                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next
                            </button>
                        </div>

                        <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600">Page</span>
                            <input
                                type="number"
                                min="1"
                                max={totalPages}
                                value={currentPage}
                                onChange={handlePageInput}
                                className="w-16 px-2 py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                            <span className="text-sm text-gray-600">of {totalPages}</span>
                            <button
                                onClick={() => handlePageChange(parseInt(currentPage))}
                                className="px-3 py-1 text-sm font-medium text-white bg-linear-to-r from-[#614EFE] to-[#7D359F] rounded-lg hover:opacity-90"
                            >
                                Go
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Transaction Details Modal */}
            <TransactionDetailsModal />

            {/* Loading overlay for transaction details */}
            {loadingTransaction && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 flex items-center space-x-3">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
                        <span className="text-gray-700">Loading transaction details...</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Earnings;
