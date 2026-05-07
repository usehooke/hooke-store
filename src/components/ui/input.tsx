import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const inputVariants = cva(
  "flex w-full bg-white px-4 py-3 text-sm transition-all file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-400 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        luxury:
          "border border-black/10 focus:border-black focus:ring-1 focus:ring-black",
        brutalist:
          "border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:translate-x-[1px] focus:translate-y-[1px] focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]",
        ghost: "border-none bg-zinc-50 focus:bg-white",
      },
    },
    defaultVariants: {
      variant: "luxury",
    },
  }
)

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(inputVariants({ variant, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input, inputVariants }
