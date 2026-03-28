// src/components/ui/Tabs.jsx
import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';

export function Tabs({
  tabs = [],
  defaultTab,
  onChange,
  variant = 'underline', // 'underline' | 'pill' | 'bordered'
  size = 'md',
  className = '',
}) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });
  const tabRefs = useRef({});

  const updateIndicator = useCallback(() => {
    const el = tabRefs.current[activeTab];
    if (el) {
      setIndicator({
        left: el.offsetLeft,
        width: el.offsetWidth,
      });
    }
  }, [activeTab]);

  useEffect(() => {
    updateIndicator();
    window.addEventListener('resize', updateIndicator);
    return () => window.removeEventListener('resize', updateIndicator);
  }, [updateIndicator]);

  const handleSelect = (id) => {
    setActiveTab(id);
    onChange?.(id);
  };

  const sizeClasses = {
    sm: 'px-3 py-2 text-xs',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  const variantWrap = {
    underline: 'border-b border-dark-100',
    pill: 'bg-dark-50 rounded-xl p-1',
    bordered: 'border border-dark-100 rounded-xl p-1',
  };

  return (
    <div className={className}>
      {/* Tab list */}
      <div
        className={`relative flex overflow-x-auto no-scrollbar ${variantWrap[variant]}`}
        role="tablist"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            ref={(el) => (tabRefs.current[tab.id] = el)}
            role="tab"
            aria-selected={activeTab === tab.id}
            onClick={() => handleSelect(tab.id)}
            className={`
              relative z-[1] flex items-center gap-2 font-heading font-semibold
              whitespace-nowrap transition-colors duration-200
              ${sizeClasses[size]}
              ${activeTab === tab.id
                ? variant === 'underline'
                  ? 'text-saffron-600'
                  : 'text-dark-800'
                : 'text-dark-300 hover:text-dark-500'
              }
            `}
          >
            {tab.icon && <span className="text-[1.1em]">{tab.icon}</span>}
            {tab.label}
            {tab.count != null && (
              <span className={`
                px-1.5 py-0.5 text-[10px] rounded-full leading-none font-bold
                ${activeTab === tab.id
                  ? 'bg-saffron-100 text-saffron-700'
                  : 'bg-dark-100 text-dark-400'
                }
              `}>
                {tab.count}
              </span>
            )}
          </button>
        ))}

        {/* Animated indicator */}
        <motion.div
          layout
          className={
            variant === 'underline'
              ? 'absolute bottom-0 h-0.5 bg-saffron-500 rounded-full'
              : 'absolute inset-y-1 bg-white rounded-lg shadow-sm'
          }
          style={
            variant === 'underline'
              ? { left: indicator.left, width: indicator.width }
              : { left: indicator.left, width: indicator.width }
          }
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        />
      </div>

      {/* Tab panel */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        role="tabpanel"
        className="pt-5"
      >
        {tabs.find((t) => t.id === activeTab)?.content}
      </motion.div>
    </div>
  );
}
