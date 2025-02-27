import type * as React from "react"
import { SidebarTrigger } from "@/components/ui/sidebar"

interface PageHeaderProps {
  title: string
  children?: React.ReactNode
}

export function PageHeader({ title, children }: PageHeaderProps) {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6">
      <SidebarTrigger />
      <div className="flex-1">
        <h1 className="text-lg font-semibold">{title}</h1>
      </div>
      {children}
    </header>
  )
}