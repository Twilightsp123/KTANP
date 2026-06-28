import React from 'react';
import './SciFiButton.css';

interface SciFiButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'danger' | 'warning';
  active?: boolean;
}

export const SciFiButton: React.FC<SciFiButtonProps> = ({ 
  children, variant = 'primary', active = false, className = '', ...props 
}) => {
  return (
    <button 
      className={`scifi-button ${variant} ${active ? 'active' : ''} ${className}`}
      {...props}
    >
      <span className="button-glitch-layer"></span>
      <span className="button-content">{children}</span>
    </button>
  );
};
