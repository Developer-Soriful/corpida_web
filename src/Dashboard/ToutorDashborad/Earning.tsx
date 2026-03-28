import { useEffect, useState } from 'react';
import { FiX, FiCreditCard, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { toast } from 'react-toastify';
import logo from '../../assets/Frame2.png';
import logo1 from '../../assets/Frame4.png';
import api from '../../services/api';
import Spinner from '../../Components/Spinner';

interface Transaction {
    id?: string;
    title?: string;
    date?: string;
    status?: string;
    amount?: number;
}

interface EarningDataType {
    totalPendingPayments: number;
    totalEarnings: number;
    completedPayments: number;
    lastTransactions?: Transaction[];
    isWalletConnected?: boolean;
    hasPayoutMethod?: boolean;
    totalSpent?: number;
}

export default function Earning() {
    const [transactions, setTransactions] = useState < Transaction[] > ([]);
    const [earningData, setEarningData] = useState < EarningDataType > ({
        totalPendingPayments: 0,
        totalEarnings: 0,
        completedPayments: 0
    });
    const [loading, setLoading] = useState(true);
    const [walletSetupLoading, setWalletSetupLoading] = useState(false);

    // Wallet Setup Modal State
    const [showWalletModal, setShowWalletModal] = useState(false);
    const [isWalletConnected, setIsWalletConnected] = useState(false);

    useEffect(() => {
        const fetchEarningData = async () => {
            try {
                const res = await api.get("/transaction/teacher/wallet");
                const data = res.response?.data || res.data || {};
                setEarningData(data);
                setTransactions(data.lastTransactions || []);
                setIsWalletConnected(data.isWalletConnected || data.hasPayoutMethod || false);
            } catch (error) {
                console.error("Failed to fetch earning data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchEarningData();
    }, []);

    const handleWalletSetup = async () => {
        setWalletSetupLoading(true);
        try {
            // Correct API from Postman: POST /transaction/wallet
            const response = await api.post('/transaction/wallet');

            if (response.status === 200 && response.response?.data?.url) {
                // Stripe Connect URL received - open in new tab
                const stripeUrl = response.response.data.url;
                window.open(stripeUrl, '_blank');
                toast.success('Redirecting to Stripe for secure wallet setup...');
                setShowWalletModal(false);
            } else {
                throw new Error(response.message || 'Failed to get wallet setup URL');
            }
        } catch (error) {
            console.error('Wallet setup error:', error);
            const errorMsg = error.response?.data?.message ||
                error.message ||
                'Failed to connect wallet. Please try again.';
            toast.error(errorMsg);
        } finally {
            setWalletSetupLoading(false);
        }
    };

    if (loading) {
        return <Spinner text='Earnings loading...' className="text-[#6657E2]" />;
    }

    return (
        <div className="space-y-4 md:space-y-6 px-4 md:px-0">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                        Earnings
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">
                        Track your earnings, view transaction history, and manage withdrawals.
                    </p>
                </div>
                <button
                    onClick={() => setShowWalletModal(true)}
                    className={`px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 text-sm font-medium shadow-sm hover:shadow-md transition-all ${isWalletConnected
                            ? 'bg-green-600 hover:bg-green-700 text-white'
                            : 'bg-gradient-to-r from-purple-600 to-purple-700 hover:opacity-90 text-white'
                        }`}
                >
                    {isWalletConnected ? (
                        <>
                            <FiCheckCircle size={18} />
                            Wallet Connected
                        </>
                    ) : (
                        <>
                            <FiCreditCard size={18} />
                            Set up wallet
                        </>
                    )}
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-5">
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col items-center gap-3 hover:shadow-md transition-shadow">
                    <div className="p-3 rounded-xl bg-purple-50">
                        <img src={logo} alt="pending" className="w-8 h-8" />
                    </div>
                    <p className="text-gray-500 text-sm">Pending</p>
                    <p className="text-2xl text-gray-800 font-bold">${earningData.totalPendingPayments || 0}</p>
                </div>

                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col items-center gap-3 hover:shadow-md transition-shadow">
                    <div className="p-3 rounded-xl bg-purple-50">
                        <img src={logo1} alt="total earnings" className="w-8 h-8" />
                    </div>
                    <p className="text-gray-500 text-sm">Total Earnings</p>
                    <p className="text-2xl text-gray-800 font-bold">${earningData.totalEarnings || earningData.totalSpent || 0}</p>
                </div>

                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col items-center gap-3 hover:shadow-md transition-shadow">
                    <div className="p-3 rounded-xl bg-purple-50">
                        <img src={logo1} alt="completed" className="w-8 h-8" />
                    </div>
                    <p className="text-gray-500 text-sm">Completed</p>
                    <p className="text-2xl text-gray-800 font-bold">{earningData.completedPayments || 0}</p>
                </div>
            </div>

            {/* Transaction History */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                    Transaction History
                </h3>

                {transactions.length > 0 ? (
                    <div className="space-y-3">
                        {transactions.map((tx, i) => (
                            <div
                                key={tx.id || i}
                                className="flex justify-between items-center border border-gray-100 rounded-xl p-4 hover:bg-gray-50/50 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 rounded-xl bg-purple-50">
                                        <img src={logo1} alt="transaction" className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-gray-900 font-semibold text-sm md:text-base">
                                            {tx.title}
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            ID: {tx.id}
                                        </p>
                                        <p className="text-xs text-gray-400">{tx.date}</p>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <span className="px-2.5 py-1 text-xs font-medium rounded-full text-green-700 bg-green-100">
                                        {tx.status}
                                    </span>
                                    <p className="text-purple-700 mt-2 font-semibold">${tx.amount}.00</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-gray-50/50 rounded-xl">
                        <p className="text-gray-500">No transactions found</p>
                    </div>
                )}
            </div>

            {/* Wallet Setup Modal */}
            {showWalletModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 sticky top-0">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-100 rounded-lg">
                                    <FiCreditCard className="text-purple-600" size={20} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-800">
                                        Connect Your Bank Account
                                    </h3>
                                    <p className="text-xs text-gray-500">
                                        Secure payouts to your bank account
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowWalletModal(false)}
                                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                            >
                                <FiX size={20} className="text-gray-500" />
                            </button>
                        </div>

                        <div className="p-6">
                            <div className="space-y-5">
                                {/* Stripe Connect Info */}
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                        <FiCreditCard size={32} className="text-purple-600" />
                                    </div>
                                    <h4 className="text-lg font-bold text-gray-800 mb-2">Connect Your Bank Account</h4>
                                    <p className="text-sm text-gray-500">
                                        Receive payments directly to your bank account through our secure payment partner Stripe.
                                    </p>
                                </div>

                                {/* Benefits */}
                                <div className="space-y-3">
                                    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                                        <div className="p-1.5 bg-green-100 rounded-lg shrink-0">
                                            <FiCheckCircle size={16} className="text-green-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-800">Secure & Encrypted</p>
                                            <p className="text-xs text-gray-500">Bank-level security with Stripe</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                                        <div className="p-1.5 bg-green-100 rounded-lg shrink-0">
                                            <FiCheckCircle size={16} className="text-green-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-800">Fast Payouts</p>
                                            <p className="text-xs text-gray-500">Get paid within 2-3 business days</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                                        <div className="p-1.5 bg-green-100 rounded-lg shrink-0">
                                            <FiCheckCircle size={16} className="text-green-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-800">No Hidden Fees</p>
                                            <p className="text-xs text-gray-500">Transparent pricing on all transactions</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Security Note */}
                                <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
                                    <p className="text-xs text-blue-700 flex items-start gap-2">
                                        <FiAlertCircle size={14} className="mt-0.5 shrink-0" />
                                        You will be redirected to Stripe's secure platform to complete your account setup.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50">
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowWalletModal(false)}
                                    className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleWalletSetup}
                                    disabled={walletSetupLoading}
                                    className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                                >
                                    {walletSetupLoading ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Connecting...
                                        </>
                                    ) : (
                                        <>
                                            <FiCheckCircle size={16} />
                                            Connect Wallet
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}