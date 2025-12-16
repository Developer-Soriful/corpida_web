const SetPassword = () => {
  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-[#F4F8F5]">
      <div className="bg-white rounded-2xl w-full max-w-lg px-16 py-50 shadow-xl">


        <h2 className="text-2xl font-semibold bg-gradient-to-r from-[#614EFE] via-[#7D359F] to-[#7D359F] bg-clip-text text-transparent">
          Set Password
        </h2>

        <p className="text-gray-600 text-sm mt-2 leading-relaxed">
          Enter your new password below to reset your account.
        </p>


        <div className="mt-8">
          <label className="text-sm font-medium text-[#585858]">New Password</label>
          <input
            type="password"
            placeholder="Password"
            className="w-full border border-gray-300 rounded-lg p-3 mt-2 text-sm focus:ring-purple-400 focus:border-purple-400"
          />
        </div>


        <div className="mt-6">
          <label className="text-sm font-medium text-[#585858]">Confirm Password</label>
          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full border border-gray-300 rounded-lg p-3 mt-2 text-sm focus:ring-purple-400 focus:border-purple-400"
          />
        </div>


        <button className="w-full mt-10 bg-gradient-to-r from-[#6657E2] to-[#903CD1] text-white py-3 rounded-full text-base font-medium shadow-sm">
          Set New Password
        </button>

      </div>
    </div>
  );
};

export default SetPassword;
