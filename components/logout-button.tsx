"use client"

import { LogOut } from "lucide-react"
import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function LogoutButton() {
  const handleLogout = async () => {
    try {
      await signOut({ 
        callbackUrl: "/login",
        redirect: true 
      })
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          <span className="sr-only">Logout</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Logout</p>
      </TooltipContent>
    </Tooltip>
  )
}
