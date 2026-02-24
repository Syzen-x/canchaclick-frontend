"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bell, Search, ArrowUpRight, MoreHorizontal, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { AdminSidebar } from "./admin-sidebar"
import { KPICards } from "./kpi-cards"

import { Booking, Field } from "../types"
import { WeeklyCalendar } from "./weekly-calendar"
import { NewBookingDialog } from "./new-booking-dialog"
import { set } from "zod"


const getStatusBadge = (status: string) => {
  switch (status) {
    case "confirmed":
      return <Badge className="bg-primary/20 text-primary border-0 font-semibold">Confirmado</Badge>
    case "pending":
      return <Badge className="bg-accent/20 text-accent border-0 font-semibold">Pendiente</Badge>
    case "cancelled":
      return <Badge className="bg-destructive/20 text-destructive border-0 font-semibold">Cancelado</Badge>
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}





interface TenantData {
  id: string,
  name: string,
  title: string,
}





export function AdminDashboard() {
  const [fields, setFields] = useState<Field[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])

  const [activeItem, setActiveItem] = useState("dashboard")
  const [isLoading, setLoading] = useState(false);
  const router = useRouter();
  const params = useParams();
  const slug = params.slug;
  const [tenant, setTenant] = useState<TenantData | null>(null)
  console.log("Slug:", slug);




  
  useEffect(() => {
    


    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }
    




      if (!slug || typeof slug !== 'string' || slug.includes('.') || slug === 'favicon.ico') {
       setLoading(false); 
       return; 
    }
       const fetchData = async () => {
      try {
        setLoading(true);

        // 1. Fetch Bookings (Con Token)
        console.log("slug:", slug);
        const resBookings = await fetch(`http://localhost:8080/api/bookings/${slug}`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        
        // 2. Fetch Fields (Si requiere token o es público)
        const resFields = await fetch(`http://localhost:8080/api/tenants/${slug}/fields`, {
             // Si fields requiere auth, agrega el header aquí también
             headers: { "Authorization": `Bearer ${token}` } 
        });
         console.log(token)
        if (resBookings.ok) {
            const data = await resBookings.json();
            setBookings(data);
        }
        
        if (resFields.ok) {
            const data = await resFields.json();
            setFields(data);
        }

      } catch (error) {
        console.error("Error cargando datos:", error);
      } finally {
        setLoading(false);
      }
    };


    fetchData();

    console.log("Bookings en AdminDashboard:", bookings);
    console.log("Fields en AdminDashboard:", fields);
    

    const fetchTenant = async () => {
      try {

        const res = await fetch(`http://localhost:8080/api/tenants/${slug}`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        })

        if (!res.ok) {
          throw new Error("Failed to fetch tenant");
        }


        const data = await res.json();
        setTenant(data);
        setLoading(false);
      }catch (err) {
        console.error(err);
      }finally {
        setLoading(false);
      }




    }
    fetchTenant();

    console.log("Tenant data en AdminDashboard:", tenant);

  }, [slug])


  if (isLoading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin" /></div>

  return (
    <div className="min-h-screen bg-background">
        
      <AdminSidebar activeItem={activeItem} onItemChange={setActiveItem} tenantData={tenant}/>

      {/* Main Content */}
      <main className="md:ml-72 min-h-screen">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-card/80 backdrop-blur-xl border-b border-border px-5 md:px-8 py-5">
          <div className="flex items-center justify-between">
            <div className="pl-14 md:pl-0">
              <h1 className="text-2xl md:text-3xl font-black tracking-tight text-foreground">
                {activeItem === "dashboard" ? "Dashboard" : 
                 activeItem === "calendar" ? "Calendario" :
                 activeItem === "bookings" ? "Reservas" :
                 activeItem === "revenue" ? "Ingresos" : "Configuracion"}
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                Bienvenido de nuevo
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden md:flex relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar reservas..."
                  className="pl-11 w-72 h-11 rounded-xl bg-secondary/50 border-border/50 focus:border-primary"
                />
              </div>
              <Button variant="ghost" size="icon" className="relative h-11 w-11 rounded-xl bg-secondary/50">
                <Bell className="h-5 w-5" />
                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-primary rounded-full ring-2 ring-card" />
              </Button>
              <NewBookingDialog fields={fields} />
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-5 md:p-8 space-y-8">
          {/* KPI Cards */}
          <KPICards bookings={bookings}/>

          {/* Main Grid */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Calendar */}
            <div className="lg:col-span-2">
              <WeeklyCalendar bookings={bookings} />
            </div>

            {/* Recent Bookings */}
            <Card className="border-border/50 bg-card/50 backdrop-blur">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-bold">Reservas Recientes</CardTitle>
                  <Button variant="ghost" size="sm" className="text-primary text-xs font-semibold">
                    Ver todo
                    <ArrowUpRight className="w-3 h-3 ml-1" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-1">
                {bookings.slice(0, 5).map((booking, index) => (
                  <div
                    key={booking.id}
                    className={cn(
                      "flex items-center justify-between p-3 rounded-xl transition-colors hover:bg-secondary/50",
                      index !== bookings.length - 1 && ""
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                        <span className="text-sm font-bold text-foreground">
                          {booking.clientName.split(" ").map(n => n[0]).join("")}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-foreground">
                          {booking.clientName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {booking.startTime.replace("T", " | ").replace(":00:00", ":00")} - {booking.endTime.replace(":00:00", ":00").split("T")[1]}
                        </p>
                      </div>
                    </div>
                    {getStatusBadge(booking.status)}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Bookings Table */}
          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-bold">Todas las Reservas</CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="rounded-lg bg-transparent border-border/50 text-muted-foreground">
                    Filtrar
                  </Button>
                  <Button variant="outline" size="sm" className="rounded-lg bg-transparent border-border/50 text-muted-foreground">
                    Exportar
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50 hover:bg-transparent">
                    <TableHead className="text-muted-foreground font-semibold">Cliente</TableHead>
                    <TableHead className="text-muted-foreground font-semibold">Cancha</TableHead>
                    <TableHead className="text-muted-foreground font-semibold">Fecha</TableHead>
                    <TableHead className="text-muted-foreground font-semibold">Hora</TableHead>
                    <TableHead className="text-muted-foreground font-semibold">Monto</TableHead>
                    <TableHead className="text-muted-foreground font-semibold">Estado</TableHead>
                    <TableHead className="text-right text-muted-foreground font-semibold"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map((booking) => {
                    return (
                      <TableRow key={booking.id} className="border-border/50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                            <span className="text-xs font-bold">
                              {booking.clientName.split(" ").map(n => n[0]).join("")}
                            </span>
                          </div>
                          <span className="font-semibold">{booking.clientName}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{booking.field.name}</TableCell>
                      <TableCell className="text-muted-foreground">{booking.startTime.split("T")[0]}</TableCell>
                      <TableCell className="text-muted-foreground">{booking.startTime.split("T")[1].replace(":00:00", ":00")} - {booking.endTime.split("T")[1].replace(":00:00", ":00")}</TableCell>
                      <TableCell className="font-semibold">${booking.totalPrice.toFixed(0)}</TableCell>
                      <TableCell>{getStatusBadge(booking.status)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                    );

                  })}
              
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
