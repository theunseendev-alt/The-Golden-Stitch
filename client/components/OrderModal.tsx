import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Scissors, User, MapPin, Clock, DollarSign } from "lucide-react";

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  design: {
    id: number;
    name: string;
    designer: string;
  };
  seamstress: {
    id: string;
    name: string;
    location: string;
    basePrice: number;
    estimatedDays: string;
  };
  onSubmit: (orderData: any) => void;
}

export default function OrderModal({
  isOpen,
  onClose,
  design,
  seamstress,
  onSubmit,
}: OrderModalProps) {
  const [formData, setFormData] = useState({
    // Customer details
    customerName: "",
    customerEmail: "",
    customerPhone: "",

    // Size details
    dressSize: "",
    chestMeasurement: "",
    waistMeasurement: "",
    hipMeasurement: "",
    length: "",

    // Order details
    preferredColor: "",
    fabricPreference: "",
    specialInstructions: "",
    rushOrder: false,
    deliveryAddress: "",
  });

  const [currentStep, setCurrentStep] = useState(1);

  if (!isOpen) return null;

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const orderData = {
      ...formData,
      design,
      seamstress,
      totalPrice: seamstress.basePrice + (formData.rushOrder ? 25 : 0),
      createdAt: new Date().toISOString(),
      orderId: `ORD-${Date.now()}`,
      status: "pending",
    };

    onSubmit(orderData);
    onClose();

    // Reset form
    setFormData({
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      dressSize: "",
      chestMeasurement: "",
      waistMeasurement: "",
      hipMeasurement: "",
      length: "",
      preferredColor: "",
      fabricPreference: "",
      specialInstructions: "",
      rushOrder: false,
      deliveryAddress: "",
    });
    setCurrentStep(1);
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Place Your Order</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step <= currentStep
                      ? "bg-primary text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {step}
                </div>
                <span
                  className={`ml-2 text-sm ${
                    step <= currentStep
                      ? "text-primary font-medium"
                      : "text-gray-500"
                  }`}
                >
                  {step === 1 && "Customer Info"}
                  {step === 2 && "Measurements"}
                  {step === 3 && "Preferences"}
                </span>
                {step < 3 && <div className="w-8 h-0.5 bg-gray-200 mx-4" />}
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="px-6 py-4 bg-gray-50 border-b">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Design:</p>
              <p className="font-medium">{design.name}</p>
              <p className="text-gray-500">by {design.designer}</p>
            </div>
            <div>
              <p className="text-gray-600">Seamstress:</p>
              <p className="font-medium">{seamstress.name}</p>
              <p className="text-gray-500">{seamstress.location}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Step 1: Customer Information */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <User className="w-5 h-5" />
                Customer Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="customerName">Full Name *</Label>
                  <Input
                    id="customerName"
                    value={formData.customerName}
                    onChange={(e) =>
                      handleInputChange("customerName", e.target.value)
                    }
                    required
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <Label htmlFor="customerEmail">Email Address *</Label>
                  <Input
                    id="customerEmail"
                    type="email"
                    value={formData.customerEmail}
                    onChange={(e) =>
                      handleInputChange("customerEmail", e.target.value)
                    }
                    required
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <Label htmlFor="customerPhone">Phone Number *</Label>
                  <Input
                    id="customerPhone"
                    value={formData.customerPhone}
                    onChange={(e) =>
                      handleInputChange("customerPhone", e.target.value)
                    }
                    required
                    placeholder="(555) 123-4567"
                  />
                </div>

                <div>
                  <Label htmlFor="deliveryAddress">Delivery Address *</Label>
                  <Input
                    id="deliveryAddress"
                    value={formData.deliveryAddress}
                    onChange={(e) =>
                      handleInputChange("deliveryAddress", e.target.value)
                    }
                    required
                    placeholder="Street address, City, State, ZIP"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Measurements */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Scissors className="w-5 h-5" />
                Dress Measurements
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="dressSize">Dress Size *</Label>
                  <select
                    id="dressSize"
                    value={formData.dressSize}
                    onChange={(e) =>
                      handleInputChange("dressSize", e.target.value)
                    }
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Select size</option>
                    <option value="XS">XS (0-2)</option>
                    <option value="S">S (4-6)</option>
                    <option value="M">M (8-10)</option>
                    <option value="L">L (12-14)</option>
                    <option value="XL">XL (16-18)</option>
                    <option value="XXL">XXL (20-22)</option>
                    <option value="Custom">Custom measurements</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="length">Preferred Length</Label>
                  <select
                    id="length"
                    value={formData.length}
                    onChange={(e) =>
                      handleInputChange("length", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Select length</option>
                    <option value="Knee-length">Knee-length</option>
                    <option value="Midi">Midi</option>
                    <option value="Maxi">Maxi</option>
                    <option value="Floor-length">Floor-length</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="chestMeasurement">Chest (inches)</Label>
                  <Input
                    id="chestMeasurement"
                    value={formData.chestMeasurement}
                    onChange={(e) =>
                      handleInputChange("chestMeasurement", e.target.value)
                    }
                    placeholder="e.g., 34"
                  />
                </div>

                <div>
                  <Label htmlFor="waistMeasurement">Waist (inches)</Label>
                  <Input
                    id="waistMeasurement"
                    value={formData.waistMeasurement}
                    onChange={(e) =>
                      handleInputChange("waistMeasurement", e.target.value)
                    }
                    placeholder="e.g., 26"
                  />
                </div>

                <div>
                  <Label htmlFor="hipMeasurement">Hip (inches)</Label>
                  <Input
                    id="hipMeasurement"
                    value={formData.hipMeasurement}
                    onChange={(e) =>
                      handleInputChange("hipMeasurement", e.target.value)
                    }
                    placeholder="e.g., 36"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Preferences */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold mb-4">Style Preferences</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="preferredColor">Preferred Color</Label>
                  <Input
                    id="preferredColor"
                    value={formData.preferredColor}
                    onChange={(e) =>
                      handleInputChange("preferredColor", e.target.value)
                    }
                    placeholder="e.g., Navy Blue, Burgundy, etc."
                  />
                </div>

                <div>
                  <Label htmlFor="fabricPreference">Fabric Preference</Label>
                  <select
                    id="fabricPreference"
                    value={formData.fabricPreference}
                    onChange={(e) =>
                      handleInputChange("fabricPreference", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Select fabric</option>
                    <option value="Cotton">Cotton</option>
                    <option value="Silk">Silk</option>
                    <option value="Polyester">Polyester</option>
                    <option value="Linen">Linen</option>
                    <option value="Chiffon">Chiffon</option>
                    <option value="Satin">Satin</option>
                    <option value="Tulle">Tulle</option>
                  </select>
                </div>
              </div>

              <div>
                <Label htmlFor="specialInstructions">
                  Special Instructions
                </Label>
                <textarea
                  id="specialInstructions"
                  value={formData.specialInstructions}
                  onChange={(e) =>
                    handleInputChange("specialInstructions", e.target.value)
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Any specific details, modifications, or special requests..."
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  id="rushOrder"
                  type="checkbox"
                  checked={formData.rushOrder}
                  onChange={(e) =>
                    handleInputChange("rushOrder", e.target.checked)
                  }
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <Label htmlFor="rushOrder" className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Rush Order (+$25, 50% faster delivery)
                </Label>
              </div>
            </div>
          )}

          {/* Order Summary */}
          {currentStep === 3 && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold mb-2">Order Summary</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Base Price:</span>
                  <span>${seamstress.basePrice}</span>
                </div>
                {formData.rushOrder && (
                  <div className="flex justify-between">
                    <span>Rush Order Fee:</span>
                    <span>+$25</span>
                  </div>
                )}
                <div className="flex justify-between font-bold border-t pt-1">
                  <span>Total:</span>
                  <span>
                    ${seamstress.basePrice + (formData.rushOrder ? 25 : 0)}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-gray-600">
                  <span>Estimated Delivery:</span>
                  <span>{seamstress.estimatedDays}</span>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-6">
            <div>
              {currentStep > 1 && (
                <Button type="button" variant="outline" onClick={prevStep}>
                  Previous
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              {currentStep < 3 ? (
                <Button type="button" onClick={nextStep}>
                  Next
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Place Order ($
                  {seamstress.basePrice + (formData.rushOrder ? 25 : 0)})
                </Button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
