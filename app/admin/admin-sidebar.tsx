"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Calendar,
  ClipboardList,
  TrendingUp,
  Settings,
  Menu,
  X,
  LayoutDashboard,
  Zap,
  LogOut,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { set } from "zod"

interface AdminSidebarProps {
  activeItem: string
  onItemChange: (item: string) => void
  tenantData: any

}

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "settings", label: "Config", icon: Settings },
]

function getUserEmailFromToken(token : string) {
  if (!token) return null;

  try {
    // El token tiene 3 partes separadas por puntos. La segunda es el payload.
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    const payload = JSON.parse(jsonPayload);
    return payload.sub; // Tu email
  } catch (e) {
    return null;
  }
}

export function AdminSidebar({ activeItem, onItemChange, tenantData }: AdminSidebarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [email, setEmail] = useState("")

  useEffect(() => { 
    setEmail(getUserEmailFromToken(localStorage.getItem("token") || ""));
  }, [])
  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden bg-card/80 backdrop-blur-sm"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-screen w-72 bg-sidebar border-r border-sidebar-border transition-transform duration-300 md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-3 px-6 py-6 border-b border-sidebar-border">
            <div className="w-11 h-11 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
              <Zap className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h2 className="font-black text-lg tracking-tight text-sidebar-foreground">{tenantData?.name || "TenantData"}</h2>
              <p className="text-xs font-medium text-muted-foreground">Admin Panel</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1.5">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-3 mb-4">Menu</p>
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onItemChange(item.id)
                  setIsOpen(false)
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200",
                  activeItem === item.id
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                    : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </button>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 mx-4 mb-4 rounded-2xl bg-sidebar-accent/50 border border-sidebar-border">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <span className="text-primary text-sm font-bold">AD</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-sidebar-foreground truncate">Admin</p>
                <p className="text-xs text-muted-foreground truncate">{email}</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="w-full justify-start text-muted-foreground hover:text-foreground">
              <LogOut className="w-4 h-4 mr-2" />
              Cerrar sesion
            </Button>
          </div>
        </div>
      </aside>
    </>
  )
}
