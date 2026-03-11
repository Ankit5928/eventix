import React, { useState, useEffect } from 'react';
import { Timer } from 'lucide-react';

interface CountdownProps {
  expiryDate: string;
  onExpire: () => void;
}

const CountdownTimer: React.FC<CountdownProps> = ({ expiryDate, onExpire }) => {
  const [timeLeft, setTimeLeft] = useState<string>("");

  useEffect(() => {
    const timer = setInterval(() => {
      const distance = new Date(expiryDate).getTime() - new Date().getTime();
      
      if (distance < 0) {
        clearInterval(timer);
        onExpire();
        return;
      }

      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      setTimeLeft(`${minutes}:${seconds < 10 ? '0' : ''}${seconds}`);
    }, 1000);

    return () => clearInterval(timer);
  }, [expiryDate, onExpire]);

  return (
    <div className="flex items-center justify-center p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 font-bold">
      <Timer className="w-5 h-5 mr-2 animate-pulse" />
      <span>Time Remaining: {timeLeft || "00:00"}</span>
    </div>
  );
};

export default CountdownTimer;