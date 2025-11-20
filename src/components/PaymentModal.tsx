import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { X, CheckCircle, Loader2 } from "lucide-react";
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

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

declare global {
  interface Window {
    Razorpay: any;
  }
}

const PaymentModal = ({ isOpen, onClose, material }: PaymentModalProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => setRazorpayLoaded(true);
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const handlePayment = async () => {
    if (!razorpayLoaded) {
      toast.error('Payment system is loading. Please wait...');
      return;
    }

    setIsProcessing(true);

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('Please login to continue');
        setIsProcessing(false);
        return;
      }

      // Create Razorpay order
      const { data: orderData, error: orderError } = await supabase.functions.invoke(
        'create-razorpay-order',
        {
          body: {
            materialId: material.id,
            amount: material.price
          }
        }
      );

      if (orderError) {
        console.error('Order creation error:', orderError);
        toast.error('Failed to create payment order');
        setIsProcessing(false);
        return;
      }

      // Configure Razorpay options
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Gyaan Repo',
        description: material.title,
        order_id: orderData.orderId,
        prefill: {
          email: user.email
        },
        config: {
          display: {
            blocks: {
              banks: {
                name: 'Pay using UPI',
                instruments: [
                  {
                    method: 'upi'
                  }
                ]
              },
              other: {
                name: 'Other Payment Methods',
                instruments: [
                  {
                    method: 'card'
                  },
                  {
                    method: 'netbanking'
                  },
                  {
                    method: 'wallet'
                  }
                ]
              }
            },
            sequence: ['block.banks', 'block.other'],
            preferences: {
              show_default_blocks: false
            }
          }
        },
        handler: async function (response: any) {
          // Verify payment
          const { error: verifyError } = await supabase.functions.invoke(
            'verify-razorpay-payment',
            {
              body: {
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
                paymentMethod: 'upi'
              }
            }
          );

          if (verifyError) {
            console.error('Payment verification error:', verifyError);
            toast.error('Payment verification failed');
            setIsProcessing(false);
            return;
          }

          setPaymentSuccess(true);
          toast.success('Payment successful! You now have premium access.');
          
          // Trigger download
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
            onClose();
            setIsProcessing(false);
            setPaymentSuccess(false);
          }, 2000);
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
            toast.info('Payment cancelled');
          }
        },
        theme: {
          color: '#3b82f6'
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment failed. Please try again.');
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Buy Premium Access</CardTitle>
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
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">One-time payment</p>
                <div className="text-4xl font-bold text-primary">₹{material.price}</div>
              </div>

              {/* Features */}
              <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-3 h-3 text-green-600" />
                  </div>
                  <span className="text-sm">Secure payment via Razorpay</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-3 h-3 text-green-600" />
                  </div>
                  <span className="text-sm">Instant download access</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-3 h-3 text-green-600" />
                  </div>
                  <span className="text-sm">UPI, Cards, Wallets accepted</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-3 h-3 text-green-600" />
                  </div>
                  <span className="text-sm">Google Pay, PhonePe, Paytm supported</span>
                </div>
              </div>

              {/* Payment Button */}
              <Button 
                className="w-full" 
                size="lg"
                onClick={handlePayment}
                disabled={isProcessing || !razorpayLoaded}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : !razorpayLoaded ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading Payment Gateway...
                  </>
                ) : (
                  'Proceed to Payment'
                )}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                Powered by Razorpay • Test Mode • By proceeding, you agree to our Terms
              </p>
            </>
          ) : (
            <div className="text-center py-8 space-y-4">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Payment Successful!</h3>
                <p className="text-muted-foreground">You now have premium access.</p>
                <p className="text-sm text-muted-foreground mt-1">Download starting...</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentModal;