import React from 'react';

interface StepsProps {
  currentStep: number; // 1, 2, or 3
}

const CheckoutSteps: React.FC<StepsProps> = ({ currentStep }) => {
  const steps = ["Select Tickets", "Reservation", "Payment"];

  return (
    <div className="flex items-center justify-between w-full max-w-md mx-auto mb-8">
      {steps.map((step, index) => (
        <React.Fragment key={index}>
          <div className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors
              ${currentStep >= index + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
              {index + 1}
            </div>
            <span className={`text-xs mt-2 font-medium ${currentStep >= index + 1 ? 'text-blue-600' : 'text-gray-400'}`}>
              {step}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div className={`flex-1 h-0.5 mx-2 ${currentStep > index + 1 ? 'bg-blue-600' : 'bg-gray-200'}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default CheckoutSteps;