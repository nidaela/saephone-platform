"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"

interface CreateAccountPageProps {
  onBack: () => void
  onNext: () => void
}

export default function CreateAccountPage({ onBack, onNext }: CreateAccountPageProps) {
  const [verificationCode, setVerificationCode] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [finalCode, setFinalCode] = useState("")

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6">
        <div className="flex items-center gap-4">
          <div className="bg-white rounded-2xl p-2 shadow-lg">
            <img src="/saephone-logo.jpg" alt="SAEPHONE Logo" className="w-16 h-16 object-contain" />
          </div>
          <div>
            <h1 className="text-white text-2xl font-bold">SAEPHONE</h1>
            <p className="text-white/80 text-sm">SMARTPHONE & ACCESORIOS</p>
          </div>
        </div>
        <Button variant="ghost" onClick={onBack} className="text-white hover:bg-white/10">
          Volver al inicio
        </Button>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
              1
            </div>
            <span className="text-white text-sm mt-2">Registrarse</span>
          </div>
          <div className="w-16 h-0.5 bg-white/30"></div>
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 bg-white/30 rounded-full flex items-center justify-center text-white font-bold">
              2
            </div>
            <span className="text-white/70 text-sm mt-2">Precio</span>
          </div>
          <div className="w-16 h-0.5 bg-white/30"></div>
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 bg-white/30 rounded-full flex items-center justify-center text-white font-bold">
              3
            </div>
            <span className="text-white/70 text-sm mt-2">Contrato</span>
          </div>
          <div className="w-16 h-0.5 bg-white/30"></div>
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 bg-white/30 rounded-full flex items-center justify-center text-white font-bold">
              4
            </div>
            <span className="text-white/70 text-sm mt-2">Software</span>
          </div>
          <div className="w-16 h-0.5 bg-white/30"></div>
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 bg-white/30 rounded-full flex items-center justify-center text-white font-bold">
              5
            </div>
            <span className="text-white/70 text-sm mt-2">Finalizar</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-lg bg-white/95 rounded-2xl shadow-2xl p-8">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-blue-600 text-2xl font-bold mb-2">Crear Cuenta en SAEPHONE</h2>
              <p className="text-gray-600">Para comenzar, necesitamos verificar tu número de teléfono</p>
            </div>

            <form className="space-y-6">
              <div>
                <Label htmlFor="verification" className="text-blue-600 font-medium">
                  Código de verificación
                </Label>
                <div className="flex gap-3 mt-2">
                  <Input
                    id="verification"
                    placeholder="Ingresa el código que ves a la derecha"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    className="flex-1 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="bg-gray-100 px-4 py-2 rounded border flex items-center">
                    <span className="text-purple-600 font-bold text-lg">2Y22</span>
                  </div>
                  <Button type="button" className="bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold">
                    Generar código
                  </Button>
                </div>
              </div>

              <div>
                <Label htmlFor="phone" className="text-blue-600 font-medium">
                  Número de teléfono
                </Label>
                <div className="flex gap-3 mt-2">
                  <div className="bg-gray-100 px-3 py-2 rounded border flex items-center">
                    <span className="text-gray-700">+52</span>
                  </div>
                  <Input
                    id="phone"
                    placeholder="Ingresa tu número de teléfono"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="flex-1 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <Button type="button" className="bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold">
                    Enviar código
                  </Button>
                </div>
              </div>

              <div>
                <Label htmlFor="code" className="text-blue-600 font-medium">
                  Introduce el código
                </Label>
                <Input
                  id="code"
                  placeholder="Código de 4 dígitos"
                  value={finalCode}
                  onChange={(e) => setFinalCode(e.target.value)}
                  className="mt-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  maxLength={4}
                />
              </div>

              <Button
                type="button"
                onClick={onNext}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold py-3 mt-8"
              >
                Verificar y Continuar
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
