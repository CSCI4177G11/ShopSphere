import { Badge } from "@/components/ui/badge"
import type { Order } from "@/types/order"

interface OrderStatusBadgeProps {
  status: Order["status"]
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const getStatusConfig = (status: Order["status"]) => {
    switch (status) {
      case "processing":
        return { variant: "secondary" as const, label: "Processing" }
      case "shipped":
        return { variant: "default" as const, label: "Shipped" }
      case "out_for_delivery":
        return { variant: "default" as const, label: "Out for Delivery" }
      case "delivered":
        return { variant: "default" as const, label: "Delivered" }
      case "cancelled":
        return { variant: "destructive" as const, label: "Cancelled" }
      case "returned":
        return { variant: "secondary" as const, label: "Returned" }
      default:
        return { variant: "secondary" as const, label: "Unknown" }
    }
  }

  const config = getStatusConfig(status)

  return <Badge variant={config.variant}>{config.label}</Badge>
}
