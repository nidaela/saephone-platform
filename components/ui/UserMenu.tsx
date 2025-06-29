"use client"

import React from "react"
import { User, LogOut, Settings, Lock } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface UserMenuProps {
  onLogout: () => void
  onProfileClick?: () => void
  onSettingsClick?: () => void
  userRole?: string
  userName?: string // nombre completo para el tooltip
  theme?: "default" | "lime"
  t: {
    userMenu_profile: string
    userMenu_changePassword: string
    userMenu_logout: string
  }
}

export const UserMenu: React.FC<UserMenuProps> = ({
  onLogout,
  onProfileClick,
  onSettingsClick,
  userRole,
  userName = "Usuario",
  theme = "default",
  t
}) => {
  const getInitials = (role: string) => {
    switch (role) {
      case "admin":
        return "A"
      case "sales":
        return "S"
      case "manager":
        return "M"
      case "super-admin":
        return "SA"
      default:
        return "U"
    }
  }

  // Color del avatar según tema
  const getAvatarStyle = () => {
    if (theme === "lime") {
      return "bg-[#A4C639] text-white border-2 border-white shadow-lg"
    }
    return "bg-[#003366] text-white border-2 border-white shadow-lg"
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-12 w-12 rounded-full bg-transparent hover:bg-white/10 border-0 p-0 flex items-center justify-center"
          aria-label="Menú de usuario"
        >
          <div className="group">
            <Avatar className="h-12 w-12">
              <AvatarFallback 
                className={`font-bold text-lg flex items-center justify-center ${getAvatarStyle()}`}
                title={userName}
              >
                {getInitials(userRole || "default")}
              </AvatarFallback>
            </Avatar>
            <span className="absolute z-50 left-1/2 -translate-x-1/2 mt-2 px-3 py-1 rounded bg-gray-900 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-lg">
              {userName}
            </span>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="w-60 bg-white border border-gray-200 shadow-2xl rounded-xl p-2 animate-fade-in"
        align="end"
        sideOffset={10}
      >
        <DropdownMenuItem 
          className="flex items-center gap-4 px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 cursor-pointer rounded-lg"
          onClick={onProfileClick}
        >
          <User className="w-5 h-5 text-gray-500" />
          <span className="font-sans text-[15px]">{t.userMenu_profile}</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          className="flex items-center gap-4 px-4 py-3 text-base font-medium text-gray-400 hover:bg-gray-50 cursor-not-allowed rounded-lg opacity-50"
          disabled
        >
          <Lock className="w-5 h-5 text-gray-300" />
          <span className="font-sans text-[15px]">{t.userMenu_changePassword}</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="my-2 bg-gray-200" />
        <DropdownMenuItem 
          className="flex items-center gap-4 px-4 py-3 text-base font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 cursor-pointer rounded-lg transition-colors"
          onClick={onLogout}
        >
          <LogOut className="w-5 h-5 text-gray-500" />
          <span className="font-sans text-[15px]">{t.userMenu_logout}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.18s cubic-bezier(.4,0,.2,1);
        }
      `}</style>
    </DropdownMenu>
  )
} 