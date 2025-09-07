import React from 'react';

// Shared UI components for NEEZS

export const Button = ({ children, className = '', ...props }) => {
  return React.createElement('button', {
    className: `inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-4 ${className}`,
    ...props
  }, children);
};

export const Card = ({ children, className = '', ...props }) => {
  return React.createElement('div', {
    className: `rounded-lg border bg-card text-card-foreground shadow-sm ${className}`,
    ...props
  }, children);
};

export const Input = ({ className = '', ...props }) => {
  return React.createElement('input', {
    className: `flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`,
    ...props
  });
};