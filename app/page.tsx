"use client"

import type React from "react"

import { useState, useCallback, useEffect } from "react"
import LoginPage from "@/components/login-page"
import CreateAccountPage from "@/components/create-account-page"
import { translations } from "@/lib/translations"
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
  UserPlus,
  Smartphone,
  BarChart3,
  Settings,
  LogOut,
  RefreshCw,
  Printer,
  FileDown,
  FileText,
  Bell,
  Check,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { QRCodeCanvas } from "qrcode.react"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"

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
  const [language, setLanguage] = useState<"es" | "en">("es")
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
  const [extractedEmail, setExtractedEmail] = useState("")
  const [extractedPhone, setExtractedPhone] = useState("")
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

  const [devicePhoneNumber, setDevicePhoneNumber] = useState("")
  const [connectWifi, setConnectWifi] = useState(false)
  const [userRole, setUserRole] = useState<"admin" | "sales" | "manager" | "super-admin" | null>(null)
  const [qrValue, setQrValue] = useState("")
  const [isQrZoomed, setIsQrZoomed] = useState(false)
  const [isInstalling, setIsInstalling] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    const savedPage = localStorage.getItem("saephone-currentPage") as PageType
    const savedUserRole = localStorage.getItem("saephone-userRole") as "admin" | "sales" | "manager" | "super-admin" | null

    if (savedPage && savedUserRole && savedPage !== "login") {
      setCurrentPage(savedPage)
      setUserRole(savedUserRole)
    }
  }, [])

  useEffect(() => {
    if (currentPage !== "login" && userRole) {
      localStorage.setItem("saephone-currentPage", currentPage)
      localStorage.setItem("saephone-userRole", userRole)
    } else {
      localStorage.removeItem("saephone-currentPage")
      localStorage.removeItem("saephone-userRole")
    }
  }, [currentPage, userRole])

  const handleCreateAccount = () => {
    setCurrentPage("create-account")
  }

  const handleBackToLogin = () => {
    setCurrentPage("login")
  }

  const handleNextFromCreate = () => {
    setCurrentPage("terms")
  }

  const handleLogout = () => {
    setCurrentPage("login")
    setUserRole(null)
  }

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "es" ? "en" : "es"))
  }

  const t = translations[language]

  useEffect(() => {
    if (currentPage === "app-install") {
      setQrValue(`saephone-install-${new Date().getTime()}`)
      setIsInstalling(true)
      const timer = setTimeout(() => {
        setIsInstalling(false)
        setIsInstalled(true)
      }, 45000)
      return () => clearTimeout(timer)
    } else {
      setIsInstalling(false)
      setIsInstalled(false)
    }
  }, [currentPage])

  const handleLogin = (email: string, password: string) => {
    if (email === "admin@test.com" && password === "Testing4dmin") {
      setUserRole("admin")
      setCurrentPage("dashboard")
    } else if (email === "sales@test.com" && password === "Testing5ales") {
      setUserRole("sales")
      setCurrentPage("dashboard")
    } else if (email === "manager@test.com" && password === "Testingmanag3r") {
      setUserRole("manager")
      setCurrentPage("dashboard")
    } else if (email === "superadmin@test.com" && password === "Testing5uper4dmin") {
      setUserRole("super-admin")
      setCurrentPage("dashboard")
    } else {
      alert(t.login_invalidCredentials)
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
        setTimeout(() => {
          setExtractedName("María Rodríguez Hernández")
          setExtractedEmail("maria.perez@email.com")
          setExtractedPhone("+53 738 837 7366")
        }, 1500)
      }
    }, 2000)
  }

  const ContractProgressSteps = () => {
    const pageToStepIndex: Partial<Record<PageType, number>> = {
      "create-account": 0,
      "terms": 1,
      "app-install": 2,
      "identity-verification": 3,
      "device-selection": 4,
      "contract-generation": 5,
      "references": 6,
      "device-configuration": 7,
    }
    const stepIndexToPage: Record<number, PageType> = {
      0: "create-account",
      1: "terms",
      2: "app-install",
      3: "identity-verification",
      4: "device-selection",
      5: "contract-generation",
      6: "references",
      7: "device-configuration",
    }
    const currentStepIndex = pageToStepIndex[currentPage] ?? -1
    const steps = [
      { name: t.progress_step1 },
      { name: t.progress_step2 },
      { name: t.progress_step3 },
      { name: t.progress_step4 },
      { name: t.progress_step5 },
      { name: t.progress_step6 },
      { name: t.progress_step7 },
      { name: t.progress_step8 },
    ]
    return (
      <div className="flex items-center justify-center">
        <div className="flex items-center gap-4">
          {steps.map((step, index) => {
            const isActive = index <= currentStepIndex
            return (
              <div
                key={index}
                className={`flex items-center ${isActive ? "cursor-pointer" : "cursor-default"}`}
                onClick={() => {
                  if (isActive) {
                    setCurrentPage(stepIndexToPage[index])
                  }
                }}
              >
                <div className="flex flex-col items-center text-center w-28">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold transition-colors duration-300 ${
                      isActive ? "bg-green-500" : "bg-white/30"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <span
                    className={`text-xs mt-2 transition-colors duration-300 ${isActive ? "text-white" : "text-white/70"}`}
                  >
                    {step.name}
                  </span>
                </div>
                {index < steps.length - 1 && <div className="w-10 h-0.5 bg-white/30 mx-2"></div>}
              </div>
            )
          })}
        </div>
      </div>
    )
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

  const GlobalLanguageSwitcher = () => (
    <div className="absolute top-6 right-6 z-20">
      <Button
        onClick={toggleLanguage}
        variant="outline"
        className="text-white bg-transparent border-white/50 hover:bg-white/10 hover:text-white"
      >
        {language === "es" ? "EN" : "ES"}
      </Button>
    </div>
  )

  const DashboardHeader = () => (
    <div className="flex items-center justify-between px-6 pt-20 pb-6">
      <div className="flex items-center gap-4">
        <div className="bg-white rounded-2xl p-2 shadow-lg">
          <img src="/saephone-logo.jpg" alt="SAEPHONE Logo" className="w-12 h-12 object-contain" />
        </div>
        <div>
          <h1 className="text-white text-xl font-bold">SAEPHONE</h1>
          <p className="text-white/80 text-sm">{t.dashboard_salesPlatform}</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-white">
          <User className="w-5 h-5" />
          <span>
            {userRole === "admin"
              ? t.dashboard_adminProfile
              : userRole === "sales"
              ? t.dashboard_salesProfile
              : userRole === "manager"
              ? t.dashboard_managerProfile
              : userRole === "super-admin"
              ? t.dashboard_superAdminProfile
              : ""}
          </span>
        </div>
        <Button onClick={handleLogout} variant="destructive" className="flex items-center gap-2">
          <LogOut className="w-5 h-5" />
          <span>{t.dashboard_logout}</span>
        </Button>
      </div>
    </div>
  )

  const FlowHeader = () => (
    <div className="w-full max-w-4xl">
      <div className="flex items-center gap-4">
        <div className="bg-white rounded-2xl p-2 shadow-lg">
          <img src="/saephone-logo.jpg" alt="SAEPHONE Logo" className="w-12 h-12 object-contain" />
        </div>
        <div>
          <h1 className="text-white text-2xl font-bold">SAEPHONE</h1>
          <p className="text-white/80 text-sm">{t.create_headerSubtitle}</p>
        </div>
      </div>
    </div>
  )

  const renderPage = () => {
    switch (currentPage) {
      case "login":
        return <LoginPage onLogin={handleLogin} t={t} />
      case "create-account":
        return (
          <div className="relative z-10 flex flex-col items-center min-h-screen py-8 px-4 sm:px-6 lg:px-8">
            <FlowHeader />
            <div className="w-full max-w-4xl mt-8">
              <ContractProgressSteps />
            </div>
            <CreateAccountPage 
              onBack={() => setCurrentPage("dashboard")} 
              onNext={() => setCurrentPage("terms")} 
              t={t} 
            />
          </div>
        )
      case "terms":
        return (
          <div className="relative z-10 flex flex-col items-center min-h-screen py-8 px-4 sm:px-6 lg:px-8">
            <FlowHeader />
            <div className="w-full max-w-4xl mt-8">
              <ContractProgressSteps />
            </div>
            <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl p-8 md:p-12 mt-8">
              <h2 className="text-center text-gray-500 font-semibold mb-6 text-lg">
                Importante: Los siguientes términos deben ser leídos y completados personalmente por el cliente.
              </h2>
              <div className="border rounded-xl p-6 sm:p-8">
                <div className="flex items-center gap-4 mb-6">
                  <img src="/saephone-logo.jpg" alt="SAEPHONE Logo" className="w-12 h-12" />
                  <h3 className="text-2xl font-bold text-gray-800">Términos y Condiciones</h3>
                </div>
                <div className="prose max-w-none space-y-4 text-gray-600 max-h-64 overflow-y-auto pr-4">
                  <p>
                    Este documento describe los términos y condiciones generales aplicables al uso de los contenidos,
                    productos y servicios ofrecidos a través del sitio www.saephone.com, del cual es titular SAEPHONE
                    México, S. de R.L. de C.V.
                  </p>
                  <h4 className="font-bold">1. OBJETO</h4>
                  <p>
                    El objeto de los presentes TÉRMINOS Y CONDICIONES es regular el acceso y la utilización del SITIO WEB.
                  </p>
                  <h4 className="font-bold">2. EL TITULAR</h4>
                  <p>
                    Se reserva el derecho de realizar cualquier tipo de modificación en el SITIO WEB en cualquier momento
                    y sin previo aviso.
                  </p>
                  <h4 className="font-bold">3. RESPONSABILIDADES</h4>
                  <p>
                    El usuario se compromete a utilizar el sitio web de manera responsable y conforme a la legislación
                    aplicable.
                  </p>
                </div>
                <div className="mt-8 space-y-4">
                  <div className="flex items-center">
                    <Checkbox id="terms" checked={acceptTerms} onCheckedChange={(checked) => setAcceptTerms(Boolean(checked))} />
                    <Label htmlFor="terms" className="ml-3 text-gray-700">
                      Acepto los términos y condiciones de SAEPHONE
                    </Label>
                  </div>
                  <div className="flex items-center">
                    <Checkbox id="privacy" checked={acceptPrivacy} onCheckedChange={(checked) => setAcceptPrivacy(Boolean(checked))} />
                    <Label htmlFor="privacy" className="ml-3 text-gray-700">
                      Acepto el aviso de privacidad de SAEPHONE
                    </Label>
                  </div>
                </div>
              </div>
              <div className="flex justify-between mt-8">
                <Button variant="ghost" onClick={() => setCurrentPage("terms")}>← Regresar</Button>
                <Button onClick={() => setCurrentPage("identity-verification")}>
                  Continuar
                </Button>
              </div>
            </div>
          </div>
        )
      case "app-install":
        return (
          <div className="relative z-10 flex flex-col items-center min-h-screen py-8 px-4 sm:px-6 lg:px-8">
            <FlowHeader />
            <div className="w-full max-w-4xl mt-8">
              <ContractProgressSteps />
            </div>
            <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl p-8 md:p-12 mt-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-blue-600">{t.appInstall_title}</h2>
                <p className="text-gray-600 mt-2">{t.appInstall_subtitle}</p>
              </div>
              <div className="grid md:grid-cols-2 gap-8 mt-8 items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{t.appInstall_qrTitle}</h3>
                  <p className="text-sm text-gray-500 mt-2 mb-4">{t.appInstall_qrSubtitle}</p>
                  <button className="block w-full" onClick={() => setIsQrZoomed(true)}>
                    <QRCodeCanvas value={qrValue} size={192} className="mx-auto border-2 rounded-lg p-2" />
                  </button>
                </div>
                <div className="mt-6 md:mt-0">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">{t.appInstall_statusTitle}</h3>
                  <div className="bg-gray-50 rounded-lg p-6 text-center h-40 flex flex-col justify-center">
                    {isInstalling && (
                      <div>
                        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
                        <p className="text-blue-600">Instalando aplicación...</p>
                      </div>
                    )}
                    {isInstalled && (
                      <>
                        <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Check className="w-7 h-7 text-white" />
                        </div>
                        <h4 className="font-semibold text-green-600">{t.appInstall_successTitle}</h4>
                        <p className="text-sm text-gray-600 mt-1">{t.appInstall_successSubtitle}</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex justify-between mt-12">
                <Button variant="ghost" onClick={() => setCurrentPage("terms")} className="text-gray-600">
                  {t.appInstall_backBtn}
                </Button>
                <Button onClick={() => setCurrentPage("identity-verification")} className="bg-blue-600 text-white hover:bg-blue-700">
                  {t.appInstall_continueBtn}
                </Button>
              </div>
            </div>
            {isQrZoomed && (
              <div
                className="fixed inset-0 z-50 flex cursor-pointer items-center justify-center bg-black bg-opacity-75"
                onClick={() => setIsQrZoomed(false)}
              >
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="cursor-default rounded-lg bg-white p-4"
                >
                  <QRCodeCanvas value={qrValue} size={384} />
                </div>
              </div>
            )}
          </div>
        )
      case "identity-verification":
        return (
          <div className="relative z-10 flex flex-col items-center min-h-screen py-8 px-4 sm:px-6 lg:px-8">
            <FlowHeader />
            <div className="w-full max-w-4xl mt-8">
              <ContractProgressSteps />
            </div>
            <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl p-8 md:p-12 mt-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-blue-600">{t.identityVerification_title}</h2>
                <p className="text-gray-600 mt-2">{t.identityVerification_subtitle}</p>
              </div>

              <div className="mt-8 space-y-8">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <Check className="w-6 h-6 text-green-500" />
                    <h3 className="text-lg font-semibold text-gray-800">{t.identityVerification_idCardTitle}</h3>
                  </div>
                  <div className="grid md:grid-cols-2 gap-8">
                    <button
                      onClick={() => handleCapture("front")}
                      className={`relative w-full h-48 rounded-lg flex items-center justify-center transition-all duration-300 ${
                        frontIdCaptured ? "bg-pink-100" : "bg-gray-100 hover:bg-gray-200"
                      }`}
                    >
                      {isCapturing === "front" && <Loader2 className="w-8 h-8 animate-spin text-pink-500" />}
                      {!isCapturing && frontIdCaptured && (
                        <>
                          <div className="absolute top-2 right-2 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                          <p className="text-green-600 font-semibold">{t.identityVerification_frontId}</p>
                        </>
                      )}
                      {!isCapturing && !frontIdCaptured && (
                        <div className="w-12 h-12 rounded-full border-2 border-dashed border-red-400" />
                      )}
                    </button>
                    <button
                      onClick={() => handleCapture("back")}
                      className={`relative w-full h-48 rounded-lg flex items-center justify-center transition-all duration-300 ${
                        backIdCaptured ? "bg-blue-100" : "bg-gray-100 hover:bg-gray-200"
                      }`}
                    >
                      {isCapturing === "back" && <Loader2 className="w-8 h-8 animate-spin text-blue-500" />}
                      {!isCapturing && backIdCaptured && (
                        <>
                          <div className="absolute top-2 right-2 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                          <p className="text-green-600 font-semibold">{t.identityVerification_backId}</p>
                        </>
                      )}
                      {!isCapturing && !backIdCaptured && (
                        <div className="w-12 h-12 rounded-full border-2 border-dashed border-blue-400" />
                      )}
                    </button>
                  </div>
                </div>

                {extractedName && (
                  <div className="bg-green-50 border-l-4 border-green-400 p-4">
                    <div className="flex items-center gap-3">
                      <Check className="w-6 h-6 text-green-500" />
                      <p className="text-gray-800">
                        <span className="font-semibold">{t.identityVerification_extractedDataTitle}</span> {extractedName}
                      </p>
                    </div>
                  </div>
                )}

                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <Check className="w-6 h-6 text-green-500" />
                    <h3 className="text-lg font-semibold text-gray-800">{t.identityVerification_selfieTitle}</h3>
                  </div>
                  <div className="text-center">
                    <button
                      onClick={() => handleCapture("selfie")}
                      className={`relative w-48 h-48 rounded-full mx-auto flex items-center justify-center transition-all duration-300 ${
                        selfieCaptured ? "bg-yellow-100" : "bg-gray-100 hover:bg-gray-200"
                      }`}
                    >
                      {isCapturing === "selfie" && <Loader2 className="w-12 h-12 animate-spin text-yellow-500" />}
                      {!isCapturing && selfieCaptured && (
                        <>
                          <div className="absolute top-2 right-2 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                          <User className="w-16 h-16 text-red-400" />
                        </>
                      )}
                      {!isCapturing && !selfieCaptured && <User className="w-16 h-16 text-red-400" />}
                    </button>
                    {selfieCaptured && (
                      <p className="mt-4 text-green-600 font-semibold">{t.identityVerification_selfieSuccess}</p>
                    )}
                  </div>
                </div>

                {userRegistered && (
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                    <div className="flex items-center gap-3">
                      <Check className="w-6 h-6 text-blue-500" />
                      <p className="text-gray-800 font-semibold">{t.identityVerification_registrationSuccess}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-between mt-12">
                <Button onClick={() => setCurrentPage("identity-verification")}>← Regresar</Button>
                <Button onClick={() => setCurrentPage("contract-generation")}>
                  Continuar →
                </Button>
              </div>
            </div>
          </div>
        )
      case "dashboard":
        return (
          <div className="relative z-10 flex flex-col min-h-screen">
            <DashboardHeader />
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="w-full max-w-6xl">
                <div className="text-center mb-12">
                  <h1 className="text-5xl font-bold text-white mb-3">{t.dashboard_mainPanel}</h1>
                  <p className="text-white/80 text-lg">{t.dashboard_manage}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {(userRole === "admin" || userRole === "super-admin") && (
                    <Card className="bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-2xl">
                      <CardContent className="p-8 flex flex-col h-full">
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-4">
                            <h3 className="text-2xl font-bold text-teal-600">{t.dashboard_createAccount}</h3>
                            <div className="p-2 bg-teal-100 rounded-lg">
                              <UserPlus className="w-6 h-6 text-teal-500" />
                            </div>
                          </div>
                          <p className="text-gray-600 mb-6">{t.dashboard_createAccountDesc}</p>
                        </div>
                        <Button onClick={() => setCurrentPage("create-account")} className="bg-teal-500 hover:bg-teal-600 text-white font-semibold py-3 px-6 rounded-lg">
                          {t.dashboard_createAccountBtn}
                        </Button>
                      </CardContent>
                    </Card>
                  )}

                  {(userRole === "admin" || userRole === "super-admin") && (
                    <Card className="bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-2xl">
                      <CardContent className="p-8 flex flex-col h-full">
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-4">
                            <h3 className="text-2xl font-bold text-blue-600">{t.dashboard_processPayments}</h3>
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <FileText className="w-6 h-6 text-blue-500" />
                            </div>
                          </div>
                          <p className="text-gray-600 mb-6">{t.dashboard_processPaymentsDesc}</p>
                        </div>
                        <Button onClick={() => setCurrentPage("payments")} className="bg-blue-600 hover:bg-blue-700 font-semibold py-3 px-6 rounded-lg">
                          {t.dashboard_processPaymentBtn}
                        </Button>
                      </CardContent>
                    </Card>
                  )}

                  {(userRole === "sales" || userRole === "super-admin") && (
                    <Card className="bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-2xl">
                      <CardContent className="p-8 flex flex-col h-full">
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-4">
                            <h3 className="text-2xl font-bold text-green-600">{t.dashboard_sellDevices}</h3>
                            <div className="p-2 bg-green-100 rounded-lg">
                              <Smartphone className="w-6 h-6 text-green-500" />
                            </div>
                          </div>
                          <p className="text-gray-600 mb-6">{t.dashboard_sellDevicesDesc}</p>
                        </div>
                        <Button onClick={() => setCurrentPage("create-account")} className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg">
                          {t.dashboard_newSaleBtn}
                        </Button>
                      </CardContent>
                    </Card>
                  )}

                  {(userRole === "admin" || userRole === "manager" || userRole === "super-admin") && (
                    <Card className="bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-2xl">
                      <CardContent className="p-8 flex flex-col h-full">
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-4">
                            <h3 className="text-2xl font-bold text-purple-600">{t.dashboard_reports}</h3>
                            <div className="p-2 bg-purple-100 rounded-lg">
                              <BarChart3 className="w-6 h-6 text-purple-500" />
                            </div>
                          </div>
                          <p className="text-gray-600 mb-6">{t.dashboard_reportsDesc}</p>
                        </div>
                        <Button onClick={() => setCurrentPage("reports")} className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg">
                          {t.dashboard_viewReportsBtn}
                        </Button>
                      </CardContent>
                    </Card>
                  )}

                  {(userRole === "admin" || userRole === "super-admin") && (
                    <Card className="bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-2xl">
                      <CardContent className="p-8 flex flex-col h-full">
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-4">
                            <h3 className="text-2xl font-bold text-gray-700">{t.dashboard_config}</h3>
                            <div className="p-2 bg-gray-200 rounded-lg">
                              <Settings className="w-6 h-6 text-gray-700" />
                            </div>
                          </div>
                          <p className="text-gray-600 mb-6">{t.dashboard_configDesc}</p>
                        </div>
                        <Button onClick={() => setCurrentPage("settings")} variant="outline" className="border-gray-400 text-gray-700 hover:bg-gray-100 font-semibold py-3 px-6 rounded-lg">
                          {t.dashboard_goToConfigBtn}
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </div>
          </div>
        )
      case "payments":
        return (
          <div className="relative z-10 min-h-screen flex flex-col">
            <DashboardHeader />
            <div className="flex-1 flex flex-col items-center justify-center p-4">
              <div className="w-full max-w-lg">
                <Card className="shadow-2xl">
                  <CardContent className="p-8">
                    <div className="text-center mb-8">
                      <h2 className="text-green-600 text-2xl font-bold mb-2">{t.payments_title}</h2>
                      <p className="text-gray-600">{t.payments_subtitle}</p>
                    </div>
                    <div className="space-y-6">
                      <div>
                        <Label htmlFor="client" className="text-gray-700">
                          {t.payments_clientLabel}
                        </Label>
                        <Input id="client" placeholder={t.payments_clientPlaceholder} className="w-full mt-1 p-2 border rounded" />
                      </div>
                      <div>
                        <Label htmlFor="amount" className="text-gray-700">
                          {t.payments_amountLabel}
                        </Label>
                        <Input id="amount" placeholder={t.payments_amountPlaceholder} className="w-full mt-1 p-2 border rounded" />
                      </div>
                      <div>
                        <Label htmlFor="paymentMethod" className="text-gray-700">
                          {t.payments_paymentMethodLabel}
                        </Label>
                        <Select>
                          <SelectTrigger className="w-full mt-1 p-2 border rounded">
                            <SelectValue placeholder={t.payments_methodOptions.cash} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="cash">{t.payments_methodOptions.cash}</SelectItem>
                            <SelectItem value="card">{t.payments_methodOptions.card}</SelectItem>
                            <SelectItem value="transfer">{t.payments_methodOptions.transfer}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="paymentDate" className="text-gray-700">
                          {t.payments_paymentDateLabel}
                        </Label>
                        <Input id="paymentDate" placeholder={t.payments_datePlaceholder} className="w-full mt-1 p-2 border rounded" />
                      </div>
                    </div>
                    <div className="mt-8 flex gap-4">
                      <Button
                        onClick={() => setCurrentPage("dashboard")}
                        className="flex-1 rounded-lg bg-gray-200 py-3 font-medium text-gray-700 hover:bg-gray-300"
                      >
                        ← {t.back_to_main_panel}
                      </Button>
                      <Button className="flex-1 bg-green-500 py-3 font-bold text-white hover:bg-green-600">
                        {t.payments_registerPaymentBtn}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )
      case "reports":
        return (
          <div className="relative z-10 min-h-screen flex flex-col">
            <DashboardHeader />
            <div className="flex-1 flex flex-col items-center justify-center p-4">
              <div className="w-full max-w-4xl mx-auto">
                <Card className="shadow-2xl">
                  <CardContent className="p-8">
                    <div className="text-center mb-8">
                      <h2 className="text-blue-600 text-2xl font-bold mb-2">{t.reports_title}</h2>
                      <p className="text-gray-600">{t.reports_subtitle}</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                      <div className="bg-blue-50 rounded-xl p-6 flex flex-col items-center">
                        <BarChart3 className="w-10 h-10 text-blue-600 mb-4" />
                        <h3 className="text-blue-600 font-bold text-lg mb-2">{t.reports_sales}</h3>
                        <p className="text-gray-700 text-sm mb-4 text-center">{t.reports_salesDesc}</p>
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white w-full">{t.reports_viewDetails}</Button>
                      </div>
                      <div className="bg-green-50 rounded-xl p-6 flex flex-col items-center">
                        <CreditCard className="w-10 h-10 text-green-600 mb-4" />
                        <h3 className="text-green-600 font-bold text-lg mb-2">{t.reports_payments}</h3>
                        <p className="text-gray-700 text-sm mb-4 text-center">{t.reports_paymentsDesc}</p>
                        <Button className="bg-green-600 hover:bg-green-700 text-white w-full">{t.reports_viewDetails}</Button>
                      </div>
                    </div>
                    <div className="flex flex-col md:flex-row gap-4 mb-4">
                      <div className="flex-1">
                        <Label htmlFor="period" className="text-gray-700 font-medium">{t.reports_period}</Label>
                        <select id="period" className="w-full mt-1 p-2 border rounded">
                          <option>{t.reports_periodOptions.week}</option>
                          <option>{t.reports_periodOptions.month}</option>
                          <option>{t.reports_periodOptions.quarter}</option>
                          <option>{t.reports_periodOptions.custom}</option>
                        </select>
                      </div>
                      <div className="flex-1">
                        <Label htmlFor="download" className="text-gray-700 font-medium">{t.reports_download}</Label>
                        <Button className="w-full bg-purple-500 hover:bg-purple-600 text-white mt-1">{t.reports_downloadBtn}</Button>
                      </div>
                    </div>
                    <div className="flex justify-start mt-8">
                      <Button
                        onClick={() => setCurrentPage("dashboard")}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-3 px-6 rounded-lg"
                      >
                        ← {t.back_to_main_panel}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )
      case "settings":
        return (
          <div className="relative z-10 min-h-screen flex flex-col">
            <DashboardHeader />
            <div className="flex-1 flex flex-col items-center justify-center p-4">
              <div className="w-full max-w-6xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Perfil de Usuario */}
                  <Card className="shadow-2xl">
                    <CardContent className="p-8">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-blue-600 text-xl font-bold">{t.settings_userProfile}</h3>
                      </div>
                      <form className="space-y-4">
                        <div>
                          <Label htmlFor="fullName" className="text-blue-600 font-medium">{t.settings_fullName}</Label>
                          <input
                            id="fullName"
                            className="w-full mt-1 p-2 border rounded bg-gray-50"
                            value={extractedName || "Juan Pérez González"}
                            readOnly
                          />
                        </div>
                        <div>
                          <Label htmlFor="email" className="text-blue-600 font-medium">{t.settings_email}</Label>
                          <input
                            id="email"
                            className="w-full mt-1 p-2 border rounded bg-gray-50"
                            value={extractedEmail || "juan.perez@email.com"}
                            readOnly
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone" className="text-blue-600 font-medium">{t.settings_phone}</Label>
                          <input
                            id="phone"
                            className="w-full mt-1 p-2 border rounded bg-gray-50"
                            value={extractedPhone || "+52 834 123 4567"}
                            readOnly
                          />
                        </div>
                        <div className="flex gap-2 mt-4">
                          <Button className="bg-blue-600 hover:bg-blue-700 text-white">{t.settings_save}</Button>
                          <Button variant="outline">{t.settings_cancel}</Button>
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
                        <h3 className="text-orange-500 text-xl font-bold">{t.settings_security}</h3>
                      </div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="font-medium text-gray-700">{t.settings_2fa}</span>
                        <input type="checkbox" className="accent-green-500 w-6 h-6" />
                      </div>
                      <Button className="mb-4 w-full bg-gray-200 hover:bg-gray-300 text-gray-700">{t.settings_changePass}</Button>
                      <Button className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700">{t.settings_sessions}</Button>
                    </CardContent>
                  </Card>
                  {/* Notificaciones */}
                  <Card className="shadow-2xl">
                    <CardContent className="p-8">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                          <Bell className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-yellow-500 text-xl font-bold">{t.settings_notifications}</h3>
                      </div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="font-medium text-gray-700">{t.settings_emailNotif}</span>
                        <input type="checkbox" className="accent-green-500 w-6 h-6" />
                      </div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="font-medium text-gray-700">{t.settings_smsNotif}</span>
                        <input type="checkbox" className="accent-green-500 w-6 h-6" />
                      </div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="font-medium text-gray-700">{t.settings_pushNotif}</span>
                        <input type="checkbox" className="accent-green-500 w-6 h-6" />
                      </div>
                      <div className="mb-4">
                        <Label htmlFor="reportFrequency" className="font-medium text-gray-700">{t.settings_reportFreq}</Label>
                        <select id="reportFrequency" className="w-full mt-1 p-2 border rounded">
                          <option>{t.settings_freqOptions.weekly}</option>
                          <option>{t.settings_freqOptions.monthly}</option>
                          <option>{t.settings_freqOptions.quarterly}</option>
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
                        <h3 className="text-purple-500 text-xl font-bold">{t.settings_system}</h3>
                      </div>
                      <div className="mb-4">
                        <Label htmlFor="language" className="font-medium text-gray-700">{t.settings_language}</Label>
                        <select id="language" className="w-full mt-1 p-2 border rounded">
                          <option>{t.settings_langOptions.es}</option>
                          <option>{t.settings_langOptions.en}</option>
                        </select>
                      </div>
                      <div className="mb-4">
                        <Label htmlFor="timezone" className="font-medium text-gray-700">{t.settings_timezone}</Label>
                        <select id="timezone" className="w-full mt-1 p-2 border rounded">
                          <option>{t.settings_tzOptions.cst}</option>
                          <option>{t.settings_tzOptions.pst}</option>
                        </select>
                      </div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="font-medium text-gray-700">{t.settings_dark_mode}</span>
                        <input type="checkbox" className="accent-green-500 w-6 h-6" />
                      </div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="font-medium text-gray-700">{t.settings_auto_backup}</span>
                        <input type="checkbox" className="accent-green-500 w-6 h-6" />
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Button className="bg-purple-500 hover:bg-purple-600 text-white">{t.settings_apply}</Button>
                        <Button variant="outline">{t.settings_reset}</Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <div className="flex justify-start w-full mt-8">
                  <Button
                    onClick={() => setCurrentPage("dashboard")}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-3 px-6 rounded-lg"
                  >
                    ← {t.back_to_main_panel}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )
      case "device-selection": {
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
        }
        const updatePrice = () => {
          if (selectedModel && selectedCapacity && prices[selectedModel] && prices[selectedModel][selectedCapacity]) {
            setDevicePrice(prices[selectedModel][selectedCapacity])
          } else {
            setDevicePrice(0)
          }
        }
        return (
          <div className="relative z-10 flex flex-col min-h-screen">
            <DashboardHeader />
            <ContractProgressSteps />
            <div className="flex-1 flex items-center justify-center p-4">
              <Card className="w-full max-w-4xl bg-white shadow-2xl">
                <CardContent className="p-8">
                  <div className="text-center mb-8">
                    <h2 className="text-blue-600 text-3xl font-bold mb-4">{t.deviceSelection_title}</h2>
                    <p className="text-gray-600 text-lg">{t.deviceSelection_subtitle}</p>
                  </div>
                  <div className="space-y-8">
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center"><span className="text-white font-bold text-sm">1</span></div>
                        <h3 className="text-blue-600 text-xl font-bold">{t.deviceSelection_paymentMethod}</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <button onClick={() => setPaymentMethod("financiado")} className={`p-4 border-2 rounded-lg text-center transition-all ${paymentMethod === "financiado" ? "border-green-500 bg-green-50" : "border-gray-200 hover:border-gray-300"}`}>
                          <div className="text-lg font-semibold text-gray-800">{t.deviceSelection_financed}</div>
                          <div className="text-sm text-gray-600 mt-1">{t.deviceSelection_financedDesc}</div>
                        </button>
                        <button onClick={() => setPaymentMethod("contado")} className={`p-4 border-2 rounded-lg text-center transition-all ${paymentMethod === "contado" ? "border-green-500 bg-green-50" : "border-gray-200 hover:border-gray-300"}`}>
                          <div className="text-lg font-semibold text-gray-800">{t.deviceSelection_cash}</div>
                          <div className="text-sm text-gray-600 mt-1">{t.deviceSelection_cashDesc}</div>
                        </button>
                      </div>
                      {!paymentMethod && <p className="text-red-500 text-sm">{t.deviceSelection_selectPaymentMethod}</p>}
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center"><span className="text-white font-bold text-sm">2</span></div>
                        <h3 className="text-blue-600 text-xl font-bold">{t.deviceSelection_model}</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div>
                          <label className="block text-blue-600 font-medium mb-2">{t.deviceSelection_brand}</label>
                          <select value={selectedBrand} onChange={e => { setSelectedBrand(e.target.value); setSelectedModel(""); setSelectedCapacity(""); setDevicePrice(0); }} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="">{t.deviceSelection_selectBrand}</option>
                            {brands.map(brand => <option key={brand} value={brand}>{brand}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-blue-600 font-medium mb-2">{t.deviceSelection_model}</label>
                          <select value={selectedModel} onChange={e => { setSelectedModel(e.target.value); setSelectedCapacity(""); setDevicePrice(0); }} disabled={!selectedBrand} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100">
                            <option value="">{t.deviceSelection_selectModel}</option>
                            {selectedBrand && models[selectedBrand] && models[selectedBrand].map(model => <option key={model} value={model}>{model}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-blue-600 font-medium mb-2">{t.deviceSelection_capacity}</label>
                          <select value={selectedCapacity} onChange={e => { setSelectedCapacity(e.target.value); setTimeout(updatePrice, 100); }} disabled={!selectedModel} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100">
                            <option value="">{t.deviceSelection_selectCapacity}</option>
                            {capacities.map(capacity => <option key={capacity} value={capacity}>{capacity}</option>)}
                          </select>
                        </div>
                      </div>
                      {!selectedBrand && <p className="text-red-500 text-sm mb-4">{t.deviceSelection_selectBrandPrompt}</p>}
                      <div>
                        <label className="block text-blue-600 font-medium mb-2">{t.deviceSelection_devicePrice}</label>
                        <div className="flex items-center">
                          <span className="bg-gray-100 px-4 py-3 border border-r-0 border-gray-300 rounded-l-lg text-gray-700 font-medium">$</span>
                          <input type="number" value={devicePrice} onChange={e => setDevicePrice(Number(e.target.value) || 0)} placeholder="Ingresa el precio del dispositivo" className="flex-1 p-3 border border-gray-300 rounded-r-lg text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{t.deviceSelection_priceDisclaimer}</p>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center"><span className="text-white font-bold text-sm">3</span></div>
                        <h3 className="text-blue-600 text-xl font-bold">{t.deviceSelection_financingPlan}</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <button onClick={() => setSelectedFinancing("13")} className={`p-6 border-2 rounded-lg text-center transition-all ${selectedFinancing === "13" ? "border-green-500 bg-green-50" : "border-gray-200 hover:border-gray-300"}`}>
                          <div className="text-xl font-bold text-blue-600 mb-2">13 {t.deviceSelection_weeks}</div>
                          <div className="text-sm text-gray-600 mb-2">SMES</div>
                          {devicePrice > 0 && (<>
                            <div className="text-2xl font-bold text-green-600 mb-1">${Math.round(devicePrice / 13).toLocaleString()}</div>
                            <div className="text-sm text-gray-600 mb-4">{t.deviceSelection_perWeek}</div>
                            <div className="text-sm text-gray-700 mb-1">{t.deviceSelection_initialPayment}: <span className="font-semibold">${Math.round(devicePrice * 0.2).toLocaleString()}</span></div>
                            <div className="text-sm text-gray-700">{t.deviceSelection_finalPrice}: <span className="font-semibold">${Math.round(devicePrice * 1.15).toLocaleString()}</span></div>
                          </>)}
                        </button>
                        <button onClick={() => setSelectedFinancing("26")} className={`p-6 border-2 rounded-lg text-center transition-all ${selectedFinancing === "26" ? "border-green-500 bg-green-50" : "border-gray-200 hover:border-gray-300"}`}>
                          <div className="text-xl font-bold text-blue-600 mb-2">26 {t.deviceSelection_weeks}</div>
                          <div className="text-sm text-gray-600 mb-2">SMES</div>
                          {devicePrice > 0 && (<>
                            <div className="text-2xl font-bold text-green-600 mb-1">${Math.round(devicePrice / 26).toLocaleString()}</div>
                            <div className="text-sm text-gray-600 mb-4">{t.deviceSelection_perWeek}</div>
                            <div className="text-sm text-gray-700 mb-1">{t.deviceSelection_initialPayment}: <span className="font-semibold">${Math.round(devicePrice * 0.2).toLocaleString()}</span></div>
                            <div className="text-sm text-gray-700">{t.deviceSelection_finalPrice}: <span className="font-semibold">${Math.round(devicePrice * 1.25).toLocaleString()}</span></div>
                          </>)}
                        </button>
                        <button onClick={() => setSelectedFinancing("39")} className={`p-6 border-2 rounded-lg text-center transition-all ${selectedFinancing === "39" ? "border-green-500 bg-green-50" : "border-gray-200 hover:border-gray-300"}`}>
                          <div className="text-xl font-bold text-blue-600 mb-2">39 {t.deviceSelection_weeks}</div>
                          <div className="text-sm text-gray-600 mb-2">SMES</div>
                          {devicePrice > 0 && (<>
                            <div className="text-2xl font-bold text-green-600 mb-1">${Math.round(devicePrice / 39).toLocaleString()}</div>
                            <div className="text-sm text-gray-600 mb-4">{t.deviceSelection_perWeek}</div>
                            <div className="text-sm text-gray-700 mb-1">{t.deviceSelection_initialPayment}: <span className="font-semibold">${Math.round(devicePrice * 0.2).toLocaleString()}</span></div>
                            <div className="text-sm text-gray-700">{t.deviceSelection_finalPrice}: <span className="font-semibold">${Math.round(devicePrice * 1.35).toLocaleString()}</span></div>
                          </>)}
                        </button>
                      </div>
                    </div>
                    <div className="flex gap-4 justify-center mt-8">
                      <Button onClick={() => setCurrentPage("dashboard")} className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-3 px-6 rounded-lg">← {t.back_to_main_panel}</Button>
                      <Button onClick={() => { if (paymentMethod && selectedBrand && selectedModel && selectedCapacity && selectedFinancing) { setCurrentPage("contract-generation"); } else { alert(t.deviceSelection_completeAllFields); } }} className={`px-8 py-3 rounded-lg font-medium transition-colors ${paymentMethod && selectedBrand && selectedModel && selectedCapacity && selectedFinancing ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`} disabled={!(paymentMethod && selectedBrand && selectedModel && selectedCapacity && selectedFinancing)}>{t.deviceSelection_continue} →</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )
      }
      case "contract-generation": {
        const generatePDF = async () => {
          const element = document.getElementById("contract-content")
          if (!element) return
          
          const canvas = await html2canvas(element, {
            scale: 2,
            useCORS: true,
            allowTaint: true
          })
          
          const imgData = canvas.toDataURL("image/png")
          const pdf = new jsPDF("p", "mm", "a4")
          const imgWidth = 210
          const pageHeight = 295
          const imgHeight = (canvas.height * imgWidth) / canvas.width
          let heightLeft = imgHeight
          
          let position = 0
          
          pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
          heightLeft -= pageHeight
          
          while (heightLeft >= 0) {
            position = heightLeft - imgHeight
            pdf.addPage()
            pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
            heightLeft -= pageHeight
          }
          
          pdf.save(`contrato-${selectedBrand}-${selectedModel}.pdf`)
        }
        
        const contrato = (
          <div id="contract-content" className="space-y-6 text-sm text-gray-700">
            <div className="text-center border-b-2 border-gray-300 pb-4">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">CONTRATO DE VENTA EN PARCIALIDADES</h2>
              <p className="text-gray-600">SAEPHONE México, S. de R.L. de C.V.</p>
              <p className="text-gray-600">Fecha: {new Date().toLocaleDateString('es-ES')}</p>
            </div>
            
            <div>
              <h3 className="font-bold text-lg text-gray-800 mb-3">1. DATOS DEL PROVEEDOR</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p><strong>Razón Social:</strong> SAEPHONE México, S. de R.L. de C.V.</p>
                <p><strong>RFC:</strong> SAE-123456-ABC</p>
                <p><strong>Domicilio:</strong> Av. Insurgentes Sur 1234, Col. Del Valle, CDMX</p>
                <p><strong>Teléfono:</strong> (55) 1234-5678</p>
                <p><strong>Email:</strong> contacto@saephone.com</p>
              </div>
            </div>
            
            <div>
              <h3 className="font-bold text-lg text-gray-800 mb-3">2. DATOS DEL CLIENTE</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p><strong>Nombre Completo:</strong> {extractedName || "NOMBRE DEL CLIENTE"}</p>
                <p><strong>Email:</strong> {extractedEmail || "correo@cliente.com"}</p>
                <p><strong>Teléfono:</strong> {extractedPhone || "55-1234-5678"}</p>
                <p><strong>Domicilio:</strong> Calle del Cliente 123, Col. Ciudad</p>
              </div>
            </div>
            
            <div>
              <h3 className="font-bold text-lg text-gray-800 mb-3">3. DISPOSITIVO Y PLAN DE FINANCIAMIENTO</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p><strong>Marca:</strong> {selectedBrand}</p>
                <p><strong>Modelo:</strong> {selectedModel}</p>
                <p><strong>Capacidad:</strong> {selectedCapacity}</p>
                <p><strong>Precio Original:</strong> ${devicePrice.toLocaleString()}</p>
                <p><strong>Plan de Financiamiento:</strong> {selectedFinancing} semanas</p>
                <p><strong>Pago Semanal:</strong> ${Math.round(devicePrice / parseInt(selectedFinancing)).toLocaleString()}</p>
                <p><strong>Pago Inicial:</strong> ${Math.round(devicePrice * 0.2).toLocaleString()}</p>
                <p><strong>Precio Final:</strong> ${Math.round(devicePrice * (selectedFinancing === "13" ? 1.15 : selectedFinancing === "26" ? 1.25 : 1.35)).toLocaleString()}</p>
              </div>
            </div>
            
            <div>
              <h3 className="font-bold text-lg text-gray-800 mb-3">4. CONDICIONES DEL CONTRATO</h3>
              <div className="space-y-2">
                <p><strong>4.1.</strong> El cliente se compromete a realizar los pagos semanales en las fechas establecidas.</p>
                <p><strong>4.2.</strong> En caso de atraso en los pagos, el dispositivo será bloqueado automáticamente.</p>
                <p><strong>4.3.</strong> El cliente puede realizar pagos anticipados sin penalización.</p>
                <p><strong>4.4.</strong> Una vez completado el pago total, el dispositivo será desbloqueado permanentemente.</p>
                <p><strong>4.5.</strong> El cliente acepta las condiciones de uso y políticas de privacidad de SAEPHONE.</p>
              </div>
            </div>
            
            <div className="border-t-2 border-gray-300 pt-4">
              <p className="text-center text-gray-600">
                <strong>Este contrato es válido desde la fecha de firma y se rige por las leyes mexicanas.</strong>
              </p>
            </div>
          </div>
        )
        
        return (
          <div className="relative z-10 flex flex-col min-h-screen">
            <DashboardHeader />
            <ContractProgressSteps />
            <div className="flex-1 flex items-center justify-center p-4">
              <Card className="w-full max-w-4xl bg-white shadow-2xl">
                <CardContent className="p-8">
                  <div className="text-center mb-8">
                    <h2 className="text-blue-600 text-3xl font-bold mb-4">Generación del Contrato</h2>
                    <p className="text-gray-600 text-lg">Escanea el código QR para que el cliente firme el contrato</p>
                  </div>
                  <div className="space-y-8">
                    {/* Sección 1: Contrato */}
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-sm">1</span>
                        </div>
                        <h3 className="text-blue-600 text-xl font-bold">Contrato de Financiamiento</h3>
                      </div>
                      <div className="border rounded-lg p-6 bg-gray-50">
                        <div className="text-center mb-4">
                          <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center mx-auto mb-3">
                            <FileText className="w-6 h-6 text-gray-500" />
                          </div>
                          <h4 className="text-gray-800 text-lg font-bold">CONTRATO DE VENTA EN PARCIALIDADES</h4>
                        </div>
                        <div className="max-h-64 overflow-y-auto pr-2">
                          {contrato}
                        </div>
                      </div>
                    </div>

                    {/* Sección 2: Código QR */}
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-sm">2</span>
                        </div>
                        <h3 className="text-blue-600 text-xl font-bold">Firma Digital del Cliente</h3>
                      </div>
                      <div className="text-center">
                        <p className="text-gray-600 mb-4">Haz click sobre el código para ampliarlo</p>
                        <div className="flex justify-center mb-4">
                          <button 
                            onClick={() => setIsQrZoomed(true)} 
                            className="bg-white border-2 border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-all"
                          >
                            <QRCodeCanvas 
                              value={`contrato-${selectedBrand}-${selectedModel}-${selectedCapacity}-${devicePrice}-${selectedFinancing}`} 
                              size={160} 
                              className="mx-auto" 
                            />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Sección 3: Acciones */}
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-sm">3</span>
                        </div>
                        <h3 className="text-blue-600 text-xl font-bold">Acciones Disponibles</h3>
                      </div>
                      <div className="flex justify-center mb-6">
                        <Button 
                          onClick={generatePDF} 
                          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg flex items-center gap-2"
                        >
                          <Download className="w-5 h-5" />
                          Descargar Contrato PDF
                        </Button>
                      </div>
                    </div>

                    {/* Botones de navegación */}
                    <div className="flex gap-4 justify-center mt-8">
                      <Button onClick={() => setCurrentPage("device-selection")}>← Regresar</Button>
                      <Button onClick={() => setCurrentPage("references")}>
                        Continuar →
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Modal de QR ampliado */}
            {isQrZoomed && (
              <div 
                className="fixed inset-0 z-50 flex cursor-pointer items-center justify-center bg-black bg-opacity-75" 
                onClick={() => setIsQrZoomed(false)}
              >
                <div 
                  onClick={e => e.stopPropagation()} 
                  className="cursor-default rounded-lg bg-white p-8"
                >
                  <QRCodeCanvas 
                    value={`contrato-${selectedBrand}-${selectedModel}-${selectedCapacity}-${devicePrice}-${selectedFinancing}`} 
                    size={384} 
                  />
                </div>
              </div>
            )}
          </div>
        )
      }
      case "contract-signed":
        return (
          <div className="relative z-10 flex flex-col min-h-screen">
            <DashboardHeader />
            <ContractProgressSteps />
            <div className="flex-1 flex items-center justify-center p-4">
              <Card className="w-full max-w-7xl bg-white shadow-2xl">
                <CardContent className="p-8">
                  <div className="text-center mb-8">
                    <h2 className="text-blue-600 text-3xl font-bold mb-4">{t.contractSigned_title}</h2>
                    <p className="text-gray-600 text-lg">{t.contractSigned_subtitle}</p>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4"><h3 className="text-blue-600 text-lg font-bold mb-2">{t.contractSigned_orderId}</h3></div>
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 text-yellow-700">
                          <span className="text-yellow-600">⚠</span>
                          <span className="text-sm">{t.contractSigned_warning}</span>
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-6"><h4 className="font-bold text-gray-800 mb-4">{t.contractSigned_cardTitle}</h4></div>
                      <div className="flex gap-4">
                        <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"><RefreshCw className="w-4 h-4" />{t.contractSigned_refresh}</Button>
                        <Button variant="outline" className="flex items-center gap-2"><Printer className="w-4 h-4" />{t.contractSigned_print}</Button>
                        <Button variant="outline" className="flex items-center gap-2"><FileDown className="w-4 h-4" />{t.contractSigned_download}</Button>
                      </div>
                      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2"><FileText className="w-5 h-5 text-gray-600" /><span className="text-gray-700">{t.contractSigned_eSignature}</span></div>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center"><User className="w-4 h-4 text-white" /></div>
                          <Button onClick={() => setCurrentPage("references")} className="bg-green-500 hover:bg-green-600 text-white">{t.contractSigned_nextStep}</Button>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-6"><h3 className="text-blue-600 text-xl font-bold mb-6">{t.contractSigned_clientInfo}</h3></div>
                  </div>
                  <div className="flex justify-between mt-8">
                    <Button onClick={() => setCurrentPage("contract-generation")} className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2">← Regresar</Button>
                    <Button onClick={() => setCurrentPage("references")} className="bg-green-500 hover:bg-green-600 text-white">{t.contractSigned_nextStep}</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )
      case "references": {
        return (
          <div className="relative z-10 flex flex-col min-h-screen">
            <DashboardHeader />
            <ContractProgressSteps />
            <div className="flex-1 flex items-center justify-center p-4">
              <Card className="w-full max-w-6xl bg-white shadow-2xl">
                <CardContent className="p-8">
                  <div className="text-center mb-8">
                    <h2 className="text-blue-600 text-3xl font-bold mb-2">Referencias</h2>
                    <p className="text-gray-600 text-lg">¡Ayúdanos a conocerte mejor! Por favor, completa la información sobre usted.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Formulario de referencias */}
                    <div className="space-y-6">
                      <div>
                        <label className="block text-blue-600 font-semibold mb-2">email :</label>
                        <input type="email" placeholder="Ingrese su correo electrónico" value={userEmail} onChange={e => setUserEmail(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                      <div>
                        <label className="block text-blue-600 font-semibold mb-2">Nombre del contacto familiar :</label>
                        <input type="text" placeholder="Nombre completo del contacto familiar" value={familyContactName} onChange={e => setFamilyContactName(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                      <div>
                        <label className="block text-blue-600 font-semibold mb-2">Número de teléfono 1 :</label>
                        <input type="tel" placeholder="Ingrese número de teléfono" value={familyContactPhone} onChange={e => setFamilyContactPhone(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                      <div>
                        <label className="block text-blue-600 font-semibold mb-2">Nombre del contacto amigo :</label>
                        <input type="text" placeholder="Nombre completo del contacto amigo" value={friendContactName} onChange={e => setFriendContactName(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                      <div>
                        <label className="block text-blue-600 font-semibold mb-2">Número de teléfono 2 :</label>
                        <input type="tel" placeholder="Ingrese número de teléfono del amigo" value={friendContactPhone} onChange={e => setFriendContactPhone(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                    </div>
                    {/* Resumen de dispositivo y datos */}
                    <div className="bg-gray-50 rounded-lg p-8">
                      <h3 className="text-blue-600 text-xl font-bold mb-4">{selectedBrand} {selectedModel} {selectedCapacity}</h3>
                      <div className="grid grid-cols-2 gap-2 mb-2">
                        <span className="font-semibold">Modelo</span>
                        <span>${devicePrice.toLocaleString()}</span>
                        <span className="font-semibold">IVA</span>
                        <span>$1120</span>
                        <span className="font-semibold">Pay recompensas</span>
                        <span>39</span>
                        <span className="font-semibold">Semanas</span>
                        <span>$1 250</span>
                      </div>
                      <div className="mt-4">
                        <span className="font-semibold">Estado donde vive</span>
                        <span className="ml-2">Celular</span>
                      </div>
                      <div className="mt-2">
                        <span className="font-semibold">CURP</span>
                        <span className="ml-2 font-bold">VAZQUEZ GOMEZ BEATIZADRIANA</span>
                      </div>
                      <div className="mt-2">
                        <span className="font-semibold">Número de celular</span>
                        <span className="ml-2">Celular</span>
                      </div>
                      <div className="mt-2">5533985775</div>
                      <div className="mt-2">
                        <span className="font-semibold">Estado donde nació :</span>
                        <input type="text" className="w-full p-2 border border-gray-300 rounded-lg font-bold mt-1" value="VAZQUEZGOMEZBRZ ADRIANA" readOnly />
                      </div>
                      <div className="mt-2">5533382575</div>
                      <div className="mt-2">
                        <span className="font-semibold">Ciudad donde vive :</span>
                        <input type="text" className="w-full p-2 border border-gray-300 rounded-lg mt-1" />
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between mt-8">
                    <Button onClick={() => setCurrentPage("contract-generation")} className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2">← Regresar</Button>
                    <Button onClick={() => setCurrentPage("device-configuration")} className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2">Siguiente paso</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )
      }
      case "device-configuration":
        return (
          <div className="relative z-10 flex flex-col min-h-screen p-6">
            <DashboardHeader />
            <ContractProgressSteps />
            <div className="flex-1 flex items-center justify-center">
              <Card className="w-full max-w-2xl bg-white shadow-2xl">
                <CardContent className="p-8">
                  <div className="text-center mb-8">
                    <h2 className="text-blue-600 text-3xl font-bold mb-4">{t.deviceConfig_title}</h2>
                    <p className="text-gray-600 text-lg">{t.deviceConfig_subtitle}</p>
                  </div>
                  {connectWifi ? (
                    <div className="text-center p-8">
                      <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4"><Check className="w-8 h-8 text-white" /></div>
                      <h3 className="text-2xl font-bold text-green-700 mb-2">{t.deviceConfig_success}</h3>
                      <p className="text-gray-600">{t.deviceConfig_successMsg}</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div>
                        <Label htmlFor="devicePhone" className="text-blue-600 font-medium">{t.deviceConfig_phone}</Label>
                        <Input id="devicePhone" value={devicePhoneNumber} onChange={(e) => setDevicePhoneNumber(e.target.value)} className="w-full mt-1 p-2 border rounded" />
                      </div>
                      <div className="flex items-center gap-4">
                        <Checkbox id="wifi" checked={connectWifi} onCheckedChange={(checked) => setConnectWifi(checked as boolean)} />
                        <Label htmlFor="wifi" className="text-gray-700 font-medium">{t.deviceConfig_connectWifi}</Label>
                      </div>
                      <div className="mt-8 flex gap-4">
                        <Button onClick={() => setCurrentPage("references")}>← Regresar</Button>
                        <Button onClick={() => setConnectWifi(true)}>
                          Finalizar
                        </Button>
                      </div>
                    </div>
                  )}
                  {connectWifi && (
                    <div className="flex justify-center mt-8">
                      <Button onClick={() => setCurrentPage("dashboard")} className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2">← {t.back_to_main_panel}</Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <Background />
      <GlobalLanguageSwitcher />
      {renderPage()}
    </div>
  )
}

      