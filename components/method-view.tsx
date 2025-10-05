"use client"

import { Card } from "@/components/ui/card"
import { SumaMatrices } from "@/components/methods/suma-matrices"
import { MultiplicacionMatrices } from "@/components/methods/multiplicacion-matrices"
import { Determinante } from "@/components/methods/determinante"
import { MatrizInversa } from "@/components/methods/matriz-inversa"
import { MetodoMatrizInversa } from "@/components/methods/metodo-matriz-inversa"
import { Gauss } from "@/components/methods/gauss"
import { GaussJordan } from "@/components/methods/gauss-jordan"
import { Jacobi } from "@/components/methods/jacobi"
import { GaussSeidel } from "@/components/methods/gauss-seidel"
import { Biseccion } from "@/components/methods/biseccion"
import { Secante } from "@/components/methods/secante"
import { NewtonRaphson } from "@/components/methods/newton-raphson"
import { NewtonRaphsonModificado } from "@/components/methods/newton-raphson-modificado"
import { PuntoFijo } from "@/components/methods/punto-fijo"

interface MethodViewProps {
  method: string
}

export function MethodView({ method }: MethodViewProps) {
  const renderMethod = () => {
    switch (method) {
      // Linear Algebra
      case "suma-matrices":
        return <SumaMatrices />
      case "multiplicacion-matrices":
        return <MultiplicacionMatrices />
      case "determinante":
        return <Determinante />
      case "inversa":
        return <MatrizInversa />
      case "matriz-inversa":
        return <MetodoMatrizInversa />
      case "gauss":
        return <Gauss />
      case "gauss-jordan":
        return <GaussJordan />
      case "jacobi":
        return <Jacobi />
      case "gauss-seidel":
        return <GaussSeidel />
      // Non-linear equations
      case "biseccion":
        return <Biseccion />
      case "secante":
        return <Secante />
      // Non-linear systems
      case "newton-raphson":
        return <NewtonRaphson />
      case "newton-raphson-modificado":
        return <NewtonRaphsonModificado />
      case "punto-fijo":
        return <PuntoFijo />
      default:
        return (
          <Card className="p-6">
            <h2 className="text-2xl font-bold text-foreground">
              {method
                .split("-")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")}
            </h2>
            <p className="mt-2 text-muted-foreground">Este método está en desarrollo</p>
          </Card>
        )
    }
  }

  return <div className="p-4 md:p-8">{renderMethod()}</div>
}
