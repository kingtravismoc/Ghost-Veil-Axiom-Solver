import React from 'react';
import { ActivityIcon } from './icons';

const SdrppWidget: React.FC = () => {
    return (
        <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
            <h2 className="text-xl font-semibold flex items-center gap-2">
                <ActivityIcon className="w-6 h-6 text-cyan-400" />
                SDR++ Waterfall (Widget)
            </h2>
            <div className="mt-4 bg-black h-64 rounded-md flex items-center justify-center border border-slate-600">
                <p className="text-slate-500">(Simulated SDR++ Waterfall Display)</p>
            </div>
        </div>
    );
};

export default SdrppWidget;
