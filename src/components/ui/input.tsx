import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

/**
 * 🎨 HOOKE DESIGN SYSTEM — Input Primitivo
 * 
 * Variantes:
 * - luxury: Borda sutil, foco elegante (padrão)
 * - brutalist: Borda preta grossa + sombra que afunda no foco
 * - ghost: Sem borda, fundo cinza claro
 * 
 * Uso:
 * <Input variant="brutalist" placeholder="Seu CEP" />
 */
const inputVariants = cva(
  "flex w-full bg-white px-4 py-3 text-sm transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-400 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        luxury:
          "border border-black/10 focus:border-black focus:ring-1 focus:ring-black",
        brutalist:
          "border-2 border-black shadow-brutal focus:translate-x-[1px] focus:translate-y-[1px] focus:shadow-brutal-sm",
        ghost: 
          "border-none bg-zinc-50 focus:bg-white focus:ring-1 focus:ring-black",
      },
    },
    defaultVariants: {
      variant: "luxury",
    },
  }
)

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
  label?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, type, label, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')
    
    if (label) {
      return (
        <div className="flex flex-col gap-1.5">
          <label 
            htmlFor={inputId}
            className="text-[10px] font-bold uppercase tracking-widest text-zinc-500"
          >
            {label}
          </label>
          <input
            id={inputId}
            type={type}
            className={cn(inputVariants({ variant, className }))}
            ref={ref}
            {...props}
          />
        </div>
      )
    }
    
    return (
      <input
        id={inputId}
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
