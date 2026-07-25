import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-none border px-2.5 py-0.5 text-[10px] font-black uppercase tracking-[0.2em] transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2",
  {
    variants: {
      variant: {
        luxury:
          "border-black/5 bg-zinc-50 text-black hover:bg-black hover:text-white",
        brutalist:
          "border-2 border-black bg-white text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]",
        destructive:
          "border-transparent bg-red-600 text-white hover:bg-red-700",
        success:
          "border-transparent bg-emerald-600 text-white hover:bg-emerald-700",
        outline: "text-black border-black/20",
        hexa:
          "border-2 border-black bg-black text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]",
      },
    },
    defaultVariants: {
      variant: "luxury",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
