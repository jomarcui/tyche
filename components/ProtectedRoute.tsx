"use client";
import { useContext, useEffect } from "react";
import { AuthContext } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useContext(AuthContext)!;
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [user, router, pathname, loading]);

  if (loading) return <p>Loading session...</p>;
  return <>{user ? children : null}</>;
}
