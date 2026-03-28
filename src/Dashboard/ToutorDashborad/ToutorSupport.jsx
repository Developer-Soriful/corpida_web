import SupportSystem from '../../Components/SupportSystem';

export default function ToutorSupport() {
    return (
        <div className="space-y-4 md:space-y-6 px-4 md:px-0">
            {/* Header */}
            <div>
                <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                    Teacher Support
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                    We're here to help. Contact us anytime for support.
                </p>
            </div>

            <SupportSystem />
        </div>
    );
}
