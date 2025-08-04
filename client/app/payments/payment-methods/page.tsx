"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

import { useAuth } from "@/components/auth-provider";
import { paymentService, type PaymentMethod } from "@/lib/api/payment-service";

import { motion, AnimatePresence } from "framer-motion";
import {
  CreditCard,
  Plus,
  Trash2,
  Loader2,
  Star,
  ArrowLeft,
  Shield,
  Lock,
  CheckCircle,
  AlertCircle,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

/* -------------------------------------------------------------------------- */
/* Stripe setup                                                               */
/* -------------------------------------------------------------------------- */

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

const maskCard = (last4: string) => `•••• •••• •••• ${last4}`;
const formatExpiry = (m?: number, y?: number) =>
  typeof m === "number" && typeof y === "number"
    ? `${m.toString().padStart(2, "0")} / ${y.toString().slice(-2)}`
    : "— / —";

const getCardBrandColors = (brand: string, isDefault?: boolean) => {
  if (isDefault) {
    return "from-green-500 via-emerald-500 to-teal-600";
  }
  // All cards use green theme for consistency with subtle variations
  return "from-green-600 via-emerald-600 to-green-700";
};

const getCardBrandIcon = (brand: string) => {
  const brandLower = brand.toLowerCase();
  if (brandLower === 'visa') return '💳';
  if (brandLower === 'mastercard') return '💵';
  if (brandLower === 'amex') return '💎';
  if (brandLower === 'discover') return '🏆';
  return '💳';
};

/* -------------------------------------------------------------------------- */
/* Page                                                                       */
/* -------------------------------------------------------------------------- */

/** Wrapper that injects Elements */
export default function PaymentMethodsPage() {
  return (
    <Elements stripe={stripePromise}>
      <PaymentMethods />
    </Elements>
  );
}

/* Main page content -------------------------------------------------------- */
function PaymentMethods() {
  const router = useRouter();
  const { user } = useAuth();
  const stripe = useStripe();
  const elements = useElements();

  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const [error, setError] = useState<any>(null);
  const [cardComplete, setCardComplete] = useState(false);

  useEffect(() => {
    if (user) fetchMethods();
  }, [user]);

  async function fetchMethods() {
    setLoading(true);
    try {
      const data = await paymentService.getPaymentMethods();
      // Ensure at least one card is default if cards exist
      if (data.length > 0 && !data.some(m => m.isDefault)) {
        data[0].isDefault = true;
      }
      // Sort payment methods to show default first
      const sortedData = [...data].sort((a, b) => {
        if (a.isDefault) return -1;
        if (b.isDefault) return 1;
        return 0;
      });
      setMethods(sortedData);
    } catch {
      toast.error("Failed to load payment methods");
    } finally {
      setLoading(false);
    }
  }

  const handleDialogOpenChange = (open: boolean) => {
    // side‑effects you want whenever the dialog toggles
    if (!open) {
      setCardComplete(false);
      setError(null);
    }
  
    // 2️⃣ finally update the state that controls <Dialog open={…} />
    setDialogOpen(open);
  };

  /* --------------------------- ADD NEW CARD -------------------------------- */
  async function handleAddCard() {
    if (!stripe || !elements) return; // Stripe.js still loading
    setAdding(true);
    try {
      /* 1️⃣ Get client‑secret from backend */
      const { clientSecret } = await paymentService.createSetupIntent();

      /* 2️⃣ Confirm the card details with Stripe */
      const result = await stripe.confirmCardSetup(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
          billing_details: {
            name: user?.username ?? "",
            email: user?.email ?? "",
          },
        },
      });

      if (result.error) {
        toast.error(result.error.message ?? "Card setup failed");
        return;
      }

      const pmToken = result.setupIntent?.payment_method as string;
      /* 3️⃣ Persist token in your DB */
      const savedResult = await paymentService.savePaymentMethod(pmToken);
      
      /* 4️⃣ If this is the first payment method, set it as default */
      if (methods.length === 0) {
        await paymentService.setDefaultPaymentMethod(savedResult.paymentMethod.paymentMethodId);
      }
      
      toast.success("Card saved successfully!");

      setDialogOpen(false);
      fetchMethods();
    } catch {
      toast.error("Could not save card");
    } finally {
      setAdding(false);
    }
  }

  /* ------------------------------ ACTIONS ---------------------------------- */

  async function handleDelete(id: string) {
    try {
      await paymentService.deletePaymentMethod(id);
      toast.success("Payment method deleted");
      setMethods((prev) => prev.filter((m) => m.id !== id));
    } catch {
      toast.error("Deletion failed");
    }
  }

  async function handleSetDefault(id: string) {
    try {
      await paymentService.setDefaultPaymentMethod(id);
      toast.success("Default payment method updated");
      setMethods((prev) => {
        // Update default status
        const updated = prev.map((m) => ({ ...m, isDefault: m.id === id }));
        // Sort to keep default first
        return updated.sort((a, b) => {
          if (a.isDefault) return -1;
          if (b.isDefault) return 1;
          return 0;
        });
      });
    } catch {
      toast.error("Could not set default");
    }
  }

  /* ---------------------------------------------------------------------- */

  if (loading) return <SkeletonPage />;

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {/* Header Section */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2 mb-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => router.back()}
                  className="h-8 w-8"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <h1 className="text-3xl font-bold">Payment Methods</h1>
              </div>
              <p className="text-muted-foreground">
                Manage your saved payment cards
              </p>
            </div>

            {/* Add New Card Button */}
            <Dialog open={dialogOpen} onOpenChange={handleDialogOpenChange}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Card
                </Button>
              </DialogTrigger>

              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>Add Payment Method</DialogTitle>
                  <DialogDescription>
                    Your card information is encrypted and securely stored.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="card-element">Card Information</Label>
                      {cardComplete && (
                        <span className="text-xs text-green-600 dark:text-green-500 flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" />
                          Valid
                        </span>
                      )}
                    </div>

                    <div
                      id="card-element-container"
                      className={`
                        relative rounded-lg border bg-background
                        px-4 py-4 transition-all duration-200
                        ${error ? "border-destructive" : 
                          focused ? "border-primary ring-2 ring-primary/20" : 
                          "border-input"}
                      `}
                      onFocus={() => setFocused(true)}
                      onBlur={() => setFocused(false)}
                    >
                      <CardElement
                        options={{
                          hidePostalCode: true,
                          iconStyle: "default",
                          style: {
                            base: {
                              fontSize: "16px",
                              color: "#424770",
                              fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                              "::placeholder": { color: "#aab7c4" },
                            },
                            invalid: { color: "#fa755a" },
                          },
                        }}
                        onChange={(event) => {
                          setError(event.error || null);
                          setCardComplete(event.complete);
                        }}
                      />
                    </div>
                    
                    {error && (
                      <div className="text-sm text-destructive flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" />
                        <span>{error.message || 'Card setup failed'}</span>
                      </div>
                    )}
                  </div>

                  {/* Security Features */}
                  <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 rounded-lg p-3">
                    <Shield className="h-4 w-4" />
                    <span>Your payment information is encrypted and secure</span>
                  </div>
                </div>

                <DialogFooter>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setDialogOpen(false); 
                      setCardComplete(false); 
                      setError(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    disabled={adding || !stripe || !elements || !cardComplete}
                    onClick={handleAddCard}
                  >
                    {adding && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    {adding ? 'Saving...' : 'Save Card'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Payment Methods Grid */}
          {methods.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border-dashed border-2">
                <CardContent className="flex flex-col items-center justify-center py-16 text-center space-y-4">
                  <motion.div 
                    className="h-16 w-16 rounded-full bg-muted flex items-center justify-center"
                    animate={{ 
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ 
                      duration: 4,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                  >
                    <CreditCard className="h-8 w-8 text-muted-foreground" />
                  </motion.div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">
                      No payment methods
                    </h3>
                    <p className="text-sm text-muted-foreground max-w-sm">
                      Add a payment method to make purchases
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <AnimatePresence mode="popLayout">
                  {methods.map((method, index) => (
                    <motion.div
                      key={method.id}
                      layout
                      initial={{ opacity: 0, y: 20, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ 
                        duration: 0.4, 
                        delay: index * 0.05,
                        type: "spring",
                        stiffness: 300,
                        damping: 25
                      }}
                    >
                      <PaymentCard
                        method={method}
                        onDelete={() => handleDelete(method.id)}
                        onSetDefault={() => handleSetDefault(method.id)}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}

          {/* Footer Info */}
          {methods.length > 0 && (
            <div className="text-center">
              <p className="text-xs text-muted-foreground flex items-center justify-center gap-2">
                <Shield className="h-3 w-3" />
                Your payment information is encrypted and secure
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Enhanced Payment Card                                                      */
/* -------------------------------------------------------------------------- */

function PaymentCard({
    method,
    onDelete,
    onSetDefault,
  }: {
    method: PaymentMethod;
    onDelete: () => void;
    onSetDefault: () => void;
  }) {
    const [isHovered, setIsHovered] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
    return (
      <motion.div
        whileHover={{ y: -4, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className={method.isDefault ? "relative" : ""}
      >
        {method.isDefault && (
          <motion.div
            className="absolute -top-3 -right-3 z-10"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-green-400 rounded-full blur-md animate-pulse" />
              <div className="relative bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-xl flex items-center gap-1.5 border border-white/30">
                <Sparkles className="h-3.5 w-3.5 animate-pulse" />
                <span className="tracking-wide">Default</span>
              </div>
            </div>
          </motion.div>
        )}
        <Card className={`relative overflow-hidden transition-all duration-300 ${
          method.isDefault 
            ? "shadow-xl shadow-green-500/25 ring-2 ring-green-500/50 scale-[1.02]" 
            : "hover:shadow-lg hover:shadow-gray-300/50 dark:hover:shadow-gray-700/50"
        }`}>
          {/* Animated Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `repeating-linear-gradient(
                45deg,
                transparent,
                transparent 10px,
                rgba(255,255,255,0.05) 10px,
                rgba(255,255,255,0.05) 20px
              )`
            }} />
          </div>
          
          {/* Card Background Gradient */}
          <div className={`absolute inset-0 bg-gradient-to-br ${getCardBrandColors(method.card.brand, method.isDefault)}`} />
          
          {/* Shimmer Effect for Default Card */}
          {method.isDefault && (
            <motion.div
              className="absolute inset-0 opacity-30"
              animate={{
                background: [
                  "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)",
                  "linear-gradient(90deg, transparent 100%, rgba(255,255,255,0.4) 150%, transparent 200%)",
                ],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
              }}
              style={{
                backgroundSize: "200% 100%",
              }}
            />
          )}
          
          <CardContent className="relative p-6 text-white z-10">
            <div className="flex items-start justify-between mb-8">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <motion.span 
                    className="text-3xl filter drop-shadow-md"
                    animate={{ 
                      rotateY: isHovered ? 360 : 0,
                    }}
                    transition={{ duration: 0.6 }}
                  >
                    {getCardBrandIcon(method.card.brand)}
                  </motion.span>
                  <div>
                    <p className="font-bold text-xl capitalize tracking-wide text-white drop-shadow-sm">
                      {method.card.brand}
                    </p>
                  </div>
                </div>
              </div>
  
              <div className="flex gap-1">
                {!method.isDefault && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isHovered || deleteDialogOpen ? 1 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={onSetDefault}
                      title="Set as Default"
                      className="h-8 w-8 hover:bg-green-500/30 text-white/80 hover:text-green-100 transition-all duration-200"
                    >
                      <motion.div
                        whileHover={{ scale: 1.2, rotate: 180 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                      >
                        <Star className="h-4 w-4" />
                      </motion.div>
                    </Button>
                  </motion.div>
                )}
                
                <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                  <AlertDialogTrigger asChild>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: isHovered || deleteDialogOpen ? 1 : 0 }}
                      transition={{ duration: 0.2, delay: 0.05 }}
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Remove card"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteDialogOpen(true);
                        }}
                        className="h-8 w-8 hover:bg-red-500/20 text-white/80 hover:text-red-200 transition-all duration-200"
                      >
                        <motion.div
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </motion.div>
                      </Button>
                    </motion.div>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle className="flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-red-500" />
                        Remove Payment Method
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to remove this {method.card.brand} card ending in {method.card.last4}? 
                        This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel 
                        className="rounded-full"
                        onClick={() => setDeleteDialogOpen(false)}
                      >
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={() => {
                          onDelete();
                          setDeleteDialogOpen(false);
                        }} 
                        className="bg-red-600 hover:bg-red-700 rounded-full"
                      >
                        Remove Card
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
  
            <div className="space-y-4">
              <motion.div 
                className="font-mono text-2xl tracking-[0.2em] text-white drop-shadow-md"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                style={{ textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}
              >
                {maskCard(method.card.last4)}
              </motion.div>
              
              <div className="flex items-center justify-between text-sm">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <p className="text-white/80 text-xs uppercase tracking-wide">Expires</p>
                  <p className="font-semibold">
                    {formatExpiry(method.card.exp_month, method.card.exp_year)}
                  </p>
                </motion.div>
                
                {method.isDefault && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3, type: "spring" }}
                    className="flex items-center gap-1"
                  >
                    <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
                      <Lock className="h-3 w-3" />
                      <span className="text-xs font-medium">Secure</span>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

/* -------------------------------------------------------------------------- */
/* Enhanced Skeleton                                                          */
/* -------------------------------------------------------------------------- */

function SkeletonPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-6xl mx-auto px-4 py-8 space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-5 w-16" />
                </div>
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-4 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}