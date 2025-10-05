"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Navbar } from "@/components/navbar"
import { MethodView } from "@/components/method-view"

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
            <MethodView method={selectedMethod} />
          ) : (
            <div className="flex h-full items-center justify-center p-8">
              <div className="text-center">
                <h2 className="text-balance text-3xl font-bold text-foreground md:text-4xl">
                  Métodos de Modelado Computacional
                </h2>
                <p className="mt-4 text-pretty text-lg text-muted-foreground">
                  Selecciona una categoría y un método del menú lateral para comenzar
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
