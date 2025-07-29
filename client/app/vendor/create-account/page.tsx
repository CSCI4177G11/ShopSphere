"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { motion } from "framer-motion"
import { userService } from "@/lib/api/user-service"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, Link2, Image as ImageIcon } from "lucide-react"
import { toast } from "sonner"
import { useAuth } from "@/components/auth-provider"

// Import country data - use the default export
import { allCountries } from "country-region-data"

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"

/* -------------------------------------------------------------------------- */
/*                              schema / helpers                              */
/* -------------------------------------------------------------------------- */

const profileSchema = z.object({
  storeName: z.string().min(2, "Store name is required"),
  location: z.string().min(2, "Location is required"),
  phoneNumber: z.string().min(5, "Phone number is required"),
  logoUrl: z.string().optional(),
  storeBannerUrl: z.string().optional(),
})

type ProfileForm = z.infer<typeof profileSchema>
type Option = { label: string; value: string }

const ALLOWED = ["CA", "US", "GB"]
// CountryData format is: [countryName, countryCode, regions[]]
// where regions is array of [regionName, regionCode]
const countries = allCountries.filter((country) =>
  ALLOWED.includes(country[1])
)
const countryOptions: Option[] = countries.map((country) => ({
  label: country[0], // countryName
  value: country[1], // countryCode
}))

const compressImage = (file: File, max: number) =>
  new Promise<string>((resolve) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        let [w, h] = [img.width, img.height]
        if (w > max || h > max) {
          if (w > h) {
            h = (h / w) * max
            w = max
          } else {
            w = (w / h) * max
            h = max
          }
        }
        const canvas = document.createElement("canvas")
        canvas.width = w
        canvas.height = h
        canvas.getContext("2d")!.drawImage(img, 0, 0, w, h)
        resolve(canvas.toDataURL("image/jpeg", 0.6))
      }
      img.src = e.target?.result as string
    }
    reader.readAsDataURL(file)
  })

/* -------------------------------------------------------------------------- */
/*                                 component                                  */
/* -------------------------------------------------------------------------- */

export default function CreateVendorAccountPage() {
  const router = useRouter()
  const { signOut } = useAuth()

  /* ----------------------- form / react‑hook‑form ------------------------ */
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProfileForm>({ resolver: zodResolver(profileSchema) })

  /* ------------------------------ state ---------------------------------- */

  const [submitting, setSubmitting] = useState(false)

  /* country & region */
  const [countryCode, setCountryCode] = useState<string>("CA")
  const [regionOptions, setRegionOptions] = useState<Option[]>([])
  const [regionCode, setRegionCode] = useState<string | undefined>()

  /* images */
  const [logoPreview, setLogoPreview] = useState("")
  const [bannerPreview, setBannerPreview] = useState("")
  const logoInput = useRef<HTMLInputElement>(null)
  const bannerInput = useRef<HTMLInputElement>(null)

  /* ------------------------ effects: regions ----------------------------- */

  useEffect(() => {
    const country = countries.find((c) => c[1] === countryCode)
    if (!country) return
    
    const regions = country[2] // regions array
    const regs = regions.map((r) => ({ label: r[0], value: r[1] }))
    setRegionOptions(regs)
    setRegionCode(regs[0]?.value)            // safe even if empty
    setValue("location", regs[0]?.label || "")
  }, [countryCode, setValue])

  /* ----------------------------- handlers -------------------------------- */

  const onLogoUpload = async (file: File) => {
    if (file.size > 1_000_000) return toast.error("Logo must be <1 MB")
    setLogoPreview(await compressImage(file, 200))
  }

  const onBannerUpload = async (file: File) => {
    if (file.size > 1_000_000) return toast.error("Banner must be <1 MB")
    setBannerPreview(await compressImage(file, 600))
  }

  const onSubmit = async (data: ProfileForm) => {
    setSubmitting(true)
    try {
      await userService.createVendorProfile({
        storeName: data.storeName,
        location: data.location,
        phoneNumber: data.phoneNumber,
        logoUrl: data.logoUrl || logoPreview,
        storeBannerUrl: data.storeBannerUrl || bannerPreview,
        socialLinks: [],
      })
      toast.success("Profile created")
      router.push("/vendor")
    } catch (e: any) {
      toast.error(e.message || "Failed")
    } finally {
      setSubmitting(false)
    }
  }

  /* ------------------------------ render --------------------------------- */

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 py-16">
      <Button
        variant="outline"
        size="sm"
        className="fixed top-4 right-4"
        onClick={() => signOut()}
      >
        Log out
      </Button>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-xl"
      >
        <Card className="shadow-xl">
          <CardContent className="p-8 space-y-6">
            <h1 className="text-2xl font-bold text-center">Set up your store</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Store name */}
              <div className="space-y-2">
                <Label>Store name</Label>
                <Input {...register("storeName")} disabled={submitting} />
                {errors.storeName && (
                  <p className="text-sm text-destructive">
                    {errors.storeName.message}
                  </p>
                )}
              </div>

              {/* Country */}
              <div className="space-y-2">
                <Label>Country</Label>
                <Select
                  value={countryCode}
                  onValueChange={(v) => setCountryCode(v)}
                  disabled={submitting}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countryOptions.map((c) => (
                      <SelectItem key={c.value} value={c.value}>
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Region */}
              <div className="space-y-2">
                <Label>Region</Label>
                <Select
                  value={regionCode}
                  onValueChange={(v) => {
                    setRegionCode(v)
                    const label = regionOptions.find((r) => r.value === v)?.label || ""
                    setValue("location", label)
                  }}
                  disabled={submitting || !regionOptions.length}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Region" />
                  </SelectTrigger>
                  <SelectContent>
                    {regionOptions.map((r) => (
                      <SelectItem key={r.value} value={r.value}>
                        {r.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.location && (
                  <p className="text-sm text-destructive">
                    {errors.location.message}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label>Phone number</Label>
                <Input {...register("phoneNumber")} disabled={submitting} />
                {errors.phoneNumber && (
                  <p className="text-sm text-destructive">
                    {errors.phoneNumber.message}
                  </p>
                )}
              </div>

              {/* Logo */}
              <div className="space-y-2">
                <Label>Store Logo</Label>
                <Tabs defaultValue="url">
                  <TabsList className="grid grid-cols-2">
                    <TabsTrigger value="url">URL</TabsTrigger>
                    <TabsTrigger value="upload">Upload</TabsTrigger>
                  </TabsList>

                  <TabsContent value="url" className="mt-4">
                    <Input
                      placeholder="https://example.com/logo.png"
                      {...register("logoUrl")}
                      disabled={submitting}
                    />
                  </TabsContent>

                  <TabsContent value="upload" className="mt-4">
                    <input
                      ref={logoInput}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        e.target.files?.[0] && onLogoUpload(e.target.files[0])
                      }
                    />
                    <Button
                      type="button"
                      onClick={() => logoInput.current?.click()}
                      disabled={submitting}
                    >
                      <ImageIcon className="mr-2 h-4 w-4" /> Choose Logo
                    </Button>
                    {logoPreview && (
                      <img
                        src={logoPreview}
                        alt="logo preview"
                        className="w-32 h-32 object-cover rounded-lg mt-2"
                      />
                    )}
                  </TabsContent>
                </Tabs>
              </div>

              {/* Banner */}
              <div className="space-y-2">
                <Label>Store Banner</Label>
                <Tabs defaultValue="url">
                  <TabsList className="grid grid-cols-2">
                    <TabsTrigger value="url">URL</TabsTrigger>
                    <TabsTrigger value="upload">Upload</TabsTrigger>
                  </TabsList>

                  <TabsContent value="url" className="mt-4">
                    <Input
                      placeholder="https://example.com/banner.png"
                      {...register("storeBannerUrl")}
                      disabled={submitting}
                    />
                  </TabsContent>

                  <TabsContent value="upload" className="mt-4">
                    <input
                      ref={bannerInput}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        e.target.files?.[0] && onBannerUpload(e.target.files[0])
                      }
                    />
                    <Button
                      type="button"
                      onClick={() => bannerInput.current?.click()}
                      disabled={submitting}
                    >
                      <ImageIcon className="mr-2 h-4 w-4" /> Choose Banner
                    </Button>
                    {bannerPreview && (
                      <img
                        src={bannerPreview}
                        alt="banner preview"
                        className="w-full h-32 object-cover rounded-lg mt-2"
                      />
                    )}
                  </TabsContent>
                </Tabs>
              </div>

              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? "Creating…" : "Create Profile"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
