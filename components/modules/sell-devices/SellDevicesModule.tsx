"use client"

import React, { useState, useRef } from "react"
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
  const [currentStep, setCurrentStep] = useState<"phone" | "terms" | "identity" | "credit" | "modelplan" | "contract" | "appinstall" | "references" | "complete">("phone")
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

  // Nombre extraído de la INE (fijo por ahora)
  const extractedName = "María Rodríguez Hernández";
  // Ref y estado para PDF
  const pdfUrlRef = useRef<string | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string>("");

  // Función para generar PDF dinámico
  const generateContractPDF = () => {
    const doc = new jsPDF();
    const today = new Date();
    const fecha = today.toLocaleDateString();
    const weeks = selectedPlan || customWeeks;
    const pagoSemanal = getWeeklyPayment(weeks);
    const firstPaymentDate = new Date();
    firstPaymentDate.setDate(firstPaymentDate.getDate() + 7); // First payment in 7 days
    
    doc.setFontSize(16);
    doc.text("CONTRATO DE VENTA EN PARCIALIDADES", 15, 20);
    doc.setFontSize(12);
    doc.text(`SAEPHONE México, S. de R.L. de C.V.`, 15, 30);
    doc.text(`Fecha: ${fecha}`, 15, 38);
    doc.setFontSize(10);
    doc.text("1. DATOS DEL PROVEEDOR", 15, 48);
    doc.text("Razón Social: SAEPHONE México, S. de R.L. de C.V.", 15, 54);
    doc.text("RFC: (insertar RFC aquí)", 15, 60);
    doc.text("Domicilio: (insertar domicilio fiscal aquí)", 15, 66);
    doc.text("Correo electrónico: (insertar correo de contacto aquí)", 15, 72);
    doc.text("2. DATOS DEL CLIENTE", 15, 82);
    doc.text(`Nombre: ${extractedName}`, 15, 88);
    doc.text(`Teléfono: +52 ${phoneNumber}`, 15, 94);
    doc.text(`Correo electrónico: ${userEmail}`, 15, 100);
    doc.text("3. OBJETO DEL CONTRATO", 15, 110);
    doc.text("El presente contrato tiene por objeto la compraventa de un dispositivo móvil", 15, 116);
    doc.text("nuevo bajo la modalidad de venta a plazos. El dispositivo será entregado al", 15, 122);
    doc.text("cliente al momento de firmar este contrato, y el pago será realizado conforme", 15, 128);
    doc.text("al plan de financiamiento seleccionado.", 15, 134);
    doc.text("4. PLAN DE FINANCIAMIENTO", 15, 144);
    doc.text(`Pago inicial: $${initialPayment}`, 15, 150);
    doc.text(`Total de pagos parciales: ${weeks}`, 15, 156);
    doc.text(`Monto por pago parcial: $${pagoSemanal}`, 15, 162);
    doc.text("Frecuencia de pago: Semanal", 15, 168);
    doc.text(`Fecha de primer pago: ${firstPaymentDate.toLocaleDateString()}`, 15, 174);
    doc.text("5. DISPOSICIONES GENERALES", 15, 184);
    doc.text("- El equipo será bloqueado en caso de incumplimiento de pago.", 15, 190);
    doc.text("- El cliente reconoce haber sido informado sobre las condiciones del plan.", 15, 196);
    doc.text("- El cliente autoriza el uso de sus datos para fines de verificación y", 15, 202);
    doc.text("  cobranza conforme a la legislación vigente.", 15, 208);
    doc.text("- La propiedad del equipo permanecerá en SAEPHONE hasta el pago total", 15, 214);
    doc.text("  del monto financiado.", 15, 220);
    doc.text("6. FIRMA DEL CONTRATO", 15, 230);
    doc.text("El cliente declara haber leído, comprendido y aceptado los términos de este", 15, 236);
    doc.text("contrato. El contrato se considera válido al momento de su firma digital", 15, 242);
    doc.text("mediante el escaneo del código QR provisto por la plataforma.", 15, 248);
    // Generar blob y url
    const pdfBlob = doc.output("blob");
    const url = URL.createObjectURL(pdfBlob);
    pdfUrlRef.current = url;
    setPdfUrl(url);
    return url;
  };

  // Generar PDF cada vez que cambian los datos relevantes
  React.useEffect(() => {
    generateContractPDF();
    // Cleanup url anterior
    return () => {
      if (pdfUrlRef.current) URL.revokeObjectURL(pdfUrlRef.current);
    };
    // eslint-disable-next-line
  }, [selectedBrand, selectedModel, selectedCapacity, devicePrice, paymentMethod, selectedPlan, customWeeks, phoneNumber, userEmail]);

  // Estado para el paso de instalación de app (Paso 8)
  const [qrExpanded, setQrExpanded] = React.useState(false);
  const [installing, setInstalling] = React.useState(true);
  React.useEffect(() => {
    if (currentStep === "appinstall") {
      setInstalling(true);
      const timer = setTimeout(() => setInstalling(false), 30000);
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  const renderPhoneStep = () => (
      <div>
      <div className="text-center mb-4">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-1">{t.create_formTitle}</h2>
        <p className="text-gray-600 text-sm md:text-base">{t.create_formSubtitle}</p>
      </div>
      <div className="space-y-4">
      <div>
          <Label htmlFor="verification-code" className="text-gray-700 text-sm">{t.create_verificationCodeLabel}</Label>
          <div className="mt-1 flex items-center gap-2 md:gap-4">
            <Input
              id="verification-code"
              placeholder={t.create_verificationCodePlaceholder}
              className="font-mono tracking-widest h-10 text-sm flex-1"
              value={verificationCodeInput}
              onChange={e => setVerificationCodeInput(e.target.value)}
              maxLength={4}
            />
            <div className="rounded-md border border-gray-300 bg-gray-100 px-4 py-2 text-base font-bold text-gray-700 select-none min-w-[56px] text-center">
              {verificationCode}
            </div>
            <Button onClick={handleGenerateNewCode} className="bg-green-500 text-white hover:bg-green-600 h-10 px-3 text-sm">
              {t.create_generateCode}
            </Button>
          </div>
        </div>
          <div>
          <Label htmlFor="phone-number" className="text-gray-700 text-sm">{t.create_phoneLabel}</Label>
          <div className="mt-1 flex items-center gap-2 md:gap-4">
            <span className="rounded-md border border-gray-300 bg-gray-100 px-3 py-1.5 text-gray-700 text-sm">+52</span>
            <Input
              id="phone-number"
              placeholder={t.create_phonePlaceholder}
              value={phoneNumber}
              onChange={handlePhoneChange}
              maxLength={10}
              className="h-10 text-sm"
            />
            <Button onClick={handleSendCode} className="bg-green-500 text-white hover:bg-green-600 h-10 px-3 text-sm">
              {t.create_sendCode}
            </Button>
          </div>
          </div>
          <div>
          <Label htmlFor="entered-code" className="text-gray-700 text-sm">{t.create_enterCodeLabel}</Label>
          <Input
            id="entered-code"
            placeholder={t.create_enterCodePlaceholder}
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
      <p className="text-gray-700 mb-8">{t.identityVerification_subtitle}</p>
      <div className="w-full max-w-3xl flex flex-col gap-10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Check className="w-5 h-5 text-green-500" />
            <span className="font-semibold text-lg text-gray-900">{t.identityVerification_idCardTitle}</span>
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
                  <span className="text-green-600 font-bold text-lg">{t.identityVerification_frontId}</span>
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
                  <span className="text-green-600 font-bold text-lg">{t.identityVerification_backId}</span>
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
            <span className="font-bold text-green-900 mr-2">{t.identityVerification_extractedDataTitle}</span>
            <span className="text-gray-900 font-medium">María Rodríguez Hernández</span>
          </div>
        )}
        <div className="mt-8">
          <div className="flex items-center gap-2 mb-2">
            <Check className={`w-5 h-5 ${selfieCaptured ? 'text-green-500' : 'text-green-500 opacity-50'}`} />
            <span className="font-semibold text-lg text-gray-900">{t.identityVerification_selfieTitle}</span>
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
              <p className="mt-4 text-green-600 font-bold text-lg">{t.identityVerification_selfieSuccess}</p>
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
          <p className="text-xl font-semibold text-gray-800 mb-2">{t.creditProfile_loadingTitle}</p>
          <p className="text-gray-600">{t.creditProfile_loadingSubtitle}</p>
        </div>
      )}
      {creditEvaluated && (
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{t.creditProfile_verifiedTitle}</h2>
          <p className="text-gray-700 mb-6">{t.creditProfile_verifiedSubtitle}</p>
          <div className="flex gap-2 mb-6">
            <button className="px-4 py-2 rounded-lg bg-gray-100 font-semibold text-gray-800 border border-gray-200">{t.creditProfile_bureau1}</button>
            <button className="px-4 py-2 rounded-lg bg-gray-100 font-semibold text-gray-800 border border-gray-200">{t.creditProfile_bureau2}</button>
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
                <span className="text-green-600 font-semibold text-lg">{t.creditProfile_scoreExcellent}</span>
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
          <button className="w-full py-3 rounded-lg bg-black text-white font-semibold text-lg mb-8">{t.creditProfile_updateScore}</button>
          <div className="grid grid-cols-2 gap-4 w-full">
            <div className="bg-gray-50 rounded-xl p-4 flex flex-col items-start shadow border border-gray-100">
              <div className="flex items-center justify-between w-full mb-2">
                <span className="font-semibold text-gray-800">{t.creditProfile_paymentHistory}</span>
                <span className="text-green-600 font-semibold text-xs bg-green-100 rounded px-2 py-0.5">{t.creditProfile_highImpact}</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">100%</div>
              <div className="text-xs text-gray-500">{t.creditProfile_onTimePayments}</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 flex flex-col items-start shadow border border-gray-100">
              <div className="flex items-center justify-between w-full mb-2">
                <span className="font-semibold text-gray-800">{t.creditProfile_cardUsage}</span>
                <span className="text-green-600 font-semibold text-xs bg-green-100 rounded px-2 py-0.5">{t.creditProfile_highImpact}</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">2%</div>
              <div className="text-xs text-gray-500">{t.creditProfile_creditUsed}</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 flex flex-col items-start shadow border border-gray-100">
              <div className="flex items-center justify-between w-full mb-2">
                <span className="font-semibold text-gray-800">{t.creditProfile_creditAge}</span>
                <span className="text-green-600 font-semibold text-xs bg-green-100 rounded px-2 py-0.5">{t.creditProfile_mediumImpact}</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">7 {t.creditProfile_years}</div>
              <div className="text-xs text-gray-500">{t.creditProfile_avgAge}</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 flex flex-col items-start shadow border border-gray-100">
              <div className="flex items-center justify-between w-full mb-2">
                <span className="font-semibold text-gray-800">{t.creditProfile_totalAccounts}</span>
                <span className="text-red-600 font-semibold text-xs bg-red-100 rounded px-2 py-0.5">{t.creditProfile_lowImpact}</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">28</div>
              <div className="text-xs text-gray-500">{t.creditProfile_openClosed}</div>
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
        <div className="font-bold text-lg text-green-600 mb-2 flex items-center gap-2"><span className="rounded-full bg-green-500 text-white w-6 h-6 flex items-center justify-center mr-2">1</span>{t.deviceSelection_paymentMethod}</div>
        <div className="grid grid-cols-2 gap-4 mb-2">
          <button type="button" onClick={() => setPaymentMethod("financiado")} className={`border rounded-lg py-4 font-bold text-lg ${paymentMethod==="financiado" ? "border-green-500 bg-green-50" : "border-gray-300 bg-white"}`}>{t.deviceSelection_financed}</button>
          <button type="button" onClick={() => setPaymentMethod("contado")} className={`border rounded-lg py-4 font-bold text-lg ${paymentMethod==="contado" ? "border-green-500 bg-green-50" : "border-gray-300 bg-white"}`}>{t.deviceSelection_cash}</button>
        </div>
        {!paymentMethod && <div className="text-red-500 text-sm mt-1">{t.deviceSelection_selectPaymentMethod}</div>}
      </div>
      {/* 2. Modelo */}
      <div className="mb-6">
        <div className="font-bold text-lg text-green-600 mb-2 flex items-center gap-2"><span className="rounded-full bg-green-500 text-white w-6 h-6 flex items-center justify-center mr-2">2</span>{t.deviceSelection_model}</div>
        <div className="flex gap-2 mb-2">
          <select className="border rounded-md px-3 py-2" value={selectedBrand} onChange={e => {setSelectedBrand(e.target.value); setSelectedModel("");}}>
            <option value="">{t.deviceSelection_selectBrand}</option>
            {brands.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
          <select className="border rounded-md px-3 py-2" value={selectedModel} onChange={e => setSelectedModel(e.target.value)} disabled={!selectedBrand}>
            <option value="">{t.deviceSelection_selectModel}</option>
            {selectedBrand && getModelsByBrand(selectedBrand).map((m: string) => <option key={m} value={m}>{m}</option>)}
          </select>
          <select className="border rounded-md px-3 py-2" value={selectedCapacity} onChange={e => setSelectedCapacity(e.target.value)}>
            <option value="">{t.deviceSelection_selectCapacity}</option>
            {capacities.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        {!selectedBrand && <div className="text-red-500 text-sm mt-1">{t.deviceSelection_selectBrandPrompt}</div>}
        <div className="mt-2">
          <Label className="text-blue-700 text-sm">{t.deviceSelection_devicePrice}</Label>
          <div className="flex items-center gap-2 mt-1">
            <span className="border rounded-l px-2 py-1 bg-gray-100">$</span>
            <Input type="number" className="w-32 h-10 text-lg" value={devicePrice} onChange={e => setDevicePrice(Number(e.target.value))} min={0} />
          </div>
          <div className="text-xs text-gray-500 mt-1">{t.deviceSelection_priceDisclaimer}</div>
        </div>
      </div>
      {/* Pago inicial requerido */}
      {paymentMethod==="financiado" && devicePrice > 0 && (
        <div className="bg-blue-50 border-l-4 border-blue-400 rounded-lg p-4 mb-6">
          <div className="font-bold text-blue-900 mb-2">{t.deviceSelection_initialPaymentRequired}</div>
          <div className="flex flex-col gap-1 text-sm">
            <div className="flex justify-between"><span>{t.deviceSelection_devicePrice}:</span><span className="font-bold">${devicePrice.toLocaleString()}</span></div>
            <div className="flex justify-between"><span>{t.deviceSelection_initialPayment} (15%):</span><span className="font-bold text-blue-700">${initialPayment.toLocaleString()}</span></div>
            <div className="flex justify-between"><span>{t.deviceSelection_balanceToFinance}</span><span className="font-bold text-green-700">${balance.toLocaleString()}</span></div>
          </div>
          <div className="text-xs text-blue-700 mt-2">{t.deviceSelection_importantInitialPayment}</div>
        </div>
      )}
      {/* 3. Plan de financiamiento */}
      {paymentMethod==="financiado" && devicePrice > 0 && (
        <div className="mb-6">
          <div className="font-bold text-lg text-green-600 mb-2 flex items-center gap-2"><span className="rounded-full bg-green-500 text-white w-6 h-6 flex items-center justify-center mr-2">3</span>{t.deviceSelection_financingPlan}</div>
          <div className="grid grid-cols-4 gap-2 mb-4">
            {plans.map(weeks => (
              <button key={weeks} type="button" onClick={() => setSelectedPlan(weeks)} className={`border rounded-lg py-4 font-bold text-lg text-center ${selectedPlan===weeks ? "border-green-500 bg-green-50" : "border-gray-300 bg-white"}`}>
                {weeks} {t.deviceSelection_weeks}
                <div className="font-normal text-base mt-1">${getWeeklyPayment(weeks)} <span className="text-xs">{t.deviceSelection_perWeek}</span></div>
                <div className="text-xs text-gray-500 mt-1">{t.deviceSelection_initialPayment}: ${initialPayment} <br/> {t.deviceSelection_finalPrice}: ${(getWeeklyPayment(weeks)*weeks+initialPayment).toLocaleString()}</div>
              </button>
            ))}
          </div>
          {/* Plan personalizado */}
          <div className="bg-gray-50 rounded-lg p-4 mt-4">
            <div className="font-bold text-blue-700 text-center mb-2">{t.deviceSelection_customPlan}</div>
            <div className="flex flex-col items-center">
              <span className="mb-2">{t.deviceSelection_weeksLabel}{customWeeks}</span>
              <input type="range" min={10} max={30} value={customWeeks} onChange={e => {setCustomWeeks(Number(e.target.value)); setSelectedPlan(null);}} className="w-full mb-2" />
              <div className="font-bold text-2xl text-green-700 mb-1">${getWeeklyPayment(customWeeks)}</div>
              <div className="text-xs text-gray-500">{t.deviceSelection_initialPayment}: ${initialPayment} <br/> {t.deviceSelection_finalPrice}: ${(getWeeklyPayment(customWeeks)*customWeeks+initialPayment).toLocaleString()}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
  const renderContractStep = () => (
    <div className="w-full flex flex-col items-center">
      <p className="text-gray-700 mb-8 text-center">{t.contractGeneration_subtitle}</p>
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg p-8 flex flex-col gap-8">
        {/* 1. Contrato de Financiamiento */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="rounded-full bg-green-500 text-white w-6 h-6 flex items-center justify-center font-bold">1</span>
            <span className="font-bold text-green-700 text-lg">{t.contractGeneration_financingTitle}</span>
            <button className="ml-auto bg-gray-100 rounded-full p-2"><FileText className="w-5 h-5 text-gray-500" /></button>
          </div>
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <div className="text-center font-bold text-lg mb-2">CONTRATO DE VENTA EN PARCIALIDADES</div>
            <div className="text-center font-bold text-md mb-4">SAEPHONE México, S. de R.L. de C.V.<br/>Fecha: {new Date().toLocaleDateString()}</div>
            <hr className="my-2" />
            <div className="text-sm mb-2 font-bold">1. DATOS DEL PROVEEDOR</div>
            <div className="text-sm text-gray-700">
              <div><span className="font-bold">Razón Social:</span> SAEPHONE México, S. de R.L. de C.V.</div>
              <div><span className="font-bold">RFC:</span> (insertar RFC aquí)</div>
              <div><span className="font-bold">Domicilio:</span> (insertar domicilio fiscal aquí)</div>
              <div><span className="font-bold">Correo electrónico:</span> (insertar correo de contacto aquí)</div>
            </div>
            <div className="text-sm mt-4 mb-2 font-bold">2. DATOS DEL CLIENTE</div>
            <div className="text-sm text-gray-700">
              <div><span className="font-bold">Nombre:</span> {extractedName}</div>
              <div><span className="font-bold">Teléfono:</span> +52 {phoneNumber}</div>
              <div><span className="font-bold">Correo electrónico:</span> {userEmail}</div>
            </div>
            <div className="text-sm mt-4 mb-2 font-bold">3. OBJETO DEL CONTRATO</div>
            <div className="text-sm text-gray-700 mb-4">
              El presente contrato tiene por objeto la compraventa de un dispositivo móvil nuevo bajo la modalidad de venta a plazos. El dispositivo será entregado al cliente al momento de firmar este contrato, y el pago será realizado conforme al plan de financiamiento seleccionado.
            </div>
            <div className="text-sm mb-2 font-bold">4. PLAN DE FINANCIAMIENTO</div>
            <div className="text-sm text-gray-700">
              <div><span className="font-bold">Pago inicial:</span> ${initialPayment}</div>
              <div><span className="font-bold">Total de pagos parciales:</span> {selectedPlan || customWeeks}</div>
              <div><span className="font-bold">Monto por pago parcial:</span> ${getWeeklyPayment(selectedPlan || customWeeks)}</div>
              <div><span className="font-bold">Frecuencia de pago:</span> Semanal</div>
              <div><span className="font-bold">Fecha de primer pago:</span> {(() => {
                const firstPaymentDate = new Date();
                firstPaymentDate.setDate(firstPaymentDate.getDate() + 7);
                return firstPaymentDate.toLocaleDateString();
              })()}</div>
            </div>
            <div className="text-sm mt-4 mb-2 font-bold">5. DISPOSICIONES GENERALES</div>
            <div className="text-sm text-gray-700">
              <div>• El equipo será bloqueado en caso de incumplimiento de pago.</div>
              <div>• El cliente reconoce haber sido informado sobre las condiciones del plan.</div>
              <div>• El cliente autoriza el uso de sus datos para fines de verificación y cobranza conforme a la legislación vigente.</div>
              <div>• La propiedad del equipo permanecerá en SAEPHONE hasta el pago total del monto financiado.</div>
            </div>
            <div className="text-sm mt-4 mb-2 font-bold">6. FIRMA DEL CONTRATO</div>
            <div className="text-sm text-gray-700">
              El cliente declara haber leído, comprendido y aceptado los términos de este contrato. El contrato se considera válido al momento de su firma digital mediante el escaneo del código QR provisto por la plataforma.
            </div>
          </div>
        </div>
        {/* 2. Firma Digital del Cliente */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="rounded-full bg-green-500 text-white w-6 h-6 flex items-center justify-center font-bold">2</span>
            <span className="font-bold text-green-700 text-lg">{t.contractGeneration_signatureTitle}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="mb-2 text-gray-700">{t.contractGeneration_qrInstruction}</span>
            <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
              <div className="bg-white p-2 rounded-lg border border-gray-200 cursor-pointer hover:shadow-lg transition">
                <QRCodeCanvas value={pdfUrl} size={128} />
              </div>
            </a>
          </div>
        </div>
        {/* 3. Acciones Disponibles */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="rounded-full bg-green-500 text-white w-6 h-6 flex items-center justify-center font-bold">3</span>
            <span className="font-bold text-green-700 text-lg">{t.contractGeneration_actionsTitle}</span>
          </div>
          <a href={pdfUrl} download={`Contrato_Saephone_${extractedName.replace(/ /g, "_")}.pdf`}>
            <Button className="bg-green-600 text-white font-bold px-6 py-2 rounded-lg flex items-center gap-2">
              <Download className="w-5 h-5" /> {t.contractGeneration_downloadBtn}
            </Button>
          </a>
        </div>
      </div>
    </div>
  )
  const renderAppInstallStep = () => {
    // URL de ejemplo para el APK
    const apkUrl = "https://saephone.com/app.apk";
    return (
      <div className="w-full flex flex-col items-center">
        <div className="text-center text-gray-700 text-base mb-8">{t.appInstall_subtitle}</div>
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Lado izquierdo: QR */}
          <div className="flex flex-col items-center">
            <div className="text-lg font-bold text-gray-800 mb-1">{t.appInstall_qrTitle}</div>
            <div className="text-gray-500 text-sm mb-4">{t.appInstall_qrSubtitle}</div>
            <div className="cursor-pointer" onClick={() => setQrExpanded(!qrExpanded)}>
              <QRCodeCanvas value={apkUrl} size={qrExpanded ? 256 : 160} />
            </div>
          </div>
          {/* Lado derecho: Estado de instalación */}
          <div className="flex flex-col items-center w-full">
            <div className="text-lg font-bold text-gray-800 mb-4 text-center">{t.appInstall_statusTitle}</div>
            <div className="w-full flex flex-col items-center justify-center bg-gray-50 rounded-xl p-8 min-h-[180px]">
              {installing ? (
                <>
                  <Loader2 className="w-16 h-16 text-blue-500 animate-spin mb-4" />
                  <div className="text-blue-600 text-lg font-semibold">{t.appInstall_statusTitle}...</div>
                </>
              ) : (
                <>
                  <Check className="w-16 h-16 text-green-500 mb-4" />
                  <div className="text-green-600 text-lg font-bold mb-1">{t.appInstall_successTitle}</div>
                  <div className="text-gray-700 text-base">{t.appInstall_successSubtitle}</div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
  const renderReferencesStep = () => (
    <div className="w-full flex flex-col items-center">
      <p className="text-gray-700 mb-8 text-center">{t.references_subtitle}</p>
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg p-8 flex flex-col gap-6">
        <div>
          <Label htmlFor="user-email" className="text-blue-700 font-bold">{t.references_email}</Label>
          <Input
            id="user-email"
            type="email"
            placeholder={t.references_emailPlaceholder}
            value={userEmail}
            onChange={e => setUserEmail(e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="family-contact-name" className="text-blue-700 font-bold">{t.references_famContactName}</Label>
          <Input
            id="family-contact-name"
            type="text"
            placeholder={t.references_famContactNamePlaceholder}
            value={familyContactName}
            onChange={e => setFamilyContactName(e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="family-contact-phone" className="text-blue-700 font-bold">{t.references_phone1}</Label>
          <Input
            id="family-contact-phone"
            type="tel"
            placeholder={t.references_phone1Placeholder}
            value={familyContactPhone}
            onChange={e => setFamilyContactPhone(e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="friend-contact-name" className="text-blue-700 font-bold">{t.references_friendContactName}</Label>
          <Input
            id="friend-contact-name"
            type="text"
            placeholder={t.references_friendContactNamePlaceholder}
            value={friendContactName}
            onChange={e => setFriendContactName(e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="friend-contact-phone" className="text-blue-700 font-bold">{t.references_phone2}</Label>
          <Input
            id="friend-contact-phone"
            type="tel"
            placeholder={t.references_phone2Placeholder}
            value={friendContactPhone}
            onChange={e => setFriendContactPhone(e.target.value)}
            className="mt-1"
          />
        </div>
        <div className="flex gap-4 justify-end mt-8">
          <Button onClick={() => setCurrentStep("contract")} className="bg-gray-200 text-gray-700 hover:bg-gray-300">
            ← {t.deviceSelection_back}
          </Button>
          <Button
            onClick={() => setCurrentStep("appinstall")}
            className="bg-black text-white font-bold px-6 py-2 rounded-lg"
            disabled={!userEmail || !familyContactName || !familyContactPhone || !friendContactName || !friendContactPhone}
          >
            {t.deviceSelection_continue} →
          </Button>
        </div>
      </div>
    </div>
  )
  const renderCompleteStep = () => (
    <div className="text-center space-y-6">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
        <Check className="w-8 h-8 text-green-600" />
      </div>
      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">{t.deviceConfig_success}</h3>
        <p className="text-gray-600">{t.deviceConfig_successMsg}</p>
      </div>
    </div>
  )
  const renderTermsStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-2">
        {/* Título eliminado por solicitud */}
      </div>
      <div className="flex justify-center">
        <div className="w-full max-w-2xl">
          <div className="bg-gray-50 rounded-lg p-6 mb-6 max-h-96 overflow-y-auto border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <img src="/saephone-logo.jpg" alt="SAEPHONE Logo" className="w-10 h-10 object-contain" />
              {/* Título azul eliminado por solicitud */}
            </div>
            <div className="space-y-4 text-sm text-gray-700">
              <p>{t.terms_content1}</p>
              <div>
                <h4 className="font-bold text-gray-900 mb-2">{t.terms_content2}</h4>
                <p>{t.terms_content3}</p>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-2">{t.terms_content4}</h4>
                <p>{t.terms_content5}</p>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-2">{t.terms_content6}</h4>
                <p>{t.terms_content7}</p>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-2">{t.terms_content8}</h4>
                <p>{t.terms_content9}</p>
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
                {t.terms_acceptTerms}
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
                {t.terms_acceptPrivacy}
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
      case "contract":
        return renderContractStep()
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
              {t.deviceSelection_back}
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
              {t.deviceSelection_continue} →
            </Button>
          </div>
        )
      case "terms":
        return (
          <div className="mt-8 flex gap-4 justify-end">
            <Button onClick={() => setCurrentStep("phone")} className="bg-gray-200 text-gray-700 hover:bg-gray-300">
              ← {t.deviceSelection_back}
            </Button>
            <Button 
              onClick={() => setCurrentStep("identity")}
              disabled={!acceptTerms || !acceptPrivacy}
              className="bg-black text-white px-8 py-2 rounded-lg font-medium disabled:bg-gray-300"
            >
              {t.deviceSelection_continue}
            </Button>
          </div>
        )
      case "identity":
        return (
          <div className="mt-8 flex gap-4 justify-end">
            <Button onClick={() => setCurrentStep("terms")} className="bg-gray-200 text-gray-700 hover:bg-gray-300">
              ← {t.deviceSelection_back}
            </Button>
            <Button onClick={() => setCurrentStep("credit")} className="bg-black text-white px-8 py-2 rounded-lg font-medium">
              {t.deviceSelection_continue}
            </Button>
          </div>
        )
      case "credit":
        return (
          <div className="mt-8 flex gap-4 justify-end">
            <Button onClick={() => setCurrentStep("identity")} className="bg-gray-200 text-gray-700 hover:bg-gray-300">
              ← {t.deviceSelection_back}
            </Button>
            <Button onClick={() => setCurrentStep("modelplan")} className="bg-black text-white px-8 py-2 rounded-lg font-medium">
              {t.deviceSelection_continue}
            </Button>
          </div>
        )
      case "modelplan":
        return (
          <div className="mt-8 flex gap-4 justify-end">
            <Button onClick={() => setCurrentStep("credit")} className="bg-gray-200 text-gray-700 hover:bg-gray-300">
              ← {t.deviceSelection_back}
            </Button>
            <Button onClick={() => setCurrentStep("contract")} className="bg-black text-white px-8 py-2 rounded-lg font-medium">
              {t.deviceSelection_continue}
            </Button>
          </div>
        )
      case "contract":
        return (
          <div className="mt-8 flex gap-4 justify-end">
            <Button onClick={() => setCurrentStep("modelplan")} className="bg-gray-200 text-gray-700 hover:bg-gray-300">
              ← {t.deviceSelection_back}
            </Button>
            <Button onClick={() => setCurrentStep("references")} className="bg-black text-white px-8 py-2 rounded-lg font-medium">
              {t.deviceSelection_continue}
            </Button>
          </div>
        )
      case "appinstall":
        return (
          <div className="mt-8 flex gap-4 justify-end">
            <Button onClick={() => setCurrentStep("references")} className="bg-gray-200 text-gray-700 hover:bg-gray-300">
              ← {t.deviceSelection_back}
            </Button>
            <Button onClick={() => setCurrentStep("complete")} className="bg-black text-white font-bold px-6 py-2 rounded-lg">
              {t.deviceSelection_continue}
            </Button>
          </div>
        )
      case "complete":
        return (
          <div className="mt-8">
            <Button onClick={onBack} className="w-full bg-blue-600 py-3 text-white hover:bg-blue-700">
              {t.deviceSelection_back}
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
        return t.progress_step1
      case "terms":
        return t.progress_step2
      case "identity":
        return t.progress_step4
      case "credit":
        return t.creditProfile_title
      case "modelplan":
        return t.deviceSelection_title
      case "contract":
        return t.contractGeneration_title
      case "references":
        return t.references_title
      case "appinstall":
        return t.appInstall_title
      case "complete":
        return t.deviceConfig_title
      default:
        return t.sell_device
    }
  }

  // Barra de progreso solo con pasos 1 al 9, traducibles dinámicamente
  const progressStepKeys = [
    t.progress_step1, // Verificación Telefónica / Phone Verification
    t.progress_step2, // Términos y Condiciones / Terms and Conditions
    t.progress_step4, // Verificación de Identidad / Identity Verification
    t.creditProfile_title, // Perfil crediticio / Credit Profile
    t.deviceSelection_title, // Selección de Modelo y Plan de Financiamiento / Model and Financing Plan Selection
    t.contractGeneration_title, // Generación del Contrato / Contract Generation
    t.references_title, // Referencias / References
    t.appInstall_title, // Instalación de la Aplicación SAEPHONE / SAEPHONE Application Installation
    t.deviceConfig_title // Finalizar / Finish
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
      case "contract":
        return 5;
      case "references":
        return 6;
      case "appinstall":
        return 7;
      case "complete":
        return 8;
      default:
        return 0;
    }
  };

  const renderProgressBar = () => (
    <div className="flex items-center justify-center mb-8 w-full">
      <div className="flex items-center justify-between w-full max-w-6xl gap-x-8">
        {progressStepKeys.map((step, index) => (
          <React.Fragment key={index}>
            <div className="flex flex-col items-center flex-1 min-w-[110px] min-h-[70px]">
              <div className="flex flex-row items-center justify-center w-full">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold transition-colors duration-300 mx-auto ${
                    index <= getCurrentStepIndex() ? "bg-green-500 cursor-pointer" : "bg-white/30 cursor-default"
                  }`}
                  onClick={() => {
                    if (index <= getCurrentStepIndex()) {
                      if (index === 0) setCurrentStep("phone");
                      else if (index === 1) setCurrentStep("terms");
                      else if (index === 2) setCurrentStep("identity");
                      else if (index === 3) setCurrentStep("credit");
                      else if (index === 4) setCurrentStep("modelplan");
                      else if (index === 5) setCurrentStep("contract");
                      else if (index === 6) setCurrentStep("references");
                      else if (index === 7) setCurrentStep("appinstall");
                      else if (index === 8) setCurrentStep("complete");
                    }
                  }}
                  role="button"
                  tabIndex={index <= getCurrentStepIndex() ? 0 : -1}
                  aria-label={`Ir al paso ${index + 1}`}
                >
                  {index + 1}
                </div>
                {index < progressStepKeys.length - 1 && (
                  <div className="h-0.5 bg-gray-300 w-10 mx-1" />
                )}
              </div>
              <span
                className={`block text-xs mt-2 transition-colors duration-300 text-center ${index <= getCurrentStepIndex() ? "text-white" : "text-gray-400"}`}
                style={{lineHeight: '1.1', maxWidth: '110px', wordBreak: 'break-word'}}
              >
                {step}
              </span>
            </div>
          </React.Fragment>
        ))}
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