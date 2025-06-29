"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import { HomeLogoHeader } from "@/components/ui/HomeLogoHeader"

interface TermsPageProps {
  onBack: () => void
  onAccept: () => void
  t: any
}

export default function TermsPage({ onBack, onAccept, t }: TermsPageProps) {
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [acceptPrivacy, setAcceptPrivacy] = useState(false)

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6">
        <HomeLogoHeader 
          onNavigateToDashboard={onBack}
          title={t.homeLogo_title}
          subtitle={t.homeLogo_subtitle}
          ariaLabel={t.homeLogo_ariaLabel}
        />
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
        <Card className="w-full max-w-4xl bg-white shadow-2xl">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-blue-600 text-2xl font-bold mb-2">Términos y condiciones</h2>
              <p className="text-gray-600">
                Importante: Los siguientes términos deben ser leídos y completados personalmente por el cliente.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 mb-6 max-h-96 overflow-y-auto">
              <div className="flex items-center gap-3 mb-4">
                <img src="/saephone-logo.jpg" alt="SAEPHONE Logo" className="w-10 h-10 object-contain" />
                <h3 className="text-blue-600 text-lg font-bold">Términos y Condiciones</h3>
              </div>

              <div className="space-y-4 text-sm text-gray-700">
                <p>
                  Este documento describe los términos y condiciones generales aplicables al uso de los contenidos,
                  productos y servicios ofrecidos a través del sitio www.saephone.com, del cual es titular SAEPHONE
                  México, S. de R.L. de C.V.
                </p>

                <div>
                  <h4 className="font-bold text-gray-900 mb-2">1. OBJETO</h4>
                  <p>
                    El objeto de los presentes TÉRMINOS Y CONDICIONES es regular el acceso y la utilización del SITIO
                    WEB.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-gray-900 mb-2">2. EL TITULAR</h4>
                  <p>
                    Se reserva el derecho de realizar cualquier tipo de modificación en el SITIO WEB en cualquier
                    momento y sin previo aviso.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-gray-900 mb-2">3. RESPONSABILIDADES</h4>
                  <p>
                    El usuario se compromete a utilizar el sitio web de manera responsable y conforme a la legislación
                    aplicable.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-gray-900 mb-2">4. PRIVACIDAD</h4>
                  <p>
                    Todos los datos personales proporcionados serán tratados conforme a nuestra política de privacidad.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <Checkbox
                  id="terms"
                  checked={acceptTerms}
                  onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                  className="mt-1"
                />
                <label htmlFor="terms" className="text-sm text-gray-700">
                  Acepto los términos y condiciones de SAEPHONE
                </label>
              </div>

              <div className="flex items-start gap-3">
                <Checkbox
                  id="privacy"
                  checked={acceptPrivacy}
                  onCheckedChange={(checked) => setAcceptPrivacy(checked as boolean)}
                  className="mt-1"
                />
                <label htmlFor="privacy" className="text-sm text-gray-700">
                  Acepto los términos y condiciones y aviso de privacidad de SAEPHONE
                </label>
              </div>
            </div>

            <div className="flex gap-4">
              <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Regresar
              </Button>
              <Button
                onClick={onAccept}
                disabled={!acceptTerms || !acceptPrivacy}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium disabled:opacity-50"
              >
                Acepto los términos
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
