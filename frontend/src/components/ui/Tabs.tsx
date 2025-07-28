interface TabButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

function TabButton({ label, isActive, onClick }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 text-sm sm:text-base ${
        isActive
          ? "bg-[#E75234] text-white border-2 border-[#E75234] shadow-md"
          : "bg-white text-gray-600 hover:text-gray-800 hover:bg-gray-200 border-2 border-gray-200"
      }`}>
      {label}
    </button>
  );
}

interface TabsProps {
  tabs: Array<{
    key: string;
    label: string;
  }>;
  activeTab: string;
  onTabChange: (key: string) => void;
  className?: string;
}

export default function Tabs({ tabs, activeTab, onTabChange, className = "" }: TabsProps) {
  return (
    <div className={`flex justify-center mb-6 ${className}`}>
      <div className="bg-gray-100 rounded-xl p-1 flex">
        {tabs.map((tab) => (
          <TabButton
            key={tab.key}
            label={tab.label}
            isActive={activeTab === tab.key}
            onClick={() => onTabChange(tab.key)}
          />
        ))}
      </div>
    </div>
  );
}
