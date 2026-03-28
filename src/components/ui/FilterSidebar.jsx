// src/components/ui/FilterSidebar.jsx
import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from './Badge';

export function FilterSidebar({
  filters = [],
  activeFilters = {},
  onFilterChange,
  onClearAll,
  className = '',
}) {
  const [collapsed, setCollapsed] = useState({});

  const toggleGroup = useCallback((id) => {
    setCollapsed((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const activeCount = Object.values(activeFilters).reduce(
    (sum, arr) => sum + (Array.isArray(arr) ? arr.length : 0),
    0
  );

  const isChecked = (groupId, value) =>
    activeFilters[groupId]?.includes(value) || false;

  return (
    <aside
      className={`
        w-full bg-white rounded-2xl border border-dark-50
        shadow-sm overflow-hidden ${className}
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-dark-50">
        <div className="flex items-center gap-2">
          <h3 className="font-heading text-lg font-bold text-dark-800">Filters</h3>
          {activeCount > 0 && (
            <Badge variant="saffron" size="sm">{activeCount}</Badge>
          )}
        </div>
        {activeCount > 0 && (
          <button
            onClick={onClearAll}
            className="text-xs font-semibold text-saffron-600 hover:text-saffron-500 transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Filter groups */}
      <div className="divide-y divide-dark-50">
        {filters.map((group) => (
          <div key={group.id} className="px-5 py-4">
            {/* Group header */}
            <button
              onClick={() => toggleGroup(group.id)}
              className="flex items-center justify-between w-full text-left group"
            >
              <h4 className="font-heading text-sm font-semibold text-dark-700 group-hover:text-dark-800 transition-colors">
                {group.title}
              </h4>
              <svg
                className={`w-4 h-4 text-dark-300 transition-transform duration-300 ${
                  collapsed[group.id] ? '' : 'rotate-180'
                }`}
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
              </svg>
            </button>

            {/* Options */}
            <AnimatePresence initial={false}>
              {!collapsed[group.id] && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <div className="flex flex-col gap-2.5 pt-3">
                    {group.options.map((option) => {
                      const checked = isChecked(group.id, option.value);
                      return (
                        <label
                          key={option.value}
                          className="flex items-center gap-3 cursor-pointer group/item"
                        >
                          <span
                            className={`
                              flex items-center justify-center w-[18px] h-[18px] rounded
                              border-2 transition-all duration-200 shrink-0
                              ${checked
                                ? 'bg-saffron-500 border-saffron-500'
                                : 'border-dark-200 group-hover/item:border-saffron-300'
                              }
                            `}
                          >
                            {checked && (
                              <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                                <path d="M2.5 6L5 8.5L9.5 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            )}
                          </span>
                          <input
                            type="checkbox"
                            className="sr-only"
                            checked={checked}
                            onChange={(e) => onFilterChange(group.id, option.value, e.target.checked)}
                          />
                          <span className={`
                            text-sm transition-colors duration-200
                            ${checked ? 'text-dark-800 font-medium' : 'text-dark-400 group-hover/item:text-dark-600'}
                          `}>
                            {option.label}
                          </span>
                          {option.count != null && (
                            <span className="ml-auto text-xs text-dark-200">
                              {option.count}
                            </span>
                          )}
                        </label>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </aside>
  );
}
