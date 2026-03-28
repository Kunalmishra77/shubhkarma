// src/components/ui/Badge.jsx

const variants = {
  saffron:   'bg-saffron-50 text-saffron-700 border border-saffron-200',
  gold:      'bg-gold-50 text-gold-700 border border-gold-200',
  dark:      'bg-dark-800 text-gold-300 border border-dark-600',
  success:   'bg-green-50 text-green-700 border border-green-200',
  warning:   'bg-amber-50 text-amber-700 border border-amber-200',
  danger:    'bg-red-50 text-red-700 border border-red-200',
  outline:   'bg-transparent text-dark-400 border border-dark-100',
  ghost:     'bg-dark-50 text-dark-500 border border-transparent',
  premium:   'bg-gradient-to-r from-saffron-500 to-gold-400 text-white border border-transparent',
};

const sizes = {
  sm: 'px-2 py-0.5 text-[10px]',
  md: 'px-2.5 py-0.5 text-xs',
  lg: 'px-3 py-1 text-sm',
};

export function Badge({
  children,
  variant = 'saffron',
  size = 'md',
  dot = false,
  icon = null,
  className = '',
}) {
  return (
    <span
      className={`
        inline-flex items-center gap-1 rounded-full font-heading font-semibold
        leading-none tracking-wide whitespace-nowrap
        ${sizes[size] || sizes.md}
        ${variants[variant] || variants.saffron}
        ${className}
      `}
    >
      {dot && (
        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
      )}
      {icon && <span className="text-[1em]">{icon}</span>}
      {children}
    </span>
  );
}
