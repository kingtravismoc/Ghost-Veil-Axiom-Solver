
import React from 'react';

const ForkWarningBanner: React.FC = () => {
    return (
        <div className="bg-red-900/50 border-b-2 border-red-500 p-3 text-center">
            <p className="text-sm font-semibold text-red-300">
                ⚠️ You are running an unauthorized fork of the Ghost Veil Protocol. System integrity cannot be guaranteed.
            </p>
        </div>
    );
};

export default ForkWarningBanner;
