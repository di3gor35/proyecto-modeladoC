"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calculator } from "lucide-react"

export function PuntoFijo() {
  const [size, setSize] = useState(2)
  const [gFunctions, setGFunctions] = useState(["(4 - y^2)^0.5", "1/x"])
  const [initialValues, setInitialValues] = useState([1, 1])
  const [tolerance, setTolerance] = useState(0.0001)
  const [maxIterations, setMaxIterations] = useState(50)
  const [result, setResult] = useState<number[] | null>(null)
  const [iterations, setIterations] = useState<{ iter: number; values: number[]; error: number }[]>([])
  const [error, setError] = useState<string | null>(null)

  const updateSize = (newSize: number) => {
    setSize(newSize)
    setGFunctions(Array(newSize).fill(""))
    setInitialValues(Array(newSize).fill(0))
    setResult(null)
    setIterations([])
    setError(null)
  }

  const updateGFunction = (index: number, value: string) => {
    const newFunctions = [...gFunctions]
    newFunctions[index] = value
    setGFunctions(newFunctions)
  }

  const updateInitialValue = (index: number, value: string) => {
    const numValue = Number.parseFloat(value) || 0
    const newValues = [...initialValues]
    newValues[index] = numValue
    setInitialValues(newValues)
  }

  const evaluateFunction = (expr: string, vars: number[]): number => {
    try {
      let expression = expr
      const varNames = ["x", "y", "z", "w"]

      for (let i = 0; i < vars.length; i++) {
        const regex = new RegExp(varNames[i], "g")
        expression = expression.replace(regex, `(${vars[i]})`)
      }

      expression = expression
        .replace(/\^/g, "**")
        .replace(/sin/g, "Math.sin")
        .replace(/cos/g, "Math.cos")
        .replace(/tan/g, "Math.tan")
        .replace(/exp/g, "Math.exp")
        .replace(/log/g, "Math.log")
        .replace(/sqrt/g, "Math.sqrt")

      return eval(expression)
    } catch (e) {
      throw new Error(`Error al evaluar: ${expr}`)
    }
  }

  const calculate = () => {
    try {
      let x = [...initialValues]
      const iterData: { iter: number; values: number[]; error: number }[] = []

      for (let iter = 0; iter < maxIterations; iter++) {
        // Calculate x^(k+1) = G(x^(k))
        const xNew = gFunctions.map((g) => evaluateFunction(g, x))

        // Calculate error as max absolute difference
        const errorVal = Math.max(...xNew.map((val, i) => Math.abs(val - x[i])))

        iterData.push({ iter: iter + 1, values: [...xNew], error: errorVal })

        if (errorVal < tolerance) {
          setResult(xNew)
          setIterations(iterData)
          setError(null)
          return
        }

        x = xNew
      }

      setError(`No convergió en ${maxIterations} iteraciones`)
      setResult(x)
      setIterations(iterData)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al calcular")
      setResult(null)
      setIterations([])
    }
  }

  const varNames = ["x", "y", "z", "w"]

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold text-foreground">Punto Fijo Multivariable</h2>
        <p className="mt-2 text-muted-foreground">
          Resuelve sistemas de ecuaciones no lineales mediante iteración de punto fijo: x = G(x)
        </p>
      </Card>

      <Card className="p-6">
        <h3 className="mb-4 text-lg font-semibold text-foreground">Configuración</h3>
        <div className="max-w-xs">
          <Label htmlFor="size">Número de ecuaciones</Label>
          <Input
            id="size"
            type="number"
            min="2"
            max="4"
            value={size}
            onChange={(e) => updateSize(Number.parseInt(e.target.value) || 2)}
          />
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="mb-4 text-lg font-semibold text-foreground">Funciones de Iteración G(x)</h3>
        <p className="mb-4 text-sm text-muted-foreground">
          Transforme su sistema F(x) = 0 a la forma x = G(x). Por ejemplo, si tiene x² + y² = 4 y xy = 1, puede usar x =
          √(4 - y²) y y = 1/x
        </p>
        <div className="space-y-4">
          {gFunctions.map((g, i) => (
            <div key={i}>
              <Label htmlFor={`g-${i}`}>
                {varNames[i]} = g{i + 1}({varNames.slice(0, size).join(", ")})
              </Label>
              <Textarea
                id={`g-${i}`}
                value={g}
                onChange={(e) => updateGFunction(i, e.target.value)}
                placeholder={`Ejemplo: (4 - ${varNames[1]}^2)^0.5`}
                className="font-mono"
              />
            </div>
          ))}
          <p className="text-xs text-muted-foreground">
            Variables disponibles: {varNames.slice(0, size).join(", ")}. Operadores: +, -, *, /, ^, sin, cos, tan, exp,
            log, sqrt
          </p>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold text-foreground">Valores Iniciales</h3>
          <div className="space-y-3">
            {initialValues.map((val, i) => (
              <div key={i}>
                <Label htmlFor={`init-${i}`}>{varNames[i]}₀</Label>
                <Input
                  id={`init-${i}`}
                  type="number"
                  step="0.1"
                  value={val}
                  onChange={(e) => updateInitialValue(i, e.target.value)}
                />
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold text-foreground">Parámetros</h3>
          <div className="space-y-3">
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
              <Label htmlFor="maxIter">Iteraciones máximas</Label>
              <Input
                id="maxIter"
                type="number"
                value={maxIterations}
                onChange={(e) => setMaxIterations(Number.parseInt(e.target.value))}
              />
            </div>
          </div>
        </Card>
      </div>

      {error && (
        <Card className="border-destructive bg-destructive/10 p-4">
          <p className="text-sm text-destructive">{error}</p>
        </Card>
      )}

      <Button onClick={calculate} className="w-full" size="lg">
        <Calculator className="mr-2 h-5 w-5" />
        Resolver Sistema
      </Button>

      {result && (
        <Card className="border-accent bg-accent/5 p-6">
          <h3 className="mb-4 text-lg font-semibold text-foreground">Solución Encontrada</h3>
          <div className="space-y-3">
            {result.map((val, i) => (
              <div key={i} className="flex items-center gap-4 rounded-lg bg-background p-4">
                <span className="font-semibold text-foreground">{varNames[i]} =</span>
                <span className="font-mono text-lg font-medium text-foreground">{val.toFixed(8)}</span>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-lg bg-background p-4">
            <h4 className="mb-2 font-semibold text-foreground">Verificación (x = G(x)):</h4>
            <div className="space-y-2">
              {gFunctions.map((g, i) => {
                const value = evaluateFunction(g, result)
                const diff = Math.abs(value - result[i])
                return (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">
                      g{i + 1}({varNames.slice(0, size).join(", ")}) =
                    </span>
                    <span className="font-mono text-foreground">{value.toFixed(8)}</span>
                    <span className="text-muted-foreground">(diferencia: {diff.toFixed(8)})</span>
                  </div>
                )
              })}
            </div>
          </div>

          {iterations.length > 0 && (
            <div className="mt-6 rounded-lg bg-muted p-4">
              <h4 className="mb-3 font-semibold text-foreground">Historial de iteraciones:</h4>
              <div className="max-h-64 space-y-2 overflow-y-auto">
                {iterations.slice(-10).map((iter) => (
                  <div key={iter.iter} className="text-sm">
                    <span className="font-medium text-foreground">Iteración {iter.iter}:</span>
                    <div className="ml-4 text-muted-foreground">
                      {iter.values.map((v, i) => (
                        <span key={i} className="mr-3">
                          {varNames[i]} = {v.toFixed(6)}
                        </span>
                      ))}
                      <span className="text-accent">Error = {iter.error.toFixed(8)}</span>
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-2 text-xs text-muted-foreground">Mostrando últimas 10 iteraciones</p>
            </div>
          )}

          <div className="mt-6 rounded-lg bg-muted p-4">
            <h4 className="mb-2 font-semibold text-foreground">Explicación</h4>
            <p className="text-sm text-muted-foreground">
              El método de Punto Fijo resuelve x = G(x) mediante iteración: x^(k+1) = G(x^(k)). La convergencia depende
              de que ||G'(x)|| {"<"} 1 en la región de la solución. Es simple de implementar pero puede converger
              lentamente o divergir si G no está bien elegida. La elección correcta de G es crucial para el éxito del
              método.
            </p>
          </div>
        </Card>
      )}
    </div>
  )
}
