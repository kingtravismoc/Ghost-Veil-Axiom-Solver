import React from 'react';

interface ManagementTabsProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
    tabs: string[];
}

const ManagementTabs: React.FC<ManagementTabsProps> = ({ activeTab, onTabChange, tabs }) => {
    return (
        <div className="border-b border-slate-700 mb-6">
            <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => onTabChange(tab)}
                        className={`${
                            activeTab === tab
                                ? 'border-cyan-500 text-cyan-400'
                                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-500'
                        } whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors`}
                    >
                        {tab}
                    </button>
                ))}
            </nav>
        </div>
    );
};

export default ManagementTabs;
