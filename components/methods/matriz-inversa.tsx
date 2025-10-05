"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RefreshCw } from "lucide-react"

export function MatrizInversa() {
  const [size, setSize] = useState(2)
  const [matrix, setMatrix] = useState<number[][]>([
    [4, 7],
    [2, 6],
  ])
  const [result, setResult] = useState<number[][] | null>(null)
  const [determinant, setDeterminant] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  const updateSize = (newSize: number) => {
    setSize(newSize)
    setMatrix(
      Array(newSize)
        .fill(0)
        .map(() => Array(newSize).fill(0)),
    )
    setResult(null)
    setDeterminant(null)
    setError(null)
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
      det += Math.pow(-1, j) * mat[0][j] * calculateDeterminant(subMatrix)
    }
    return det
  }

  const getMatrixInverse = (mat: number[][]): number[][] | null => {
    const n = mat.length
    const det = calculateDeterminant(mat)

    if (Math.abs(det) < 1e-10) return null

    if (n === 2) {
      return [
        [mat[1][1] / det, -mat[0][1] / det],
        [-mat[1][0] / det, mat[0][0] / det],
      ]
    }

    // For larger matrices, use Gauss-Jordan elimination
    const augmented = mat.map((row, i) => [
      ...row,
      ...Array(n)
        .fill(0)
        .map((_, j) => (i === j ? 1 : 0)),
    ])

    // Forward elimination
    for (let i = 0; i < n; i++) {
      let maxRow = i
      for (let k = i + 1; k < n; k++) {
        if (Math.abs(augmented[k][i]) > Math.abs(augmented[maxRow][i])) {
          maxRow = k
        }
      }
      ;[augmented[i], augmented[maxRow]] = [augmented[maxRow], augmented[i]]

      if (Math.abs(augmented[i][i]) < 1e-10) return null

      for (let k = i + 1; k < n; k++) {
        const factor = augmented[k][i] / augmented[i][i]
        for (let j = i; j < 2 * n; j++) {
          augmented[k][j] -= factor * augmented[i][j]
        }
      }
    }

    // Back substitution
    for (let i = n - 1; i >= 0; i--) {
      for (let j = n; j < 2 * n; j++) {
        augmented[i][j] /= augmented[i][i]
      }
      augmented[i][i] = 1

      for (let k = i - 1; k >= 0; k--) {
        const factor = augmented[k][i]
        for (let j = i; j < 2 * n; j++) {
          augmented[k][j] -= factor * augmented[i][j]
        }
      }
    }

    return augmented.map((row) => row.slice(n))
  }

  const calculate = () => {
    const det = calculateDeterminant(matrix)
    setDeterminant(det)

    if (Math.abs(det) < 1e-10) {
      setError("La matriz es singular (determinante = 0) y no tiene inversa")
      setResult(null)
      return
    }

    const inverse = getMatrixInverse(matrix)
    if (!inverse) {
      setError("No se pudo calcular la inversa de la matriz")
      setResult(null)
      return
    }

    setResult(inverse)
    setError(null)
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold text-foreground">Matriz Inversa</h2>
        <p className="mt-2 text-muted-foreground">Calcula la matriz inversa A⁻¹ usando el método de Gauss-Jordan</p>
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
          Matriz A ({size}×{size})
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

      {error && (
        <Card className="border-destructive bg-destructive/10 p-4">
          <p className="text-sm text-destructive">{error}</p>
        </Card>
      )}

      <Button onClick={calculate} className="w-full" size="lg">
        <RefreshCw className="mr-2 h-5 w-5" />
        Calcular Inversa
      </Button>

      {result && determinant !== null && (
        <Card className="border-accent bg-accent/5 p-6">
          <div className="mb-6">
            <h3 className="mb-2 text-lg font-semibold text-foreground">Determinante</h3>
            <div className="rounded-lg bg-background p-4 text-center">
              <p className="text-2xl font-bold text-foreground">{determinant.toFixed(6)}</p>
            </div>
          </div>

          <h3 className="mb-4 text-lg font-semibold text-foreground">Matriz Inversa A⁻¹</h3>
          <div className="space-y-2">
            {result.map((row, i) => (
              <div key={i} className="flex gap-2">
                {row.map((val, j) => (
                  <div
                    key={j}
                    className="flex h-12 w-24 items-center justify-center rounded-md bg-background font-mono text-sm font-medium"
                  >
                    {val.toFixed(4)}
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-lg bg-muted p-4">
            <h4 className="mb-2 font-semibold text-foreground">Explicación</h4>
            <p className="text-sm text-muted-foreground">
              La matriz inversa A⁻¹ es aquella que cumple A × A⁻¹ = I, donde I es la matriz identidad. Se calcula usando
              el método de Gauss-Jordan, que consiste en formar una matriz aumentada [A|I] y aplicar operaciones
              elementales hasta obtener [I|A⁻¹]. Una matriz solo tiene inversa si su determinante es diferente de cero.
            </p>
          </div>
        </Card>
      )}
    </div>
  )
}
