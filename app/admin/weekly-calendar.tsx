"use client"

import { useState, useMemo } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ChevronLeft, ChevronRight, User, Phone, Clock, MapPin, X, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"
// Importa tu tipo compartido
import { Booking } from "../types"

const hours = Array.from({ length: 15 }, (_, i) => i + 8)

// TU DISEÑO ORIGINAL DE COLORES
const getStatusColor = (status: string) => {
  switch (status) {
    case "CONFIRMED":
      return "bg-primary/90 hover:bg-primary text-primary-foreground border-primary/50"
    case "PENDING":
      return "bg-accent/90 hover:bg-accent text-accent-foreground border-accent/50"
    case "CANCELLED":
      return "bg-destructive/30 hover:bg-destructive/40 text-destructive border-destructive/50"
    default:
      return "bg-secondary"
  }
}

interface Props {
  bookings: Booking[]
}

export function WeeklyCalendar({ bookings }: Props) {
  // 1. LÓGICA DE FECHAS (Solo toqué esto para asegurar que empiece el Lunes correcto)
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const today = new Date()
    const dayOfWeek = today.getDay() 
    const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1)
    const monday = new Date(today)
    monday.setDate(diff)
    return monday
  })
  
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)

  const weekDays = useMemo(() => {
    const days = []
    for (let i = 0; i < 7; i++) {
      const day = new Date(currentWeekStart)
      day.setDate(currentWeekStart.getDate() + i)
      days.push(day)
    }
    return days
  }, [currentWeekStart])

  const handlePrevWeek = () => {
    const newStart = new Date(currentWeekStart)
    newStart.setDate(currentWeekStart.getDate() - 7)
    setCurrentWeekStart(newStart)
  }

  const handleNextWeek = () => {
    const newStart = new Date(currentWeekStart)
    newStart.setDate(currentWeekStart.getDate() + 7)
    setCurrentWeekStart(newStart)
  }

  // 2. LÓGICA CORREGIDA (invisible al diseño)
  // Ahora recibe la FECHA de la columna (slotDate), no el índice (0,1,2...)
  const getBookingForSlot = (slotDate: Date, hour: number) => {
    return bookings.find((b) => {
      const bookingDate = new Date(b.startTime);
      return (
        bookingDate.getDate() === slotDate.getDate() &&
        bookingDate.getMonth() === slotDate.getMonth() &&
        bookingDate.getFullYear() === slotDate.getFullYear() &&
        bookingDate.getHours() === hour &&
        b.status !== "CANCELLED"
      );
    });
  }

  const formatDateRange = () => {
    const start = weekDays[0]
    const end = weekDays[6]
    const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
    return `${start.getDate()} ${months[start.getMonth()]} - ${end.getDate()} ${months[end.getMonth()]} ${end.getFullYear()}`
  }

  const dayNames = ["Lun", "Mar", "Mie", "Jue", "Vie", "Sab", "Dom"]

  // 3. TU DISEÑO VISUAL (Intacto)
  return (
    <div className="bg-card/50 backdrop-blur rounded-2xl border border-border/50 overflow-hidden">
      {/* Calendar Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border/50">
        <h3 className="font-bold text-lg text-foreground">Calendario Semanal</h3>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={handlePrevWeek} className="h-9 w-9 rounded-xl">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-semibold min-w-[180px] text-center text-muted-foreground">
            {formatDateRange()}
          </span>
          <Button variant="ghost" size="icon" onClick={handleNextWeek} className="h-9 w-9 rounded-xl">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Day Headers */}
          <div className="grid grid-cols-8 border-b border-border/50">
            <div className="p-3 text-center text-xs font-bold text-muted-foreground bg-secondary/30">
              HORA
            </div>
            {weekDays.map((day, index) => {
              const isToday = day.toDateString() === new Date().toDateString()
              return (
                <div
                  key={index}
                  className={cn(
                    "p-3 text-center border-l border-border/50",
                    isToday && "bg-primary/5"
                  )}
                >
                  <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    {dayNames[index]}
                  </div>
                  <div
                    className={cn(
                      "text-lg font-black mt-0.5",
                      isToday ? "text-primary" : "text-foreground"
                    )}
                  >
                    {day.getDate()} {/* AQUÍ MOSTRAMOS EL NÚMERO DEL DÍA */}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Time Slots */}
          <div className="max-h-[500px] overflow-y-auto">
            {hours.map((hour) => (
              <div key={hour} className="grid grid-cols-8 border-b border-border/30">
                <div className="p-2 text-center text-xs font-semibold text-muted-foreground bg-secondary/20 flex items-center justify-center">
                  {hour}:00
                </div>
                {weekDays.map((day, dayIndex) => {
                  // CORRECCIÓN CLAVE: Pasamos 'day' en vez de 'dayIndex'
                  const booking = getBookingForSlot(day, hour)
                  const isToday = day.toDateString() === new Date().toDateString()
                  return (
                    <div
                      key={dayIndex}
                      className={cn(
                        "p-1 border-l border-border/30 min-h-[56px] relative",
                        isToday && "bg-primary/5"
                      )}
                    >
                      {booking && (
                        <button
                          onClick={() => setSelectedBooking(booking)}
                          className={cn(
                            "w-full p-2 rounded-lg text-left text-xs transition-all border",
                            getStatusColor(booking.status)
                          )}
                          // Ajuste visual simple para altura
                          style={{ minHeight: "46px" }} 
                        >
                          <div className="font-bold truncate">
                            {booking.field?.name || "Cancha"}
                          </div>
                          <div className="truncate opacity-80 text-[10px]">
                            {booking.clientName}
                          </div>
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Booking Details Dialog (Manteniendo tu estilo) */}
      <Dialog open={!!selectedBooking} onOpenChange={() => setSelectedBooking(null)}>
        <DialogContent className="bg-card border-border/50 rounded-2xl max-w-md">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl font-bold">Detalles de Reserva</DialogTitle>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 rounded-full"
                onClick={() => setSelectedBooking(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-5 pt-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-lg text-foreground">
                  {selectedBooking.field?.name}
                </span>
                <Badge className={cn(
                  "font-semibold",
                  selectedBooking.status === "CONFIRMED" && "bg-primary/20 text-primary border-0",
                  selectedBooking.status === "PENDING" && "bg-accent/20 text-accent border-0",
                  selectedBooking.status === "CANCELLED" && "bg-destructive/20 text-destructive border-0"
                )}>
                  {selectedBooking.status}
                </Badge>
              </div>
              
              <div className="space-y-3 bg-secondary/30 rounded-xl p-4">
                <div className="flex items-center gap-3 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{selectedBooking.clientName}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{selectedBooking.clientPhone}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {selectedBooking.startTime.split("T")[1].substring(0,5)}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{selectedBooking.field?.name}</span>
                </div>
              </div>
              
              <div className="flex gap-3 pt-2">
                  <Button className="w-full" onClick={() => setSelectedBooking(null)}>
                    Cerrar
                  </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}