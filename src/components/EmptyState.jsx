import { AlertCircle } from 'lucide-react';

export default function EmptyState({ 
  icon: Icon = AlertCircle,
  title = 'No items found',
  description = 'There are no items to display at the moment.',
  action,
  className = ''
}) {
  return (
    <div className={`text-center py-16 px-4 ${className}`} role="status">
      <div className="max-w-md mx-auto">
        <div className="w-20 h-20 rounded-2xl bg-base-200/80 flex items-center justify-center mx-auto mb-5 relative">
          <Icon size={32} className="opacity-20" aria-hidden="true" />
          <div className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-warning/20 flex items-center justify-center">
            <AlertCircle size={14} className="text-warning" />
          </div>
        </div>
        
        <h3 className="text-lg font-bold mb-2">{title}</h3>
        <p className="text-sm opacity-50 mb-6 leading-relaxed">{description}</p>
        
        {action && <div className="flex justify-center">{action}</div>}
      </div>
    </div>
  );
}
