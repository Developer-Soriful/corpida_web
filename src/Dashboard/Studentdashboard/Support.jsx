import SupportSystem from '../../Components/SupportSystem';

export default function Support() {
    return (
        <div className="min-h-screen">
            {/* Header */}
            <h2 className="text-[#6657E2] font-semibold text-xl mb-1">
                Support
            </h2>
            <p className="text-gray-500 text-sm mb-6">
                We’re here to help. Contact us anytime for support.
            </p>

            <SupportSystem />
        </div>
    );
}
