import React from 'react';

const Disclaimer: React.FC = () => {
    return (
        <div className="mt-8 p-4 bg-yellow-900/30 border-2 border-yellow-600 rounded-lg text-sm text-yellow-200">
            <div className="font-bold text-yellow-300 mb-2">⚠️ CRITICAL LEGAL & SAFETY WARNING</div>
            <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm">
                <li>This is a conceptual tool for educational purposes. It does not interact with real hardware.</li>
                <li>Transmitting radio frequencies or jamming signals is illegal in most jurisdictions and can have severe consequences.</li>
                <li>The data and analysis are AI-generated for functional purposes and should not be used for real-world decisions.</li>
                <li>Always comply with all local, national, and international laws regarding telecommunications and privacy.</li>
            </ul>
            <div className="mt-3 pt-3 border-t-2 border-yellow-700/50 text-xs text-green-300">
                <strong>Safety Protocol Active:</strong> System logic includes a non-negotiable directive to avoid interference with known medical device frequencies (e.g., MedRadio band).
            </div>
        </div>
    );
};

export default Disclaimer;
