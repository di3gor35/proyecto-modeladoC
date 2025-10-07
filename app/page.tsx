"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Navbar } from "@/components/navbar"
import { MethodView } from "@/components/method-view"
import { Breadcrumb } from "@/components/breadcrumb"
import { Calculator, Sparkles } from "lucide-react"

const categoryNames: Record<string, string> = {
  "algebra-lineal": "Álgebra Lineal",
  "sistemas-lineales": "Sistemas Lineales",
  "ecuaciones-no-lineales": "Ecuaciones No Lineales",
  "sistemas-no-lineales": "Sistemas No Lineales",
}

const methodNames: Record<string, string> = {
  "suma-matrices": "Suma de Matrices",
  "multiplicacion-matrices": "Multiplicación de Matrices",
  determinante: "Determinante",
  inversa: "Matriz Inversa",
  "matriz-inversa": "Método de Matriz Inversa",
  gauss: "Eliminación de Gauss",
  "gauss-jordan": "Gauss-Jordan",
  jacobi: "Método de Jacobi",
  "gauss-seidel": "Gauss-Seidel",
  biseccion: "Método de Bisección",
  secante: "Método de la Secante",
  "newton-raphson": "Newton-Raphson",
  "newton-raphson-modificado": "Newton-Raphson Modificado",
  "punto-fijo": "Punto Fijo Multivariable",
}

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <Navbar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          selectedCategory={selectedCategory}
          selectedMethod={selectedMethod}
          onCategorySelect={setSelectedCategory}
          onMethodSelect={(method) => {
            setSelectedMethod(method)
            setIsSidebarOpen(false)
          }}
        />

        <main className="flex-1 overflow-y-auto">
          {selectedMethod ? (
            <div className="p-4 md:p-6">
              <div className="mb-4">
                <Breadcrumb
                  category={selectedCategory ? categoryNames[selectedCategory] : undefined}
                  method={selectedMethod ? methodNames[selectedMethod] : undefined}
                />
              </div>
              <MethodView method={selectedMethod} />
            </div>
          ) : (
            <div className="flex h-full items-center justify-center p-8">
              <div className="text-center max-w-2xl">
                <div className="mb-6 flex justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 animate-pulse rounded-full bg-primary/20 blur-2xl" />
                    <div className="relative rounded-full bg-gradient-to-br from-primary to-primary/60 p-6 shadow-lg">
                      <Calculator className="h-16 w-16 text-primary-foreground" />
                    </div>
                  </div>
                </div>
                <h2 className="text-balance text-3xl font-bold text-foreground md:text-4xl mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  Métodos de Modelado Computacional
                </h2>
                <p className="text-pretty text-lg text-muted-foreground mb-6">
                  Explora y aprende métodos numéricos de forma interactiva
                </p>
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span>Selecciona una categoría y un método del menú lateral para comenzar</span>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
