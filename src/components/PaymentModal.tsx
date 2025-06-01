
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Smartphone, X, CheckCircle, Copy } from "lucide-react";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  material: {
    id: string;
    title: string;
    price: number;
    file_url?: string;
  };
}

const PaymentModal = ({ isOpen, onClose, material }: PaymentModalProps) => {
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card'>('upi');
  const [transactionId, setTransactionId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const upiId = 'vik657@axl';
  const upiLink = `upi://pay?pa=${upiId}&pn=The Editor Star&am=${material.price}&cu=INR&tn=Payment for ${material.title}`;

  const handlePayment = async () => {
    if (paymentMethod === 'upi' && !transactionId.trim()) {
      alert('Please enter transaction ID');
      return;
    }

    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentSuccess(true);
      
      // Auto download after successful payment
      setTimeout(() => {
        if (material.file_url) {
          const link = document.createElement('a');
          link.href = material.file_url;
          link.download = `${material.title}.zip`;
          link.target = '_blank';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      }, 1000);
    }, 3000);
  };

  const copyUpiId = () => {
    navigator.clipboard.writeText(upiId);
    alert('UPI ID copied to clipboard!');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Complete Payment</CardTitle>
            <CardDescription>{material.title}</CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {!paymentSuccess ? (
            <>
              {/* Price */}
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">₹{material.price}</div>
                <p className="text-gray-600">One-time payment</p>
              </div>

              {/* Payment Method Selection */}
              <div className="space-y-3">
                <h3 className="font-semibold">Payment Method</h3>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant={paymentMethod === 'upi' ? 'default' : 'outline'}
                    className="flex items-center space-x-2"
                    onClick={() => setPaymentMethod('upi')}
                  >
                    <Smartphone className="h-4 w-4" />
                    <span>UPI</span>
                  </Button>
                  <Button
                    variant={paymentMethod === 'card' ? 'default' : 'outline'}
                    className="flex items-center space-x-2"
                    onClick={() => setPaymentMethod('card')}
                  >
                    <CreditCard className="h-4 w-4" />
                    <span>Card</span>
                  </Button>
                </div>
              </div>

              {/* UPI Payment */}
              {paymentMethod === 'upi' && (
                <div className="space-y-4">
                  <div className="text-center">
                    <h4 className="font-semibold mb-3">Scan QR Code or Pay via UPI</h4>
                    
                    {/* QR Code */}
                    <div className="bg-white p-4 rounded-lg shadow-inner mb-4 inline-block">
                      <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiLink)}`}
                        alt="UPI QR Code"
                        className="w-48 h-48"
                      />
                    </div>
                    
                    {/* UPI ID */}
                    <div className="flex items-center justify-center space-x-2 mb-4">
                      <Badge variant="outline" className="text-lg px-4 py-2">
                        {upiId}
                      </Badge>
                      <Button size="sm" variant="ghost" onClick={copyUpiId}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-4">
                      Pay ₹{material.price} to the above UPI ID and enter transaction ID below
                    </p>
                  </div>
                  
                  {/* Transaction ID Input */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Transaction ID <span className="text-red-500">*</span>
                    </label>
                    <Input
                      placeholder="Enter 12-digit transaction ID"
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      maxLength={12}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      You'll receive this ID after successful payment
                    </p>
                  </div>
                </div>
              )}

              {/* Card Payment */}
              {paymentMethod === 'card' && (
                <div className="space-y-4">
                  <div className="space-y-3">
                    <Input placeholder="Card Number" />
                    <div className="grid grid-cols-2 gap-3">
                      <Input placeholder="MM/YY" />
                      <Input placeholder="CVV" />
                    </div>
                    <Input placeholder="Cardholder Name" />
                  </div>
                </div>
              )}

              {/* Payment Button */}
              <Button 
                className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600"
                onClick={handlePayment}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing...</span>
                  </div>
                ) : (
                  `Pay ₹${material.price}`
                )}
              </Button>
            </>
          ) : (
            /* Success Screen */
            <div className="text-center space-y-4">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
              <h3 className="text-xl font-bold text-green-600">Payment Successful!</h3>
              <p className="text-gray-600">
                Your file download will start automatically.
              </p>
              <p className="text-sm text-gray-500">
                Transaction ID: {transactionId || 'TXN' + Date.now()}
              </p>
              <Button onClick={onClose} className="w-full">
                Close
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentModal;
