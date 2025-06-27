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

interface SellDevicesModuleProps {
  onBack: () => void
  onComplete: (saleData: SaleData) => void
  t: (typeof translations)["es"]
}

export interface SaleData {
  selectedBrand: string
  selectedModel: string
  selectedCapacity: string
  devicePrice: number
  selectedFinancing: string
  paymentMethod: string
  contractGenerated: boolean
}

export default function SellDevicesModule({ onBack, onComplete, t }: SellDevicesModuleProps) {
  const [currentStep, setCurrentStep] = useState<"device-selection" | "contract-generation" | "contract-signed" | "complete">("device-selection")
  const [selectedBrand, setSelectedBrand] = useState("")
  const [selectedModel, setSelectedModel] = useState("")
  const [selectedCapacity, setSelectedCapacity] = useState("")
  const [devicePrice, setDevicePrice] = useState(0)
  const [selectedFinancing, setSelectedFinancing] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("")
  const [contractGenerated, setContractGenerated] = useState(false)
  const [customWeeks, setCustomWeeks] = useState(10)

  // Device data - independent from other modules
  const brands = ["Apple", "Samsung", "Xiaomi", "Huawei", "Google"]
  const models: Record<string, string[]> = {
    Apple: ["iPhone 15", "iPhone 15 Pro", "iPhone 14", "iPhone 14 Pro"],
    Samsung: ["Galaxy S24", "Galaxy S24 Ultra", "Galaxy A55", "Galaxy A35"],
    Xiaomi: ["Redmi Note 13", "POCO X6", "Redmi 13", "POCO M6"],
    Huawei: ["Pura 70", "Nova 12", "Y9 Prime", "Y7 Prime"],
    Google: ["Pixel 8", "Pixel 8 Pro", "Pixel 7a", "Pixel 6a"]
  }
  const capacities = ["128GB", "256GB", "512GB", "1TB"]

  const updatePrice = () => {
    if (selectedBrand && selectedModel && selectedCapacity) {
      const basePrice = 15000
      const brandMultiplier = selectedBrand === "Apple" ? 1.5 : selectedBrand === "Samsung" ? 1.3 : 1.0
      const modelMultiplier = selectedModel.includes("Pro") || selectedModel.includes("Ultra") ? 1.4 : 1.0
      const capacityMultiplier = selectedCapacity === "256GB" ? 1.2 : selectedCapacity === "512GB" ? 1.5 : selectedCapacity === "1TB" ? 2.0 : 1.0
      
      setDevicePrice(Math.round(basePrice * brandMultiplier * modelMultiplier * capacityMultiplier))
    }
  }

  const handleDeviceSelection = () => {
    if (paymentMethod && selectedBrand && selectedModel && selectedCapacity && (selectedFinancing === 'custom' || selectedFinancing)) {
      setCurrentStep("contract-generation")
    } else {
      alert("Por favor completa todos los campos")
    }
  }

  const generateContract = () => {
    setContractGenerated(true)
    setTimeout(() => {
      setCurrentStep("contract-signed")
    }, 2000)
  }

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

  const handleCompleteSale = () => {
    const saleData: SaleData = {
      selectedBrand,
      selectedModel,
      selectedCapacity,
      devicePrice,
      selectedFinancing,
      paymentMethod,
      contractGenerated
    }
    onComplete(saleData)
    setCurrentStep("complete")
  }

  const renderDeviceSelection = () => (
    <div className="space-y-8">
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
            className={`p-4 border-2 rounded-lg text-center transition-all ${paymentMethod === "financiado" ? "border-green-500 bg-green-50" : "border-gray-200 hover:border-gray-300"}`}
          >
            <div className="text-lg font-semibold text-gray-800">Financiado por Saephone</div>
            <div className="text-sm text-gray-600 mt-1">Pagos a meses sin intereses</div>
          </button>
          <button 
            onClick={() => setPaymentMethod("contado")} 
            className={`p-4 border-2 rounded-lg text-center transition-all ${paymentMethod === "contado" ? "border-green-500 bg-green-50" : "border-gray-200 hover:border-gray-300"}`}
          >
            <div className="text-lg font-semibold text-gray-800">Pago de Contado</div>
            <div className="text-sm text-gray-600 mt-1">Pago único completo</div>
          </button>
        </div>
        {!paymentMethod && <p className="text-red-500 text-sm">* Selecciona un método de pago</p>}
      </div>

      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">2</span>
          </div>
          <h3 className="text-blue-600 text-xl font-bold">Modelo</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <Label className="block text-blue-600 font-medium mb-2">Marca</Label>
            <select 
              value={selectedBrand} 
              onChange={e => { 
                setSelectedBrand(e.target.value); 
                setSelectedModel(""); 
                setSelectedCapacity(""); 
                setDevicePrice(0); 
              }} 
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selecciona una marca</option>
              {brands.map(brand => <option key={brand} value={brand}>{brand}</option>)}
            </select>
          </div>
          <div>
            <Label className="block text-blue-600 font-medium mb-2">Modelo</Label>
            <select 
              value={selectedModel} 
              onChange={e => { 
                setSelectedModel(e.target.value); 
                setSelectedCapacity(""); 
                setDevicePrice(0); 
              }} 
              disabled={!selectedBrand} 
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            >
              <option value="">Selecciona un modelo</option>
              {selectedBrand && models[selectedBrand] && models[selectedBrand].map(model => <option key={model} value={model}>{model}</option>)}
            </select>
          </div>
          <div>
            <Label className="block text-blue-600 font-medium mb-2">Capacidad</Label>
            <select 
              value={selectedCapacity} 
              onChange={e => { 
                setSelectedCapacity(e.target.value); 
                setTimeout(updatePrice, 100); 
              }} 
              disabled={!selectedModel} 
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            >
              <option value="">Selecciona capacidad</option>
              {capacities.map(capacity => <option key={capacity} value={capacity}>{capacity}</option>)}
            </select>
          </div>
        </div>

        {devicePrice > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="text-blue-700 font-medium">Precio del dispositivo:</span>
              <span className="text-blue-800 font-bold text-xl">${devicePrice.toLocaleString()}</span>
            </div>
            <p className="text-sm text-blue-600 mt-2">
              El precio se actualiza automáticamente al seleccionar modelo y capacidad
            </p>
          </div>
        )}
      </div>

      {paymentMethod === "financiado" && devicePrice > 0 && (
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">3</span>
            </div>
            <h3 className="text-blue-600 text-xl font-bold">Plan de financiamiento</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button 
              onClick={() => setSelectedFinancing("10")} 
              className={`p-6 border-2 rounded-lg text-center transition-all ${selectedFinancing === "10" ? "border-green-500 bg-green-50" : "border-gray-200 hover:border-gray-300"}`}
            >
              <div className="text-xl font-bold text-blue-600 mb-2">10 SEMANAS</div>
              {devicePrice > 0 && (
                <>
                  <div className="text-2xl font-bold text-green-600 mb-1">${Math.round((devicePrice * 0.85) / 10).toLocaleString()}</div>
                  <div className="text-sm text-gray-600 mb-4">/SEMANA</div>
                  <div className="text-sm text-gray-700 mb-1">pago inicial: <span className="font-semibold">${Math.round(devicePrice * 0.15).toLocaleString()}</span></div>
                  <div className="text-sm text-gray-700">precio final: <span className="font-semibold">${Math.round(devicePrice * 1.10).toLocaleString()}</span></div>
                </>
              )}
            </button>
            <button 
              onClick={() => setSelectedFinancing("20")} 
              className={`p-6 border-2 rounded-lg text-center transition-all ${selectedFinancing === "20" ? "border-green-500 bg-green-50" : "border-gray-200 hover:border-gray-300"}`}
            >
              <div className="text-xl font-bold text-blue-600 mb-2">20 SEMANAS</div>
              {devicePrice > 0 && (
                <>
                  <div className="text-2xl font-bold text-green-600 mb-1">${Math.round((devicePrice * 0.85) / 20).toLocaleString()}</div>
                  <div className="text-sm text-gray-600 mb-4">/SEMANA</div>
                  <div className="text-sm text-gray-700 mb-1">pago inicial: <span className="font-semibold">${Math.round(devicePrice * 0.15).toLocaleString()}</span></div>
                  <div className="text-sm text-gray-700">precio final: <span className="font-semibold">${Math.round(devicePrice * 1.20).toLocaleString()}</span></div>
                </>
              )}
            </button>
            <button 
              onClick={() => setSelectedFinancing("26")} 
              className={`p-6 border-2 rounded-lg text-center transition-all ${selectedFinancing === "26" ? "border-green-500 bg-green-50" : "border-gray-200 hover:border-gray-300"}`}
            >
              <div className="text-xl font-bold text-blue-600 mb-2">26 SEMANAS</div>
              {devicePrice > 0 && (
                <>
                  <div className="text-2xl font-bold text-green-600 mb-1">${Math.round((devicePrice * 0.85) / 26).toLocaleString()}</div>
                  <div className="text-sm text-gray-600 mb-4">/SEMANA</div>
                  <div className="text-sm text-gray-700 mb-1">pago inicial: <span className="font-semibold">${Math.round(devicePrice * 0.15).toLocaleString()}</span></div>
                  <div className="text-sm text-gray-700">precio final: <span className="font-semibold">${Math.round(devicePrice * 1.25).toLocaleString()}</span></div>
                </>
              )}
            </button>
            <button 
              onClick={() => setSelectedFinancing("custom")} 
              className={`p-6 border-2 rounded-lg text-center transition-all ${selectedFinancing === "custom" ? "border-green-500 bg-green-50" : "border-gray-200 hover:border-gray-300"}`}
            >
              <div className="text-xl font-bold text-blue-600 mb-2">Personalizado</div>
              <div className="text-sm text-gray-600 mb-2">SEMANAS</div>
              <Input
                type="number"
                placeholder="10"
                value={customWeeks}
                onChange={(e) => setCustomWeeks(parseInt(e.target.value) || 10)}
                className="w-full mb-2"
                min="1"
                max="52"
              />
              {devicePrice > 0 && (
                <>
                  <div className="text-2xl font-bold text-green-600 mb-1">${Math.round((devicePrice * 0.85) / customWeeks).toLocaleString()}</div>
                  <div className="text-sm text-gray-600 mb-4">/SEMANA</div>
                  <div className="text-sm text-gray-700 mb-1">pago inicial: <span className="font-semibold">${Math.round(devicePrice * 0.15).toLocaleString()}</span></div>
                  <div className="text-sm text-gray-700">precio final: <span className="font-semibold">${Math.round(devicePrice * (1 + 0.01 * (customWeeks - 10))).toLocaleString()}</span></div>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  )

  const renderContractGeneration = () => {
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
            <p><strong>Nombre Completo:</strong> CLIENTE EJEMPLO</p>
            <p><strong>Email:</strong> cliente@ejemplo.com</p>
            <p><strong>Teléfono:</strong> 55-1234-5678</p>
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
            <p><strong>Plan de Financiamiento:</strong> {selectedFinancing === 'custom' ? customWeeks : selectedFinancing} semanas</p>
            <p><strong>Pago Semanal:</strong> ${selectedFinancing === 'custom' ? Math.round((devicePrice * 0.85) / customWeeks).toLocaleString() : Math.round((devicePrice * 0.85) / parseInt(selectedFinancing)).toLocaleString()}</p>
            <p><strong>Pago Inicial:</strong> ${Math.round(devicePrice * 0.15).toLocaleString()}</p>
            <p><strong>Precio Final:</strong> ${selectedFinancing === 'custom' ? Math.round(devicePrice * (1 + 0.01 * (customWeeks - 10))).toLocaleString() : Math.round(devicePrice * (selectedFinancing === "10" ? 1.10 : selectedFinancing === "20" ? 1.20 : selectedFinancing === "26" ? 1.25 : 1.30)).toLocaleString()}</p>
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
      <div className="space-y-8">
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
              <button className="bg-white border-2 border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-all">
                <QRCodeCanvas 
                  value={`contrato-${selectedBrand}-${selectedModel}-${selectedCapacity}-${devicePrice}-${selectedFinancing}`} 
                  size={160} 
                  className="mx-auto" 
                />
              </button>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">3</span>
            </div>
            <h3 className="text-blue-600 text-xl font-bold">Acciones</h3>
          </div>
          <div className="flex gap-4 justify-center">
            <Button onClick={generatePDF} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2">
              <Download className="w-4 h-4" />
              Descargar PDF
            </Button>
            <Button onClick={generateContract} className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2">
              <Check className="w-4 h-4" />
              Simular Firma del Cliente
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const renderContractSigned = () => (
    <div className="text-center space-y-6">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
        <Check className="w-8 h-8 text-green-600" />
      </div>
      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">Contrato Firmado</h3>
        <p className="text-gray-600">El contrato ha sido firmado digitalmente por el cliente</p>
      </div>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-blue-700 font-medium">ID del pedido actual: SYSKT-{Date.now().toString().slice(-6)}</p>
      </div>
    </div>
  )

  const renderComplete = () => (
    <div className="text-center space-y-6">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
        <Check className="w-8 h-8 text-green-600" />
      </div>
      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">Venta Completada</h3>
        <p className="text-gray-600">La venta del dispositivo ha sido procesada exitosamente</p>
      </div>
    </div>
  )

  const renderStepContent = () => {
    switch (currentStep) {
      case "device-selection":
        return renderDeviceSelection()
      case "contract-generation":
        return renderContractGeneration()
      case "contract-signed":
        return renderContractSigned()
      case "complete":
        return renderComplete()
      default:
        return renderDeviceSelection()
    }
  }

  const renderStepButtons = () => {
    switch (currentStep) {
      case "device-selection":
        return (
          <div className="flex gap-4 justify-center mt-8">
            <Button onClick={onBack} className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-3 px-6 rounded-lg">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t.back_to_main_panel}
            </Button>
            <Button 
              onClick={handleDeviceSelection} 
              disabled={!(paymentMethod && selectedBrand && selectedModel && selectedCapacity && (selectedFinancing === 'custom' || selectedFinancing))}
              className={`px-8 py-3 rounded-lg font-medium transition-colors ${paymentMethod && selectedBrand && selectedModel && selectedCapacity && (selectedFinancing === 'custom' || selectedFinancing) ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
            >
              Continuar →
            </Button>
          </div>
        )
      case "contract-generation":
        return (
          <div className="flex gap-4 justify-center mt-8">
            <Button onClick={() => setCurrentStep("device-selection")} className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors">
              ← Regresar
            </Button>
          </div>
        )
      case "contract-signed":
        return (
          <div className="flex gap-4 justify-center mt-8">
            <Button onClick={() => setCurrentStep("contract-generation")} className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors">
              ← Regresar
            </Button>
            <Button onClick={handleCompleteSale} className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
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
      case "device-selection":
        return "Selección de Modelo y Plan de Financiamiento"
      case "contract-generation":
        return "Generación del Contrato"
      case "contract-signed":
        return "Contrato Firmado"
      case "complete":
        return "Venta Completada"
      default:
        return "Vender Dispositivos"
    }
  }

  return (
    <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl p-8 md:p-12 mt-8">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className="p-3 bg-green-100 rounded-full">
            <Smartphone className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <h1 className="mb-2 text-3xl font-bold text-gray-800">{getStepTitle()}</h1>
        <p className="text-gray-600">Módulo independiente de venta de dispositivos</p>
      </div>

      {renderStepContent()}
      {renderStepButtons()}
    </div>
  )
} 