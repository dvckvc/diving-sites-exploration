import { useSession } from "next-auth/react"
import type { Role } from "@prisma/client"

export function useAuth() {
  const { data: session, status } = useSession()
  
  const user = session?.user
  const isLoading = status === "loading"
  const isAuthenticated = status === "authenticated"
  
  const hasRole = (role: Role): boolean => {
    if (!user) return false
    
    // Role hierarchy: ADMIN > GUIDE > USER > GUEST
    const roleHierarchy = {
      GUEST: 0,
      USER: 1,
      GUIDE: 2,
      ADMIN: 3
    }
    
    const userLevel = roleHierarchy[user.role]
    const requiredLevel = roleHierarchy[role]
    
    return userLevel >= requiredLevel
  }
  
  const isGuest = user?.role === "GUEST"
  const isUser = hasRole("USER")
  const isGuide = hasRole("GUIDE") 
  const isAdmin = hasRole("ADMIN")
  
  return {
    user,
    isLoading,
    isAuthenticated,
    hasRole,
    isGuest,
    isUser,
    isGuide,
    isAdmin
  }
}
