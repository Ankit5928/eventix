import React, { useEffect } from 'react';
import { createPortal } from 'react-dom'; // Required for teleporting the modal
import { cn } from './Button';
import { X, Sparkles } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function Modal({ isOpen, onClose, title, description, children, className }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // This wraps the modal in a Portal to force it to the root of the body
  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-8 outline-none">
      {/* Cinematic Backdrop */}
      <div
        className="fixed inset-0 bg-black/90 backdrop-blur-md animate-in fade-in duration-300"
        onClick={onClose}
      />

      <div
        className={cn(
          "relative w-full max-w-xl bg-gradient-to-b from-[#1A0000] to-[#0A0000]",
          "rounded-[2.5rem] border border-white/10 shadow-[0_0_100px_rgba(0,0,0,1)]",
          "animate-in zoom-in-95 fade-in duration-300 flex flex-col",
          "max-h-[85vh] overflow-hidden",
          className
        )}
      >
        {/* Top Accent Trace */}
        <div className="absolute top-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-[#FF3333] to-transparent opacity-50" />

        {/* Modal Header */}
        <div className="p-8 pb-4 relative border-b border-white/5 shrink-0">
          <button
            onClick={onClose}
            className="absolute right-6 top-6 h-10 w-10 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-white/40 transition-all hover:bg-[#FF3333]/20 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="flex flex-col space-y-2 text-left">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="h-4 w-4 text-[#FF3333] animate-pulse" />
              <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/30">System Prompt</span>
            </div>
            {title && <h2 className="text-2xl font-bold tracking-tighter italic text-white leading-tight uppercase">{title}</h2>}
            {description && <p className="text-xs font-light italic text-white/40 border-l border-[#FF3333]/30 pl-4">{description}</p>}
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-8 pt-6 overflow-y-auto custom-scrollbar flex-1 relative z-10">
          {children}
        </div>

        {/* Bottom Decorative Glow */}
        <div className="absolute bottom-[-40px] left-1/2 -translate-x-1/2 w-48 h-24 bg-[#FF3333]/10 blur-[50px] pointer-events-none" />
      </div>
    </div>,
    document.body // Teleport destination
  );
}