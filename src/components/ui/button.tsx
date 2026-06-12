import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

/**
 * 🎨 HOOKE DESIGN SYSTEM — Button Primitivo
 * 
 * Variantes disponíveis:
 * - luxury: Elegante e minimalista (padrão)
 * - brutalist: Borda preta grossa + sombra que afunda no hover
 * - outline: Contorno sutil
 * - ghost: Transparente com hover suave
 * - link: Inline como texto sublinhado
 * - buy: Preto sólido para "COMPRAR AGORA" (ink-reveal feel)
 * - checkout: Verde confirmação para "FINALIZAR"
 * - destructive: Vermelho para ações perigosas
 * 
 * Tamanhos: sm, md, lg, fab, icon
 * 
 * Uso:
 * <Button variant="buy" size="lg">COMPRAR AGORA →</Button>
 * <Button variant="brutalist">Clique aqui</Button>
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap text-xs font-bold tracking-[0.2em] uppercase transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        luxury:
          "bg-[#F5F5F5] text-black border border-black/10 hover:bg-black hover:text-white hover:border-black",
        brutalist:
          "bg-white text-black border-2 border-black shadow-brutal hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-brutal-sm active:translate-x-[3px] active:translate-y-[3px] active:shadow-none",
        outline:
          "border border-black/20 bg-transparent hover:bg-black/5 text-black",
        ghost: 
          "hover:bg-black/5 text-black",
        link: 
          "text-black underline-offset-4 hover:underline",
        buy:
          "bg-hooke-900 text-white border-0 hover:bg-hooke-800 active:scale-[0.98] shadow-none",
        checkout:
          "bg-green-600 text-white border-0 hover:bg-green-700 active:scale-[0.98] shadow-none",
        destructive:
          "bg-red-600 text-white border-0 hover:bg-red-700 active:scale-[0.98]",
        hexa:
          "bg-[#E1F522] text-black border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none",
      },
      size: {
        xs: "h-8 px-4 text-[10px]",
        sm: "h-9 px-6",
        md: "h-12 px-10",
        lg: "h-14 px-14 text-sm",
        xl: "h-16 px-16 text-sm",
        fab: "h-16 w-16 rounded-full shadow-editorial",
        icon: "h-10 w-10",
      },
      fullWidth: {
        true: "w-full",
      },
    },
    defaultVariants: {
      variant: "luxury",
      size: "md",
      fullWidth: false,
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, fullWidth, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
