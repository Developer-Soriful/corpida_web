import SupportSystem from '../../Components/SupportSystem';

export default function Support() {
    return (
        <div className="min-h-screen space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                    Support
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                    We're here to help. Contact us anytime for support.
                </p>
            </div>

            <SupportSystem />
        </div>
    );
}
