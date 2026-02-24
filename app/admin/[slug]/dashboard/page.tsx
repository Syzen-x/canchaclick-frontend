import { AdminDashboard } from "../../admin-dashboard"; // Ajusta la ruta si es necesario

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function DashboardPage({ params }: Props) {
  // 1. Extraemos el slug (Next.js 15 requiere await params)
  const { slug } = await params;

  // 2. Solo renderizamos el Dashboard y le pasamos el slug.
  // NO hacemos fetch aquí porque no tenemos acceso al token del usuario.
  return (
      <AdminDashboard />
  );
}