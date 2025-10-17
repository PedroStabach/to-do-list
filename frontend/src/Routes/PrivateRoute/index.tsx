import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface PrivateRouteProps {
  children: ReactNode;
}

export function PrivateRoute({ children }: PrivateRouteProps) {
  // pega o token do localStorage (ou de outro método de autenticação)
  const token = localStorage.getItem("token");

  // se não tiver token, redireciona para login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // se tiver token, renderiza o conteúdo normalmente
  return <>{children}</>;
}
