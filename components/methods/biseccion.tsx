"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calculator } from "lucide-react"

export function Biseccion() {
  const [equation, setEquation] = useState("x^3 - x - 2")
  const [a, setA] = useState(1)
  const [b, setB] = useState(2)
  const [tolerance, setTolerance] = useState(0.0001)
  const [maxIterations, setMaxIterations] = useState(50)
  const [result, setResult] = useState<number | null>(null)
  const [iterations, setIterations] = useState<
    { iter: number; a: number; b: number; c: number; fc: number; error: number }[]
  >([])
  const [error, setError] = useState<string | null>(null)

  const evaluateFunction = (x: number): number => {
    try {
      // Simple parser for basic mathematical expressions
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
      const fa = evaluateFunction(a)
      const fb = evaluateFunction(b)

      if (fa * fb > 0) {
        setError("f(a) y f(b) deben tener signos opuestos")
        setResult(null)
        setIterations([])
        return
      }

      let aVal = a
      let bVal = b
      const iterData: { iter: number; a: number; b: number; c: number; fc: number; error: number }[] = []

      for (let iter = 0; iter < maxIterations; iter++) {
        const c = (aVal + bVal) / 2
        const fc = evaluateFunction(c)
        const errorVal = Math.abs(bVal - aVal) / 2

        iterData.push({ iter: iter + 1, a: aVal, b: bVal, c, fc, error: errorVal })

        if (errorVal < tolerance || Math.abs(fc) < tolerance) {
          setResult(c)
          setIterations(iterData)
          setError(null)
          return
        }

        const fa = evaluateFunction(aVal)
        if (fa * fc < 0) {
          bVal = c
        } else {
          aVal = c
        }
      }

      setError(`No convergió en ${maxIterations} iteraciones`)
      setResult((aVal + bVal) / 2)
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
        <h2 className="text-2xl font-bold text-foreground">Método de Bisección</h2>
        <p className="mt-2 text-muted-foreground">
          Encuentra raíces de ecuaciones no lineales dividiendo el intervalo a la mitad
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
        <h3 className="mb-4 text-lg font-semibold text-foreground">Intervalo y Parámetros</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Label htmlFor="a">a (límite inferior)</Label>
            <Input
              id="a"
              type="number"
              step="0.1"
              value={a}
              onChange={(e) => setA(Number.parseFloat(e.target.value))}
            />
          </div>
          <div>
            <Label htmlFor="b">b (límite superior)</Label>
            <Input
              id="b"
              type="number"
              step="0.1"
              value={b}
              onChange={(e) => setB(Number.parseFloat(e.target.value))}
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
                      <th className="pb-2 font-medium text-foreground">a</th>
                      <th className="pb-2 font-medium text-foreground">b</th>
                      <th className="pb-2 font-medium text-foreground">c</th>
                      <th className="pb-2 font-medium text-foreground">f(c)</th>
                      <th className="pb-2 font-medium text-foreground">Error</th>
                    </tr>
                  </thead>
                  <tbody>
                    {iterations.slice(-10).map((iter) => (
                      <tr key={iter.iter} className="border-b border-border/50">
                        <td className="py-2 text-muted-foreground">{iter.iter}</td>
                        <td className="py-2 font-mono text-muted-foreground">{iter.a.toFixed(4)}</td>
                        <td className="py-2 font-mono text-muted-foreground">{iter.b.toFixed(4)}</td>
                        <td className="py-2 font-mono text-muted-foreground">{iter.c.toFixed(4)}</td>
                        <td className="py-2 font-mono text-muted-foreground">{iter.fc.toFixed(6)}</td>
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
              El método de bisección encuentra raíces dividiendo repetidamente el intervalo [a,b] por la mitad. En cada
              iteración, se evalúa f(c) donde c = (a+b)/2, y se selecciona el subintervalo donde la función cambia de
              signo. Es un método robusto que siempre converge si f(a) y f(b) tienen signos opuestos.
            </p>
          </div>
        </Card>
      )}
    </div>
  )
}
