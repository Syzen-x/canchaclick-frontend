"use client";


import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalendarDays, Loader2 } from "lucide-react";

interface Props {
    fieldId: number;
    fieldName: string;
    price: number;
}






export default function BookingModal({ fieldId, fieldName, price }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);


    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        date: '',
        startTime: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setIsLoading(true);
        try {
            const startDateTime = `${formData.date}T${formData.startTime}:00`;
            const startHour = parseInt(formData.startTime.split(':')[0], 10);
            const endHour = startHour + 1;
            const endTime = `${endHour.toString().padStart(2, '0')}:00`;
            const endDateTime = `${formData.date}T${endTime}:00`;


            const payload = {
                fieldId: fieldId,
                clientName: formData.name,
                clientPhone: formData.phone,
                startTime: startDateTime,
                endTime: endDateTime,
            };

            const response = await fetch('http://localhost:8080/api/bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });
            if (!response.ok) {
                const errorMsg = await response.text();
                alert('Error al crear la reserva: ' + errorMsg);
                return;

            }

            alert('Reserva creada con exito! Te esperamos.');
            setIsOpen(false);
            setFormData({
                name: '',
                phone: '',
                date: '',
                startTime: '',
            })
        } catch (error) {
            console.error("Connection Error: ", error);
            alert('Error al crear la reserva. Por favor, intenta nuevamente.');
        } finally {
            setIsLoading(false);
        };

    
    }
    
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            setFormData({
                ...formData,
                [e.target.name]: e.target.value,
            });
        }

    return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {/* El botón que activa el modal */}
      <DialogTrigger asChild>
        <Button className="w-full bg-slate-900 hover:bg-slate-800">
          <CalendarDays className="w-4 h-4 mr-2" />
          Reservar Ahora
        </Button>
      </DialogTrigger>

      {/* El contenido del modal */}
      <DialogContent className="sm:max-w-[425px] bg-white text-slate-900">
        <DialogHeader>
          <DialogTitle>Reservar {fieldName}</DialogTitle>
          <DialogDescription>
            Precio: <span className="font-bold text-emerald-600">${price}</span> / hora
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          
          <div className="grid gap-2">
            <Label htmlFor="name">Tu Nombre</Label>
            <Input id="name" name="name" required onChange={handleChange} value={formData.name} placeholder="Juan Pérez" />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="phone">Celular</Label>
            <Input id="phone" name="phone" required type="tel" onChange={handleChange} value={formData.phone} placeholder="099..." />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="date">Fecha</Label>
              <Input id="date" name="date" required type="date" onChange={handleChange} value={formData.date} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="startTime">Hora Inicio</Label>
              <Input id="startTime" name="startTime" required type="time" onChange={handleChange} value={formData.startTime} />
            </div>
          </div>
          
          <p className="text-xs text-slate-500 text-center mt-2">
            * Las reservas son de 1 hora por defecto.
          </p>

          <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Procesando...
              </>
            ) : (
              "Confirmar Reserva"
            )}
          </Button>

        </form>
      </DialogContent>
    </Dialog>
  );
}








