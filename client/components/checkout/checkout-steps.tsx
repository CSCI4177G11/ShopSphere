import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface CheckoutStepsProps {
  currentStep: "shipping" | "payment" | "review"
}

export function CheckoutSteps({ currentStep }: CheckoutStepsProps) {
  const steps = [
    { id: "shipping", title: "Shipping Address", completed: false },
    { id: "payment", title: "Payment Method", completed: false },
    { id: "review", title: "Review Order", completed: false },
  ]

  const currentStepIndex = steps.findIndex((step) => step.id === currentStep)

  // Mark previous steps as completed
  steps.forEach((step, index) => {
    if (index < currentStepIndex) {
      step.completed = true
    }
  })

  return (
    <div className="flex items-center justify-center">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center">
          <div className="flex items-center">
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-medium",
                step.completed
                  ? "border-primary bg-primary text-primary-foreground"
                  : step.id === currentStep
                    ? "border-primary text-primary"
                    : "border-muted-foreground text-muted-foreground",
              )}
            >
              {step.completed ? <Check className="h-4 w-4" /> : index + 1}
            </div>
            <span
              className={cn(
                "ml-2 text-sm font-medium",
                step.id === currentStep ? "text-foreground" : "text-muted-foreground",
              )}
            >
              {step.title}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div className={cn("mx-4 h-0.5 w-16", index < currentStepIndex ? "bg-primary" : "bg-muted")} />
          )}
        </div>
      ))}
    </div>
  )
}
