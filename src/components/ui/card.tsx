import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

/**
 * 🎨 HOOKE DESIGN SYSTEM — Card Primitivo
 * 
 * Variantes:
 * - luxury: Borda sutil + sombra editorial (padrão)
 * - brutalist: Borda preta grossa + sombra dura
 * - ghost: Sem borda, sem sombra (para composição)
 * - product: Otimizado para vitrine (borda fina cinza, sem sombra)
 * 
 * Uso:
 * <Card variant="brutalist">
 *   <CardContent>Conteúdo</CardContent>
 *   <CardFooter>Rodapé</CardFooter>
 * </Card>
 */
const cardVariants = cva(
  "bg-white text-black transition-all duration-200",
  {
    variants: {
      variant: {
        luxury: "border border-black/5 shadow-editorial",
        brutalist: "border-2 border-black shadow-brutal-lg hover:shadow-brutal hover:translate-x-[2px] hover:translate-y-[2px]",
        ghost: "border-0 shadow-none",
        product: "border border-zinc-200",
      },
    },
    defaultVariants: {
      variant: "luxury",
    },
  }
)

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ variant, className }))}
      {...props}
    />
  )
)
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-lg font-black tracking-tighter uppercase italic leading-none",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-[10px] font-bold uppercase tracking-widest text-zinc-400", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, cardVariants, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
