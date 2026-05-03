// GlassCard.jsx
export function GlassCard({ children, className = '', onClick }) {
  return (
    <div
      onClick={onClick}
      className={`glass rounded-2xl p-5 ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''} ${className}`}
    >
      {children}
    </div>
  );
}

// StatCard.jsx
export function StatCard({ title, value, subtitle, icon: Icon, trend, color = 'brand', className = '' }) {
  const colors = {
    brand:   { bg: 'bg-brand-50',   icon: 'text-brand-500',   ring: 'ring-brand-100' },
    success: { bg: 'bg-success-50', icon: 'text-success-500', ring: 'ring-success-100' },
    warn:    { bg: 'bg-warn-50',    icon: 'text-warn-500',    ring: 'ring-warn-100' },
    danger:  { bg: 'bg-danger-50',  icon: 'text-danger-500',  ring: 'ring-danger-100' },
    slate:   { bg: 'bg-slate-100',  icon: 'text-slate-500',   ring: 'ring-slate-200' },
  };
  const c = colors[color] || colors.brand;

  return (
    <div className={`card p-5 animate-fade-in ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</p>
          <p className="text-2xl font-bold text-slate-900 mt-1 tracking-tight">{value}</p>
          {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
          {trend && (
            <span className={`inline-flex items-center gap-1 text-xs font-medium mt-2 ${trend.positive ? 'text-success-600' : 'text-danger-500'}`}>
              {trend.positive ? '↑' : '↓'} {trend.label}
            </span>
          )}
        </div>
        {Icon && (
          <div className={`w-10 h-10 rounded-xl ${c.bg} ring-1 ${c.ring} flex items-center justify-center flex-shrink-0`}>
            <Icon className={`w-5 h-5 ${c.icon}`} />
          </div>
        )}
      </div>
    </div>
  );
}

// Badge.jsx
export function Badge({ children, variant = 'slate', className = '' }) {
  const variants = {
    slate:   'bg-slate-100 text-slate-600',
    brand:   'bg-brand-50 text-brand-600',
    success: 'bg-success-50 text-success-600',
    warn:    'bg-warn-50 text-warn-600',
    danger:  'bg-danger-50 text-danger-500',
    emerald: 'bg-emerald-50 text-emerald-600',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${variants[variant] || variants.slate} ${className}`}>
      {children}
    </span>
  );
}

// Loader.jsx
export function Loader({ size = 'md', className = '' }) {
  const sizes = { sm: 'w-4 h-4 border-2', md: 'w-7 h-7 border-2', lg: 'w-10 h-10 border-3' };
  return (
    <div className={`${sizes[size]} border-brand-200 border-t-brand-500 rounded-full animate-spin ${className}`} />
  );
}

export function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <Loader size="lg" className="mx-auto" />
        <p className="text-sm text-slate-400 mt-3 font-medium">Loading...</p>
      </div>
    </div>
  );
}

// Modal.jsx
export function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  if (!isOpen) return null;
  const sizes = { sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-lg', xl: 'max-w-2xl' };
  return (
    <div className="modal-overlay animate-fade-in" onClick={onClose}>
      <div
        className={`w-full ${sizes[size]} bg-white rounded-2xl shadow-2xl animate-scale-in`}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="text-base font-bold text-slate-900">{title}</h3>
          <button onClick={onClose} className="btn-icon text-slate-400 hover:text-slate-600">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

// Empty state
export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      {Icon && (
        <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
          <Icon className="w-7 h-7 text-slate-400" />
        </div>
      )}
      <h3 className="text-base font-semibold text-slate-700">{title}</h3>
      {description && <p className="text-sm text-slate-400 mt-1 max-w-xs">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

// ProgressBar
export function ProgressBar({ value, max = 100, color = 'brand', className = '' }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const colors = {
    brand: 'bg-brand-500',
    success: 'bg-success-500',
    warn: 'bg-warn-400',
    danger: 'bg-danger-500',
  };
  const barColor = value >= 75 ? colors.success : value >= 60 ? colors.warn : colors.danger;
  return (
    <div className={`progress-bar ${className}`}>
      <div className={`progress-fill ${barColor}`} style={{ width: `${pct}%` }} />
    </div>
  );
}
