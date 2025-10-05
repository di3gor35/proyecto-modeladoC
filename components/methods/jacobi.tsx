"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calculator } from "lucide-react"

export function Jacobi() {
  const [size, setSize] = useState(3)
  const [matrixA, setMatrixA] = useState<number[][]>([
    [10, -1, 2],
    [-1, 11, -1],
    [2, -1, 10],
  ])
  const [vectorB, setVectorB] = useState<number[]>([6, 25, -11])
  const [tolerance, setTolerance] = useState(0.0001)
  const [maxIterations, setMaxIterations] = useState(50)
  const [result, setResult] = useState<number[] | null>(null)
  const [iterations, setIterations] = useState<{ iter: number; values: number[]; error: number }[]>([])
  const [error, setError] = useState<string | null>(null)

  const updateSize = (newSize: number) => {
    setSize(newSize)
    setMatrixA(
      Array(newSize)
        .fill(0)
        .map(() => Array(newSize).fill(0)),
    )
    setVectorB(Array(newSize).fill(0))
    setResult(null)
    setIterations([])
    setError(null)
  }

  const updateMatrix = (row: number, col: number, value: string) => {
    const numValue = Number.parseFloat(value) || 0
    const newMatrix = matrixA.map((r, i) => (i === row ? r.map((c, j) => (j === col ? numValue : c)) : r))
    setMatrixA(newMatrix)
  }

  const updateVector = (index: number, value: string) => {
    const numValue = Number.parseFloat(value) || 0
    const newVector = vectorB.map((v, i) => (i === index ? numValue : v))
    setVectorB(newVector)
  }

  const calculate = () => {
    const n = size

    // Check diagonal dominance
    for (let i = 0; i < n; i++) {
      const diag = Math.abs(matrixA[i][i])
      const sum = matrixA[i].reduce((s, val, j) => (j !== i ? s + Math.abs(val) : s), 0)
      if (diag <= sum) {
        setError("Advertencia: La matriz no es diagonalmente dominante. El método puede no converger.")
      }
    }

    let x = Array(n).fill(0)
    const iterData: { iter: number; values: number[]; error: number }[] = []

    for (let iter = 0; iter < maxIterations; iter++) {
      const xNew = Array(n).fill(0)

      for (let i = 0; i < n; i++) {
        let sum = vectorB[i]
        for (let j = 0; j < n; j++) {
          if (j !== i) {
            sum -= matrixA[i][j] * x[j]
          }
        }
        xNew[i] = sum / matrixA[i][i]
      }

      const maxError = Math.max(...xNew.map((val, i) => Math.abs(val - x[i])))
      iterData.push({ iter: iter + 1, values: [...xNew], error: maxError })

      if (maxError < tolerance) {
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
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold text-foreground">Método de Jacobi</h2>
        <p className="mt-2 text-muted-foreground">Método iterativo para resolver sistemas lineales</p>
      </Card>

      <Card className="p-6">
        <h3 className="mb-4 text-lg font-semibold text-foreground">Configuración</h3>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <Label htmlFor="size">Tamaño</Label>
            <Input
              id="size"
              type="number"
              min="2"
              max="5"
              value={size}
              onChange={(e) => updateSize(Number.parseInt(e.target.value) || 3)}
            />
          </div>
          <div>
            <Label htmlFor="tolerance">Tolerancia</Label>
            <Input
              id="tolerance"
              type="number"
              step="0.0001"
              value={tolerance}
              onChange={(e) => setTolerance(Number.parseFloat(e.target.value) || 0.0001)}
            />
          </div>
          <div>
            <Label htmlFor="maxIter">Iteraciones máx.</Label>
            <Input
              id="maxIter"
              type="number"
              value={maxIterations}
              onChange={(e) => setMaxIterations(Number.parseInt(e.target.value) || 50)}
            />
          </div>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold text-foreground">Matriz A</h3>
          <div className="space-y-2">
            {matrixA.map((row, i) => (
              <div key={i} className="flex gap-2">
                {row.map((val, j) => (
                  <Input
                    key={j}
                    type="number"
                    value={val}
                    onChange={(e) => updateMatrix(i, j, e.target.value)}
                    className="w-20"
                  />
                ))}
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold text-foreground">Vector b</h3>
          <div className="space-y-2">
            {vectorB.map((val, i) => (
              <Input key={i} type="number" value={val} onChange={(e) => updateVector(i, e.target.value)} />
            ))}
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
        Resolver con Jacobi
      </Button>

      {result && (
        <Card className="border-accent bg-accent/5 p-6">
          <h3 className="mb-4 text-lg font-semibold text-foreground">Solución (Iteración {iterations.length})</h3>
          <div className="space-y-3">
            {result.map((val, i) => (
              <div key={i} className="flex items-center gap-4 rounded-lg bg-background p-4">
                <span className="font-semibold text-foreground">x{i + 1} =</span>
                <span className="font-mono text-lg font-medium text-foreground">{val.toFixed(6)}</span>
              </div>
            ))}
          </div>

          {iterations.length > 0 && (
            <div className="mt-6 rounded-lg bg-muted p-4">
              <h4 className="mb-3 font-semibold text-foreground">Historial de iteraciones:</h4>
              <div className="max-h-64 space-y-2 overflow-y-auto">
                {iterations.slice(-10).map((iter) => (
                  <div key={iter.iter} className="text-sm text-muted-foreground">
                    <span className="font-medium">Iter {iter.iter}:</span> Error = {iter.error.toFixed(6)}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 rounded-lg bg-muted p-4">
            <h4 className="mb-2 font-semibold text-foreground">Explicación</h4>
            <p className="text-sm text-muted-foreground">
              El método de Jacobi es un método iterativo que actualiza cada variable usando los valores de la iteración
              anterior. Converge si la matriz es diagonalmente dominante. La fórmula es: x_i^(k+1) = (b_i - Σ a_ij *
              x_j^(k)) / a_ii
            </p>
          </div>
        </Card>
      )}
    </div>
  )
}
