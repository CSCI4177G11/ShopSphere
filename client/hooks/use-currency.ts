"use client"

import { useSettings } from "@/components/settings-provider"
import { formatPrice, convertCurrency, formatCurrency, CURRENCY_SYMBOLS } from "@/lib/currency"
import { useCallback } from "react"

export function useCurrency() {
  const { currency } = useSettings()

  // Convert price from CAD (base currency) to current currency
  const convertPrice = useCallback(
    (priceInCAD: number) => {
      return convertCurrency(priceInCAD, currency)
    },
    [currency]
  )

  // Format price with currency symbol (price is stored in CAD)
  const formatPriceWithCurrency = useCallback(
    (priceInCAD: number, options?: { showCurrency?: boolean; decimals?: number }) => {
      return formatPrice(priceInCAD, currency, options)
    },
    [currency]
  )

  // Format already converted amount
  const formatAmount = useCallback(
    (amount: number, options?: { showCurrency?: boolean; decimals?: number }) => {
      return formatCurrency(amount, currency, options)
    },
    [currency]
  )

  // Get current currency symbol
  const currencySymbol = CURRENCY_SYMBOLS[currency]

  return {
    currency,
    currencySymbol,
    convertPrice,
    formatPrice: formatPriceWithCurrency,
    formatAmount,
  }
}