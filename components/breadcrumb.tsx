"use client"

import { ChevronRight, Home } from "lucide-react"

interface BreadcrumbProps {
  category?: string
  method?: string
}

export function Breadcrumb({ category, method }: BreadcrumbProps) {
  return (
    <nav className="flex items-center gap-2 text-sm text-muted-foreground">
      <Home className="h-4 w-4" />
      {category && (
        <>
          <ChevronRight className="h-4 w-4" />
          <span className="font-medium">{category}</span>
        </>
      )}
      {method && (
        <>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground font-medium">{method}</span>
        </>
      )}
    </nav>
  )
}
