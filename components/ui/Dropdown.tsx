"use client";

import React from 'react';
import { cn } from '@/lib/utils';

interface DropdownContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const DropdownContext = React.createContext<DropdownContextValue | undefined>(undefined);

const useDropdown = () => {
  const context = React.useContext(DropdownContext);
  if (!context) {
    throw new Error('Dropdown components must be used within a Dropdown');
  }
  return context;
};

// Root Dropdown Component
export interface DropdownProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const Dropdown: React.FC<DropdownProps> = ({ children, open: controlledOpen, onOpenChange }) => {
  const [internalOpen, setInternalOpen] = React.useState(false);

  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = onOpenChange || setInternalOpen;

  return (
    <DropdownContext.Provider value={{ open, setOpen }}>
      <div className="relative inline-block">
        {children}
      </div>
    </DropdownContext.Provider>
  );
};

// Trigger Component
export interface DropdownTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

const DropdownTrigger = React.forwardRef<HTMLButtonElement, DropdownTriggerProps>(
  ({ className, children, asChild, ...props }, ref) => {
    const { open, setOpen } = useDropdown();

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      setOpen(!open);
      props.onClick?.(e);
    };

    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children as React.ReactElement<any>, {
        onClick: handleClick,
        ref,
      });
    }

    return (
      <button
        ref={ref}
        onClick={handleClick}
        className={cn('focus:outline-none', className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

DropdownTrigger.displayName = 'DropdownTrigger';

// Content Component
export interface DropdownContentProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: 'start' | 'center' | 'end';
  sideOffset?: number;
}

const DropdownContent = React.forwardRef<HTMLDivElement, DropdownContentProps>(
  ({ className, children, align = 'end', sideOffset = 4, ...props }, ref) => {
    const { open, setOpen } = useDropdown();
    const contentRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (contentRef.current && !contentRef.current.contains(event.target as Node)) {
          const trigger = contentRef.current.parentElement?.querySelector('button');
          if (trigger && !trigger.contains(event.target as Node)) {
            setOpen(false);
          }
        }
      };

      if (open) {
        document.addEventListener('mousedown', handleClickOutside);
      }

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [open, setOpen]);

    React.useEffect(() => {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setOpen(false);
        }
      };

      if (open) {
        document.addEventListener('keydown', handleEscape);
      }

      return () => {
        document.removeEventListener('keydown', handleEscape);
      };
    }, [open, setOpen]);

    if (!open) return null;

    const alignmentClasses = {
      start: 'left-0',
      center: 'left-1/2 -translate-x-1/2',
      end: 'right-0',
    };

    return (
      <>
        <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
        <div
          ref={contentRef}
          className={cn(
            'absolute z-50 min-w-[8rem] overflow-hidden rounded-lg border border-border bg-card p-1 shadow-neomorph',
            'animate-in fade-in-0 zoom-in-95',
            alignmentClasses[align],
            className
          )}
          style={{ top: `calc(100% + ${sideOffset}px)` }}
          {...props}
        >
          {children}
        </div>
      </>
    );
  }
);

DropdownContent.displayName = 'DropdownContent';

// Item Component
export interface DropdownItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  destructive?: boolean;
}

const DropdownItem = React.forwardRef<HTMLButtonElement, DropdownItemProps>(
  ({ className, children, destructive, ...props }, ref) => {
    const { setOpen } = useDropdown();

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      props.onClick?.(e);
      if (!e.defaultPrevented) {
        setOpen(false);
      }
    };

    return (
      <button
        ref={ref}
        onClick={handleClick}
        className={cn(
          'relative flex w-full cursor-pointer select-none items-center rounded-md px-3 py-2 text-sm outline-none transition-colors',
          'focus:bg-accent focus:text-accent-foreground',
          'hover:bg-accent/50 hover:text-accent-foreground',
          'disabled:pointer-events-none disabled:opacity-50',
          destructive && 'text-error focus:bg-error/10 hover:bg-error/10',
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

DropdownItem.displayName = 'DropdownItem';

// Separator Component
const DropdownSeparator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('-mx-1 my-1 h-px bg-border', className)}
    {...props}
  />
));

DropdownSeparator.displayName = 'DropdownSeparator';

// Label Component
const DropdownLabel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('px-3 py-2 text-sm font-semibold text-foreground', className)}
    {...props}
  />
));

DropdownLabel.displayName = 'DropdownLabel';

export {
  Dropdown,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
  DropdownSeparator,
  DropdownLabel,
};
