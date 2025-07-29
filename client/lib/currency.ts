import { Currency } from "@/components/settings-provider"

// Exchange rates relative to CAD (Canadian Dollar as base)
// In a real app, these would be fetched from an API
const EXCHANGE_RATES: Record<Currency, number> = {
  CAD: 1.00,      // Base currency
  USD: 0.74,      // 1 CAD = 0.74 USD
  GBP: 0.58,      // 1 CAD = 0.58 GBP
}

// Currency symbols
export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  USD: "$",
  CAD: "C$",
  GBP: "£",
}

// Convert from CAD (base currency) to target currency
export function convertCurrency(
  amountInCAD: number,
  targetCurrency: Currency
): number {
  const rate = EXCHANGE_RATES[targetCurrency]
  return amountInCAD * rate
}

// Format currency with proper symbol and decimals
export function formatCurrency(
  amount: number,
  currency: Currency,
  options?: {
    showCurrency?: boolean
    decimals?: number
  }
): string {
  const { showCurrency = true, decimals = 2 } = options || {}
  
  const formattedAmount = amount.toFixed(decimals)
  const symbol = CURRENCY_SYMBOLS[currency]
  
  if (!showCurrency) {
    return formattedAmount
  }
  
  // Format based on currency conventions
  switch (currency) {
    case "USD":
    case "CAD":
      return `${symbol}${formattedAmount}`
    case "GBP":
      return `${symbol}${formattedAmount}`
    default:
      return `${symbol}${formattedAmount}`
  }
}

// Convert and format in one function
export function formatPrice(
  priceInCAD: number,
  currency: Currency,
  options?: {
    showCurrency?: boolean
    decimals?: number
  }
): string {
  const convertedAmount = convertCurrency(priceInCAD, currency)
  return formatCurrency(convertedAmount, currency, options)
}

// Get currency name
export function getCurrencyName(currency: Currency): string {
  const names: Record<Currency, string> = {
    USD: "US Dollar",
    CAD: "Canadian Dollar",
    GBP: "British Pound",
  }
  return names[currency]
}

// Parse price string to number (handles different formats)
export function parsePrice(priceString: string): number {
  // Remove currency symbols and spaces
  const cleanedString = priceString
    .replace(/[^0-9.-]/g, '')
    .trim()
  
  return parseFloat(cleanedString) || 0
}