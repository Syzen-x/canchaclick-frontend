"use client"

import React, { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Field } from "../types"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus, Zap, Loader2 } from "lucide-react"
import { toast } from "sonner" // O usa alert() si no tienes sonner instalado

interface Props { 
  fields : Field[]
}

// Generamos horas de 08:00 a 23:00
const timeSlots = Array.from({ length: 16 }, (_, i) => `${(i + 8).toString().padStart(2, "0")}:00`)

export function NewBookingDialog({ fields }: Props) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false) // Para mostrar spinner mientras guarda

  // Inicializamos con valores por defecto para evitar error de "uncontrolled component"
  const [formData, setFormData] = useState({
      fieldId: fields.length > 0 ? fields[0].id.toString() : "", // Selecciona la primera cancha por defecto
      date: new Date().toISOString().split('T')[0], // Fecha de hoy
      time: "10:00",
      hours: "1",
      clientName: "",
      clientPhone: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // 1. Construir las fechas ISO para Java
    const startDateTimeString = `${formData.date}T${formData.time}:00`;
    
    // Calculamos la fecha de fin sumando las horas
    const startDate = new Date(startDateTimeString);
    const endDate = new Date(startDate.getTime() + (parseInt(formData.hours) * 60 * 60 * 1000));
    
    // Ajuste manual para obtener formato local YYYY-MM-DDTHH:mm:ss (evita problemas de zona horaria UTC)
    // Nota: Esto asume que el backend espera la hora local.
    const toLocalISO = (date: Date) => {
        const pad = (n: number) => n.toString().padStart(2, '0');
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:00`;
    };

    const payload = {
        tenantId: 1, // ⚠️ IMPORTANTE: Ajusta esto dinámicamente si tienes el ID del tenant
        fieldId: parseInt(formData.fieldId),
        startTime: startDateTimeString,
        endTime: toLocalISO(endDate),
        clientName: formData.clientName,
        clientPhone: formData.clientPhone,
        totalPrice: 15.00 * parseInt(formData.hours), // Ejemplo de cálculo bási
        hours: parseInt(formData.hours),
    };

    console.log("Enviando reserva:", payload)

    try {
        const token = localStorage.getItem("token");
      
        if (!token) throw new Error("No hay sesión activa");
  console.log("Token para autenticación:", token);
        const res = await fetch("http://localhost:8080/api/bookings", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            // Intentamos leer el mensaje de error del backend
            const errorText = await res.text(); 
            throw new Error(errorText || "Error al crear la reserva");
        }

        // ¡Éxito!
        console.log("Reserva creada correctamente");
        setOpen(false);
        window.location.reload(); // Recargamos para ver la reserva en la tabla

    } catch (error: any) {
        console.error("Error:", error);
        alert("Error: " + error.message); // Feedback visual simple
    } finally {
        setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 h-11 rounded-xl font-bold shadow-lg shadow-primary/20">
          <Plus className="h-4 w-4" />
          <span className="hidden md:inline">Nueva Reserva</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[440px] bg-card border-border/50 rounded-2xl p-0 overflow-hidden">
        <div className="bg-primary/10 border-b border-border/50 px-6 py-5">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
                <Zap className="w-4 h-4 text-primary-foreground" />
              </div>
              Nueva Reserva
            </DialogTitle>
          </DialogHeader>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="field" className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Cancha</Label>
              <Select
                value={formData.fieldId}
                onValueChange={(value) => setFormData({ ...formData, fieldId: value })}
              >
                <SelectTrigger className="h-12 rounded-xl bg-secondary/50 border-border/50">
                  <SelectValue placeholder="Seleccionar cancha" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {fields.map((field) => (
                    <SelectItem key={field.id} value={`${field.id}`} className="rounded-lg">
                      {field.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date" className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Fecha</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="h-12 rounded-xl bg-secondary/50 border-border/50"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time" className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Hora</Label>
                <Select
                  value={formData.time}
                  onValueChange={(value) => setFormData({ ...formData, time: value })}
                >
                  <SelectTrigger className="h-12 rounded-xl bg-secondary/50 border-border/50">
                    <SelectValue placeholder="Hora" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl h-48">
                    {timeSlots.map((time) => (
                      <SelectItem key={time} value={time} className="rounded-lg">
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="duration" className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Duración</Label>
              <Select
                value={formData.hours}
                onValueChange={(value) => setFormData({ ...formData, hours: value })}
              >
                <SelectTrigger className="h-12 rounded-xl bg-secondary/50 border-border/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="1" className="rounded-lg">1 hora</SelectItem>
                  <SelectItem value="2" className="rounded-lg">2 horas</SelectItem>
                  <SelectItem value="3" className="rounded-lg">3 horas</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="clientName" className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Nombre del Cliente</Label>
              <Input
                id="clientName"
                placeholder="Juan Pérez"
                value={formData.clientName}
                onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                className="h-12 rounded-xl bg-secondary/50 border-border/50"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="clientPhone" className="text-xs font-bold text-muted-foreground uppercase tracking-wider">WhatsApp</Label>
              <Input
                id="clientPhone"
                placeholder="0991234567"
                type="tel"
                value={formData.clientPhone}
                onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
                className="h-12 rounded-xl bg-secondary/50 border-border/50"
              />
            </div>
          </div>
          
          <div className="flex gap-3 mt-6 pt-5 border-t border-border/50">
            <Button 
              type="button" 
              variant="ghost" 
              onClick={() => setOpen(false)}
              className="flex-1 h-12 rounded-xl font-bold"
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button 
              type="submit"
              className="flex-1 h-12 rounded-xl font-bold shadow-lg shadow-primary/20"
              disabled={loading}
            >
              {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Guardando...
                  </>
              ) : (
                  "Crear Reserva"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}