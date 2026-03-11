import React from "react";
import { BellRing, X } from "lucide-react";
import { SaleNotification } from "../../types/notification.types";

interface ToastProps {
  notification: SaleNotification;
  onClose: () => void;
}

const ToastNotification: React.FC<ToastProps> = ({ notification, onClose }) => {
  return (
    <div className="fixed bottom-5 right-5 w-80 bg-white border-l-4 border-green-500 shadow-2xl rounded-lg p-4 animate-bounce-in">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <BellRing className="h-6 w-6 text-green-500" />
        </div>
        <div className="ml-3 w-0 flex-1 pt-0.5">
          <p className="text-sm font-bold text-gray-900">
            New Sale! ${notification.amount}
          </p>
          <p className="mt-1 text-sm text-gray-500">
            {notification.customerName} just bought tickets for{" "}
            {notification.eventName}
          </p>
        </div>
        <div className="ml-4 flex-shrink-0 flex">
          <button
            onClick={onClose}
            className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ToastNotification;
