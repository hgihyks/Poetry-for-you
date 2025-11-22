import React from 'react';

interface NeuButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  label?: string;
  active?: boolean;
  variant?: 'circle' | 'pill';
}

export const NeuButton: React.FC<NeuButtonProps> = ({ 
  icon, 
  label, 
  active = false, 
  variant = 'circle', 
  className = '',
  children,
  ...props 
}) => {
  const baseStyles = "transition-all duration-200 ease-in-out flex items-center justify-center text-neu-text font-semibold outline-none focus:outline-none";
  
  const shapeStyles = variant === 'circle' 
    ? "w-12 h-12 rounded-full" 
    : "px-6 py-3 rounded-xl";

  const shadowStyles = active
    ? "shadow-[inset_4px_4px_8px_#a3b1c6,inset_-4px_-4px_8px_#ffffff] text-neu-accent"
    : "shadow-[6px_6px_12px_#a3b1c6,-6px_-6px_12px_#ffffff] hover:shadow-[8px_8px_16px_#a3b1c6,-8px_-8px_16px_#ffffff] active:shadow-[inset_4px_4px_8px_#a3b1c6,inset_-4px_-4px_8px_#ffffff]";

  const disabledStyles = props.disabled ? "opacity-50 cursor-not-allowed" : "active:scale-95";

  return (
    <button 
      className={`${baseStyles} ${shapeStyles} ${shadowStyles} ${disabledStyles} ${className}`}
      {...props}
    >
      {icon && <span className={label || children ? "mr-2" : ""}>{icon}</span>}
      {label}
      {children}
    </button>
  );
};
