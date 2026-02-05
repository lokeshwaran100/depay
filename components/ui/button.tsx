import * as React from "react"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "outline" | "ghost" | "destructive" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "default", size = "default", asChild = false, children, ...props }, ref) => {
    // Base button styles
    const baseStyles = "inline-flex items-center justify-center whitespace-nowrap font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--depay-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--depay-bg)] disabled:pointer-events-none disabled:opacity-50"

    // Variant styles
    const variantStyles: Record<string, string> = {
      default: "bg-[var(--depay-primary)] text-white hover:bg-[var(--depay-primary-hover)] active:scale-[0.98]",
      secondary: "bg-[var(--depay-bg-card)] text-white border border-[var(--depay-border)] hover:bg-[var(--depay-bg-secondary)]",
      outline: "border border-[var(--depay-border)] bg-transparent text-white hover:bg-[var(--depay-bg-card)]",
      ghost: "text-white hover:bg-[var(--depay-bg-card)]",
      destructive: "bg-[var(--depay-error)] text-white hover:bg-[var(--depay-error)]/90",
      link: "text-[var(--depay-primary)] underline-offset-4 hover:underline"
    }

    // Size styles
    const sizeStyles: Record<string, string> = {
      default: "h-12 px-6 rounded-2xl text-base",
      sm: "h-9 px-4 rounded-xl text-sm",
      lg: "h-14 px-8 rounded-2xl text-lg",
      icon: "h-10 w-10 rounded-xl"
    }

    const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`

    // If asChild is true, we need to handle it differently
    // For simplicity, we'll just render the button with children
    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children as React.ReactElement<any>, {
        ref,
        className: `${combinedClassName} ${(children as React.ReactElement<any>).props.className || ""}`,
        ...props
      })
    }

    return (
      <button
        className={combinedClassName}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    )
  }
)
Button.displayName = "Button"

export { Button }
