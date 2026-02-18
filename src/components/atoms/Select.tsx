import { forwardRef } from 'react';
import type { SelectHTMLAttributes } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: (string | SelectOption)[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, placeholder, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-bold text-dark mb-2 pl-1">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            className={cn(
              "flex h-12 w-full appearance-none rounded-2xl border-2 border-slate-200 bg-slate-50 px-5 py-3 text-sm ring-offset-white placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300",
              error && "border-red-500 focus-visible:ring-red-500",
              className
            )}
            ref={ref}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option, index) => {
              const value = typeof option === 'string' ? option : option.value;
              const label = typeof option === 'string' ? option : option.label;
              return (
                <option key={`${value}-${index}`} value={value}>
                  {label}
                </option>
              );
            })}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </div>
        </div>
        {error && (
          <p className="mt-1 text-sm text-red-500 pl-1">{error}</p>
        )}
      </div>
    );
  }
);
Select.displayName = "Select";
