import { useState } from 'react';
import { X, CheckCircle } from 'lucide-react';

export default function ToastNotification() {
  const [visible, setVisible] = useState(false);

  // In a real implementation this would listen to a global event or Redux
  
  if (!visible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-fade-in-up">
      <div className="bg-white dark:bg-card border border-border shadow-lg rounded-lg p-4 flex items-start gap-3 w-80">
        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h4 className="text-sm font-semibold">Success</h4>
          <p className="text-xs text-muted-foreground mt-1">Action completed successfully.</p>
        </div>
        <button onClick={() => setVisible(false)} className="text-muted-foreground hover:text-foreground transition-colors">
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
