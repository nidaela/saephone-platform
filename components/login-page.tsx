"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent } from "@/components/ui/card"
import { Shield, CreditCard, Lock, Star } from "lucide-react"

interface LoginPageProps {
  onCreateAccount: () => void
}

export default function LoginPage({ onCreateAccount }: LoginPageProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {/* Logo y Header */}
      <div className="text-center mb-8">
        <div className="mb-6">
          <img src="/saephone-logo.jpg" alt="SAEPHONE Logo" className="w-32 h-32 mx-auto object-contain" />
        </div>
        <h1 className="text-white text-4xl font-bold mb-2">SAEPHONE</h1>
        <div className="flex items-center justify-center mb-2">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
          ))}
        </div>
        <p className="text-white/90 text-sm mb-4">Smartphone & Accesorios</p>
        <p className="text-white/80 text-xs">Dispositivos premium • Pagos a meses • Sin complicaciones</p>

        {/* Estadísticas */}
        <div className="flex justify-center gap-8 mt-6 text-white">
          <div className="text-center">
            <div className="text-2xl font-bold">50K+</div>
            <div className="text-xs opacity-80">Clientes Felices</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold flex items-center justify-center gap-1">
              4.9 <Star className="w-4 h-4 text-yellow-400 fill-current" />
            </div>
            <div className="text-xs opacity-80">Calificación</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">0%</div>
            <div className="text-xs opacity-80">Pagos Sin Interés</div>
          </div>
        </div>
      </div>

      {/* Formulario de Login */}
      <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm shadow-2xl">
        <CardContent className="p-6">
          <div className="text-center mb-6">
            <h2 className="text-blue-600 text-xl font-bold mb-2">¡Bienvenido de Vuelta!</h2>
            <p className="text-gray-600 text-sm">Inicia sesión para continuar tu experiencia con smartphones</p>
          </div>

          <form className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-blue-600 font-medium">
                Correo Electrónico
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Ingresa tu correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 border-gray-200 focus:border-blue-500"
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-blue-600 font-medium">
                Contraseña
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Ingresa tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 border-gray-200 focus:border-blue-500"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                />
                <Label htmlFor="remember" className="text-sm text-gray-600">
                  Recordarme
                </Label>
              </div>
              <button type="button" className="text-sm text-green-600 hover:underline">
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            <Button className="w-full bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium py-3">
              Iniciar Sesión en SAEPHONE
            </Button>

            <div className="text-center text-gray-500 text-sm">O CONTINÚA CON</div>

            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="flex items-center justify-center gap-2 py-3">
                <div className="w-5 h-5 bg-red-500 rounded"></div>
                Google
              </Button>
              <Button variant="outline" className="flex items-center justify-center gap-2 py-3">
                <div className="w-5 h-5 bg-blue-600 rounded"></div>
                Facebook
              </Button>
            </div>

            <div className="text-center text-sm text-gray-600">
              ¿Nuevo en SAEPHONE?{" "}
              <button type="button" onClick={onCreateAccount} className="text-green-600 hover:underline font-medium">
                Crear Cuenta
              </button>
            </div>
          </form>

          {/* Iconos de seguridad */}
          <div className="flex justify-center gap-8 mt-6 pt-4 border-t">
            <div className="text-center">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mb-1">
                <Shield className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-xs text-gray-600">Pagos Seguros</div>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mb-1">
                <CreditCard className="w-5 h-5 text-green-600" />
              </div>
              <div className="text-xs text-gray-600">Pagos a Meses</div>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mb-1">
                <Lock className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-xs text-gray-600">Última Tecnología</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="text-center text-white/70 text-xs mt-6 max-w-md">
        Al iniciar sesión, aceptas los <span className="underline">Términos y Condiciones</span> y la{" "}
        <span className="underline">Política de Privacidad</span> de SAEPHONE
      </div>
    </div>
  )
}
