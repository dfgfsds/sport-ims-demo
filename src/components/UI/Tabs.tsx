import React from 'react';

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  renderFooter?: (args: {
    activeTabIndex: number;
    setActiveTabIndex: (index: number) => void;
  }) => React.ReactNode;
  tabDisabled?: (tabIndex: number) => boolean;
  tabButtonProps?: (tabIndex: number) => React.ButtonHTMLAttributes<HTMLButtonElement>;
}

const Tabs: React.FC<TabsProps> = ({
  tabs,
  defaultTab,
  renderFooter,
  tabDisabled,
  tabButtonProps,
}) => {
  const [activeTabIndex, setActiveTabIndex] = React.useState(() => {
    if (defaultTab) {
      const idx = tabs.findIndex(tab => tab.id === defaultTab);
      return idx !== -1 ? idx : 0;
    }
    return 0;
  });

  const activeTab = tabs[activeTabIndex];

  return (
    <div>
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab, idx) => (
            <button
              key={tab.id}
              onClick={() => setActiveTabIndex(idx)}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTabIndex === idx
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              disabled={tabDisabled?.(idx)}
              aria-disabled={tabDisabled?.(idx)}
              {...(tabButtonProps?.(idx) ?? {})}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
      
      <div className="mt-6">
        {activeTab?.content}
      </div>

      {renderFooter &&
        renderFooter({
          activeTabIndex,
          setActiveTabIndex,
        })}
    </div>
  );
};

export default Tabs;