import React from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface AlertProps {
  type: 'success' | 'error';
  message: string;
}

const Alert: React.FC<AlertProps> = ({ type, message }) => {
  const styles = type === 'success' 
    ? "bg-green-50 text-green-700 border-green-200" 
    : "bg-red-50 text-red-700 border-red-200";

  return (
    <div className={`flex items-center p-4 border rounded-lg ${styles}`}>
      {type === 'success' ? <CheckCircle2 className="w-5 h-5 mr-3" /> : <AlertCircle className="w-5 h-5 mr-3" />}
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
};

export default Alert;