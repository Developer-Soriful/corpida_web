import { useEffect, useState } from 'react';
import logo from '../../assets/Frame2.png'
import logo1 from '../../assets/Frame4.png'
import api from '../../services/api';
import Spinner from '../../Components/Spinner';
export default function PaymentHistory() {

  const [transactions, setTransactions] = useState([]);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const PaymentData = async () => {
      const res = await api.get("/transaction/student/wallet");
      setPaymentHistory(res.response.data)
      setTransactions(res.response.data.lastTransactions);
      setLoading(false);
    }
    PaymentData();
  }, [])
  console.log(paymentHistory)
  if (loading) {
    return <Spinner text='Payment History loading...' />
  }
  return (
    <div className="  min-h-screen">
      {/* Header */}
      <h2 className="text-[#6657E2] font-semibold text-xl mb-1">
        Payment History
      </h2>
      <p className="text-gray-500 text-sm mb-6">
        View your transaction history, invoices, and payment details.
      </p>

      {/* Summary Cards */}
      <div className="flex gap-6 mb-8">
        {/* Pending */}
        <div className="flex-1 bg-white rounded-lg p-5 shadow-sm flex flex-col items-center gap-2">
          <div className="p-2 rounded-md bg-purple-100">
            {/* calendar icon */}
            <img src={logo} alt="" />
          </div>
          <p className="text-gray-500 text-md">Pending</p>
          <p className="text-xl text-[#585858] font-bold">${paymentHistory.totalPendingPayments}</p>
        </div>

        {/* Total Spent */}
        <div className="flex-1 bg-white rounded-lg p-5 shadow-sm flex flex-col items-center gap-2 relative">
          <div className="p-2 rounded-md bg-purple-100">
            {/* credit card icon */}
            <img src={logo1} alt="" />
          </div>
          <p className="text-gray-500 text-md">Total Spent</p>
          <p className="text-xl text-[#585858] font-bold">${paymentHistory.totalSpent}</p>

          {/* small overlapping avatar circle */}
          <div className="absolute -top-2 -right-3 flex -space-x-2">


          </div>
        </div>

        {/* Completed */}
        <div className="flex-1 bg-white rounded-lg p-5 shadow-sm flex flex-col items-center gap-2">
          <div className="p-2 rounded-md bg-purple-100">
            {/* credit card icon */}
            <img src={logo1} alt="" />
          </div>
          <p className="text-gray-500 text-md">Completed</p>
          <p className="text-xl text-[#585858] font-bold">{paymentHistory.completedPayments}</p>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-[#FFFFFF] rounded-lg p-5 space-y-4">
        <h3 className="text-[#6657E2] font-semibold text-xl mb-3">
          Transaction History
        </h3>

        {transactions.length > 0 ? transactions.map((tx, i) => (
          <div
            key={tx.id}
            className="flex justify-between items-center border border-gray-200 rounded-md p-4"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-md bg-purple-100">
                {/* credit card icon */}
                <img src={logo1} alt="" />
              </div>
              <div>
                <p className="text-[#6657E2] font-semibold text-xl">
                  {tx.title}
                </p>
                <p className="text-xs text-gray-400">
                  Transaction ID: {tx.id}
                </p>
                <p className="text-xs text-gray-400">{tx.date}</p>
              </div>
            </div>

            <div className=" items-center">
              <span className=" py-1 text-xs font-semibold rounded-full text-green-700 bg-green-100">
                {tx.status}
              </span>
              <p className="text-purple-700 mt-3 font-semibold">${tx.amount}.00</p>
            </div>
          </div>
        )) : (
          <p className="text-center">No transactions found</p>
        )}
      </div>
    </div>
  );
}
