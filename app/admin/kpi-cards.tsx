"use client"

import { TrendingUp, Calendar, Activity, Users, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Booking } from "../types"

interface Props {
    bookings: Booking[]
}




export function KPICards({ bookings }: Props) {
  const kpis = [
  {
    title: "Ingresos Hoy",
    value: "$245",
    changeType: "positive" as const,
    icon: TrendingUp,
    color: "primary",
  },
  {
    title: "Reservas Activas",
    value: bookings.length.toString(),
    changeType: "positive" as const,
    icon: Calendar,
    color: "accent",
  },
  {
    title: "Clientes Unicos",
    value: "1",
    changeType: "negative" as const,
    icon: Users,
    color: "chart-4",
  },
]
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {kpis.map((kpi) => (
        <div 
          key={kpi.title}
          className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur p-5 transition-all hover:border-border hover:bg-card"
        >
          {/* Background glow */}
          <div className={cn(
            "absolute -top-12 -right-12 w-32 h-32 rounded-full blur-3xl opacity-20",
            kpi.color === "primary" && "bg-primary",
            kpi.color === "accent" && "bg-accent",
            kpi.color === "chart-3" && "bg-chart-3",
            kpi.color === "chart-4" && "bg-chart-4",
          )} />
          
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className={cn(
                "w-11 h-11 rounded-xl flex items-center justify-center",
                kpi.color === "primary" && "bg-primary/20 text-primary",
                kpi.color === "accent" && "bg-accent/20 text-accent",
                kpi.color === "chart-3" && "bg-chart-3/20 text-chart-3",
                kpi.color === "chart-4" && "bg-chart-4/20 text-chart-4",
              )}>
                <kpi.icon className="h-5 w-5" />
              </div>
            
            </div>
            
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
              {kpi.title}
            </p>
            <p className="text-3xl font-black tracking-tight text-foreground">{kpi.value}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
