"use client"

import type React from "react"

import { useState } from "react"
import { ChevronDown, ChevronRight, X, Grid3x3, GitBranch, TrendingUp, Network } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface Category {
  id: string
  name: string
  icon: React.ReactNode
  methods: { id: string; name: string }[]
}

const categories: Category[] = [
  {
    id: "algebra-lineal",
    name: "Álgebra Lineal",
    icon: <Grid3x3 className="h-4 w-4" />,
    methods: [
      { id: "suma-matrices", name: "Suma de Matrices" },
      { id: "multiplicacion-matrices", name: "Multiplicación de Matrices" },
      { id: "determinante", name: "Determinante" },
      { id: "inversa", name: "Matriz Inversa" },
    ],
  },
  {
    id: "sistemas-lineales",
    name: "Sistemas Lineales",
    icon: <GitBranch className="h-4 w-4" />,
    methods: [
      { id: "matriz-inversa", name: "Método de Matriz Inversa" },
      { id: "gauss", name: "Eliminación de Gauss" },
      { id: "gauss-jordan", name: "Gauss-Jordan" },
      { id: "jacobi", name: "Método de Jacobi" },
      { id: "gauss-seidel", name: "Gauss-Seidel" },
    ],
  },
  {
    id: "ecuaciones-no-lineales",
    name: "Ecuaciones No Lineales (1 variable)",
    icon: <TrendingUp className="h-4 w-4" />,
    methods: [
      { id: "biseccion", name: "Método de Bisección" },
      { id: "secante", name: "Método de la Secante" },
    ],
  },
  {
    id: "sistemas-no-lineales",
    name: "Sistemas No Lineales (multivariable)",
    icon: <Network className="h-4 w-4" />,
    methods: [
      { id: "newton-raphson", name: "Newton-Raphson" },
      { id: "newton-raphson-modificado", name: "Newton-Raphson Modificado" },
      { id: "punto-fijo", name: "Punto Fijo Multivariable" },
    ],
  },
]

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  selectedCategory: string | null
  selectedMethod: string | null
  onCategorySelect: (categoryId: string) => void
  onMethodSelect: (methodId: string) => void
}

export function Sidebar({
  isOpen,
  onClose,
  selectedCategory,
  selectedMethod,
  onCategorySelect,
  onMethodSelect,
}: SidebarProps) {
  const [expandedCategories, setExpandedCategories] = useState<string[]>([])

  const toggleCategory = (categoryId: string) => {
    if (expandedCategories.includes(categoryId)) {
      setExpandedCategories(expandedCategories.filter((id) => id !== categoryId))
    } else {
      setExpandedCategories([...expandedCategories, categoryId])
      onCategorySelect(categoryId)
    }
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && <div className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden" onClick={onClose} />}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 transform border-r border-border bg-card shadow-lg transition-transform duration-300 ease-in-out md:relative md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-full flex-col">
          {/* Mobile close button */}
          <div className="flex h-16 items-center justify-between border-b border-border px-4 md:hidden">
            <h2 className="font-semibold text-foreground">Categorías</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
              <span className="sr-only">Close menu</span>
            </Button>
          </div>

          {/* Categories */}
          <nav className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              {categories.map((category) => {
                const isExpanded = expandedCategories.includes(category.id)

                return (
                  <div key={category.id}>
                    <button
                      onClick={() => toggleCategory(category.id)}
                      className={cn(
                        "flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-all duration-200 hover:bg-secondary hover:shadow-sm",
                        selectedCategory === category.id && "bg-secondary shadow-sm",
                      )}
                    >
                      <div className="text-primary">{category.icon}</div>
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform duration-200" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform duration-200" />
                      )}
                      <span className="text-pretty text-foreground">{category.name}</span>
                    </button>

                    {isExpanded && (
                      <div className="ml-6 mt-1 space-y-1 animate-in fade-in slide-in-from-top-2 duration-200">
                        {category.methods.map((method) => (
                          <button
                            key={method.id}
                            onClick={() => onMethodSelect(method.id)}
                            className={cn(
                              "relative block w-full rounded-lg px-3 py-2 text-left text-sm transition-all duration-200 hover:bg-secondary hover:pl-4",
                              selectedMethod === method.id
                                ? "bg-primary text-primary-foreground shadow-md pl-4 font-medium"
                                : "text-muted-foreground",
                            )}
                          >
                            {selectedMethod === method.id && (
                              <div className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-primary-foreground" />
                            )}
                            {method.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </nav>
        </div>
      </aside>
    </>
  )
}
