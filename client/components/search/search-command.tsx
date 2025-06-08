"use client"

import * as React from "react"
import { Search, Package, Store, Users } from "lucide-react"
import { useRouter } from "next/navigation"

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SearchCommandProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function SearchCommand({ open: controlledOpen, onOpenChange }: SearchCommandProps) {
  const [internalOpen, setInternalOpen] = React.useState(false)
  const router = useRouter()

  // Use controlled state if provided, otherwise use internal state
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen
  const setOpen = onOpenChange || setInternalOpen

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen(!isOpen)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [isOpen, setOpen])

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false)
    command()
  }, [setOpen])

  return (
    <>
      <Button
        variant="outline"
        className={cn(
          "relative h-9 w-full justify-start rounded-[0.5rem] text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64"
        )}
        onClick={() => setOpen(true)}
      >
        <Search className="mr-2 h-4 w-4" />
        <span className="hidden lg:inline-flex">Search products...</span>
        <span className="inline-flex lg:hidden">Search...</span>
        <kbd className="pointer-events-none absolute right-[0.3rem] top-[0.3rem] hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <CommandDialog open={isOpen} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Quick Actions">
            <CommandItem
              onSelect={() => runCommand(() => router.push("/shop"))}
            >
              <Package className="mr-2 h-4 w-4" />
              <span>Browse Products</span>
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => router.push("/seller/dashboard"))}
            >
              <Store className="mr-2 h-4 w-4" />
              <span>Seller Dashboard</span>
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => router.push("/admin"))}
            >
              <Users className="mr-2 h-4 w-4" />
              <span>Admin Panel</span>
            </CommandItem>
          </CommandGroup>
          <CommandGroup heading="Recent Searches">
            <CommandItem
              onSelect={() => runCommand(() => router.push("/shop?search=electronics"))}
            >
              <Search className="mr-2 h-4 w-4" />
              <span>Electronics</span>
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => router.push("/shop?search=clothing"))}
            >
              <Search className="mr-2 h-4 w-4" />
              <span>Clothing</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
} 