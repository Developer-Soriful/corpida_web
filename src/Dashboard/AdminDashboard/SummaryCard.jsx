const SummaryCard = ({ summaryData }) => {
    return (
        <div>
            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Total Earnings</p>
                            <p className="text-3xl text-[#8113b5] text-[32px] font-medium mt-2">
                                ${summaryData?.totalEarnings?.toFixed(2)}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Total Students</p>
                            <p className="text-3xl text-[#8113b5] text-[32px] font-medium mt-2">
                                {summaryData?.totalStudents?.toLocaleString()}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Total Tutors</p>
                            <p className="text-3xl text-[#8113b5] text-[32px] font-medium mt-2">
                                {summaryData?.totalTeachers?.toLocaleString()}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SummaryCard
