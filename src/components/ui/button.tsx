import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap text-xs font-bold tracking-[0.2em] uppercase transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-black disabled:pointer-events-none disabled:opacity-50 active:scale-95",
  {
    variants: {
      variant: {
        luxury:
          "bg-[#F5F5F5] text-black border border-black/10 hover:bg-black hover:text-white hover:border-black",
        brutalist:
          "bg-white text-black border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none",
        outline:
          "border border-black/20 bg-transparent hover:bg-black/5 text-black",
        ghost: "hover:bg-black/5 text-black",
        link: "text-black underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-9 px-6",
        md: "h-12 px-10",
        lg: "h-16 px-14 text-sm",
        fab: "h-16 w-16 rounded-full shadow-editorial",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "luxury",
      size: "md",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
