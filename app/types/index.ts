export interface Booking {
  id: number;
  clientName: string;
  clientPhone: string;
  startTime: string; // ISO String: "2026-01-27T18:00:00"
  endTime: string;   // ISO String: "2026-01-27T19:00:00"
  status: string;    // "PENDING", "CONFIRMED", "CANCELLED"
  totalPrice: number;
  field: {
    name: string;
  };
}


export interface Field {
    id: number;
    name: string;
    type: string;
    hourlyPrice: number;
    description: string;
    tenant: string;
}