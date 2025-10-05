"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus } from "lucide-react"

export function SumaMatrices() {
  const [rows, setRows] = useState(2)
  const [cols, setCols] = useState(2)
  const [matrixA, setMatrixA] = useState<number[][]>([
    [0, 0],
    [0, 0],
  ])
  const [matrixB, setMatrixB] = useState<number[][]>([
    [0, 0],
    [0, 0],
  ])
  const [result, setResult] = useState<number[][] | null>(null)

  const updateDimensions = (newRows: number, newCols: number) => {
    setRows(newRows)
    setCols(newCols)
    setMatrixA(
      Array(newRows)
        .fill(0)
        .map(() => Array(newCols).fill(0)),
    )
    setMatrixB(
      Array(newRows)
        .fill(0)
        .map(() => Array(newCols).fill(0)),
    )
    setResult(null)
  }

  const updateMatrix = (matrix: "A" | "B", row: number, col: number, value: string) => {
    const numValue = Number.parseFloat(value) || 0
    const setter = matrix === "A" ? setMatrixA : setMatrixB
    const current = matrix === "A" ? matrixA : matrixB

    const newMatrix = current.map((r, i) => (i === row ? r.map((c, j) => (j === col ? numValue : c)) : r))
    setter(newMatrix)
  }

  const calculate = () => {
    const resultMatrix = matrixA.map((row, i) => row.map((val, j) => val + matrixB[i][j]))
    setResult(resultMatrix)
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold text-foreground">Suma de Matrices</h2>
        <p className="mt-2 text-muted-foreground">Calcula la suma de dos matrices del mismo tamaño</p>
      </Card>

      <Card className="p-6">
        <h3 className="mb-4 text-lg font-semibold text-foreground">Dimensiones</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="rows">Filas</Label>
            <Input
              id="rows"
              type="number"
              min="1"
              max="5"
              value={rows}
              onChange={(e) => updateDimensions(Number.parseInt(e.target.value) || 2, cols)}
            />
          </div>
          <div>
            <Label htmlFor="cols">Columnas</Label>
            <Input
              id="cols"
              type="number"
              min="1"
              max="5"
              value={cols}
              onChange={(e) => updateDimensions(rows, Number.parseInt(e.target.value) || 2)}
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
                    onChange={(e) => updateMatrix("A", i, j, e.target.value)}
                    className="w-20"
                  />
                ))}
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold text-foreground">Matriz B</h3>
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

      <Button onClick={calculate} className="w-full" size="lg">
        <Plus className="mr-2 h-5 w-5" />
        Calcular Suma
      </Button>

      {result && (
        <Card className="border-accent bg-accent/5 p-6">
          <h3 className="mb-4 text-lg font-semibold text-foreground">Resultado: A + B</h3>
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
              La suma de matrices se realiza sumando los elementos correspondientes de cada matriz. Para que dos
              matrices puedan sumarse, deben tener las mismas dimensiones.
            </p>
          </div>
        </Card>
      )}
    </div>
  )
}
