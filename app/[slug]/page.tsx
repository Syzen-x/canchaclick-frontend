
"use client";


import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { StringToBoolean } from "class-variance-authority/types";
import { Badge, CalendarDays, MapPin, Phone } from "lucide-react";
import BookingModal from "../components/BookingModal";



interface Field {
    id: number;
    name: string;
    type: string;
    hourlyPrice: number;
    image: string;

}


interface TenantResponse {
  id: number;
  name: string;
  slug: string;
  address: string;
  phone: string;
  fields: Field[];
}






























async function getTenantData(slug: string): Promise<TenantResponse | null> {
  if (slug.includes(".")) return null; // Evitar rutas con puntos para seguridad
    try {
      const res = await fetch('http://localhost:8080/api/tenants/' + slug, {
        cache: 'no-store',
      });
      if (!res.ok) {
        return null;
    }

    return res.json();
  
  }catch (error) {
    console.error("Error fetching tenant data:", error);
    return null;
  }
}



    interface Props {
        params: Promise<{ slug: string }>;
    }


export default async function TenantPage({ params }: Props) {
    const { slug } = await params;

  // Simulamos el nombre del complejo basado en la URL
  const tenantName = slug.replace("-", " ").toUpperCase();



  const tenant = await getTenantData(slug);


    if (!tenant) {
        return (
          <div className="max-w-md mx-auto px-4 mt-8">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">Complejo no encontrado</h2>
            <p className="text-slate-600">Lo sentimos, no pudimos encontrar el complejo que buscas.</p>
          </div>
        );
      }

  return (
    <div className="min-h-screen bg-slate-50 pb-10">
      {/* HEADER DEL COMPLEJO */}
      <div className="bg-slate-900 text-white py-8 px-4 shadow-lg">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold text-emerald-400">{tenantName}</h1>
          
          <div className="mt-4 flex flex-col gap-2 text-slate-300">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>Av. Quito y Calle 5, Lago Agrio</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              <span>099 123 4567</span>
            </div>
          </div>
        </div>
      </div>

    
      

      {/* LISTA DE CANCHAS */}
      <main className="max-w-md mx-auto px-4 mt-8">
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Nuestras Canchas</h2>
        
        <div className="grid gap-6">
          {tenant.fields.map((field) => (
            <Card key={field.id} className="overflow-hidden border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              {/* Imagen de la cancha */}
              <div className="h-40 bg-slate-200 relative">
                <img 
                  src={field.image} 
                  alt={field.name}
                  className="w-full h-full object-cover"
                />
                <Badge className="absolute top-2 right-2 bg-slate-900/80 hover:bg-slate-900">
                  {field.type.replace("_", " ")}
                </Badge>
              </div>

              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{field.name}</CardTitle>
              </CardHeader>

              <CardContent>
                <p className="text-2xl font-bold text-emerald-600">
                  ${field.hourlyPrice.toFixed(2)} <span className="text-sm text-slate-500 font-normal">/ hora</span>
                </p>
              </CardContent>
            <BookingModal 
             fieldId={field.id} 
             fieldName={field.name}
             price={field.hourlyPrice} 
             />
                        
            </Card>

          ))}
        </div>
      </main>
    </div>
  );
}

