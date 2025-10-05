"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X } from "lucide-react"

export function MultiplicacionMatrices() {
  const [rowsA, setRowsA] = useState(2)
  const [colsA, setColsA] = useState(2)
  const [rowsB, setRowsB] = useState(2)
  const [colsB, setColsB] = useState(2)
  const [matrixA, setMatrixA] = useState<number[][]>([
    [1, 2],
    [3, 4],
  ])
  const [matrixB, setMatrixB] = useState<number[][]>([
    [5, 6],
    [7, 8],
  ])
  const [result, setResult] = useState<number[][] | null>(null)
  const [error, setError] = useState<string | null>(null)

  const updateDimensionsA = (newRows: number, newCols: number) => {
    setRowsA(newRows)
    setColsA(newCols)
    setRowsB(newCols)
    setMatrixA(
      Array(newRows)
        .fill(0)
        .map(() => Array(newCols).fill(0)),
    )
    setMatrixB(
      Array(newCols)
        .fill(0)
        .map(() => Array(colsB).fill(0)),
    )
    setResult(null)
    setError(null)
  }

  const updateDimensionsB = (newCols: number) => {
    setColsB(newCols)
    setMatrixB(
      Array(rowsB)
        .fill(0)
        .map(() => Array(newCols).fill(0)),
    )
    setResult(null)
    setError(null)
  }

  const updateMatrix = (matrix: "A" | "B", row: number, col: number, value: string) => {
    const numValue = Number.parseFloat(value) || 0
    const setter = matrix === "A" ? setMatrixA : setMatrixB
    const current = matrix === "A" ? matrixA : matrixB

    const newMatrix = current.map((r, i) => (i === row ? r.map((c, j) => (j === col ? numValue : c)) : r))
    setter(newMatrix)
  }

  const calculate = () => {
    if (colsA !== rowsB) {
      setError("El número de columnas de A debe ser igual al número de filas de B")
      return
    }

    const resultMatrix: number[][] = []
    for (let i = 0; i < rowsA; i++) {
      resultMatrix[i] = []
      for (let j = 0; j < colsB; j++) {
        let sum = 0
        for (let k = 0; k < colsA; k++) {
          sum += matrixA[i][k] * matrixB[k][j]
        }
        resultMatrix[i][j] = sum
      }
    }
    setResult(resultMatrix)
    setError(null)
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold text-foreground">Multiplicación de Matrices</h2>
        <p className="mt-2 text-muted-foreground">Calcula el producto de dos matrices A × B</p>
      </Card>

      <Card className="p-6">
        <h3 className="mb-4 text-lg font-semibold text-foreground">Dimensiones</h3>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <Label htmlFor="rowsA">Filas de A</Label>
            <Input
              id="rowsA"
              type="number"
              min="1"
              max="4"
              value={rowsA}
              onChange={(e) => updateDimensionsA(Number.parseInt(e.target.value) || 2, colsA)}
            />
          </div>
          <div>
            <Label htmlFor="colsA">Columnas de A / Filas de B</Label>
            <Input
              id="colsA"
              type="number"
              min="1"
              max="4"
              value={colsA}
              onChange={(e) => updateDimensionsA(rowsA, Number.parseInt(e.target.value) || 2)}
            />
          </div>
          <div>
            <Label htmlFor="colsB">Columnas de B</Label>
            <Input
              id="colsB"
              type="number"
              min="1"
              max="4"
              value={colsB}
              onChange={(e) => updateDimensionsB(Number.parseInt(e.target.value) || 2)}
            />
          </div>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold text-foreground">
            Matriz A ({rowsA}×{colsA})
          </h3>
          <div className="space-y-2">
            {matrixA.map((row, i) => (
              <div key={i} className="flex gap-2">
                {row.map((val, j) => (
                  <Input
                    key={j}
                    type="number"
                    value={val}
                    onChange={(e) => updateMatrix("A", i, j, e.target.value)}
                    className="w-20"
                  />
                ))}
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold text-foreground">
            Matriz B ({rowsB}×{colsB})
          </h3>
          <div className="space-y-2">
            {matrixB.map((row, i) => (
              <div key={i} className="flex gap-2">
                {row.map((val, j) => (
                  <Input
                    key={j}
                    type="number"
                    value={val}
                    onChange={(e) => updateMatrix("B", i, j, e.target.value)}
                    className="w-20"
                  />
                ))}
              </div>
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
        <X className="mr-2 h-5 w-5" />
        Calcular Multiplicación
      </Button>

      {result && (
        <Card className="border-accent bg-accent/5 p-6">
          <h3 className="mb-4 text-lg font-semibold text-foreground">
            Resultado: A × B ({rowsA}×{colsB})
          </h3>
          <div className="space-y-2">
            {result.map((row, i) => (
              <div key={i} className="flex gap-2">
                {row.map((val, j) => (
                  <div
                    key={j}
                    className="flex h-12 w-20 items-center justify-center rounded-md bg-background font-mono text-sm font-medium"
                  >
                    {val.toFixed(2)}
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-lg bg-muted p-4">
            <h4 className="mb-2 font-semibold text-foreground">Explicación</h4>
            <p className="text-sm text-muted-foreground">
              La multiplicación de matrices A×B se calcula multiplicando cada fila de A por cada columna de B. El
              elemento (i,j) del resultado es la suma de los productos de los elementos correspondientes de la fila i de
              A y la columna j de B.
            </p>
          </div>
        </Card>
      )}
    </div>
  )
}
