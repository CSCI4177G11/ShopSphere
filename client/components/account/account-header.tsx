import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

interface AccountHeaderProps {
  user: {
    name?: string | null
    email?: string | null
    image?: string | null
    role?: string
  }
}

export function AccountHeader({ user }: AccountHeaderProps) {
  return (
    <div className="flex items-center space-x-4">
      <Avatar className="h-16 w-16">
        <AvatarImage src={user.image || ""} alt={user.name || "User"} />
        <AvatarFallback className="text-lg">{user.name?.charAt(0) || "U"}</AvatarFallback>
      </Avatar>
      <div>
        <h1 className="text-2xl font-bold">{user.name}</h1>
        <p className="text-muted-foreground">{user.email}</p>
        <Badge variant="secondary" className="mt-1">
          {user.role === "consumer" ? "Customer" : user.role}
        </Badge>
      </div>
    </div>
  )
}
