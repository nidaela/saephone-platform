"use client"

import type React from "react"
import { useState } from "react"
import { translations } from "@/lib/translations"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Smartphone, ArrowLeft, Check, FileText, Download } from "lucide-react"
import { QRCodeCanvas } from "qrcode.react"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"

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
  const [currentStep, setCurrentStep] = useState<"phone" | "verification" | "references" | "complete">("phone")
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
  const renderVerificationStep = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
        <div className="flex items-center gap-3">
          <Check className="w-6 h-6 text-blue-500" />
          <p className="text-gray-800">
            Se ha enviado un código al teléfono +52 {phoneNumber}
          </p>
        </div>
      </div>
      <div>
        <Label htmlFor="enter-code" className="text-gray-700">
          Ingresa el código
        </Label>
        <Input
          id="enter-code"
          placeholder="Código de 4 dígitos"
          className="mt-1"
          value={enteredCode}
          onChange={e => setEnteredCode(e.target.value)}
          maxLength={4}
        />
      </div>
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
  const renderStepContent = () => {
    switch (currentStep) {
      case "phone":
        return renderPhoneStep()
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
                  setCurrentStep("references")
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
      case "references":
        return (
          <div className="mt-8 grid grid-cols-2 gap-4">
            <Button onClick={() => setCurrentStep("phone")} className="w-full bg-gray-200 py-3 text-gray-700 hover:bg-gray-300">
              ← Regresar
            </Button>
            <Button
              onClick={handleCompleteAccount}
              disabled={!userEmail || !familyContactName || !familyContactPhone || !friendContactName || !friendContactPhone}
              className="w-full bg-green-600 py-3 text-white hover:bg-green-700 disabled:bg-gray-300"
            >
              Completar Venta →
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
      case "verification":
        return "Código de Verificación"
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
    t.progress_step1,
    t.progress_step2,
    t.progress_step3,
    t.progress_step4,
    t.progress_step5,
    t.progress_step6,
    t.progress_step7,
    t.progress_step8,
  ];

  const getCurrentStepIndex = () => {
    switch (currentStep) {
      case "phone":
        return 0;
      case "verification":
        return 1;
      case "references":
        return 2;
      case "complete":
        return 7;
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
                  else if (index === 1) setCurrentStep("verification");
                  else if (index === 2) setCurrentStep("references");
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
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 bg-green-100 rounded-full">
                <Smartphone className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <h1 className="mb-2 text-3xl font-bold text-gray-800">{getStepTitle()}</h1>
            <p className="text-gray-600">Módulo independiente de venta de dispositivos</p>
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