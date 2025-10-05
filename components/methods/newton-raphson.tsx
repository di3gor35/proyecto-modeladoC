"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calculator } from "lucide-react"

export function NewtonRaphson() {
  const [size, setSize] = useState(2)
  const [equations, setEquations] = useState(["x^2 + y^2 - 4", "x*y - 1"])
  const [initialValues, setInitialValues] = useState([1, 1])
  const [tolerance, setTolerance] = useState(0.0001)
  const [maxIterations, setMaxIterations] = useState(50)
  const [result, setResult] = useState<number[] | null>(null)
  const [iterations, setIterations] = useState<{ iter: number; values: number[]; error: number }[]>([])
  const [error, setError] = useState<string | null>(null)

  const updateSize = (newSize: number) => {
    setSize(newSize)
    setEquations(Array(newSize).fill(""))
    setInitialValues(Array(newSize).fill(0))
    setResult(null)
    setIterations([])
    setError(null)
  }

  const updateEquation = (index: number, value: string) => {
    const newEquations = [...equations]
    newEquations[index] = value
    setEquations(newEquations)
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

  const numericalDerivative = (expr: string, vars: number[], varIndex: number): number => {
    const h = 1e-7
    const varsPlus = [...vars]
    varsPlus[varIndex] += h

    const fPlus = evaluateFunction(expr, varsPlus)
    const f = evaluateFunction(expr, vars)

    return (fPlus - f) / h
  }

  const calculateJacobian = (vars: number[]): number[][] => {
    const n = size
    const jacobian: number[][] = []

    for (let i = 0; i < n; i++) {
      const row: number[] = []
      for (let j = 0; j < n; j++) {
        row.push(numericalDerivative(equations[i], vars, j))
      }
      jacobian.push(row)
    }

    return jacobian
  }

  const solveLinearSystem = (A: number[][], b: number[]): number[] => {
    const n = A.length
    const augmented = A.map((row, i) => [...row, b[i]])

    for (let i = 0; i < n; i++) {
      let maxRow = i
      for (let k = i + 1; k < n; k++) {
        if (Math.abs(augmented[k][i]) > Math.abs(augmented[maxRow][i])) {
          maxRow = k
        }
      }
      ;[augmented[i], augmented[maxRow]] = [augmented[maxRow], augmented[i]]

      if (Math.abs(augmented[i][i]) < 1e-10) {
        throw new Error("Sistema singular")
      }

      for (let k = i + 1; k < n; k++) {
        const factor = augmented[k][i] / augmented[i][i]
        for (let j = i; j <= n; j++) {
          augmented[k][j] -= factor * augmented[i][j]
        }
      }
    }

    const x = Array(n).fill(0)
    for (let i = n - 1; i >= 0; i--) {
      x[i] = augmented[i][n]
      for (let j = i + 1; j < n; j++) {
        x[i] -= augmented[i][j] * x[j]
      }
      x[i] /= augmented[i][i]
    }

    return x
  }

  const calculate = () => {
    try {
      let x = [...initialValues]
      const iterData: { iter: number; values: number[]; error: number }[] = []

      for (let iter = 0; iter < maxIterations; iter++) {
        const F = equations.map((eq) => evaluateFunction(eq, x))
        const J = calculateJacobian(x)
        const negF = F.map((val) => -val)
        const delta = solveLinearSystem(J, negF)
        const xNew = x.map((val, i) => val + delta[i])
        const errorVal = Math.max(...delta.map((d) => Math.abs(d)))

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
        <h2 className="text-2xl font-bold text-foreground">Newton-Raphson para Sistemas</h2>
        <p className="mt-2 text-muted-foreground">
          Resuelve sistemas de ecuaciones no lineales usando el método de Newton multivariable
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
        <h3 className="mb-4 text-lg font-semibold text-foreground">Sistema de Ecuaciones</h3>
        <div className="space-y-4">
          {equations.map((eq, i) => (
            <div key={i}>
              <Label htmlFor={`eq-${i}`}>
                f{i + 1}({varNames.slice(0, size).join(", ")}) = 0
              </Label>
              <Textarea
                id={`eq-${i}`}
                value={eq}
                onChange={(e) => updateEquation(i, e.target.value)}
                placeholder={`Ejemplo: ${varNames[0]}^2 + ${varNames[1]}^2 - 4`}
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
            <h4 className="mb-2 font-semibold text-foreground">Verificación:</h4>
            <div className="space-y-2">
              {equations.map((eq, i) => {
                const value = evaluateFunction(eq, result)
                return (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">
                      f{i + 1}({varNames.slice(0, size).join(", ")}) =
                    </span>
                    <span className="font-mono text-foreground">{value.toFixed(8)}</span>
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
              El método de Newton-Raphson para sistemas resuelve F(x) = 0 iterativamente usando: x^(k+1) = x^(k) -
              J(x^(k))^(-1) × F(x^(k)), donde J es la matriz Jacobiana de derivadas parciales. El método tiene
              convergencia cuadrática cerca de la solución si el Jacobiano es no singular.
            </p>
          </div>
        </Card>
      )}
    </div>
  )
}
