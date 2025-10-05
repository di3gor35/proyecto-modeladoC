"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calculator } from "lucide-react"

export function Gauss() {
  const [size, setSize] = useState(3)
  const [matrixA, setMatrixA] = useState<number[][]>([
    [2, 1, -1],
    [-3, -1, 2],
    [-2, 1, 2],
  ])
  const [vectorB, setVectorB] = useState<number[]>([8, -11, -3])
  const [result, setResult] = useState<number[] | null>(null)
  const [steps, setSteps] = useState<string[]>([])
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
    setSteps([])
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
    const A = matrixA.map((row) => [...row])
    const b = [...vectorB]
    const newSteps: string[] = []

    newSteps.push("Matriz aumentada inicial [A|b]")

    // Forward elimination
    for (let i = 0; i < n; i++) {
      // Find pivot
      let maxRow = i
      for (let k = i + 1; k < n; k++) {
        if (Math.abs(A[k][i]) > Math.abs(A[maxRow][i])) {
          maxRow = k
        }
      }

      if (maxRow !== i) {
        ;[A[i], A[maxRow]] = [A[maxRow], A[i]]
        ;[b[i], b[maxRow]] = [b[maxRow], b[i]]
        newSteps.push(`Intercambiar fila ${i + 1} con fila ${maxRow + 1}`)
      }

      if (Math.abs(A[i][i]) < 1e-10) {
        setError("El sistema no tiene solución única")
        setResult(null)
        setSteps([])
        return
      }

      // Eliminate below
      for (let k = i + 1; k < n; k++) {
        const factor = A[k][i] / A[i][i]
        newSteps.push(`F${k + 1} = F${k + 1} - (${factor.toFixed(2)}) × F${i + 1}`)
        for (let j = i; j < n; j++) {
          A[k][j] -= factor * A[i][j]
        }
        b[k] -= factor * b[i]
      }
    }

    newSteps.push("Sustitución hacia atrás:")

    // Back substitution
    const x = Array(n).fill(0)
    for (let i = n - 1; i >= 0; i--) {
      x[i] = b[i]
      for (let j = i + 1; j < n; j++) {
        x[i] -= A[i][j] * x[j]
      }
      x[i] /= A[i][i]
      newSteps.push(`x${i + 1} = ${x[i].toFixed(4)}`)
    }

    setResult(x)
    setSteps(newSteps)
    setError(null)
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold text-foreground">Eliminación de Gauss</h2>
        <p className="mt-2 text-muted-foreground">
          Resuelve sistemas lineales mediante eliminación hacia adelante y sustitución hacia atrás
        </p>
      </Card>

      <Card className="p-6">
        <h3 className="mb-4 text-lg font-semibold text-foreground">Tamaño del Sistema</h3>
        <div className="max-w-xs">
          <Label htmlFor="size">Número de ecuaciones</Label>
          <Input
            id="size"
            type="number"
            min="2"
            max="5"
            value={size}
            onChange={(e) => updateSize(Number.parseInt(e.target.value) || 3)}
          />
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold text-foreground">Matriz de Coeficientes A</h3>
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
        Resolver con Gauss
      </Button>

      {result && (
        <Card className="border-accent bg-accent/5 p-6">
          <h3 className="mb-4 text-lg font-semibold text-foreground">Solución</h3>
          <div className="space-y-3">
            {result.map((val, i) => (
              <div key={i} className="flex items-center gap-4 rounded-lg bg-background p-4">
                <span className="font-semibold text-foreground">x{i + 1} =</span>
                <span className="font-mono text-lg font-medium text-foreground">{val.toFixed(6)}</span>
              </div>
            ))}
          </div>

          {steps.length > 0 && (
            <div className="mt-6 space-y-2 rounded-lg bg-muted p-4">
              <h4 className="font-semibold text-foreground">Pasos del algoritmo:</h4>
              <div className="max-h-64 space-y-1 overflow-y-auto">
                {steps.map((step, i) => (
                  <p key={i} className="text-sm text-muted-foreground">
                    {step}
                  </p>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 rounded-lg bg-muted p-4">
            <h4 className="mb-2 font-semibold text-foreground">Explicación</h4>
            <p className="text-sm text-muted-foreground">
              La eliminación de Gauss transforma el sistema en una matriz triangular superior mediante operaciones
              elementales, luego resuelve usando sustitución hacia atrás. Es uno de los métodos directos más eficientes.
            </p>
          </div>
        </Card>
      )}
    </div>
  )
}
