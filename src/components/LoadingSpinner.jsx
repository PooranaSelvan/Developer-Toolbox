export default function LoadingSpinner({ size = 'md', text = 'Loading...' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  return (
    <div className="flex items-center justify-center min-h-[40vh]" role="status" aria-live="polite">
      <div className="text-center space-y-4">
        <div className="relative mx-auto" style={{ width: 'fit-content' }}>
          <div className={`${sizeClasses[size]} absolute inset-0 rounded-2xl bg-primary/20 animate-ping`} />
          <div className={`${sizeClasses[size]} relative rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/30`}>
            <svg 
              className="w-1/2 h-1/2 text-primary-content animate-spin" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold text-primary mb-1">{text}</p>
          <p className="text-xs opacity-40">Please wait a moment</p>
        </div>
      </div>
    </div>
  );
}
