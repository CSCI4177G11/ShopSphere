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

const getCardBrandColors = (brand: string) => {
  const colors = {
    visa: "from-blue-600 to-blue-800",
    mastercard: "from-red-600 to-orange-600",
    amex: "from-green-600 to-teal-700",
    discover: "from-orange-600 to-amber-700",
    default: "from-slate-600 to-slate-800",
  };
  return colors[brand.toLowerCase() as keyof typeof colors] || colors.default;
};

const getCardBrandIcon = (brand: string) => {
  const brandLower = brand.toLowerCase();
  if (brandLower === 'visa') return '💳';
  if (brandLower === 'mastercard') return '🏦';
  if (brandLower === 'amex') return '💎';
  if (brandLower === 'discover') return '🔍';
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
  const [error, setError] = useState(null);
  const [cardComplete, setCardComplete] = useState(false);

  useEffect(() => {
    if (user) fetchMethods();
  }, [user]);

  async function fetchMethods() {
    setLoading(true);
    try {
      const data = await paymentService.getPaymentMethods();
      setMethods(data);
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
            name: user?.fullName ?? user?.name ?? "",
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
      await paymentService.savePaymentMethod(pmToken);
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
      setMethods((prev) => prev.map((m) => ({ ...m, isDefault: m.id === id })));
    } catch {
      toast.error("Could not set default");
    }
  }

  /* ---------------------------------------------------------------------- */

  if (loading) return <SkeletonPage />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/20">
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="space-y-8"
        >
          {/* Header Section */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm" 
                className="rounded-full hover:bg-white/80 dark:hover:bg-slate-800/80 backdrop-blur-sm" 
                onClick={router.back}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div className="hidden sm:block w-px h-6 bg-border" />
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                    <CreditCard className="h-6 w-6 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 h-4 w-4 bg-green-500 rounded-full flex items-center justify-center">
                    <Shield className="h-2.5 w-2.5 text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                    Payment Methods
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Securely manage your saved payment cards
                  </p>
                </div>
              </div>
            </div>

            {/* Add New Card Button */}
            <Dialog open={dialogOpen} onOpenChange={handleDialogOpenChange}>
              <DialogTrigger asChild>
                <Button 
                  size="sm" 
                  className="rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Card
                </Button>
              </DialogTrigger>

              <DialogContent className="sm:max-w-lg [&>button:last-of-type]:hidden">
                <DialogHeader className="text-center space-y-3">
                  <DialogTitle className="text-xl text-center">Add New Payment Method</DialogTitle>
                  <DialogDescription className="text-center">
                    Your card information is encrypted and securely stored using industry-standard security.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="card-element"
                        className="text-sm font-medium text-foreground flex items-center gap-2"
                      >
                        <Lock className="h-4 w-4 text-muted-foreground" />
                        Card Information
                      </label>
                      <AnimatePresence>
                        {cardComplete && (
                          <motion.span 
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="text-xs text-green-600 flex items-center gap-1 bg-green-50 dark:bg-green-950/30 px-2 py-1 rounded-full"
                          >
                            <CheckCircle className="h-3 w-3" />
                            Valid
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </div>

                    <div
                      id="card-element-container"
                      className={`
                        relative rounded-xl border-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm
                        px-4 py-4 shadow-sm transition-all duration-200
                        ${error ? "border-red-300 dark:border-red-700 bg-red-50/50 dark:bg-red-950/20" : 
                          focused ? "border-blue-300 dark:border-blue-600 ring-4 ring-blue-100 dark:ring-blue-900/30 shadow-lg" : 
                          "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"}
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
                              color: "hsl(var(--foreground))",
                              fontFamily: "inherit",
                              iconColor: "hsl(var(--muted-foreground))",
                              "::placeholder": { color: "hsl(var(--muted-foreground))" },
                            },
                            invalid: { color: "hsl(var(--destructive))" },
                          },
                        }}
                        onChange={(event) => {
                          setError(event.error);
                          setCardComplete(event.complete);
                        }}
                      />
                    </div>
                    
                    <AnimatePresence>
                      {error && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="text-sm text-red-600 flex items-start gap-2 bg-red-50 dark:bg-red-950/30 p-3 rounded-lg"
                        >
                          <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <span>{error.message}</span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Security Features */}
                  <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4 space-y-3">
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                      <Shield className="h-4 w-4 text-green-600" />
                      Security Features
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 bg-green-500 rounded-full" />
                        256-bit SSL encryption
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 bg-green-500 rounded-full" />
                        PCI DSS compliant
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 bg-green-500 rounded-full" />
                        Stripe secure processing
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 bg-green-500 rounded-full" />
                        No card data stored
                      </div>
                    </div>
                  </div>
                </div>

                <DialogFooter className="gap-3">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setDialogOpen(false); 
                      setCardComplete(false); 
                      setError(null);
                    }}
                    className="rounded-full"
                  >
                    Cancel
                  </Button>
                  <Button
                    disabled={adding || !stripe || !elements || !cardComplete}
                    onClick={handleAddCard}
                    className="rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  >
                    {adding && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    {adding ? 'Saving...' : 'Save Card'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Payment Methods Grid */}
          <div className="space-y-6">
            {methods.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
              >
                <Card className="border-2 border-dashed border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
                  <CardContent className="flex flex-col items-center justify-center py-16 text-center space-y-4">
                    <div className="h-20 w-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                      <CreditCard className="h-10 w-10 text-slate-400" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                        No payment methods yet
                      </h3>
                      <p className="text-sm text-muted-foreground max-w-sm">
                        Add your first payment method to get started with secure transactions.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <AnimatePresence>
                  {methods.map((method, index) => (
                    <motion.div
                      key={method.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
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
          </div>

          {/* Footer Info */}
          {methods.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-center"
            >
              <div className="inline-flex items-center gap-2 text-xs text-muted-foreground bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm px-4 py-2 rounded-full border">
                <Shield className="h-3 w-3" />
                All payment methods are securely encrypted and PCI compliant
              </div>
            </motion.div>
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

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card className="relative overflow-hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-300">
        {/* Card Background Gradient */}
        <div className={`absolute inset-0 bg-gradient-to-br ${getCardBrandColors(method.card.brand)} opacity-90`} />
        
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12" />
        
        <CardContent className="relative p-6 text-white">
          <div className="flex items-start justify-between mb-6">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{getCardBrandIcon(method.card.brand)}</span>
                <div>
                  <p className="font-bold text-lg capitalize tracking-wide">
                    {method.card.brand}
                  </p>
                  {method.isDefault && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="flex items-center gap-1 mt-1"
                    >
                      <Sparkles className="h-3 w-3 text-yellow-300" />
                      <Badge variant="secondary" className="bg-white/20 text-white border-0 text-xs">
                        Primary
                      </Badge>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>

            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex gap-1"
                >
                  {!method.isDefault && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={onSetDefault}
                      title="Set as primary"
                      className="h-8 w-8 hover:bg-white/20 text-white/80 hover:text-white"
                    >
                      <Star className="h-4 w-4" />
                    </Button>
                  )}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Remove card"
                        className="h-8 w-8 hover:bg-red-500/20 text-white/80 hover:text-red-200"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
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
                        <AlertDialogCancel className="rounded-full">Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={onDelete} 
                          className="bg-red-600 hover:bg-red-700 rounded-full"
                        >
                          Remove Card
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="space-y-4">
            <div className="font-mono text-xl tracking-wider">
              {maskCard(method.card.last4)}
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <div>
                <p className="text-white/80 text-xs uppercase tracking-wide">Expires</p>
                <p className="font-semibold">
                  {formatExpiry(method.card.exp_month, method.card.exp_year)}
                </p>
              </div>
              
              <div className="text-right">
                <p className="text-white/80 text-xs uppercase tracking-wide">Status</p>
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="font-semibold text-xs">Active</span>
                </div>
              </div>
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/20">
      <div className="container max-w-6xl mx-auto px-4 py-8 space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Skeleton className="h-8 w-16 rounded-full" />
            <div className="flex items-center gap-3">
              <Skeleton className="h-12 w-12 rounded-2xl" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
          </div>
          <Skeleton className="h-9 w-32 rounded-full" />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-8 w-8 rounded" />
                    <Skeleton className="h-5 w-20" />
                  </div>
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>
                <Skeleton className="h-6 w-40" />
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-12" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}