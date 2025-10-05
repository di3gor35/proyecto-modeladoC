"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calculator } from "lucide-react"

export function Secante() {
  const [equation, setEquation] = useState("x^3 - x - 2")
  const [x0, setX0] = useState(1)
  const [x1, setX1] = useState(2)
  const [tolerance, setTolerance] = useState(0.0001)
  const [maxIterations, setMaxIterations] = useState(50)
  const [result, setResult] = useState<number | null>(null)
  const [iterations, setIterations] = useState<
    { iter: number; x0: number; x1: number; x2: number; fx2: number; error: number }[]
  >([])
  const [error, setError] = useState<string | null>(null)

  const evaluateFunction = (x: number): number => {
    try {
      const expr = equation
        .replace(/\^/g, "**")
        .replace(/x/g, `(${x})`)
        .replace(/sin/g, "Math.sin")
        .replace(/cos/g, "Math.cos")
        .replace(/tan/g, "Math.tan")
        .replace(/exp/g, "Math.exp")
        .replace(/log/g, "Math.log")
        .replace(/sqrt/g, "Math.sqrt")

      return eval(expr)
    } catch (e) {
      throw new Error("Error al evaluar la función")
    }
  }

  const calculate = () => {
    try {
      let x0Val = x0
      let x1Val = x1
      const iterData: { iter: number; x0: number; x1: number; x2: number; fx2: number; error: number }[] = []

      for (let iter = 0; iter < maxIterations; iter++) {
        const fx0 = evaluateFunction(x0Val)
        const fx1 = evaluateFunction(x1Val)

        if (Math.abs(fx1 - fx0) < 1e-10) {
          setError("División por cero: f(x1) - f(x0) es muy pequeño")
          setResult(null)
          setIterations(iterData)
          return
        }

        // Secant formula: x2 = x1 - f(x1) * (x1 - x0) / (f(x1) - f(x0))
        const x2 = x1Val - (fx1 * (x1Val - x0Val)) / (fx1 - fx0)
        const fx2 = evaluateFunction(x2)
        const errorVal = Math.abs(x2 - x1Val)

        iterData.push({ iter: iter + 1, x0: x0Val, x1: x1Val, x2, fx2, error: errorVal })

        if (errorVal < tolerance || Math.abs(fx2) < tolerance) {
          setResult(x2)
          setIterations(iterData)
          setError(null)
          return
        }

        x0Val = x1Val
        x1Val = x2
      }

      setError(`No convergió en ${maxIterations} iteraciones`)
      setResult(x1Val)
      setIterations(iterData)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al calcular")
      setResult(null)
      setIterations([])
    }
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold text-foreground">Método de la Secante</h2>
        <p className="mt-2 text-muted-foreground">
          Encuentra raíces usando aproximaciones sucesivas con la secante de la función
        </p>
      </Card>

      <Card className="p-6">
        <h3 className="mb-4 text-lg font-semibold text-foreground">Función</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="equation">f(x) =</Label>
            <Input
              id="equation"
              value={equation}
              onChange={(e) => setEquation(e.target.value)}
              placeholder="x^3 - x - 2"
            />
            <p className="mt-1 text-xs text-muted-foreground">Usa: x, +, -, *, /, ^, sin, cos, tan, exp, log, sqrt</p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="mb-4 text-lg font-semibold text-foreground">Valores Iniciales y Parámetros</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Label htmlFor="x0">x₀ (primer valor)</Label>
            <Input
              id="x0"
              type="number"
              step="0.1"
              value={x0}
              onChange={(e) => setX0(Number.parseFloat(e.target.value))}
            />
          </div>
          <div>
            <Label htmlFor="x1">x₁ (segundo valor)</Label>
            <Input
              id="x1"
              type="number"
              step="0.1"
              value={x1}
              onChange={(e) => setX1(Number.parseFloat(e.target.value))}
            />
          </div>
          <div>
            <Label htmlFor="tolerance">Tolerancia</Label>
            <Input
              id="tolerance"
              type="number"
              step="0.0001"
              value={tolerance}
              onChange={(e) => setTolerance(Number.parseFloat(e.target.value))}
            />
          </div>
          <div>
            <Label htmlFor="maxIter">Iteraciones máx.</Label>
            <Input
              id="maxIter"
              type="number"
              value={maxIterations}
              onChange={(e) => setMaxIterations(Number.parseInt(e.target.value))}
            />
          </div>
        </div>
      </Card>

      {error && (
        <Card className="border-destructive bg-destructive/10 p-4">
          <p className="text-sm text-destructive">{error}</p>
        </Card>
      )}

      <Button onClick={calculate} className="w-full" size="lg">
        <Calculator className="mr-2 h-5 w-5" />
        Calcular Raíz
      </Button>

      {result !== null && (
        <Card className="border-accent bg-accent/5 p-6">
          <h3 className="mb-4 text-lg font-semibold text-foreground">Raíz Encontrada</h3>
          <div className="mb-6 rounded-lg bg-background p-6 text-center">
            <p className="text-sm text-muted-foreground">x ≈</p>
            <p className="text-4xl font-bold text-foreground">{result.toFixed(8)}</p>
            <p className="mt-2 text-sm text-muted-foreground">f(x) ≈ {evaluateFunction(result).toFixed(8)}</p>
          </div>

          {iterations.length > 0 && (
            <div className="mb-6 rounded-lg bg-muted p-4">
              <h4 className="mb-3 font-semibold text-foreground">Historial de iteraciones:</h4>
              <div className="max-h-64 overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-border">
                    <tr className="text-left">
                      <th className="pb-2 font-medium text-foreground">Iter</th>
                      <th className="pb-2 font-medium text-foreground">x₀</th>
                      <th className="pb-2 font-medium text-foreground">x₁</th>
                      <th className="pb-2 font-medium text-foreground">x₂</th>
                      <th className="pb-2 font-medium text-foreground">f(x₂)</th>
                      <th className="pb-2 font-medium text-foreground">Error</th>
                    </tr>
                  </thead>
                  <tbody>
                    {iterations.slice(-10).map((iter) => (
                      <tr key={iter.iter} className="border-b border-border/50">
                        <td className="py-2 text-muted-foreground">{iter.iter}</td>
                        <td className="py-2 font-mono text-muted-foreground">{iter.x0.toFixed(4)}</td>
                        <td className="py-2 font-mono text-muted-foreground">{iter.x1.toFixed(4)}</td>
                        <td className="py-2 font-mono text-muted-foreground">{iter.x2.toFixed(4)}</td>
                        <td className="py-2 font-mono text-muted-foreground">{iter.fx2.toFixed(6)}</td>
                        <td className="py-2 font-mono text-muted-foreground">{iter.error.toFixed(6)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">Mostrando últimas 10 iteraciones</p>
            </div>
          )}

          <div className="rounded-lg bg-muted p-4">
            <h4 className="mb-2 font-semibold text-foreground">Explicación</h4>
            <p className="text-sm text-muted-foreground">
              El método de la secante aproxima la derivada usando dos puntos anteriores: x₂ = x₁ - f(x₁) × (x₁ - x₀) /
              (f(x₁) - f(x₀)). Es más rápido que bisección y no requiere calcular derivadas como Newton-Raphson. La
              convergencia es superlineal (orden ≈ 1.618).
            </p>
          </div>
        </Card>
      )}
    </div>
  )
}
