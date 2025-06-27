"use client"

import React, { useState } from "react"
import { translations } from "@/lib/translations"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Smartphone, ArrowLeft, Check, FileText, Download, User, Loader2 } from "lucide-react"
import { QRCodeCanvas } from "qrcode.react"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"
import { Checkbox } from "@/components/ui/checkbox"

export interface SaleData {
  selectedBrand: string
  selectedModel: string
  selectedCapacity: string
  devicePrice: number
  selectedFinancing: string
  paymentMethod: string
  contractGenerated: boolean
}

export interface AccountSaleData {
  phoneNumber: string;
  verificationCode: string;
  userEmail: string;
  familyContactName: string;
  familyContactPhone: string;
  friendContactName: string;
  friendContactPhone: string;
}

type SellDevicesModuleProps = {
  onBack: () => void;
  onComplete: (saleData: AccountSaleData) => void;
  t: (typeof translations)["es"];
};

export default function SellDevicesModule({ onBack, onComplete, t }: SellDevicesModuleProps) {
  const [currentStep, setCurrentStep] = useState<"phone" | "terms" | "identity" | "credit" | "modelplan" | "appinstall" | "references" | "complete">("phone")
  const [verificationCode, setVerificationCode] = useState(() => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    let result = ""
    for (let i = 0; i < 4; i++) result += chars.charAt(Math.floor(Math.random() * chars.length))
    return result
  })
  const [phoneNumber, setPhoneNumber] = useState("")
  const [enteredCode, setEnteredCode] = useState("")
  const [userEmail, setUserEmail] = useState("")
  const [familyContactName, setFamilyContactName] = useState("")
  const [familyContactPhone, setFamilyContactPhone] = useState("")
  const [friendContactName, setFriendContactName] = useState("")
  const [friendContactPhone, setFriendContactPhone] = useState("")
  const [verificationCodeInput, setVerificationCodeInput] = useState("")
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [acceptPrivacy, setAcceptPrivacy] = useState(false)
  const [frontCaptured, setFrontCaptured] = useState(false)
  const [backCaptured, setBackCaptured] = useState(false)
  const [selfieLoading, setSelfieLoading] = useState(false)
  const [selfieCaptured, setSelfieCaptured] = useState(false)
  const bothCaptured = frontCaptured && backCaptured
  const [creditLoading, setCreditLoading] = useState(true)
  const [creditEvaluated, setCreditEvaluated] = useState(false)

  // Simulación de datos para el paso de modelo y plan
  const brands = ["Apple", "Samsung", "Xiaomi"];
  const modelsByBrand = {
    Apple: ["iPhone 15 Pro", "iPhone 14", "iPhone SE"],
    Samsung: ["Galaxy S23", "Galaxy A54", "Galaxy Z Flip"],
    Xiaomi: ["Redmi Note 12", "Mi 11", "Poco X5"]
  };
  const capacities = ["64GB", "128GB", "256GB"];
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [selectedCapacity, setSelectedCapacity] = useState<string>("");
  const [devicePrice, setDevicePrice] = useState<number>(0);
  const [selectedPlan, setSelectedPlan] = useState<number|null>(null);
  const [customWeeks, setCustomWeeks] = useState<number>(10);
  // Precios simulados por modelo
  const priceTable: Record<string, number> = {
    "iPhone 15 Pro": 3997,
    "iPhone 14": 2999,
    "iPhone SE": 1999,
    "Galaxy S23": 3499,
    "Galaxy A54": 2499,
    "Galaxy Z Flip": 4299,
    "Redmi Note 12": 1599,
    "Mi 11": 1899,
    "Poco X5": 1799
  };
  // Planes simulados
  const plans = [10, 20, 26, 30];
  // Cálculo de pago inicial y saldo
  const initialPayment = Math.round(devicePrice * 0.15);
  const balance = devicePrice - initialPayment;
  // Cálculo de pagos por semana
  const getWeeklyPayment = (weeks: number) => weeks > 0 ? Math.round(balance / weeks) : 0;
  // Actualiza precio al seleccionar modelo
  React.useEffect(() => {
    if (selectedModel && priceTable[selectedModel]) {
      setDevicePrice(priceTable[selectedModel]);
    }
  }, [selectedModel]);
  // Helper para obtener modelos por marca
  const getModelsByBrand = (brand: string): string[] => {
    if (brand === "Apple") return modelsByBrand.Apple;
    if (brand === "Samsung") return modelsByBrand.Samsung;
    if (brand === "Xiaomi") return modelsByBrand.Xiaomi;
    return [];
  };

  const handleGenerateNewCode = () => {
    let result = ""
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    for (let i = 0; i < 4; i++) result += chars.charAt(Math.floor(Math.random() * chars.length))
    setVerificationCode(result)
  }
  const handleSendCode = () => {
    if (phoneNumber) {
      alert(`Se ha enviado un código al teléfono +52 ${phoneNumber}`)
    } else {
      alert("Por favor, ingresa un número de teléfono")
    }
  }
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "")
    setPhoneNumber(value)
  }
  const handleVerifyCode = () => {
    if (enteredCode.length === 4) {
      setCurrentStep("references")
    } else {
      alert("Código incorrecto. Por favor, intenta de nuevo.")
    }
  }
  const handleCompleteAccount = () => {
    onComplete({
      phoneNumber,
      verificationCode,
      userEmail,
      familyContactName,
      familyContactPhone,
      friendContactName,
      friendContactPhone
    })
    setCurrentStep("complete")
  }
  const handleSelfieClick = () => {
    if (!selfieCaptured && !selfieLoading) {
      setSelfieLoading(true)
      setTimeout(() => {
        setSelfieLoading(false)
        setSelfieCaptured(true)
      }, 10000)
    }
  }

  const renderPhoneStep = () => (
    <div>
      <div className="text-center mb-4">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-1">Registrar nuevo cliente en Saephone</h2>
        <p className="text-gray-600 text-sm md:text-base">Para comenzar, necesitamos verificar tu número de teléfono</p>
      </div>
      <div className="space-y-4">
        <div>
          <Label htmlFor="verification-code" className="text-gray-700 text-sm">Código de verificación</Label>
          <div className="mt-1 flex items-center gap-2 md:gap-4">
            <Input
              id="verification-code"
              placeholder="Ingresa el código que ves a la derecha"
              className="font-mono tracking-widest h-10 text-sm flex-1"
              value={verificationCodeInput}
              onChange={e => setVerificationCodeInput(e.target.value)}
              maxLength={4}
            />
            <div className="rounded-md border border-gray-300 bg-gray-100 px-4 py-2 text-base font-bold text-gray-700 select-none min-w-[56px] text-center">
              {verificationCode}
            </div>
            <Button onClick={handleGenerateNewCode} className="bg-green-500 text-white hover:bg-green-600 h-10 px-3 text-sm">
              Generar nuevo código
            </Button>
          </div>
        </div>
        <div>
          <Label htmlFor="phone-number" className="text-gray-700 text-sm">Número de teléfono</Label>
          <div className="mt-1 flex items-center gap-2 md:gap-4">
            <span className="rounded-md border border-gray-300 bg-gray-100 px-3 py-1.5 text-gray-700 text-sm">+52</span>
            <Input
              id="phone-number"
              placeholder="Ingresa tu número de teléfono"
              value={phoneNumber}
              onChange={handlePhoneChange}
              maxLength={10}
              className="h-10 text-sm"
            />
            <Button onClick={handleSendCode} className="bg-green-500 text-white hover:bg-green-600 h-10 px-3 text-sm">
              Enviar código
            </Button>
          </div>
        </div>
        <div>
          <Label htmlFor="entered-code" className="text-gray-700 text-sm">Introduce el código</Label>
          <Input
            id="entered-code"
            placeholder="Código de 4 dígitos"
            className="mt-1 h-10 text-sm"
            value={enteredCode}
            onChange={e => setEnteredCode(e.target.value)}
            maxLength={4}
          />
        </div>
      </div>
    </div>
  )
  const renderVerificationIdentityStep = () => (
    <div className="w-full flex flex-col items-center">
      <p className="text-gray-700 mb-8">Para continuar, necesitamos verificar tu identidad con tu INE y una selfie</p>
      <div className="w-full max-w-3xl flex flex-col gap-10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Check className="w-5 h-5 text-green-500" />
            <span className="font-semibold text-lg text-gray-900">Tarjeta de identificación de usuario</span>
          </div>
          <div className="flex gap-8 justify-center mt-4">
            {/* Anverso */}
            <div
              className={`w-64 h-40 rounded-lg flex items-center justify-center relative cursor-pointer transition-all duration-200 ${frontCaptured ? 'bg-red-100' : 'bg-gray-100 hover:bg-red-50'}`}
              onClick={() => setFrontCaptured(true)}
            >
              {frontCaptured ? (
                <>
                  <span className="absolute top-3 right-3 bg-green-100 rounded-full p-1"><Check className="w-5 h-5 text-green-500" /></span>
                  <span className="text-green-600 font-bold text-lg">Anverso capturado</span>
                </>
              ) : (
                <div className="w-16 h-16 border-2 border-dashed border-red-300 rounded-full flex items-center justify-center">
                  <div className="w-4 h-4 bg-red-300 rounded-full opacity-40" />
                </div>
              )}
            </div>
            {/* Reverso */}
            <div
              className={`w-64 h-40 rounded-lg flex items-center justify-center relative cursor-pointer transition-all duration-200 ${backCaptured ? 'bg-blue-100' : 'bg-gray-100 hover:bg-blue-50'}`}
              onClick={() => setBackCaptured(true)}
            >
              {backCaptured ? (
                <>
                  <span className="absolute top-3 right-3 bg-green-100 rounded-full p-1"><Check className="w-5 h-5 text-green-500" /></span>
                  <span className="text-green-600 font-bold text-lg">Reverso capturado</span>
                </>
              ) : (
                <div className="w-16 h-16 border-2 border-dashed border-blue-300 rounded-full flex items-center justify-center">
                  <div className="w-4 h-4 bg-blue-300 rounded-full opacity-40" />
                </div>
              )}
            </div>
          </div>
        </div>
        {bothCaptured && (
          <div className="w-full bg-green-50 border-l-4 border-green-400 flex items-center p-4 mt-6 rounded-md">
            <Check className="w-6 h-6 text-green-500 mr-2" />
            <span className="font-bold text-green-900 mr-2">Nombre extraído del INE:</span>
            <span className="text-gray-900 font-medium">María Rodríguez Hernández</span>
          </div>
        )}
        <div className="mt-8">
          <div className="flex items-center gap-2 mb-2">
            <Check className={`w-5 h-5 ${selfieCaptured ? 'text-green-500' : 'text-green-500 opacity-50'}`} />
            <span className="font-semibold text-lg text-gray-900">Foto en vivo del usuario</span>
          </div>
          <div className="flex flex-col items-center justify-center mt-4">
            <div
              className={`w-64 h-64 rounded-full flex items-center justify-center relative border transition-all duration-200 ${selfieCaptured ? 'bg-yellow-100 border-yellow-300' : 'bg-gray-100 border-gray-200 hover:bg-yellow-50'} ${selfieLoading ? 'opacity-80' : ''}`}
              onClick={bothCaptured && !selfieCaptured && !selfieLoading ? handleSelfieClick : undefined}
              style={{ pointerEvents: bothCaptured ? 'auto' : 'none', opacity: bothCaptured ? 1 : 0.5 }}
            >
              {selfieLoading ? (
                <Loader2 className="w-20 h-20 text-yellow-400 animate-spin" />
              ) : (
                <User className="w-20 h-20 text-red-400" />
              )}
              {selfieCaptured && (
                <span className="absolute top-4 right-4 bg-green-100 rounded-full p-1"><Check className="w-6 h-6 text-green-500" /></span>
              )}
            </div>
            {selfieCaptured && (
              <p className="mt-4 text-green-600 font-bold text-lg">¡Selfie capturada correctamente!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
  const renderCreditProfileStep = () => (
    <div className="w-full flex flex-col items-center">
      {creditLoading && (
        <div className="flex flex-col items-center justify-center py-16">
          <Loader2 className="w-16 h-16 text-blue-500 animate-spin mb-6" />
          <p className="text-xl font-semibold text-gray-800 mb-2">Evaluando perfil crediticio con Buró de Crédito...</p>
          <p className="text-gray-600">Por favor espera unos segundos mientras verificamos tu historial.</p>
        </div>
      )}
      {creditEvaluated && (
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Perfil crediticio verificado!</h2>
          <p className="text-gray-700 mb-6">María Rodríguez Hernández tiene un excelente historial crediticio. Es posible otorgar crédito.</p>
          <div className="flex gap-2 mb-6">
            <button className="px-4 py-2 rounded-lg bg-gray-100 font-semibold text-gray-800 border border-gray-200">Buró de Crédito</button>
            <button className="px-4 py-2 rounded-lg bg-gray-100 font-semibold text-gray-800 border border-gray-200">Círculo de Crédito</button>
          </div>
          <div className="w-full flex flex-col items-center mb-8">
            {/* Score Gauge (simulado) */}
            <div className="relative flex flex-col items-center mb-2">
              <svg width="260" height="120" viewBox="0 0 260 120">
                <defs>
                  <linearGradient id="scoreGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#ef4444" />
                    <stop offset="50%" stopColor="#facc15" />
                    <stop offset="100%" stopColor="#22c55e" />
                  </linearGradient>
                </defs>
                <path d="M30,110 A100,100 0 0,1 230,110" fill="none" stroke="url(#scoreGradient)" strokeWidth="16" />
                <circle cx="200" cy="90" r="8" fill="#22c55e" />
              </svg>
              <div className="absolute top-14 left-1/2 -translate-x-1/2 flex flex-col items-center">
                <span className="text-5xl font-bold text-gray-900">803</span>
                <span className="text-green-600 font-semibold text-lg">Excelente</span>
              </div>
              <div className="absolute top-24 right-12 flex items-center gap-1 bg-white rounded-full px-2 py-1 shadow text-green-600 font-semibold text-sm border border-green-200">
                <svg width="16" height="16" fill="none"><path d="M8 12V4M8 4l-4 4m4-4l4 4" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                +6 pts
              </div>
            </div>
            <div className="flex justify-between w-full mt-2 text-xs text-gray-400 px-2">
              <span>300</span>
              <span>450</span>
              <span>580</span>
              <span>700</span>
              <span>850</span>
            </div>
          </div>
          <button className="w-full py-3 rounded-lg bg-black text-white font-semibold text-lg mb-8">Actualizar score crediticio</button>
          <div className="grid grid-cols-2 gap-4 w-full">
            <div className="bg-gray-50 rounded-xl p-4 flex flex-col items-start shadow border border-gray-100">
              <div className="flex items-center justify-between w-full mb-2">
                <span className="font-semibold text-gray-800">Historial de pagos</span>
                <span className="text-green-600 font-semibold text-xs bg-green-100 rounded px-2 py-0.5">Alto impacto</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">100%</div>
              <div className="text-xs text-gray-500">Pagos realizados a tiempo</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 flex flex-col items-start shadow border border-gray-100">
              <div className="flex items-center justify-between w-full mb-2">
                <span className="font-semibold text-gray-800">Uso de tarjeta</span>
                <span className="text-green-600 font-semibold text-xs bg-green-100 rounded px-2 py-0.5">Alto impacto</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">2%</div>
              <div className="text-xs text-gray-500">Porcentaje de crédito utilizado</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 flex flex-col items-start shadow border border-gray-100">
              <div className="flex items-center justify-between w-full mb-2">
                <span className="font-semibold text-gray-800">Antigüedad crediticia</span>
                <span className="text-green-600 font-semibold text-xs bg-green-100 rounded px-2 py-0.5">Impacto medio</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">7 años</div>
              <div className="text-xs text-gray-500">Promedio de antigüedad</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 flex flex-col items-start shadow border border-gray-100">
              <div className="flex items-center justify-between w-full mb-2">
                <span className="font-semibold text-gray-800">Cuentas totales</span>
                <span className="text-red-600 font-semibold text-xs bg-red-100 rounded px-2 py-0.5">Bajo impacto</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">28</div>
              <div className="text-xs text-gray-500">Cuentas abiertas y cerradas</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
  const renderModelPlanStep = () => (
    <div className="w-full max-w-2xl mx-auto">
      {/* Título eliminado por solicitud */}
      <div className="mb-6">
        <div className="font-bold text-lg text-green-600 mb-2 flex items-center gap-2"><span className="rounded-full bg-green-500 text-white w-6 h-6 flex items-center justify-center mr-2">1</span>Método de pago</div>
        <div className="grid grid-cols-2 gap-4 mb-2">
          <button type="button" onClick={() => setPaymentMethod("financiado")} className={`border rounded-lg py-4 font-bold text-lg ${paymentMethod==="financiado" ? "border-green-500 bg-green-50" : "border-gray-300 bg-white"}`}>Financiado por Saephone<br/><span className="font-normal text-sm">Pagos a meses sin intereses</span></button>
          <button type="button" onClick={() => setPaymentMethod("contado")} className={`border rounded-lg py-4 font-bold text-lg ${paymentMethod==="contado" ? "border-green-500 bg-green-50" : "border-gray-300 bg-white"}`}>Pago de Contado<br/><span className="font-normal text-sm">Pago único completo</span></button>
        </div>
        {!paymentMethod && <div className="text-red-500 text-sm mt-1">* Selecciona un método de pago</div>}
      </div>
      {/* 2. Modelo */}
      <div className="mb-6">
        <div className="font-bold text-lg text-green-600 mb-2 flex items-center gap-2"><span className="rounded-full bg-green-500 text-white w-6 h-6 flex items-center justify-center mr-2">2</span>Modelo</div>
        <div className="flex gap-2 mb-2">
          <select className="border rounded-md px-3 py-2" value={selectedBrand} onChange={e => {setSelectedBrand(e.target.value); setSelectedModel("");}}>
            <option value="">Selecciona una marca</option>
            {brands.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
          <select className="border rounded-md px-3 py-2" value={selectedModel} onChange={e => setSelectedModel(e.target.value)} disabled={!selectedBrand}>
            <option value="">Selecciona un modelo</option>
            {selectedBrand && getModelsByBrand(selectedBrand).map((m: string) => <option key={m} value={m}>{m}</option>)}
          </select>
          <select className="border rounded-md px-3 py-2" value={selectedCapacity} onChange={e => setSelectedCapacity(e.target.value)}>
            <option value="">Selecciona capacidad</option>
            {capacities.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        {!selectedBrand && <div className="text-red-500 text-sm mt-1">* Selecciona una marca</div>}
        <div className="mt-2">
          <Label className="text-blue-700 text-sm">Precio del dispositivo</Label>
          <div className="flex items-center gap-2 mt-1">
            <span className="border rounded-l px-2 py-1 bg-gray-100">$</span>
            <Input type="number" className="w-32 h-10 text-lg" value={devicePrice} onChange={e => setDevicePrice(Number(e.target.value))} min={0} />
          </div>
          <div className="text-xs text-gray-500 mt-1">El precio se actualiza automáticamente al seleccionar modelo y capacidad, pero puedes editarlo manualmente</div>
        </div>
      </div>
      {/* Pago inicial requerido */}
      {paymentMethod==="financiado" && devicePrice > 0 && (
        <div className="bg-blue-50 border-l-4 border-blue-400 rounded-lg p-4 mb-6">
          <div className="font-bold text-blue-900 mb-2">Pago Inicial Requerido</div>
          <div className="flex flex-col gap-1 text-sm">
            <div className="flex justify-between"><span>Precio del dispositivo:</span><span className="font-bold">${devicePrice.toLocaleString()}</span></div>
            <div className="flex justify-between"><span>Pago inicial (15%):</span><span className="font-bold text-blue-700">${initialPayment.toLocaleString()}</span></div>
            <div className="flex justify-between"><span>Saldo a financiar:</span><span className="font-bold text-green-700">${balance.toLocaleString()}</span></div>
          </div>
          <div className="text-xs text-blue-700 mt-2">Importante: El pago inicial del 15% debe ser realizado al momento de la entrega del dispositivo.</div>
        </div>
      )}
      {/* 3. Plan de financiamiento */}
      {paymentMethod==="financiado" && devicePrice > 0 && (
        <div className="mb-6">
          <div className="font-bold text-lg text-green-600 mb-2 flex items-center gap-2"><span className="rounded-full bg-green-500 text-white w-6 h-6 flex items-center justify-center mr-2">3</span>Plan de financiamiento</div>
          <div className="grid grid-cols-4 gap-2 mb-4">
            {plans.map(weeks => (
              <button key={weeks} type="button" onClick={() => setSelectedPlan(weeks)} className={`border rounded-lg py-4 font-bold text-lg text-center ${selectedPlan===weeks ? "border-green-500 bg-green-50" : "border-gray-300 bg-white"}`}>
                {weeks} SEMANAS
                <div className="font-normal text-base mt-1">${getWeeklyPayment(weeks)} <span className="text-xs">/SEMANA</span></div>
                <div className="text-xs text-gray-500 mt-1">pago inicial: ${initialPayment} <br/> saldo final: ${(getWeeklyPayment(weeks)*weeks+initialPayment).toLocaleString()}</div>
              </button>
            ))}
          </div>
          {/* Plan personalizado */}
          <div className="bg-gray-50 rounded-lg p-4 mt-4">
            <div className="font-bold text-blue-700 text-center mb-2">Plan personalizado</div>
            <div className="flex flex-col items-center">
              <span className="mb-2">Semanas: {customWeeks}</span>
              <input type="range" min={10} max={30} value={customWeeks} onChange={e => {setCustomWeeks(Number(e.target.value)); setSelectedPlan(null);}} className="w-full mb-2" />
              <div className="font-bold text-2xl text-green-700 mb-1">${getWeeklyPayment(customWeeks)}</div>
              <div className="text-xs text-gray-500">pago inicial: ${initialPayment} <br/> saldo final: ${(getWeeklyPayment(customWeeks)*customWeeks+initialPayment).toLocaleString()}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
  const renderAppInstallStep = () => (
    <div className="space-y-6 text-center">
      <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">Instalación de App</h2>
      <p className="text-gray-600 mb-6">Aquí va el contenido de instalación de la app.</p>
    </div>
  )
  const renderReferencesStep = () => (
    <div className="space-y-6">
      <div>
        <Label htmlFor="user-email" className="text-gray-700">
          Email del usuario
        </Label>
        <Input
          id="user-email"
          type="email"
          placeholder="Ingrese su correo electrónico"
          value={userEmail}
          onChange={e => setUserEmail(e.target.value)}
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="family-contact-name" className="text-gray-700">
          Nombre del contacto familiar
        </Label>
        <Input
          id="family-contact-name"
          type="text"
          placeholder="Nombre completo del contacto familiar"
          value={familyContactName}
          onChange={e => setFamilyContactName(e.target.value)}
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="family-contact-phone" className="text-gray-700">
          Número de teléfono familiar
        </Label>
        <Input
          id="family-contact-phone"
          type="tel"
          placeholder="Ingrese número de teléfono"
          value={familyContactPhone}
          onChange={e => setFamilyContactPhone(e.target.value)}
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="friend-contact-name" className="text-gray-700">
          Nombre del contacto amigo
        </Label>
        <Input
          id="friend-contact-name"
          type="text"
          placeholder="Nombre completo del contacto amigo"
          value={friendContactName}
          onChange={e => setFriendContactName(e.target.value)}
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="friend-contact-phone" className="text-gray-700">
          Número de teléfono del amigo
        </Label>
        <Input
          id="friend-contact-phone"
          type="tel"
          placeholder="Ingrese número de teléfono del amigo"
          value={friendContactPhone}
          onChange={e => setFriendContactPhone(e.target.value)}
          className="mt-1"
        />
      </div>
    </div>
  )
  const renderCompleteStep = () => (
    <div className="text-center space-y-6">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
        <Check className="w-8 h-8 text-green-600" />
      </div>
      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">Venta completada exitosamente</h3>
        <p className="text-gray-600">La venta ha sido registrada en el sistema</p>
      </div>
    </div>
  )
  const renderTermsStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-2">
        <span className="font-semibold text-gray-700 text-lg block mb-4">
          Importante: Los siguientes términos deben ser leídos y completados personalmente por el cliente.
        </span>
      </div>
      <div className="flex justify-center">
        <div className="w-full max-w-2xl">
          <div className="bg-gray-50 rounded-lg p-6 mb-6 max-h-96 overflow-y-auto border border-gray-200">
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
                  El objeto de los presentes TÉRMINOS Y CONDICIONES es regular el acceso y la utilización del SITIO WEB.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-2">2. EL TITULAR</h4>
                <p>
                  Se reserva el derecho de realizar cualquier tipo de modificación en el SITIO WEB en cualquier momento y sin previo aviso.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-2">3. RESPONSABILIDADES</h4>
                <p>
                  El usuario se compromete a utilizar el sitio web de manera responsable y conforme a la legislación aplicable.
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
                onCheckedChange={checked => setAcceptTerms(!!checked)}
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
                onCheckedChange={checked => setAcceptPrivacy(!!checked)}
                className="mt-1"
              />
              <label htmlFor="privacy" className="text-sm text-gray-700">
                Acepto el aviso de privacidad de SAEPHONE
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
  const renderStepContent = () => {
    switch (currentStep) {
      case "phone":
        return renderPhoneStep()
      case "terms":
        return renderTermsStep()
      case "identity":
        return renderVerificationIdentityStep()
      case "credit":
        return renderCreditProfileStep()
      case "modelplan":
        return renderModelPlanStep()
      case "appinstall":
        return renderAppInstallStep()
      case "references":
        return renderReferencesStep()
      case "complete":
        return renderCompleteStep()
      default:
        return renderPhoneStep()
    }
  }
  const renderStepButtons = () => {
    switch (currentStep) {
      case "phone":
        return (
          <div className="mt-6 grid grid-cols-2 gap-3 md:gap-4">
            <Button onClick={onBack} className="w-full bg-gray-200 py-2.5 md:py-3 text-gray-700 hover:bg-gray-300 text-sm md:text-base">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Regresar a Panel Principal
            </Button>
            <Button
              onClick={() => {
                if (phoneNumber.length === 10 && enteredCode.length === 4) {
                  setCurrentStep("terms")
                } else {
                  alert("Por favor, ingresa un teléfono válido y un código de 4 dígitos.")
                }
              }}
              disabled={!(phoneNumber.length === 10 && enteredCode.length === 4)}
              className="w-full bg-blue-600 py-2.5 md:py-3 text-white hover:bg-blue-700 disabled:bg-gray-300 text-sm md:text-base"
            >
              Verificar y Continuar →
            </Button>
          </div>
        )
      case "terms":
        return (
          <div className="mt-8 flex gap-4 justify-end">
            <Button onClick={() => setCurrentStep("phone")} className="bg-gray-200 text-gray-700 hover:bg-gray-300">
              ← Regresar
            </Button>
            <Button
              onClick={() => setCurrentStep("identity")}
              disabled={!acceptTerms || !acceptPrivacy}
              className="bg-black text-white px-8 py-2 rounded-lg font-medium disabled:bg-gray-300"
            >
              Continuar
            </Button>
          </div>
        )
      case "identity":
        return (
          <div className="mt-8 flex gap-4 justify-end">
            <Button onClick={() => setCurrentStep("terms")} className="bg-gray-200 text-gray-700 hover:bg-gray-300">
              ← Regresar
            </Button>
            <Button onClick={() => setCurrentStep("credit")} className="bg-black text-white px-8 py-2 rounded-lg font-medium">
              Continuar
            </Button>
          </div>
        )
      case "credit":
        return (
          <div className="mt-8 flex gap-4 justify-end">
            <Button onClick={() => setCurrentStep("identity")} className="bg-gray-200 text-gray-700 hover:bg-gray-300">
              ← Regresar
            </Button>
            <Button onClick={() => setCurrentStep("modelplan")} className="bg-black text-white px-8 py-2 rounded-lg font-medium">
              Continuar
            </Button>
          </div>
        )
      case "modelplan":
        return (
          <div className="mt-8 flex gap-4 justify-end">
            <Button onClick={() => setCurrentStep("credit")} className="bg-gray-200 text-gray-700 hover:bg-gray-300">
              ← Regresar
            </Button>
            <Button onClick={() => setCurrentStep("appinstall")} className="bg-black text-white px-8 py-2 rounded-lg font-medium">
              Continuar
            </Button>
          </div>
        )
      case "references":
        return (
          <div className="mt-8 grid grid-cols-2 gap-4">
            <Button onClick={() => setCurrentStep("identity")} className="w-full bg-gray-200 py-3 text-gray-700 hover:bg-gray-300">
              ← Regresar
            </Button>
            <Button
              onClick={() => setCurrentStep("appinstall")}
              disabled={!userEmail || !familyContactName || !familyContactPhone || !friendContactName || !friendContactPhone}
              className="w-full bg-green-600 py-3 text-white hover:bg-green-700 disabled:bg-gray-300"
            >
              Continuar a Instalación de App →
            </Button>
          </div>
        )
      case "appinstall":
        return (
          <div className="mt-8 flex gap-4 justify-end">
            <Button onClick={() => setCurrentStep("references")} className="bg-gray-200 text-gray-700 hover:bg-gray-300">
              ← Regresar
            </Button>
            <Button onClick={handleCompleteAccount} className="bg-blue-600 text-white px-8 py-2 rounded-lg font-medium">
              Finalizar
            </Button>
          </div>
        )
      case "complete":
        return (
          <div className="mt-8">
            <Button onClick={onBack} className="w-full bg-blue-600 py-3 text-white hover:bg-blue-700">
              Volver al Dashboard
            </Button>
          </div>
        )
      default:
        return null
    }
  }
  const getStepTitle = () => {
    switch (currentStep) {
      case "phone":
        return "Verificación Telefónica"
      case "terms":
        return "Términos y Condiciones"
      case "identity":
        return "Verificación de Identidad"
      case "credit":
        return "Verificación de Perfil Crediticio"
      case "modelplan":
        return "Selección de Modelo y Plan de Financiamiento"
      case "appinstall":
        return "Instalación de App"
      case "references":
        return "Referencias de Contacto"
      case "complete":
        return "Venta Completada"
      default:
        return "Vender Dispositivos"
    }
  }

  // Add progress bar with 8 steps
  const progressStepKeys = [
    t.progress_step1, // Verificación Telefónica
    t.progress_step2, // Términos y Condiciones
    t.progress_step4, // Verificación de Identidad
    "Verificación de Perfil Crediticio",
    "Selección de Modelo y Plan de Financiamiento",
    t.progress_step8, // Instalación de App
    t.progress_step3, // Referencias de Contacto
    t.progress_step5,
    t.progress_step6,
    t.progress_step7,
  ];

  const getCurrentStepIndex = () => {
    switch (currentStep) {
      case "phone":
        return 0;
      case "terms":
        return 1;
      case "identity":
        return 2;
      case "credit":
        return 3;
      case "modelplan":
        return 4;
      case "appinstall":
        return 5;
      case "references":
        return 6;
      case "complete":
        return 10;
      default:
        return 0;
    }
  };

  const renderProgressBar = () => (
    <div className="flex items-center justify-center mb-8">
      <div className="flex items-center gap-4">
        {progressStepKeys.map((step, index) => {
          const isActive = index <= getCurrentStepIndex();
          return (
            <div
              key={index}
              className={`flex items-center ${isActive ? "cursor-pointer" : "cursor-default"}`}
              onClick={() => {
                // Only allow navigation to completed steps
                if (index <= getCurrentStepIndex()) {
                  // Map step index back to currentStep
                  if (index === 0) setCurrentStep("phone");
                  else if (index === 1) setCurrentStep("terms");
                  else if (index === 2) setCurrentStep("identity");
                  else if (index === 3) setCurrentStep("credit");
                  else if (index === 4) setCurrentStep("modelplan");
                  else if (index === 5) setCurrentStep("appinstall");
                  else if (index === 6) setCurrentStep("references");
                  else if (index === 7) setCurrentStep("complete");
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
                  className={`text-xs mt-2 transition-colors duration-300 ${isActive ? "text-green-700" : "text-gray-400"}`}
                >
                  {step}
                </span>
              </div>
              {index < progressStepKeys.length - 1 && <div className="w-10 h-0.5 bg-gray-300 mx-2"></div>}
            </div>
          );
        })}
      </div>
    </div>
  );

  React.useEffect(() => {
    if (currentStep === "credit") {
      setCreditLoading(true)
      setCreditEvaluated(false)
      const timer = setTimeout(() => {
        setCreditLoading(false)
        setCreditEvaluated(true)
      }, 10000)
      return () => clearTimeout(timer)
    }
  }, [currentStep])

  return (
    <>
      <div className="mt-8">{renderProgressBar()}</div>
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl p-4 md:p-6 mt-4 mx-auto min-h-[480px]">
        {currentStep === "phone" && (
          <div className="text-center mb-8">
            {/* Sin ícono ni subtítulo aquí */}
          </div>
        )}
        {currentStep !== "phone" && (
          <div className="text-center mb-8">
            <h1 className="mb-2 text-xl md:text-2xl font-bold text-gray-800">{getStepTitle()}</h1>
          </div>
        )}
        <div className="space-y-6">
          {renderStepContent()}
        </div>
        {renderStepButtons()}
      </div>
    </>
  )
} 