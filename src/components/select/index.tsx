import * as SelectPrimitive from "@radix-ui/react-select"
import { FiChevronDown, FiChevronUp } from "react-icons/fi"

function Select({ ...props }: SelectPrimitive.SelectProps) {
  return <SelectPrimitive.Root {...props} />
}

function SelectGroup({ ...props }: SelectPrimitive.SelectGroupProps) {
  return <SelectPrimitive.Group {...props} />
}

function SelectValue({ ...props }: SelectPrimitive.SelectValueProps) {
  return <SelectPrimitive.Value {...props} />
}

function SelectTrigger({ children, className = "", ...props }: SelectPrimitive.SelectTriggerProps & { className?: string }) {
  return (
    <SelectPrimitive.Trigger
      className={`flex w-full items-center justify-between gap-2 rounded-lg px-3 text-sm whitespace-nowrap outline-none transition-all h-9 ${className}`}
      style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-default)", color: "var(--text-primary)" }}
      onFocusCapture={(e) => {
        e.currentTarget.style.borderColor = "var(--accent)"
        e.currentTarget.style.boxShadow = "0 0 0 3px rgba(233,0,63,0.12)"
      }}
      onBlurCapture={(e) => {
        e.currentTarget.style.borderColor = "var(--border-default)"
        e.currentTarget.style.boxShadow = "none"
      }}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon>
        <FiChevronDown size={16} style={{ opacity: 0.5, flexShrink: 0 }} />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
}

function SelectContent({ children, position = "item-aligned", ...props }: SelectPrimitive.SelectContentProps) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        position={position}
        sideOffset={4}
        className="z-50 max-h-60 overflow-hidden rounded-lg shadow-lg"
        style={{ background: "var(--bg-card)", border: "1px solid var(--border-default)" }}
        {...props}
      >
        <SelectPrimitive.ScrollUpButton className="flex items-center justify-center py-1 cursor-default" style={{ color: "var(--text-muted)" }}>
          <FiChevronUp size={14} />
        </SelectPrimitive.ScrollUpButton>
        <SelectPrimitive.Viewport className="p-1">
          {children}
        </SelectPrimitive.Viewport>
        <SelectPrimitive.ScrollDownButton className="flex items-center justify-center py-1 cursor-default" style={{ color: "var(--text-muted)" }}>
          <FiChevronDown size={14} />
        </SelectPrimitive.ScrollDownButton>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
}

function SelectItem({ children, ...props }: SelectPrimitive.SelectItemProps) {
  return (
    <SelectPrimitive.Item
      className="relative flex w-full cursor-pointer items-center rounded-md py-1.5 pl-2 pr-2 text-sm outline-none transition-colors text-(--text-primary) hover:bg-[rgba(233,0,63,0.08)] hover:text-(--accent) data-[state=checked]:bg-[rgba(233,0,63,0.15)] data-[state=checked]:text-(--accent)"
      {...props}
    >
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  )
}

export { Select, SelectGroup, SelectValue, SelectTrigger, SelectContent, SelectItem }
