"use client"

import type React from "react"
import { useState } from "react"

import type { translations } from "@/lib/translations"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"

interface CreateAccountPageProps {
  onBack: () => void
  onNext: () => void
  t: (typeof translations)["es"]
}

function generateVerificationCode() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let result = ""
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export default function CreateAccountPage({ onBack, onNext, t }: CreateAccountPageProps) {
  const [verificationCode, setVerificationCode] = useState(generateVerificationCode())
  const [phoneNumber, setPhoneNumber] = useState("")

  const handleGenerateNewCode = () => {
    setVerificationCode(generateVerificationCode())
  }

  const handleSendCode = () => {
    if (phoneNumber) {
      alert(`${t.create_codeSentAlert} +52 ${phoneNumber}`)
    } else {
      alert(t.create_enterPhoneAlert)
    }
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "")
    setPhoneNumber(value)
  }

  return (
    <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl p-8 md:p-12 mt-8">
      <div className="text-center">
        <h1 className="mb-2 text-3xl font-bold text-gray-800">{t.create_formTitle}</h1>
        <p className="mb-8 text-gray-600">{t.create_formSubtitle}</p>
      </div>

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
        <div>
          <Label htmlFor="enter-code" className="text-gray-700">
            {t.create_enterCodeLabel}
          </Label>
          <Input id="enter-code" placeholder={t.create_enterCodePlaceholder} className="mt-1" />
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4">
        <Button onClick={onBack} className="w-full bg-gray-200 py-3 text-gray-700 hover:bg-gray-300">
          ← {t.back_to_main_panel}
        </Button>
        <Button onClick={onNext} className="w-full bg-blue-600 py-3 text-white hover:bg-blue-700">
          {t.create_verifyAndContinue} →
        </Button>
      </div>
    </div>
  )
}
