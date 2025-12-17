import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-glow hover:shadow-glow-lg hover:-translate-y-0.5 active:translate-y-0 active:shadow-md",
        destructive:
          "bg-gradient-to-r from-destructive to-destructive/90 text-destructive-foreground shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0",
        outline:
          "border-2 border-input bg-background/80 backdrop-blur-sm hover:bg-accent hover:text-accent-foreground hover:border-primary/50 hover:-translate-y-0.5 active:translate-y-0 shadow-sm hover:shadow-md",
        secondary:
          "bg-gradient-to-r from-secondary to-secondary/80 text-secondary-foreground shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0",
        ghost: "hover:bg-accent hover:text-accent-foreground hover:shadow-sm",
        link: "text-primary underline-offset-4 hover:underline",
        premium: "bg-gradient-to-r from-primary via-[hsl(280,85%,55%)] to-accent text-white shadow-glow hover:shadow-glow-lg hover:-translate-y-1 active:translate-y-0 active:shadow-md",
        glow: "bg-gradient-to-r from-primary to-accent text-white shadow-glow animate-pulse-glow hover:-translate-y-0.5 active:translate-y-0",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-9 rounded-md px-4 text-xs",
        lg: "h-12 rounded-lg px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
