"use client"

import type React from "react"
import { useState } from "react"
import { translations } from "@/lib/translations"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { UserPlus, ArrowLeft, Check } from "lucide-react"

interface CreateAccountModuleProps {
  onBack: () => void
  onComplete: (userData: CreateAccountData) => void
  t: (typeof translations)["es"]
}

export interface CreateAccountData {
  phoneNumber: string
  verificationCode: string
  userEmail: string
  familyContactName: string
  familyContactPhone: string
  friendContactName: string
  friendContactPhone: string
}

function generateVerificationCode() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let result = ""
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export default function CreateAccountModule({ onBack, onComplete, t }: CreateAccountModuleProps) {
  const [currentStep, setCurrentStep] = useState<"phone" | "verification" | "references" | "complete">("phone")
  const [verificationCode, setVerificationCode] = useState(generateVerificationCode())
  const [phoneNumber, setPhoneNumber] = useState("")
  const [enteredCode, setEnteredCode] = useState("")
  const [userEmail, setUserEmail] = useState("")
  const [familyContactName, setFamilyContactName] = useState("")
  const [familyContactPhone, setFamilyContactPhone] = useState("")
  const [friendContactName, setFriendContactName] = useState("")
  const [friendContactPhone, setFriendContactPhone] = useState("")

  const handleGenerateNewCode = () => {
    setVerificationCode(generateVerificationCode())
  }

  const handleSendCode = () => {
    if (phoneNumber) {
      alert(`${t.create_codeSentAlert} +52 ${phoneNumber}`)
      setCurrentStep("verification")
    } else {
      alert(t.create_enterPhoneAlert)
    }
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "")
    setPhoneNumber(value)
  }

  const handleVerifyCode = () => {
    if (enteredCode === verificationCode) {
      setCurrentStep("references")
    } else {
      alert("Código incorrecto. Por favor, intenta de nuevo.")
    }
  }

  const handleCompleteAccount = () => {
    const userData: CreateAccountData = {
      phoneNumber,
      verificationCode,
      userEmail,
      familyContactName,
      familyContactPhone,
      friendContactName,
      friendContactPhone
    }
    onComplete(userData)
    setCurrentStep("complete")
  }

  const renderPhoneStep = () => (
    <div className="space-y-6">
      <div>
        <Label htmlFor="verification-code" className="text-gray-700">
          {t.create_verificationCodeLabel}
        </Label>
        <div className="mt-1 flex items-center gap-4">
          <Input
            id="verification-code"
            placeholder={t.create_verificationCodePlaceholder}
            className="font-mono tracking-widest"
          />
          <div className="rounded-md border border-gray-300 bg-gray-100 px-4 py-2 text-lg font-bold text-gray-700">
            {verificationCode}
          </div>
          <Button onClick={handleGenerateNewCode} className="bg-green-500 text-white hover:bg-green-600">
            {t.create_generateCode}
          </Button>
        </div>
      </div>
      
      <div>
        <Label htmlFor="phone-number" className="text-gray-700">
          {t.create_phoneLabel}
        </Label>
        <div className="mt-1 flex items-center gap-4">
          <span className="rounded-md border border-gray-300 bg-gray-100 px-4 py-2 text-gray-700">+52</span>
          <Input
            id="phone-number"
            placeholder={t.create_phonePlaceholder}
            value={phoneNumber}
            onChange={handlePhoneChange}
            maxLength={10}
          />
          <Button onClick={handleSendCode} className="bg-green-500 text-white hover:bg-green-600">
            {t.create_sendCode}
          </Button>
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
          {t.create_enterCodeLabel}
        </Label>
        <Input 
          id="enter-code" 
          placeholder={t.create_enterCodePlaceholder} 
          className="mt-1"
          value={enteredCode}
          onChange={(e) => setEnteredCode(e.target.value)}
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
          onChange={(e) => setUserEmail(e.target.value)}
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
          onChange={(e) => setFamilyContactName(e.target.value)}
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
          onChange={(e) => setFamilyContactPhone(e.target.value)}
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
          onChange={(e) => setFriendContactName(e.target.value)}
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
          onChange={(e) => setFriendContactPhone(e.target.value)}
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
        <h3 className="text-xl font-bold text-gray-800 mb-2">Cuenta creada exitosamente</h3>
        <p className="text-gray-600">La cuenta ha sido registrada en el sistema</p>
      </div>
    </div>
  )

  const renderStepContent = () => {
    switch (currentStep) {
      case "phone":
        return renderPhoneStep()
      case "verification":
        return renderVerificationStep()
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
          <div className="mt-8 grid grid-cols-2 gap-4">
            <Button onClick={onBack} className="w-full bg-gray-200 py-3 text-gray-700 hover:bg-gray-300">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t.back_to_main_panel}
            </Button>
            <Button 
              onClick={handleSendCode} 
              disabled={!phoneNumber}
              className="w-full bg-blue-600 py-3 text-white hover:bg-blue-700 disabled:bg-gray-300"
            >
              {t.create_sendCode} →
            </Button>
          </div>
        )
      case "verification":
        return (
          <div className="mt-8 grid grid-cols-2 gap-4">
            <Button onClick={() => setCurrentStep("phone")} className="w-full bg-gray-200 py-3 text-gray-700 hover:bg-gray-300">
              ← Regresar
            </Button>
            <Button 
              onClick={handleVerifyCode} 
              disabled={!enteredCode}
              className="w-full bg-blue-600 py-3 text-white hover:bg-blue-700 disabled:bg-gray-300"
            >
              {t.create_verifyAndContinue} →
            </Button>
          </div>
        )
      case "references":
        return (
          <div className="mt-8 grid grid-cols-2 gap-4">
            <Button onClick={() => setCurrentStep("verification")} className="w-full bg-gray-200 py-3 text-gray-700 hover:bg-gray-300">
              ← Regresar
            </Button>
            <Button 
              onClick={handleCompleteAccount} 
              disabled={!userEmail || !familyContactName || !familyContactPhone || !friendContactName || !friendContactPhone}
              className="w-full bg-green-600 py-3 text-white hover:bg-green-700 disabled:bg-gray-300"
            >
              Completar Cuenta →
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
        return "Cuenta Creada"
      default:
        return "Crear Cuenta"
    }
  }

  return (
    <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl p-8 md:p-12 mt-8">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className="p-3 bg-teal-100 rounded-full">
            <UserPlus className="w-8 h-8 text-teal-600" />
          </div>
        </div>
        <h1 className="mb-2 text-3xl font-bold text-gray-800">{getStepTitle()}</h1>
        <p className="text-gray-600">Módulo independiente de creación de cuentas</p>
      </div>

      {renderStepContent()}
      {renderStepButtons()}
    </div>
  )
} 