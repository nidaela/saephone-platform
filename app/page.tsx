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
    setCurrentPage("dashboard") // or the next step in the creation process
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
        setTimeout(() => setExtractedName("María Rodríguez Hernández"), 1500)
      }
    }, 2000)
  }

  const ContractProgressSteps = () => {
    const steps = [
      { name: t.contractSteps_register, completed: true },
      {
        name: t.contractSteps_price,
        completed: ["device-selection", "contract-generation", "contract-signed", "references", "device-configuration"].includes(currentPage),
      },
      {
        name: t.contractSteps_contract,
        completed: ["contract-generation", "contract-signed", "references", "device-configuration"].includes(currentPage),
      },
      { name: t.contractSteps_software, completed: ["references", "device-configuration"].includes(currentPage) },
      { name: t.contractSteps_finish, completed: currentPage === "device-configuration" && connectWifi },
    ]
    return (
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center gap-4">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                    step.completed ? "bg-green-500" : "bg-white/30"
                  }`}
                >
                  {index + 1}
                </div>
                <span className={`text-sm mt-2 ${step.completed ? "text-white" : "text-white/70"}`}>{step.name}</span>
              </div>
              {index < steps.length - 1 && <div className="w-16 h-0.5 bg-white/30 mx-2"></div>}
            </div>
          ))}
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

  const renderPage = () => {
    switch (currentPage) {
      case "login":
        return <LoginPage onLogin={handleLogin} t={t} />
      case "create-account":
        return <CreateAccountPage onBack={() => setCurrentPage("dashboard")} onNext={handleNextFromCreate} t={t} />
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
                        <Button onClick={() => setCurrentPage("device-selection")} className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg">
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
                          <input id="fullName" className="w-full mt-1 p-2 border rounded" placeholder="Juan Pérez González" />
                        </div>
                        <div>
                          <Label htmlFor="email" className="text-blue-600 font-medium">{t.settings_email}</Label>
                          <input id="email" className="w-full mt-1 p-2 border rounded" placeholder="juan.perez@email.com" />
                        </div>
                        <div>
                          <Label htmlFor="phone" className="text-blue-600 font-medium">{t.settings_phone}</Label>
                          <input id="phone" className="w-full mt-1 p-2 border rounded" placeholder="+52 834 123 4567" />
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
      case "contract-generation":
        return (
          <div className="relative z-10 flex flex-col min-h-screen">
            <DashboardHeader />
            <ContractProgressSteps />
            <div className="flex-1 flex items-center justify-center p-4">
              <div className="w-full max-w-6xl">
                <div className="text-center mb-8">
                  <h2 className="text-white text-4xl font-bold mb-4">{t.contractGeneration_title}</h2>
                  <p className="text-white/90 text-lg">{t.contractGeneration_subtitle}</p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <Card className="bg-white shadow-2xl">
                    <CardContent className="p-8">
                      <div className="text-center mb-6">
                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center mx-auto mb-4"><FileText className="w-8 h-8 text-gray-500" /></div>
                        <h3 className="text-gray-800 text-xl font-bold mb-4">{t.contractGeneration_cardTitle}</h3>
                      </div>
                      <div className="space-y-4 text-sm text-gray-700">
                        <div><p className="font-semibold">{t.contractGeneration_providerData}</p></div>
                        <div>
                          <p className="font-semibold mb-2">{t.contractGeneration_clientData}</p>
                          <div className="bg-gray-50 p-4 rounded-lg text-center">
                            <p className="font-bold text-gray-800">GONZALEZ TREJO YAZMIN ARCELIA</p>
                            <p className="text-gray-600 mt-1">GOTY840630MDFNZ03</p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-8">
                        {contractGenerated ? (
                          <div className="text-center">
                            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3"><Check className="w-6 h-6 text-white" /></div>
                            <p className="text-green-600 font-semibold">{t.contractGeneration_generatedSuccess}</p>
                          </div>
                        ) : (
                          <Button onClick={() => setContractGenerated(true)} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 text-lg">{t.contractGeneration_generateBtn}</Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                  <div className="space-y-6">
                    <Card className="bg-white shadow-2xl">
                      <CardContent className="p-8 text-center">
                        <h3 className="text-blue-600 text-xl font-bold mb-4">{t.contractGeneration_qrTitle}</h3>
                        <div className="flex justify-center mb-6">
                          <button onClick={() => setQrCodeClicked(!qrCodeClicked)} className={`bg-white border-2 border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-all ${qrCodeClicked ? "scale-150 z-50" : ""}`}>
                            <img src="/qr-code.png" alt="QR Code" className="w-48 h-48" />
                          </button>
                        </div>
                      </CardContent>
                    </Card>
                    {contractGenerated && <Button onClick={() => setCurrentPage("contract-signed")} className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 text-lg rounded-xl">{t.contractGeneration_simulateSign}</Button>}
                  </div>
                </div>
                <div className="flex justify-start mt-8">
                  <Button onClick={() => setCurrentPage("device-selection")} className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2">← {t.deviceSelection_back}</Button>
                </div>
              </div>
            </div>
          </div>
        )
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
                    <Button onClick={() => setCurrentPage("contract-generation")} className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2">← {t.deviceSelection_back}</Button>
                    <Button onClick={() => setCurrentPage("references")} className="bg-green-500 hover:bg-green-600 text-white">{t.contractSigned_nextStep}</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )
      case "references":
        return (
          <div className="relative z-10 flex flex-col min-h-screen p-6">
            <DashboardHeader />
            <ContractProgressSteps />
            <div className="flex-1 flex items-center justify-center">
              <Card className="w-full max-w-7xl bg-white shadow-2xl">
                <CardContent className="p-8">
                  <div className="text-center mb-8">
                    <h2 className="text-blue-600 text-3xl font-bold mb-4">{t.references_title}</h2>
                    <p className="text-gray-600 text-lg">{t.references_subtitle}</p>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div><label className="block text-blue-600 font-semibold mb-2">{t.references_email}</label><input type="email" placeholder={t.references_emailPlaceholder} value={userEmail} onChange={e => setUserEmail(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
                      <div><label className="block text-blue-600 font-semibold mb-2">{t.references_famContactName}</label><input type="text" placeholder={t.references_famContactNamePlaceholder} value={familyContactName} onChange={e => setFamilyContactName(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
                      <div><label className="block text-blue-600 font-semibold mb-2">{t.references_phone1}</label><input type="tel" placeholder={t.references_phone1Placeholder} value={familyContactPhone} onChange={e => setFamilyContactPhone(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
                      <div><label className="block text-blue-600 font-semibold mb-2">{t.references_friendContactName}</label><input type="text" placeholder={t.references_friendContactNamePlaceholder} value={friendContactName} onChange={e => setFriendContactName(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
                      <div><label className="block text-blue-600 font-semibold mb-2">{t.references_phone2}</label><input type="tel" placeholder={t.references_phone2Placeholder} value={friendContactPhone} onChange={e => setFriendContactPhone(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-6">
                      <div className="mt-8 flex justify-end">
                        <Button onClick={() => { if (userEmail && familyContactName && familyContactPhone && friendContactName && friendContactPhone) { setCurrentPage("device-configuration"); } else { alert(t.references_fillFields); } }} className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg font-semibold">{t.references_nextStep}</Button>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-start mt-8">
                    <Button onClick={() => setCurrentPage("contract-signed")} className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2">← {t.deviceSelection_back}</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )
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
                        <Button onClick={() => setCurrentPage("references")} className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-3 rounded-lg">← {t.deviceSelection_back}</Button>
                        <Button onClick={() => setConnectWifi(true)} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3">{t.deviceConfig_finish}</Button>
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
