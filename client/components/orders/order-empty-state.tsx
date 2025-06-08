import { Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function OrderEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <Package className="h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-medium mb-2">No orders found</h3>
      <p className="text-muted-foreground mb-4">
        You haven't placed any orders yet. Start shopping to see your orders here.
      </p>
      <Button asChild>
        <Link href="/shop">Start Shopping</Link>
      </Button>
    </div>
  )
}
