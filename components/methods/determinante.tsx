"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calculator } from "lucide-react"

export function Determinante() {
  const [size, setSize] = useState(2)
  const [matrix, setMatrix] = useState<number[][]>([
    [1, 2],
    [3, 4],
  ])
  const [result, setResult] = useState<number | null>(null)
  const [steps, setSteps] = useState<string[]>([])

  const updateSize = (newSize: number) => {
    setSize(newSize)
    setMatrix(
      Array(newSize)
        .fill(0)
        .map(() => Array(newSize).fill(0)),
    )
    setResult(null)
    setSteps([])
  }

  const updateMatrix = (row: number, col: number, value: string) => {
    const numValue = Number.parseFloat(value) || 0
    const newMatrix = matrix.map((r, i) => (i === row ? r.map((c, j) => (j === col ? numValue : c)) : r))
    setMatrix(newMatrix)
  }

  const calculateDeterminant = (mat: number[][]): number => {
    const n = mat.length

    if (n === 1) return mat[0][0]
    if (n === 2) return mat[0][0] * mat[1][1] - mat[0][1] * mat[1][0]

    let det = 0
    for (let j = 0; j < n; j++) {
      const subMatrix = mat.slice(1).map((row) => row.filter((_, colIndex) => colIndex !== j))
      const cofactor = Math.pow(-1, j) * mat[0][j] * calculateDeterminant(subMatrix)
      det += cofactor
    }
    return det
  }

  const calculate = () => {
    const det = calculateDeterminant(matrix)
    setResult(det)

    const newSteps = []
    if (size === 2) {
      newSteps.push(`det(A) = (${matrix[0][0]})(${matrix[1][1]}) - (${matrix[0][1]})(${matrix[1][0]})`)
      newSteps.push(`det(A) = ${matrix[0][0] * matrix[1][1]} - ${matrix[0][1] * matrix[1][0]}`)
      newSteps.push(`det(A) = ${det}`)
    } else if (size === 3) {
      newSteps.push("Usando expansión por cofactores en la primera fila:")
      newSteps.push(
        `det(A) = ${matrix[0][0]} × det(submatriz) - ${matrix[0][1]} × det(submatriz) + ${matrix[0][2]} × det(submatriz)`,
      )
    } else {
      newSteps.push("Determinante calculado usando expansión por cofactores")
    }
    setSteps(newSteps)
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold text-foreground">Determinante de una Matriz</h2>
        <p className="mt-2 text-muted-foreground">Calcula el determinante de una matriz cuadrada</p>
      </Card>

      <Card className="p-6">
        <h3 className="mb-4 text-lg font-semibold text-foreground">Tamaño de la Matriz</h3>
        <div className="max-w-xs">
          <Label htmlFor="size">Dimensión (n×n)</Label>
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
        <h3 className="mb-4 text-lg font-semibold text-foreground">
          Matriz ({size}×{size})
        </h3>
        <div className="space-y-2">
          {matrix.map((row, i) => (
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

      <Button onClick={calculate} className="w-full" size="lg">
        <Calculator className="mr-2 h-5 w-5" />
        Calcular Determinante
      </Button>

      {result !== null && (
        <Card className="border-accent bg-accent/5 p-6">
          <h3 className="mb-4 text-lg font-semibold text-foreground">Resultado</h3>
          <div className="mb-6 rounded-lg bg-background p-6 text-center">
            <p className="text-sm text-muted-foreground">det(A) =</p>
            <p className="text-4xl font-bold text-foreground">{result.toFixed(4)}</p>
          </div>

          {steps.length > 0 && (
            <div className="space-y-2 rounded-lg bg-muted p-4">
              <h4 className="font-semibold text-foreground">Pasos del cálculo:</h4>
              {steps.map((step, i) => (
                <p key={i} className="text-sm text-muted-foreground">
                  {i + 1}. {step}
                </p>
              ))}
            </div>
          )}

          <div className="mt-6 rounded-lg bg-muted p-4">
            <h4 className="mb-2 font-semibold text-foreground">Explicación</h4>
            <p className="text-sm text-muted-foreground">
              El determinante es un valor escalar que se puede calcular a partir de una matriz cuadrada. Para matrices
              2×2, se usa la fórmula ad-bc. Para matrices más grandes, se usa la expansión por cofactores o métodos de
              eliminación.
            </p>
          </div>
        </Card>
      )}
    </div>
  )
}
