"use client"

import type React from "react"

import { useState, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent } from "@/components/ui/card"
import {
  Shield,
  CreditCard,
  Lock,
  Star,
  ArrowLeft,
  Download,
  Loader2,
  User,
  Smartphone,
  BarChart3,
  Settings,
  LogOut,
  RefreshCw,
  Printer,
  FileDown,
  FileText,
  Bell,
} from "lucide-react"

type PageType =
  | "login"
  | "create-account"
  | "terms"
  | "app-install"
  | "identity-verification"
  | "dashboard"
  | "device-selection"
  | "contract-generation"
  | "contract-signed"
  | "references"
  | "device-configuration"
  | "settings" // Nueva página de configuración
  | "payments" // Nueva página de procesar pagos
  | "reports" // Nueva página de reportes

export default function SaephonePlatform() {
  const [currentPage, setCurrentPage] = useState<PageType>("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [acceptPrivacy, setAcceptPrivacy] = useState(false)
  const [qrClicked, setQrClicked] = useState(false)
  const [appInstalling, setAppInstalling] = useState(false)
  const [appInstalled, setAppInstalled] = useState(false)
  const [frontIdCaptured, setFrontIdCaptured] = useState(false)
  const [backIdCaptured, setBackIdCaptured] = useState(false)
  const [selfieCaptured, setSelfieCaptured] = useState(false)
  const [isCapturing, setIsCapturing] = useState<"front" | "back" | "selfie" | null>(null)
  const [extractedName, setExtractedName] = useState("")
  const [userRegistered, setUserRegistered] = useState(false)
  const [selectedBrand, setSelectedBrand] = useState("")
  const [selectedModel, setSelectedModel] = useState("")
  const [selectedCapacity, setSelectedCapacity] = useState("")
  const [devicePrice, setDevicePrice] = useState(0)
  const [selectedFinancing, setSelectedFinancing] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("")
  const [contractGenerated, setContractGenerated] = useState(false)
  const [qrCodeClicked, setQrCodeClicked] = useState(false)

  const [userEmail, setUserEmail] = useState("")
  const [familyContactName, setFamilyContactName] = useState("")
  const [familyContactPhone, setFamilyContactPhone] = useState("")
  const [friendContactName, setFriendContactName] = useState("")
  const [friendContactPhone, setFriendContactPhone] = useState("")

  const [devicePhoneNumber, setDevicePhoneNumber] = useState("551328")
  const [connectWifi, setConnectWifi] = useState(false)

  useEffect(() => {
    if (currentPage === "app-install" && !appInstalled) {
      const timer = setTimeout(() => {
        setAppInstalling(true)
        setTimeout(() => {
          setAppInstalling(false)
          setAppInstalled(true)
        }, 4000)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [currentPage, appInstalled])

  const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
  }, [])

  const handlePasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
  }, [])

  const handleLogin = () => {
    if (email && password) {
      setCurrentPage("dashboard")
    } else {
      alert("Por favor ingresa tu correo electrónico y contraseña")
    }
  }

  const handleCapture = (type: "front" | "back" | "selfie") => {
    setIsCapturing(type)
    setTimeout(() => {
      if (type === "front") setFrontIdCaptured(true)
      if (type === "back") setBackIdCaptured(true)
      if (type === "selfie") {
        setSelfieCaptured(true)
        setTimeout(() => setUserRegistered(true), 1000)
      }
      setIsCapturing(null)

      if ((type === "front" && backIdCaptured) || (type === "back" && frontIdCaptured)) {
        setTimeout(() => setExtractedName("María Rodríguez Hernández"), 1500)
      }
    }, 2000)
  }

  const Background = () => (
    <>
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(135deg, #3A4A9A 0%, #4A5AA0 25%, #4A8A5A 75%, #3A9A8A 100%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-80"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.35) 1px, transparent 1px)`,
          backgroundSize: "30px 30px",
        }}
      />
    </>
  )

  const Header = ({ onBack }: { onBack?: () => void }) => (
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
      {onBack && (
        <button
          onClick={onBack}
          className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-xl border border-white/20 font-medium transition-all duration-200 hover:scale-105 shadow-lg"
        >
          🏠 Volver al inicio
        </button>
      )}
    </div>
  )

  const DashboardHeader = () => (
    <div className="flex items-center justify-between p-6">
      <div className="flex items-center gap-4">
        <div className="bg-white rounded-2xl p-2 shadow-lg">
          <img src="/saephone-logo.jpg" alt="SAEPHONE Logo" className="w-12 h-12 object-contain" />
        </div>
        <div>
          <h1 className="text-white text-xl font-bold">SAEPHONE</h1>
          <p className="text-white/80 text-sm">PLATAFORMA DE VENTAS</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-white">
          <User className="w-5 h-5" />
          <span className="text-sm font-medium">Usuario Demo</span>
        </div>
        <button
          onClick={() => setCurrentPage("login")}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          Cerrar Sesión
        </button>
      </div>
    </div>
  )

  const ProgressSteps = () => {
    const steps = [
      { id: 1, name: "Verificación", page: "create-account" },
      { id: 2, name: "Términos", page: "terms" },
      { id: 3, name: "Instalación", page: "app-install" },
      { id: 4, name: "Identidad", page: "identity-verification" },
      { id: 5, name: "Finalizar", page: "complete" },
    ]

    const getCurrentStepIndex = () => {
      switch (currentPage) {
        case "create-account":
          return 0
        case "terms":
          return 1
        case "app-install":
          return 2
        case "identity-verification":
          return 3
        default:
          return 0
      }
    }

    const currentStepIndex = getCurrentStepIndex()

    return (
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center gap-4">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                    index <= currentStepIndex ? "bg-green-500" : "bg-white/30"
                  }`}
                >
                  {step.id}
                </div>
                <span className={`text-sm mt-2 ${index <= currentStepIndex ? "text-white" : "text-white/70"}`}>
                  {step.name}
                </span>
              </div>
              {index < steps.length - 1 && <div className="w-16 h-0.5 bg-white/30 mx-2"></div>}
            </div>
          ))}
        </div>
      </div>
    )
  }

  const ContractProgressSteps = () => {
    const steps = [
      { id: 1, name: "Registrarse", completed: true },
      { id: 2, name: "Precio", completed: true },
      { id: 3, name: "Contrato", completed: true },
      { id: 4, name: "Software", completed: currentPage === "device-configuration" },
      { id: 5, name: "Finalizar", completed: false },
    ]

    return (
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center gap-4">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${
                    step.completed ? "bg-green-500" : "bg-gray-400"
                  }`}
                >
                  {step.id}
                </div>
                <span className={`text-sm mt-2 font-medium ${step.completed ? "text-green-600" : "text-gray-500"}`}>
                  {step.name}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className={`w-16 h-1 mx-4 ${step.completed ? "bg-green-500" : "bg-gray-300"}`}></div>
              )}
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (currentPage === "device-configuration") {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <Background />
        <div className="relative z-10 flex flex-col min-h-screen p-6">
          {/* Progress Steps */}
          <ContractProgressSteps />

          {/* Main Content */}
          <div className="flex-1 flex items-center justify-center">
            <Card className="w-full max-w-6xl bg-white shadow-2xl">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <h2 className="text-blue-600 text-3xl font-bold mb-4">Configuración Final del Dispositivo</h2>
                  <p className="text-gray-600 text-lg">
                    ¡Ya estamos en el último paso! Ahora instalaremos la aplicación LEPAGO en su teléfono XIAOMI
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left Side - Configuration Form */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-blue-600 text-xl font-bold mb-4">
                        Por favor ingrese el número de teléfono que usará en el dispositivo comprada con LePago.
                      </h3>

                      <div className="mb-6">
                        <input
                          type="text"
                          value={devicePhoneNumber}
                          onChange={(e) => setDevicePhoneNumber(e.target.value)}
                          className="w-full p-4 text-lg border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Ingrese el número de teléfono"
                        />
                      </div>

                      <div className="flex items-center gap-3 mb-6">
                        <Checkbox
                          id="wifi"
                          checked={connectWifi}
                          onCheckedChange={(checked) => setConnectWifi(checked as boolean)}
                        />
                        <label htmlFor="wifi" className="text-gray-700">
                          Favor de conectar el pago si wifi
                        </label>
                      </div>

                      <div className="mb-8">
                        <h4 className="text-blue-600 text-lg font-bold mb-2">Saque el teléfono de caja y enciéndalo</h4>
                        <p className="text-gray-600 text-sm">
                          Favor de asegurar que es un modelo de ubicación reciente
                        </p>
                      </div>

                      <div className="flex justify-center">
                        <Button
                          onClick={() => {
                            if (devicePhoneNumber.trim()) {
                              alert("Configuración completada exitosamente!")
                              // Here you could navigate to the final step
                            } else {
                              alert("Por favor ingresa el número de teléfono")
                            }
                          }}
                          className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg font-semibold text-lg"
                        >
                          Siguiente paso
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Right Side - Product Information */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-blue-600 text-xl font-bold mb-6">Producto</h3>

                    <div className="space-y-4">
                      <div>
                        <p className="text-lg font-semibold text-gray-800">Redmi Note 11 Pro 8+256</p>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Precio:</span>
                          <span className="font-semibold text-gray-800">$5500</span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-gray-600">Plan:</span>
                          <span className="font-semibold text-gray-800">$2190</span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-gray-600">Modelo*:</span>
                          <span className="font-semibold text-gray-800">Redmi Note 11 Pro</span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-gray-600">Color:</span>
                          <span className="font-semibold text-gray-800">Negro</span>
                        </div>
                      </div>

                      <div className="mt-6 pt-4 border-t border-gray-200">
                        <div className="w-full h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                          <Smartphone className="w-16 h-16 text-gray-400" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Back Button */}
                <div className="flex justify-start mt-8">
                  <button
                    onClick={() => setCurrentPage("references")}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
                  >
                    ← Regresar
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  if (currentPage === "contract-signed") {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <Background />
        <div className="relative z-10 flex flex-col min-h-screen p-6">
          {/* Progress Steps */}
          <ContractProgressSteps />

          {/* Main Content */}
          <div className="flex-1 flex items-center justify-center">
            <Card className="w-full max-w-7xl bg-white shadow-2xl">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <h2 className="text-blue-600 text-3xl font-bold mb-4">Contrato Firmado</h2>
                  <p className="text-gray-600 text-lg">
                    Da clic en el botón Refresh (A) para que aparezca la firma del cliente
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left Side - Contract Details */}
                  <div className="space-y-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h3 className="text-blue-600 text-lg font-bold mb-2">ID del pedido actual: SYSKT</h3>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-yellow-700">
                        <span className="text-yellow-600">⚠</span>
                        <span className="text-sm">
                          Asegúrese que el cliente haya leído el plan de pago. Si no paga a tiempo, se teléfono se
                          bloqueará
                        </span>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-6">
                      <h4 className="font-bold text-gray-800 mb-4">
                        CARÁTULA DEL CONTRATO DE COMPRAVENTA A PLAZO DE EQUIPO
                      </h4>

                      <div className="space-y-4 text-sm">
                        <div>
                          <p className="font-semibold">1. Datos de la Empresa, para Atención a Clientes</p>
                          <div className="ml-4 space-y-1 text-gray-700">
                            <p>Empresa: test_Tiendas LexPago</p>
                            <p>Domicilio: HUICHAPAN</p>
                            <p>RFC: HUICHAPAN</p>
                            <p>Teléfono: 5553371080</p>
                            <p>Correo electrónico: jose.luis@lexpago.com</p>
                          </div>
                        </div>

                        <div>
                          <p className="font-semibold">2. Datos del Cliente</p>
                          <div className="ml-4 space-y-1 text-gray-700">
                            <p>Titular: OROSIO SUAREZ ISRAEL</p>
                            <p>RFC: _______________</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4">
                      <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white">
                        <RefreshCw className="w-4 h-4" />
                        Refresh (A)
                      </Button>
                      <Button variant="outline" className="flex items-center gap-2">
                        <Printer className="w-4 h-4" />
                        Imprimir
                      </Button>
                      <Button variant="outline" className="flex items-center gap-2">
                        <FileDown className="w-4 h-4" />
                        Descargar contrato
                      </Button>
                    </div>

                    {/* Electronic Signature Section */}
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-gray-600" />
                        <span className="text-gray-700">Firma electrónica</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-white" />
                        </div>
                        <Button
                          onClick={() => setCurrentPage("references")}
                          className="bg-green-500 hover:bg-green-600 text-white"
                        >
                          Siguiente Paso (B)
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Right Side - Client Information */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-blue-600 text-xl font-bold mb-6">Información del Cliente</h3>

                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Modelo:</p>
                          <p className="font-semibold">SAMSUNG Galaxy A22 5G 4+128</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Precio en caja:</p>
                          <p className="font-semibold">$5000</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Primer pago:</p>
                          <p className="font-semibold">$380</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Plazos de pago:</p>
                          <p className="font-semibold">26Plazo</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Monto de cada plazo a pagar:</p>
                          <p className="font-semibold">$56.47</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Monto total:</p>
                          <p className="font-semibold">$5000</p>
                        </div>
                      </div>

                      <div className="border-t pt-4 mt-6">
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm text-gray-600">Nombre del cliente:</p>
                            <p className="font-semibold">GONZALEZ TREJO YAZMIN ARCELIA</p>
                          </div>

                          <div>
                            <p className="text-sm text-gray-600">Número Celular:</p>
                            <p className="font-semibold">5356425647</p>
                          </div>

                          <div>
                            <p className="text-sm text-gray-600">ID:</p>
                            <p className="font-semibold">CURP</p>
                          </div>

                          <div>
                            <p className="font-semibold">GOTY840630MDFNZ03</p>
                          </div>

                          <div className="pt-4">
                            <p className="text-sm text-gray-600">Contrato:</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="font-semibold">Firmado</span>
                              <div className="flex gap-1">
                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Back Button */}
                <div className="flex justify-start mt-8">
                  <button
                    onClick={() => setCurrentPage("contract-generation")}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
                  >
                    ← Regresar
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  if (currentPage === "references") {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <Background />
        <div className="relative z-10 flex flex-col min-h-screen p-6">
          {/* Progress Steps - Updated to show step 4 completed */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                  1
                </div>
                <span className="text-sm mt-2 font-medium text-green-600">Registrarse</span>
              </div>
              <div className="w-16 h-1 bg-green-500"></div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                  2
                </div>
                <span className="text-sm mt-2 font-medium text-green-600">Precio</span>
              </div>
              <div className="w-16 h-1 bg-green-500"></div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                  3
                </div>
                <span className="text-sm mt-2 font-medium text-green-600">Contrato</span>
              </div>
              <div className="w-16 h-1 bg-green-500"></div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                  4
                </div>
                <span className="text-sm mt-2 font-medium text-green-600">Software</span>
              </div>
              <div className="w-16 h-1 bg-gray-300"></div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-gray-400 rounded-full flex items-center justify-center text-white font-bold">
                  5
                </div>
                <span className="text-sm mt-2 font-medium text-gray-500">Finalizar</span>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex items-center justify-center">
            <Card className="w-full max-w-7xl bg-white shadow-2xl">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <h2 className="text-blue-600 text-3xl font-bold mb-4">Referencias</h2>
                  <p className="text-gray-600 text-lg">
                    ¡Ayúdanos a conocerte mejor! Por favor, completa la información sobre usted.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left Side - Form */}
                  <div className="space-y-6">
                    <div>
                      <label className="block text-blue-600 font-semibold mb-2">email :</label>
                      <input
                        type="email"
                        placeholder="Ingrese su correo electrónico"
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-blue-600 font-semibold mb-2">Nombre del contacto familiar :</label>
                      <input
                        type="text"
                        placeholder="Nombre completo del contacto familiar"
                        value={familyContactName}
                        onChange={(e) => setFamilyContactName(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-blue-600 font-semibold mb-2">Número de teléfono 1 :</label>
                      <input
                        type="tel"
                        placeholder="Ingrese número de teléfono"
                        value={familyContactPhone}
                        onChange={(e) => setFamilyContactPhone(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-blue-600 font-semibold mb-2">Nombre del contacto amigo :</label>
                      <input
                        type="text"
                        placeholder="Nombre completo del contacto amigo"
                        value={friendContactName}
                        onChange={(e) => setFriendContactName(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-blue-600 font-semibold mb-2">Número de teléfono 2 :</label>
                      <input
                        type="tel"
                        placeholder="Ingrese número de teléfono del amigo"
                        value={friendContactPhone}
                        onChange={(e) => setFriendContactPhone(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* Right Side - Device Information */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-blue-600 text-xl font-bold mb-6">Redmi Note 14 Pro 8+256</h3>

                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Modelo</p>
                          <p className="font-semibold">$5000</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">IVA</p>
                          <p className="font-semibold">$1120</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Pay recompensas</p>
                          <p className="font-semibold">39</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Semanas</p>
                          <p className="font-semibold">$1 250</p>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm text-gray-600">Estado donde vive</p>
                        <p className="font-semibold">Celular</p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-600">CURP</p>
                        <p className="font-semibold">VAZQUEZ GOMEZ BEATIZADRIANA</p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-600">Número de celular</p>
                        <p className="font-semibold">Celular</p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-600">5533985775</p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-600">Estado donde nació :</p>
                        <div className="bg-white p-3 rounded border mt-2">
                          <p className="font-semibold">VAZQUEZGOMEZBRZ ADRIANA</p>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm text-gray-600">5533382575</p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-600">Ciudad donde vive :</p>
                        <div className="bg-white p-3 rounded border mt-2">{/* Empty field as shown in image */}</div>
                      </div>
                    </div>

                    {/* Next Step Button */}
                    <div className="mt-8 flex justify-end">
                      <Button
                        onClick={() => {
                          if (
                            userEmail &&
                            familyContactName &&
                            familyContactPhone &&
                            friendContactName &&
                            friendContactPhone
                          ) {
                            setCurrentPage("device-configuration")
                          } else {
                            alert("Por favor completa todos los campos obligatorios")
                          }
                        }}
                        className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg font-semibold"
                      >
                        Siguiente paso
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Back Button */}
                <div className="flex justify-start mt-8">
                  <button
                    onClick={() => setCurrentPage("contract-signed")}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
                  >
                    ← Regresar
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  if (currentPage === "device-selection") {
    const brands = ["Apple", "Samsung", "Xiaomi", "Huawei", "OnePlus"]
    const models: Record<string, string[]> = {
      Apple: ["iPhone 15 Pro", "iPhone 15", "iPhone 14 Pro", "iPhone 14"],
      Samsung: ["Galaxy S24 Ultra", "Galaxy S24", "Galaxy A54", "Galaxy A34"],
      Xiaomi: ["Redmi Note 13", "Mi 13", "Redmi 12", "POCO X5"],
      Huawei: ["P60 Pro", "Mate 50", "Nova 11", "Y70"],
      OnePlus: ["OnePlus 12", "OnePlus 11", "Nord 3", "Nord CE 3"],
    }
    const capacities = ["64GB", "128GB", "256GB", "512GB", "1TB"]

    const prices: Record<string, Record<string, number>> = {
      "iPhone 15 Pro": { "128GB": 25999, "256GB": 28999, "512GB": 34999, "1TB": 40999 },
      "iPhone 15": { "128GB": 21999, "256GB": 24999, "512GB": 30999 },
      "Galaxy S24 Ultra": { "256GB": 26999, "512GB": 31999, "1TB": 37999 },
      "Galaxy S24": { "128GB": 19999, "256GB": 22999, "512GB": 27999 },
      "Redmi Note 13": { "128GB": 5999, "256GB": 7999 },
      "Mi 13": { "128GB": 15999, "256GB": 18999, "512GB": 22999 },
    }

    const updatePrice = () => {
      if (selectedModel && selectedCapacity && prices[selectedModel] && prices[selectedModel][selectedCapacity]) {
        setDevicePrice(prices[selectedModel][selectedCapacity])
      } else {
        setDevicePrice(0)
      }
    }

    const getWeeklyPayment = (weeks: number) => {
      if (devicePrice > 0) {
        return Math.round(devicePrice / weeks)
      }
      return 0
    }

    return (
      <div className="min-h-screen relative overflow-hidden">
        <Background />
        <div className="relative z-10 flex flex-col min-h-screen">
          {/* Header */}
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center gap-4">
              <div className="bg-white rounded-2xl p-2 shadow-lg">
                <img src="/saephone-logo.jpg" alt="SAEPHONE Logo" className="w-12 h-12 object-contain" />
              </div>
              <div>
                <h1 className="text-white text-xl font-bold">SAEPHONE</h1>
                <p className="text-white/80 text-sm">SMARTPHONES EN TUS MANOS</p>
              </div>
            </div>
            <button
              onClick={() => setCurrentPage("dashboard")}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-xl border border-white/20 font-medium transition-all duration-200 hover:scale-105 shadow-lg"
            >
              ← Volver al Dashboard
            </button>
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
              <div className="w-16 h-0.5 bg-green-400"></div>
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                  2
                </div>
                <span className="text-white text-sm mt-2">Precio</span>
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
                  <h2 className="text-blue-600 text-3xl font-bold mb-4">
                    Selección de Modelo y Plan de Financiamiento
                  </h2>
                  <p className="text-gray-600 text-lg">
                    Elige el dispositivo y el plan de pagos que mejor se adapte a tus necesidades
                  </p>
                </div>

                <div className="space-y-8">
                  {/* Método de pago */}
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">1</span>
                      </div>
                      <h3 className="text-blue-600 text-xl font-bold">Método de pago</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <button
                        onClick={() => setPaymentMethod("financiado")}
                        className={`p-4 border-2 rounded-lg text-center transition-all ${
                          paymentMethod === "financiado"
                            ? "border-green-500 bg-green-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="text-lg font-semibold text-gray-800">Financiado por Saephone</div>
                        <div className="text-sm text-gray-600 mt-1">Pagos a meses sin intereses</div>
                      </button>

                      <button
                        onClick={() => setPaymentMethod("contado")}
                        className={`p-4 border-2 rounded-lg text-center transition-all ${
                          paymentMethod === "contado"
                            ? "border-green-500 bg-green-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="text-lg font-semibold text-gray-800">Pago de Contado</div>
                        <div className="text-sm text-gray-600 mt-1">Pago único completo</div>
                      </button>
                    </div>

                    {!paymentMethod && <p className="text-red-500 text-sm">* Selecciona un método de pago</p>}
                  </div>

                  {/* Modelo */}
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">2</span>
                      </div>
                      <h3 className="text-blue-600 text-xl font-bold">Modelo</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div>
                        <label className="block text-blue-600 font-medium mb-2">Marca</label>
                        <select
                          value={selectedBrand}
                          onChange={(e) => {
                            setSelectedBrand(e.target.value)
                            setSelectedModel("")
                            setSelectedCapacity("")
                            setDevicePrice(0)
                          }}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Selecciona una marca</option>
                          {brands.map((brand) => (
                            <option key={brand} value={brand}>
                              {brand}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-blue-600 font-medium mb-2">Modelo</label>
                        <select
                          value={selectedModel}
                          onChange={(e) => {
                            setSelectedModel(e.target.value)
                            setSelectedCapacity("")
                            setDevicePrice(0)
                          }}
                          disabled={!selectedBrand}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                        >
                          <option value="">Selecciona un modelo</option>
                          {selectedBrand &&
                            models[selectedBrand] &&
                            models[selectedBrand].map((model) => (
                              <option key={model} value={model}>
                                {model}
                              </option>
                            ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-blue-600 font-medium mb-2">Capacidad</label>
                        <select
                          value={selectedCapacity}
                          onChange={(e) => {
                            setSelectedCapacity(e.target.value)
                            setTimeout(updatePrice, 100)
                          }}
                          disabled={!selectedModel}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                        >
                          <option value="">Selecciona capacidad</option>
                          {capacities.map((capacity) => (
                            <option key={capacity} value={capacity}>
                              {capacity}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {!selectedBrand && <p className="text-red-500 text-sm mb-4">* Selecciona una marca</p>}

                    <div>
                      <label className="block text-blue-600 font-medium mb-2">Precio del dispositivo</label>
                      <div className="flex items-center">
                        <span className="bg-gray-100 px-4 py-3 border border-r-0 border-gray-300 rounded-l-lg text-gray-700 font-medium">
                          $
                        </span>
                        <input
                          type="number"
                          value={devicePrice}
                          onChange={(e) => setDevicePrice(Number(e.target.value) || 0)}
                          placeholder="Ingresa el precio del dispositivo"
                          className="flex-1 p-3 border border-gray-300 rounded-r-lg text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        El precio se actualiza automáticamente al seleccionar modelo y capacidad, pero puedes editarlo
                        manualmente
                      </p>
                    </div>
                  </div>

                  {/* Plan de financiamiento */}
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">3</span>
                      </div>
                      <h3 className="text-blue-600 text-xl font-bold">Plan de financiamiento</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <button
                        onClick={() => setSelectedFinancing("13")}
                        className={`p-6 border-2 rounded-lg text-center transition-all ${
                          selectedFinancing === "13"
                            ? "border-green-500 bg-green-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="text-xl font-bold text-blue-600 mb-2">13 SEMANAS</div>
                        <div className="text-sm text-gray-600 mb-2">SMES</div>
                        {devicePrice > 0 && (
                          <>
                            <div className="text-2xl font-bold text-green-600 mb-1">
                              ${Math.round(devicePrice / 13).toLocaleString()}
                            </div>
                            <div className="text-sm text-gray-600 mb-4">/SEMANA</div>
                            <div className="text-sm text-gray-700 mb-1">
                              pago inicial:{" "}
                              <span className="font-semibold">${Math.round(devicePrice * 0.2).toLocaleString()}</span>
                            </div>
                            <div className="text-sm text-gray-700">
                              precio final:{" "}
                              <span className="font-semibold">${Math.round(devicePrice * 1.15).toLocaleString()}</span>
                            </div>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => setSelectedFinancing("26")}
                        className={`p-6 border-2 rounded-lg text-center transition-all ${
                          selectedFinancing === "26"
                            ? "border-green-500 bg-green-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="text-xl font-bold text-blue-600 mb-2">26 SEMANAS</div>
                        <div className="text-sm text-gray-600 mb-2">SMES</div>
                        {devicePrice > 0 && (
                          <>
                            <div className="text-2xl font-bold text-green-600 mb-1">
                              ${Math.round(devicePrice / 26).toLocaleString()}
                            </div>
                            <div className="text-sm text-gray-600 mb-4">/SEMANA</div>
                            <div className="text-sm text-gray-700 mb-1">
                              pago inicial:{" "}
                              <span className="font-semibold">${Math.round(devicePrice * 0.2).toLocaleString()}</span>
                            </div>
                            <div className="text-sm text-gray-700">
                              precio final:{" "}
                              <span className="font-semibold">${Math.round(devicePrice * 1.25).toLocaleString()}</span>
                            </div>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => setSelectedFinancing("39")}
                        className={`p-6 border-2 rounded-lg text-center transition-all ${
                          selectedFinancing === "39"
                            ? "border-green-500 bg-green-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="text-xl font-bold text-blue-600 mb-2">39 SEMANAS</div>
                        <div className="text-sm text-gray-600 mb-2">SMES</div>
                        {devicePrice > 0 && (
                          <>
                            <div className="text-2xl font-bold text-green-600 mb-1">
                              ${Math.round(devicePrice / 39).toLocaleString()}
                            </div>
                            <div className="text-sm text-gray-600 mb-4">/SEMANA</div>
                            <div className="text-sm text-gray-700 mb-1">
                              pago inicial:{" "}
                              <span className="font-semibold">${Math.round(devicePrice * 0.2).toLocaleString()}</span>
                            </div>
                            <div className="text-sm text-gray-700">
                              precio final:{" "}
                              <span className="font-semibold">${Math.round(devicePrice * 1.35).toLocaleString()}</span>
                            </div>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Botones de navegación */}
                  <div className="flex gap-4 justify-center mt-8">
                    <button
                      onClick={() => setCurrentPage("dashboard")}
                      className="px-6 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-3 rounded"
                    >
                      ← Regresar al Dashboard
                    </button>
                    <button
                      onClick={() => {
                        if (paymentMethod && selectedBrand && selectedModel && selectedCapacity && selectedFinancing) {
                          setCurrentPage("contract-generation")
                        } else {
                          alert("Por favor completa todos los campos")
                        }
                      }}
                      className={`px-8 py-3 rounded-lg font-medium transition-colors ${
                        paymentMethod && selectedBrand && selectedModel && selectedCapacity && selectedFinancing
                          ? "bg-blue-600 hover:bg-blue-700 text-white"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                      disabled={
                        !(paymentMethod && selectedBrand && selectedModel && selectedCapacity && selectedFinancing)
                      }
                    >
                      Continuar →
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  if (currentPage === "contract-generation") {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <Background />
        <div className="relative z-10 flex flex-col min-h-screen">
          {/* Header */}
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center gap-4">
              <div className="bg-white rounded-2xl p-2 shadow-lg">
                <img src="/saephone-logo.jpg" alt="SAEPHONE Logo" className="w-12 h-12 object-contain" />
              </div>
              <div>
                <h1 className="text-white text-xl font-bold">SAEPHONE</h1>
                <p className="text-white/80 text-sm">SMARTPHONES EN TUS MANOS</p>
              </div>
            </div>
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
              <div className="w-16 h-0.5 bg-green-400"></div>
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                  2
                </div>
                <span className="text-white text-sm mt-2">Precio</span>
              </div>
              <div className="w-16 h-0.5 bg-green-400"></div>
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                  3
                </div>
                <span className="text-white text-sm mt-2">Contrato</span>
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
            <div className="w-full max-w-6xl">
              {/* Title */}
              <div className="text-center mb-8">
                <h2 className="text-white text-4xl font-bold mb-4">Generación del Contrato</h2>
                <p className="text-white/90 text-lg">
                  Escanea el código QR con un lector normal para que el cliente firme el contrato
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Contract Document */}
                <Card className="bg-white shadow-2xl">
                  <CardContent className="p-8">
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <h3 className="text-gray-800 text-xl font-bold mb-4">CONTRATO DE VENTA EN PARCIALIDADES</h3>
                    </div>

                    <div className="space-y-4 text-sm text-gray-700">
                      <div>
                        <p className="font-semibold">1. Datos del Proveedor y para Atención a Clientes</p>
                      </div>
                      <div>
                        <p className="font-semibold mb-2">2. Datos del cliente responsable para el contrato:</p>
                        <div className="bg-gray-50 p-4 rounded-lg text-center">
                          <p className="font-bold text-gray-800">GONZALEZ TREJO YAZMIN ARCELIA</p>
                          <p className="text-gray-600 mt-1">GOTY840630MDFNZ03</p>
                        </div>
                      </div>
                    </div>

                    {/* Contract Generation Status */}
                    <div className="mt-8">
                      {contractGenerated ? (
                        <div className="text-center">
                          <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                          <p className="text-green-600 font-semibold">Contrato generado exitosamente</p>
                        </div>
                      ) : (
                        <Button
                          onClick={() => setContractGenerated(true)}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 text-lg"
                        >
                          Generar Contrato
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* QR Code Section */}
                <div className="space-y-6">
                  <Card className="bg-white shadow-2xl">
                    <CardContent className="p-8 text-center">
                      <h3 className="text-blue-600 text-xl font-bold mb-4">
                        Escanea el código QR con un lector normal para que el cliente firme el contrato. Da click sobre
                        el código para ampliarlo
                      </h3>

                      <div className="flex justify-center mb-6">
                        <button
                          onClick={() => setQrCodeClicked(!qrCodeClicked)}
                          className={`bg-white border-2 border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-all ${
                            qrCodeClicked ? "scale-150 z-50" : ""
                          }`}
                        >
                          <div className="w-48 h-48 bg-white flex items-center justify-center border-2 border-gray-300">
                            <div className="w-44 h-44 bg-white relative">
                              {/* QR Code Pattern */}
                              <div className="absolute inset-0 grid grid-cols-21 grid-rows-21 gap-0">
                                {[
                                  1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0,
                                  0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 0, 0, 1, 0, 1, 0,
                                  1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 1, 1, 0, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1,
                                  1, 1, 0, 1, 0, 1, 0, 0, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1,
                                  0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1,
                                  1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 1,
                                  1, 1, 0, 0, 1, 0, 0, 1, 1, 0, 1, 0, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 1, 0, 1, 1, 0,
                                  0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 0, 1, 0, 0, 1, 1, 0, 1, 1, 0, 1, 0, 0,
                                  1, 0, 0, 1, 0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0,
                                  0, 1, 0, 0, 1, 1, 0, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0, 0,
                                  0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0,
                                  0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 0, 0,
                                  1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 1, 1, 0, 0, 1, 0, 1, 1, 1, 0,
                                  1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 0, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 1,
                                  0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1,
                                  1, 1, 1, 1, 1, 1,
                                ].map((cell, index) => (
                                  <div
                                    key={index}
                                    className={`w-full h-full ${cell === 1 ? "bg-black" : "bg-white"}`}
                                  />
                                ))}
                              </div>

                              {/* Corner positioning squares */}
                              <div className="absolute top-1 left-1 w-7 h-7 border-2 border-black bg-white">
                                <div className="w-3 h-3 bg-black m-1"></div>
                              </div>
                              <div className="absolute top-1 right-1 w-7 h-7 border-2 border-black bg-white">
                                <div className="w-3 h-3 bg-black m-1"></div>
                              </div>
                              <div className="absolute bottom-1 left-1 w-7 h-7 border-2 border-black bg-white">
                                <div className="w-3 h-3 bg-black m-1"></div>
                              </div>
                            </div>
                          </div>
                        </button>
                      </div>
                    </CardContent>
                  </Card>

                  {contractGenerated && (
                    <Button
                      onClick={() => setCurrentPage("contract-signed")}
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 text-lg rounded-xl"
                    >
                      Simular Firma del Cliente
                    </Button>
                  )}
                </div>
              </div>

              {/* Back Button */}
              <div className="flex justify-start mt-8">
                <button
                  onClick={() => setCurrentPage("device-selection")}
                  className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-xl border border-white/20 font-medium transition-all duration-200 hover:scale-105 shadow-lg flex items-center gap-2"
                >
                  ← Regresar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (currentPage === "dashboard") {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <Background />
        <div className="relative z-10 min-h-screen">
          <DashboardHeader />

          {/* Welcome Section */}
          <div className="text-center mb-12 px-6">
            <h1 className="text-white text-5xl font-bold mb-4">Panel Principal</h1>
            <p className="text-white/90 text-xl">Gestiona tus ventas, pagos, reportes y configuración de tu cuenta</p>
          </div>

          {/* Dashboard Cards */}
          <div className="px-6 pb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {/* Procesar Pagos */}
              <Card className="bg-white/95 rounded-2xl shadow-2xl p-8">
                <div className="flex items-center justify-center mb-6">
                  <CreditCard className="w-10 h-10 text-blue-600" />
                </div>
                <h3 className="text-blue-600 text-2xl font-bold mb-4">Procesar Pagos</h3>
                <p className="text-gray-700 text-lg mb-8 leading-relaxed">
                  Gestiona y procesa pagos de clientes de forma segura con planes de financiamiento flexibles
                </p>
                <Button
                  onClick={() => setCurrentPage("payments")}
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold py-3 px-6"
                >
                  Procesar Pago
                </Button>
              </Card>

              {/* Vender Dispositivos */}
              <Card className="bg-white/95 rounded-2xl shadow-2xl p-8">
                <div className="flex items-center justify-center mb-6">
                  <Smartphone className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="text-green-600 text-2xl font-bold mb-4">Vender Dispositivos</h3>
                <p className="text-gray-700 text-lg mb-8 leading-relaxed">
                  Facilita la venta de dispositivos con planes de financiamiento y gestión de inventario
                </p>
                <Button
                  onClick={() => setCurrentPage("device-selection")}
                  className="bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold py-3 px-6"
                >
                  Nueva Venta
                </Button>
              </Card>

              {/* Reportes */}
              <Card className="bg-white/95 rounded-2xl shadow-2xl p-8">
                <div className="flex items-center justify-center mb-6">
                  <BarChart3 className="w-10 h-10 text-purple-600" />
                </div>
                <h3 className="text-purple-600 text-2xl font-bold mb-4">Reportes</h3>
                <p className="text-gray-700 text-lg mb-8 leading-relaxed">
                  Consulta reportes detallados de transacciones, ventas y rendimiento del negocio
                </p>
                <Button
                  onClick={() => setCurrentPage("reports")}
                  className="bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold py-3 px-6"
                >
                  Ver Reportes
                </Button>
              </Card>

              {/* Configuración */}
              <Card className="bg-white/95 rounded-2xl shadow-2xl p-8">
                <div className="flex items-center justify-center mb-6">
                  <Settings className="w-10 h-10 text-gray-600" />
                </div>
                <h3 className="text-gray-600 text-2xl font-bold mb-4">Configuración</h3>
                <p className="text-gray-700 text-lg mb-8 leading-relaxed">
                  Administra tu cuenta y configuraciones del sistema para optimizar tu experiencia
                </p>
                <Button
                  onClick={() => setCurrentPage("settings")}
                  className="bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold py-3 px-6"
                >
                  Configuración
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (currentPage === "settings") {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <Background />
        <div className="relative z-10 min-h-screen flex flex-col">
          <DashboardHeader />
          <div className="flex-1 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Perfil de Usuario */}
              <Card className="shadow-2xl">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-blue-600 text-xl font-bold">Perfil de Usuario</h3>
                  </div>
                  <form className="space-y-4">
                    <div>
                      <Label htmlFor="fullName" className="text-blue-600 font-medium">Nombre completo</Label>
                      <input id="fullName" className="w-full mt-1 p-2 border rounded" placeholder="Juan Pérez González" />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-blue-600 font-medium">Correo electrónico</Label>
                      <input id="email" className="w-full mt-1 p-2 border rounded" placeholder="juan.perez@email.com" />
                    </div>
                    <div>
                      <Label htmlFor="phone" className="text-blue-600 font-medium">Teléfono</Label>
                      <input id="phone" className="w-full mt-1 p-2 border rounded" placeholder="+52 834 123 4567" />
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white">Guardar cambios</Button>
                      <Button variant="outline">Cancelar</Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
              {/* Seguridad */}
              <Card className="shadow-2xl">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                      <Lock className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-orange-500 text-xl font-bold">Seguridad</h3>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-medium text-gray-700">Autenticación de dos factores</span>
                    <input type="checkbox" className="accent-green-500 w-6 h-6" />
                  </div>
                  <Button className="mb-4 w-full bg-gray-200 hover:bg-gray-300 text-gray-700">Cambiar contraseña</Button>
                  <Button className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700">Ver sesiones activas</Button>
                </CardContent>
              </Card>
              {/* Notificaciones */}
              <Card className="shadow-2xl">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                      <Bell className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-yellow-500 text-xl font-bold">Notificaciones</h3>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-medium text-gray-700">Notificaciones de email</span>
                    <input type="checkbox" className="accent-green-500 w-6 h-6" />
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-medium text-gray-700">Notificaciones SMS</span>
                    <input type="checkbox" className="accent-green-500 w-6 h-6" />
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-medium text-gray-700">Notificaciones push</span>
                    <input type="checkbox" className="accent-green-500 w-6 h-6" />
                  </div>
                  <div className="mb-4">
                    <Label htmlFor="reportFrequency" className="font-medium text-gray-700">Frecuencia de reportes</Label>
                    <select id="reportFrequency" className="w-full mt-1 p-2 border rounded">
                      <option>Semanal</option>
                      <option>Mensual</option>
                      <option>Trimestral</option>
                    </select>
                  </div>
                </CardContent>
              </Card>
              {/* Sistema */}
              <Card className="shadow-2xl">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                      <Settings className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-purple-500 text-xl font-bold">Sistema</h3>
                  </div>
                  <div className="mb-4">
                    <Label htmlFor="language" className="font-medium text-gray-700">Idioma</Label>
                    <select id="language" className="w-full mt-1 p-2 border rounded">
                      <option>Español (México)</option>
                      <option>Inglés (US)</option>
                    </select>
                  </div>
                  <div className="mb-4">
                    <Label htmlFor="timezone" className="font-medium text-gray-700">Zona horaria</Label>
                    <select id="timezone" className="w-full mt-1 p-2 border rounded">
                      <option>GMT-6 (Tiempo del Centro)</option>
                      <option>GMT-8 (Pacífico)</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-medium text-gray-700">Modo oscuro</span>
                    <input type="checkbox" className="accent-green-500 w-6 h-6" />
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-medium text-gray-700">Backup automático</span>
                    <input type="checkbox" className="accent-green-500 w-6 h-6" />
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button className="bg-purple-500 hover:bg-purple-600 text-white">Aplicar configuración</Button>
                    <Button variant="outline">Restablecer</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="flex justify-end w-full max-w-6xl mt-8">
              <Button onClick={() => setCurrentPage("dashboard")}
                className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-xl border border-white/20 font-medium transition-all duration-200 hover:scale-105 shadow-lg">
                ← Volver al Inicio
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (currentPage === "login") {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <Background />
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">
          <div className="text-center mb-8">
            <div className="bg-white rounded-3xl p-6 mb-6 inline-block shadow-lg">
              <img src="/saephone-logo.jpg" alt="SAEPHONE Logo" className="w-20 h-20 object-contain" />
            </div>
            <h1 className="text-white text-5xl font-bold mb-3">SAEPHONE</h1>
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-16 h-1 bg-green-400 rounded-full"></div>
              <div className="text-green-400">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                  <path d="M13 2L3 14h6l-2 8 10-12h-6l2-8z" />
                </svg>
              </div>
              <div className="w-16 h-1 bg-green-400 rounded-full"></div>
            </div>
            <p className="text-white text-lg font-medium mb-2">Smartphones y Accesorios</p>
            <p className="text-white/80 text-sm mb-8">Dispositivos premium • Pagos a meses • Sin complicaciones</p>
            <div className="flex justify-center gap-12 mb-8 text-white">
              <div className="text-center">
                <div className="text-3xl font-bold">50K+</div>
                <div className="text-sm opacity-90">Clientes Felices</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold flex items-center justify-center gap-1">
                  4.9 <Star className="w-5 h-5 text-yellow-400 fill-current" />
                </div>
                <div className="text-sm opacity-90">Calificación</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">0%</div>
                <div className="text-sm opacity-90">Pagos Sin Interés</div>
              </div>
            </div>
          </div>

          <Card className="w-full max-w-md bg-white shadow-2xl rounded-2xl">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-blue-600 text-2xl font-bold mb-2">¡Bienvenido de Vuelta!</h2>
                <p className="text-gray-600 text-sm">Inicia sesión para continuar tu experiencia con smartphones</p>
              </div>

              <div className="space-y-6">
                <div>
                  <Label htmlFor="email" className="text-blue-600 font-semibold text-sm">
                    Correo Electrónico
                  </Label>
                  <input
                    id="email"
                    type="email"
                    placeholder="Ingresa tu correo electrónico"
                    value={email}
                    onChange={handleEmailChange}
                    className="mt-2 w-full h-12 px-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <Label htmlFor="password" className="text-blue-600 font-semibold text-sm">
                    Contraseña
                  </Label>
                  <input
                    id="password"
                    type="password"
                    placeholder="Ingresa tu contraseña"
                    value={password}
                    onChange={handlePasswordChange}
                    className="mt-2 w-full h-12 px-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember"
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                    />
                    <Label htmlFor="remember" className="text-sm text-gray-700">
                      Recordarme
                    </Label>
                  </div>
                  <button type="button" className="text-sm text-green-600 hover:underline font-medium">
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>

                <Button
                  onClick={handleLogin}
                  className="w-full bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-3 h-12 rounded-lg"
                >
                  Iniciar Sesión en SAEPHONE →
                </Button>

                <div className="relative text-center text-gray-500 text-sm font-medium my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative bg-white px-4">O CONTINÚA CON</div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <Button variant="outline" className="flex items-center justify-center gap-3 py-4 h-14 rounded-2xl">
                    <span className="font-bold text-lg">G</span>
                    <span className="font-medium text-gray-700">Google</span>
                  </Button>
                  <Button variant="outline" className="flex items-center justify-center gap-3 py-4 h-14 rounded-2xl">
                    <span className="font-bold text-lg">f</span>
                    <span className="font-medium text-gray-700">Facebook</span>
                  </Button>
                </div>

                <div className="text-center text-sm text-gray-600 mb-8">
                  ¿Nuevo en SAEPHONE?{" "}
                  <button
                    type="button"
                    onClick={() => setCurrentPage("create-account")}
                    className="text-green-500 hover:text-green-600 font-semibold"
                  >
                    Crear Cuenta
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="bg-blue-50 rounded-2xl p-4 text-center">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-sm font-semibold text-blue-600">Pagos Seguros</div>
                </div>
                <div className="bg-green-50 rounded-2xl p-4 text-center">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CreditCard className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-sm font-semibold text-green-500">Pagos a Meses</div>
                </div>
                <div className="bg-blue-50 rounded-2xl p-4 text-center">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Lock className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-sm font-semibold text-blue-600">Última Tecnología</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (currentPage === "create-account") {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <Background />
        <div className="relative z-10 flex flex-col min-h-screen">
          <Header onBack={() => setCurrentPage("login")} />
          <ProgressSteps />
          <div className="flex-1 flex items-center justify-center p-4">
            <Card className="w-full max-w-lg bg-white shadow-2xl">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <h2 className="text-blue-600 text-2xl font-bold mb-2">Crear Cuenta en SAEPHONE</h2>
                  <p className="text-gray-600">Para comenzar, necesitamos verificar tu número de teléfono</p>
                </div>

                <div className="space-y-6">
                  <div>
                    <Label className="text-blue-600 font-medium">Código de verificación</Label>
                    <div className="flex gap-3 mt-2">
                      <input
                        type="text"
                        placeholder="Ingresa el código que ves a la derecha"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <div className="bg-gray-100 px-4 py-2 rounded border flex items-center">
                        <span className="text-purple-600 font-bold text-lg">2Y22</span>
                      </div>
                      <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">
                        Cambiar código
                      </button>
                    </div>
                  </div>

                  <div>
                    <Label className="text-blue-600 font-medium">Número de teléfono</Label>
                    <div className="flex gap-3 mt-2">
                      <div className="bg-gray-100 px-3 py-2 rounded border">+52</div>
                      <input
                        id="phone"
                        type="tel"
                        placeholder="Ingresa tu número de teléfono"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={() => {
                          const phoneInput = document.getElementById("phone") as HTMLInputElement
                          if (phoneInput && phoneInput.value.trim()) {
                            alert(`Código enviado al número +52 ${phoneInput.value}`)
                          } else {
                            alert("Por favor ingresa tu número de teléfono")
                          }
                        }}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                      >
                        Enviar código
                      </button>
                    </div>
                  </div>

                  <div>
                    <Label className="text-blue-600 font-medium">Introduce el código</Label>
                    <input
                      type="text"
                      placeholder="Código de 4 dígitos"
                      className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      maxLength={4}
                    />
                  </div>

                  <div className="flex gap-3 mt-8">
                    <button
                      onClick={() => setCurrentPage("login")}
                      className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-3 rounded"
                    >
                      ← Regresar
                    </button>
                    <button
                      onClick={() => setCurrentPage("terms")}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded"
                    >
                      Verificar y Continuar →
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  if (currentPage === "terms") {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <Background />
        <div className="relative z-10 flex flex-col min-h-screen">
          <Header onBack={() => setCurrentPage("login")} />
          <ProgressSteps />
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
                        El objeto de los presentes TÉRMINOS Y CONDICIONES es regular el acceso y la utilización del
                        SITIO WEB.
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
                        El usuario se compromete a utilizar el sitio web de manera responsable y conforme a la
                        legislación aplicable.
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
                    />
                    <label htmlFor="privacy" className="text-sm text-gray-700">
                      Acepto el aviso de privacidad de SAEPHONE
                    </label>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setCurrentPage("create-account")}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-3 rounded flex items-center justify-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Regresar
                  </button>
                  <Button
                    onClick={() => setCurrentPage("app-install")}
                    disabled={!acceptTerms || !acceptPrivacy}
                    className="flex-1"
                  >
                    Acepto los términos →
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  if (currentPage === "app-install") {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <Background />
        <div className="relative z-10 flex flex-col min-h-screen">
          <Header onBack={() => setCurrentPage("login")} />
          <ProgressSteps />
          <div className="flex-1 flex items-center justify-center p-4">
            <Card className="w-full max-w-6xl bg-white shadow-2xl">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <h2 className="text-blue-600 text-3xl font-bold mb-4">Instalación de la Aplicación SAEPHONE</h2>
                  <p className="text-gray-600 text-lg">
                    Escanea el código QR para descargar e instalar la aplicación móvil
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">✓</span>
                      </div>
                      <h3 className="text-blue-600 text-xl font-bold">Código QR APK</h3>
                    </div>

                    <p className="text-gray-600 mb-4">Da clic para aumentar el tamaño del código QR</p>

                    <div className="flex justify-center mb-6">
                      <button
                        onClick={() => setQrClicked(!qrClicked)}
                        className={`bg-white border-2 border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-all ${
                          qrClicked ? "scale-150 z-50" : ""
                        }`}
                      >
                        <div className="w-48 h-48 bg-white flex items-center justify-center border-2 border-gray-300">
                          <div className="w-44 h-44 bg-white relative">
                            {/* QR Code Pattern realista */}
                            <div className="absolute inset-0 grid grid-cols-21 grid-rows-21 gap-0">
                              {[
                                1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0,
                                0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 0, 0, 1, 0, 1, 0,
                                1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 1, 1, 0, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1,
                                1, 1, 0, 1, 0, 1, 0, 0, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1,
                                0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1,
                                1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 1,
                                1, 1, 0, 0, 1, 0, 0, 1, 1, 0, 1, 0, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 1, 0, 1, 1, 0,
                                0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 0, 1, 0, 0, 1, 1, 0, 1, 1, 0, 1, 0, 0,
                                1, 0, 0, 1, 0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0,
                                0, 1, 0, 0, 1, 1, 0, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0, 0,
                                0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0,
                                0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 0, 0,
                                1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 1, 1, 0, 0, 1, 0, 1, 1, 1, 0,
                                1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 0, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 1,
                                0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1,
                                1, 1, 1, 1, 1, 1,
                              ].map((cell, index) => (
                                <div key={index} className={`w-full h-full ${cell === 1 ? "bg-black" : "bg-white"}`} />
                              ))}
                            </div>

                            {/* Esquinas de posicionamiento más prominentes */}
                            <div className="absolute top-1 left-1 w-7 h-7 border-2 border-black bg-white">
                              <div className="w-3 h-3 bg-black m-1"></div>
                            </div>
                            <div className="absolute top-1 right-1 w-7 h-7 border-2 border-black bg-white">
                              <div className="w-3 h-3 bg-black m-1"></div>
                            </div>
                            <div className="absolute bottom-1 left-1 w-7 h-7 border-2 border-black bg-white">
                              <div className="w-3 h-3 bg-black m-1"></div>
                            </div>
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                          appInstalled ? "bg-green-500" : appInstalling ? "bg-blue-500" : "bg-gray-400"
                        }`}
                      >
                        <span className="text-white font-bold text-sm">✓</span>
                      </div>
                      <h3 className="text-blue-600 text-xl font-bold">Instalación de la aplicación</h3>
                    </div>

                    <div className="bg-gray-100 rounded-lg p-8 text-center">
                      {appInstalled ? (
                        <>
                          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-white text-2xl">✓</span>
                          </div>
                          <p className="text-green-600 font-semibold mb-4">¡Aplicación instalada correctamente!</p>
                          <p className="text-gray-600 text-sm">La aplicación SAEPHONE está lista para usar</p>
                        </>
                      ) : appInstalling ? (
                        <>
                          <Download className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                          <p className="text-blue-600 font-semibold mb-4">Instalando aplicación...</p>
                          <div className="w-16 h-16 mx-auto flex items-center justify-center">
                            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                          </div>
                        </>
                      ) : (
                        <>
                          <Download className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-600 mb-4">Iniciando instalación automática...</p>
                          <div className="w-16 h-16 mx-auto flex items-center justify-center">
                            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 justify-center mt-8">
                  <button
                    onClick={() => setCurrentPage("terms")}
                    className="px-6 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-3 rounded"
                  >
                    ← Regresar
                  </button>
                  <button
                    onClick={() => setCurrentPage("identity-verification")}
                    className={`px-8 py-3 rounded-lg font-medium transition-colors ${
                      appInstalled
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                    disabled={!appInstalled}
                  >
                    Continuar
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  if (currentPage === "identity-verification") {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <Background />
        <div className="relative z-10 flex flex-col min-h-screen">
          <Header onBack={() => setCurrentPage("login")} />
          <ProgressSteps />
          <div className="flex-1 flex items-center justify-center p-4">
            <Card className="w-full max-w-4xl bg-white shadow-2xl">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <h2 className="text-blue-600 text-3xl font-bold mb-4">Verificación de identidad</h2>
                  <p className="text-gray-600 text-lg">Captura las imágenes solicitadas para verificar tu identidad</p>
                </div>
                {/* Rest of identity verification content would go here */}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  if (currentPage === "payments") {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <Background />
        <div className="relative z-10 min-h-screen flex flex-col">
          <DashboardHeader />
          <div className="flex-1 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-2xl mx-auto">
              <Card className="shadow-2xl">
                <CardContent className="p-8">
                  <div className="text-center mb-8">
                    <h2 className="text-blue-600 text-2xl font-bold mb-2">Procesar Pago</h2>
                    <p className="text-gray-600">Gestiona y registra pagos de clientes de forma segura y sencilla</p>
                  </div>
                  <form className="space-y-6">
                    <div>
                      <Label htmlFor="customer" className="text-blue-600 font-medium">Cliente</Label>
                      <input id="customer" className="w-full mt-1 p-2 border rounded" placeholder="Nombre del cliente o ID" />
                    </div>
                    <div>
                      <Label htmlFor="amount" className="text-blue-600 font-medium">Monto a pagar</Label>
                      <input id="amount" type="number" className="w-full mt-1 p-2 border rounded" placeholder="$0.00" />
                    </div>
                    <div>
                      <Label htmlFor="method" className="text-blue-600 font-medium">Método de pago</Label>
                      <select id="method" className="w-full mt-1 p-2 border rounded">
                        <option>Efectivo</option>
                        <option>Tarjeta</option>
                        <option>Transferencia</option>
                        <option>Otro</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="date" className="text-blue-600 font-medium">Fecha de pago</Label>
                      <input id="date" type="date" className="w-full mt-1 p-2 border rounded" />
                    </div>
                    <Button className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 mt-8">Registrar Pago</Button>
                  </form>
                </CardContent>
              </Card>
              <div className="flex justify-end mt-8">
                <Button onClick={() => setCurrentPage("dashboard")}
                  className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-xl border border-white/20 font-medium transition-all duration-200 hover:scale-105 shadow-lg">
                  ← Volver al Inicio
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (currentPage === "reports") {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <Background />
        <div className="relative z-10 min-h-screen flex flex-col">
          <DashboardHeader />
          <div className="flex-1 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-4xl mx-auto">
              <Card className="shadow-2xl">
                <CardContent className="p-8">
                  <div className="text-center mb-8">
                    <h2 className="text-blue-600 text-2xl font-bold mb-2">Reportes</h2>
                    <p className="text-gray-600">Consulta y descarga reportes detallados de ventas, pagos y rendimiento</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div className="bg-blue-50 rounded-xl p-6 flex flex-col items-center">
                      <BarChart3 className="w-10 h-10 text-blue-600 mb-4" />
                      <h3 className="text-blue-600 font-bold text-lg mb-2">Ventas</h3>
                      <p className="text-gray-700 text-sm mb-4 text-center">Visualiza el total de ventas realizadas en el periodo seleccionado.</p>
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white w-full">Ver Detalles</Button>
                    </div>
                    <div className="bg-green-50 rounded-xl p-6 flex flex-col items-center">
                      <CreditCard className="w-10 h-10 text-green-600 mb-4" />
                      <h3 className="text-green-600 font-bold text-lg mb-2">Pagos</h3>
                      <p className="text-gray-700 text-sm mb-4 text-center">Consulta los pagos recibidos y su desglose por método.</p>
                      <Button className="bg-green-600 hover:bg-green-700 text-white w-full">Ver Detalles</Button>
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row gap-4 mb-4">
                    <div className="flex-1">
                      <Label htmlFor="period" className="text-gray-700 font-medium">Periodo</Label>
                      <select id="period" className="w-full mt-1 p-2 border rounded">
                        <option>Última semana</option>
                        <option>Último mes</option>
                        <option>Último trimestre</option>
                        <option>Personalizado</option>
                      </select>
                    </div>
                    <div className="flex-1">
                      <Label htmlFor="download" className="text-gray-700 font-medium">Descargar reporte</Label>
                      <Button className="w-full bg-purple-500 hover:bg-purple-600 text-white mt-1">Descargar PDF</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <div className="flex justify-end mt-8">
                <Button onClick={() => setCurrentPage("dashboard")}
                  className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-xl border border-white/20 font-medium transition-all duration-200 hover:scale-105 shadow-lg">
                  ← Volver al Inicio
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return null
}
