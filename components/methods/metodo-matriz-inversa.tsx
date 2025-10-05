"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calculator } from "lucide-react"

export function MetodoMatrizInversa() {
  const [size, setSize] = useState(2)
  const [matrixA, setMatrixA] = useState<number[][]>([
    [2, 1],
    [1, 3],
  ])
  const [vectorB, setVectorB] = useState<number[]>([5, 7])
  const [result, setResult] = useState<number[] | null>(null)
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

    const augmented = mat.map((row, i) => [
      ...row,
      ...Array(n)
        .fill(0)
        .map((_, j) => (i === j ? 1 : 0)),
    ])

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
    const inverse = getMatrixInverse(matrixA)
    if (!inverse) {
      setError("La matriz es singular y no tiene inversa")
      setResult(null)
      return
    }

    const solution = inverse.map((row) => row.reduce((sum, val, i) => sum + val * vectorB[i], 0))
    setResult(solution)
    setError(null)
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold text-foreground">Método de Matriz Inversa</h2>
        <p className="mt-2 text-muted-foreground">Resuelve el sistema Ax = b usando x = A⁻¹b</p>
      </Card>

      <Card className="p-6">
        <h3 className="mb-4 text-lg font-semibold text-foreground">Tamaño del Sistema</h3>
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
          <h3 className="mb-4 text-lg font-semibold text-foreground">Vector de Términos Independientes b</h3>
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
        Resolver Sistema
      </Button>

      {result && (
        <Card className="border-accent bg-accent/5 p-6">
          <h3 className="mb-4 text-lg font-semibold text-foreground">Solución del Sistema</h3>
          <div className="space-y-3">
            {result.map((val, i) => (
              <div key={i} className="flex items-center gap-4 rounded-lg bg-background p-4">
                <span className="font-semibold text-foreground">x{i + 1} =</span>
                <span className="font-mono text-lg font-medium text-foreground">{val.toFixed(6)}</span>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-lg bg-muted p-4">
            <h4 className="mb-2 font-semibold text-foreground">Explicación</h4>
            <p className="text-sm text-muted-foreground">
              El método de matriz inversa resuelve el sistema Ax = b calculando primero la inversa de A (A⁻¹) y luego
              multiplicando: x = A⁻¹b. Este método es directo pero computacionalmente costoso para matrices grandes.
            </p>
          </div>
        </Card>
      )}
    </div>
  )
}
