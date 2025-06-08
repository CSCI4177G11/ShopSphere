"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { X, Plus, Minus, ShoppingBag } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/hooks/use-cart"
import { formatPrice } from "@/lib/utils"

export function CartDrawer() {
  const { items, updateQuantity, removeItem, total, itemCount } = useCart()
  const [isOpen, setIsOpen] = useState(false)

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20, transition: { duration: 0.2 } },
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            Shopping Cart
            <Badge variant="secondary">{itemCount}</Badge>
          </SheetTitle>
          <SheetDescription>Review your items before checkout</SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto -mx-6 px-6 py-4">
          <AnimatePresence>
            {items.length > 0 ? (
              items.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="flex items-center space-x-4 py-4 border-b"
                >
                  <div className="relative h-16 w-16 overflow-hidden rounded-md">
                    <Image
                      src={item.image || "/placeholder.svg?height=64&width=64"}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 space-y-1">
                    <h4 className="font-medium line-clamp-2">{item.name}</h4>
                    <p className="text-sm text-muted-foreground">{formatPrice(item.price)}</p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>

                    <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>

                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>

                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => removeItem(item.id)}>
                    <X className="h-3 w-3" />
                  </Button>
                </motion.div>
              ))
            ) : (
              <motion.div
                key="empty-cart"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center h-full space-y-4"
              >
                <ShoppingBag className="h-16 w-16 text-muted-foreground" />
                <p className="text-muted-foreground">Your cart is empty</p>
                <Button asChild onClick={() => setIsOpen(false)}>
                  <Link href="/shop">Start Shopping</Link>
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {items.length > 0 && (
          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center justify-between text-lg font-semibold">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>

            <div className="space-y-2">
              <Button className="w-full" size="lg" asChild>
                <Link href="/checkout" onClick={() => setIsOpen(false)}>
                  Checkout
                </Link>
              </Button>

              <Button variant="outline" className="w-full" asChild>
                <Link href="/cart" onClick={() => setIsOpen(false)}>
                  View Cart
                </Link>
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
