import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const Input: React.FC<InputProps> = ({ label, error, className, ...props }) => {
  return (
    <div className="flex flex-col space-y-1 w-full">
      <label className="text-sm font-semibold text-gray-700">{label}</label>
      <input
        className={`px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all
          ${error ? 'border-red-500' : 'border-gray-300'} 
          ${className}`}
        {...props}
      />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
};

export default Input;