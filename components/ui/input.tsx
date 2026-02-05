import * as React from "react"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", type, icon, ...props }, ref) => {
    const baseStyles = "flex h-12 w-full rounded-xl border border-[var(--depay-border)] bg-transparent px-4 py-3 text-base text-white placeholder:text-[var(--depay-text-muted)] transition-colors focus:border-[var(--depay-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--depay-primary)]/20 disabled:cursor-not-allowed disabled:opacity-50"

    if (icon) {
      return (
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--depay-text-muted)]">
            {icon}
          </div>
          <input
            type={type}
            className={`${baseStyles} pl-11 ${className}`}
            ref={ref}
            {...props}
          />
        </div>
      )
    }

    return (
      <input
        type={type}
        className={`${baseStyles} ${className}`}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
