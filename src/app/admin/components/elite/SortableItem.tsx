import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ReactNode } from "react";

interface SortableItemProps {
  id: string;
  children: ReactNode;
  isGrid?: boolean;
}

export function SortableItem({ id, children, isGrid = false }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : "auto",
    opacity: isDragging ? 0.7 : 1,
    position: isDragging ? "relative" : ("static" as any),
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className={isGrid ? "h-full cursor-grab active:cursor-grabbing" : "cursor-grab active:cursor-grabbing"}>
      {children}
    </div>
  );
}
