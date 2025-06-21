"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"

interface CreateAccountPageProps {
  onBack: () => void
  onNext: () => void
  t: any
}

export default function CreateAccountPage({ onBack, onNext, t }: CreateAccountPageProps) {
  return (
    <div className="relative z-10 flex flex-col min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between p-6">
        <div className="flex items-center gap-4">
          <div className="bg-white rounded-2xl p-2 shadow-lg">
            <img src="/saephone-logo.jpg" alt="SAEPHONE Logo" className="w-16 h-16 object-contain" />
          </div>
          <div>
            <h1 className="text-white text-2xl font-bold">SAEPHONE</h1>
            <p className="text-white/80 text-sm">{t.create_headerSubtitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-xl border border-white/20 font-medium transition-all duration-200 hover:scale-105 shadow-lg"
          >
            {t.create_backToHome}
          </button>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
              1
            </div>
            <span className="text-white text-sm mt-2">{t.create_step1}</span>
          </div>
          <div className="w-16 h-0.5 bg-white/30"></div>
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 bg-white/30 rounded-full flex items-center justify-center text-white font-bold">
              2
            </div>
            <span className="text-white/70 text-sm mt-2">{t.create_step2}</span>
          </div>
          <div className="w-16 h-0.5 bg-white/30"></div>
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 bg-white/30 rounded-full flex items-center justify-center text-white font-bold">
              3
            </div>
            <span className="text-white/70 text-sm mt-2">{t.create_step3}</span>
          </div>
          <div className="w-16 h-0.5 bg-white/30"></div>
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 bg-white/30 rounded-full flex items-center justify-center text-white font-bold">
              4
            </div>
            <span className="text-white/70 text-sm mt-2">{t.create_step4}</span>
          </div>
          <div className="w-16 h-0.5 bg-white/30"></div>
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 bg-white/30 rounded-full flex items-center justify-center text-white font-bold">
              5
            </div>
            <span className="text-white/70 text-sm mt-2">{t.create_step5}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-lg bg-white shadow-2xl">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-blue-600 text-2xl font-bold mb-2">{t.create_formTitle}</h2>
              <p className="text-gray-600">{t.create_formSubtitle}</p>
            </div>

            <div className="space-y-6">
              <div>
                <Label className="text-blue-600 font-medium">{t.create_verificationCodeLabel}</Label>
                <div className="flex gap-3 mt-2">
                  <Input
                    placeholder={t.create_verificationCodePlaceholder}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="bg-gray-100 px-4 py-2 rounded border flex items-center">
                    <span className="text-purple-600 font-bold text-lg">2Y22</span>
                  </div>
                  <Button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">
                    {t.create_generateCode}
                  </Button>
                </div>
              </div>

              <div>
                <Label className="text-blue-600 font-medium">{t.create_phoneLabel}</Label>
                <div className="flex gap-3 mt-2">
                  <div className="bg-gray-100 px-3 py-2 rounded border">+52</div>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder={t.create_phonePlaceholder}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">
                    {t.create_sendCode}
                  </Button>
                </div>
              </div>

              <div>
                <Label className="text-blue-600 font-medium">{t.create_enterCodeLabel}</Label>
                <Input
                  type="text"
                  placeholder={t.create_enterCodePlaceholder}
                  className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  maxLength={4}
                />
              </div>

              <div className="flex gap-3 mt-8">
                <Button
                  onClick={onBack}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-3 rounded"
                >
                  ← {t.create_backToHome}
                </Button>
                <Button
                  onClick={onNext}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded"
                >
                  {t.create_verifyAndContinue} →
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
