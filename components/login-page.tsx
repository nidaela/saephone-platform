"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent } from "@/components/ui/card"
import { Shield, CreditCard, Lock, Star } from "lucide-react"

interface LoginPageProps {
  onCreateAccount: () => void
  onLogin: (email: string, password: string) => void
  t: any
}

export default function LoginPage({ onCreateAccount, onLogin, t }: LoginPageProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)

  return (
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
        <p className="text-white text-lg font-medium mb-2">{t.login_headerTitle}</p>
        <p className="text-white/80 text-sm mb-8">{t.login_headerSubtitle}</p>
        <div className="flex justify-center gap-12 mb-8 text-white">
          <div className="text-center">
            <div className="text-3xl font-bold">50K+</div>
            <div className="text-sm opacity-90">{t.login_happyClients}</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold flex items-center justify-center gap-1">
              4.9 <Star className="w-5 h-5 text-yellow-400 fill-current" />
            </div>
            <div className="text-sm opacity-90">{t.login_rating}</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">0%</div>
            <div className="text-sm opacity-90">{t.login_interestFreePayments}</div>
          </div>
        </div>
      </div>

      <Card className="w-full max-w-md bg-white shadow-2xl rounded-2xl">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-blue-600 text-2xl font-bold mb-2">{t.login_welcomeBack}</h2>
            <p className="text-gray-600 text-sm">{t.login_loginToContinue}</p>
          </div>

          <div className="space-y-6">
            <div>
              <Label htmlFor="email" className="text-blue-600 font-semibold text-sm">
                {t.login_emailLabel}
              </Label>
              <Input
                id="email"
                type="email"
                placeholder={t.login_emailPlaceholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 w-full h-12 px-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-blue-600 font-semibold text-sm">
                {t.login_passwordLabel}
              </Label>
              <Input
                id="password"
                type="password"
                placeholder={t.login_passwordPlaceholder}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
                  {t.login_rememberMe}
                </Label>
              </div>
              <button type="button" className="text-sm text-green-600 hover:underline font-medium">
                {t.login_forgotPassword}
              </button>
            </div>

            <Button
              onClick={() => onLogin(email, password)}
              className="w-full bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-3 h-12 rounded-lg"
            >
              {t.login_loginButton}
            </Button>

            <div className="text-center text-sm text-gray-600 mb-8 pt-8">
              {t.login_newToSaephone}{" "}
              <button
                type="button"
                onClick={onCreateAccount}
                className="text-green-500 hover:text-green-600 font-semibold"
              >
                {t.login_createAccount}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-blue-50 rounded-2xl p-4 text-center">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div className="text-sm font-semibold text-blue-600">{t.login_securePayments}</div>
            </div>
            <div className="bg-green-50 rounded-2xl p-4 text-center">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <div className="text-sm font-semibold text-green-500">{t.login_monthlyPaymentsLabel}</div>
            </div>
            <div className="bg-blue-50 rounded-2xl p-4 text-center">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <Lock className="w-6 h-6 text-white" />
              </div>
              <div className="text-sm font-semibold text-blue-600">{t.login_latestTechnology}</div>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="text-center text-white/70 text-xs mt-6 max-w-md">
        {t.login_terms_part1}
        <span className="underline">{t.login_terms_link1}</span>
        {t.login_terms_part2}
        <span className="underline">{t.login_terms_link2}</span>
        {t.login_terms_part3}
      </div>
    </div>
  )
}
