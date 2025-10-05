"use client"

import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"

interface NavbarProps {
  onMenuClick: () => void
}

export function Navbar({ onMenuClick }: NavbarProps) {
  return (
    <nav className="border-b border-border bg-card">
      <div className="flex h-16 items-center gap-4 px-4 md:px-6">
        <Button variant="ghost" size="icon" className="md:hidden" onClick={onMenuClick}>
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>

        <h1 className="text-balance text-lg font-bold text-foreground md:text-xl">Métodos de Modelado Computacional</h1>
      </div>
    </nav>
  )
}
