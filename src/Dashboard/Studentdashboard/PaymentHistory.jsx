import { useEffect, useState } from 'react';
import logo from '../../assets/Frame2.png';
import logo1 from '../../assets/Frame4.png';
import api from '../../services/api';
import Spinner from '../../Components/Spinner';

export default function PaymentHistory() {
  const [transactions, setTransactions] = useState([]);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const PaymentData = async () => {
      try {
        const res = await api.get("/transaction/student/wallet");
        setPaymentHistory(res.response.data);
        setTransactions(res.response.data.lastTransactions);
      } catch (error) {
        console.error("Error fetching payment data:", error);
      } finally {
        setLoading(false);
      }
    };
    PaymentData();
  }, []);

  console.log(paymentHistory);

  if (loading) {
    return <Spinner text='Payment History loading...' />;
  }

  return (
    <div className="min-h-screen space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
          Payment History
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          View your transaction history, invoices, and payment details.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-6">
        {/* Pending */}
        <div className="bg-white rounded-2xl p-6 shadow-sm flex flex-col items-center gap-3 border border-gray-100 hover:shadow-md transition-all">
          <div className="p-3 rounded-xl bg-amber-50">
            <img src={logo} alt="" className="w-6 h-6" />
          </div>
          <p className="text-gray-500 text-sm font-medium">Pending</p>
          <p className="text-2xl text-gray-900 font-bold">
            ${paymentHistory.totalPendingPayments || 0}
          </p>
        </div>

        {/* Total Spent */}
        <div className="bg-white rounded-2xl p-6 shadow-sm flex flex-col items-center gap-3 border border-gray-100 hover:shadow-md transition-all">
          <div className="p-3 rounded-xl bg-purple-50">
            <img src={logo1} alt="" className="w-6 h-6" />
          </div>
          <p className="text-gray-500 text-sm font-medium">Total Spent</p>
          <p className="text-2xl text-gray-900 font-bold">
            ${paymentHistory.totalSpent || 0}
          </p>
        </div>

        {/* Completed */}
        <div className="bg-white rounded-2xl p-6 shadow-sm flex flex-col items-center gap-3 border border-gray-100 hover:shadow-md transition-all">
          <div className="p-3 rounded-xl bg-emerald-50">
            <img src={logo1} alt="" className="w-6 h-6" />
          </div>
          <p className="text-gray-500 text-sm font-medium">Completed</p>
          <p className="text-2xl text-gray-900 font-bold">
            {paymentHistory.completedPayments || 0}
          </p>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-4">
          Transaction History
        </h3>

        <div className="space-y-4">
          {transactions.length > 0 ? (
            transactions.map((tx, i) => (
              <div
                key={tx.id || i}
                className="flex justify-between items-center border border-gray-100 rounded-xl p-4 hover:shadow-sm transition-all bg-gray-50/50"
              >
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-purple-100">
                    <img src={logo1} alt="" className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-purple-700 font-bold text-lg">
                      {tx.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      Transaction ID: {tx.id}
                    </p>
                    <p className="text-xs text-gray-400">{tx.date}</p>
                  </div>
                </div>

                <div className="flex flex-col items-end">
                  <span className="px-3 py-1 text-xs font-semibold rounded-full text-green-700 bg-green-100">
                    {tx.status}
                  </span>
                  <p className="text-purple-700 mt-2 font-bold text-lg">
                    ${tx.amount}.00
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
              <p className="text-gray-500">No transactions found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}