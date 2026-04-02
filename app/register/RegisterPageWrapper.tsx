"use client";
import { useContext, useEffect } from "react";
import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function RegisterPageWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { token } = useContext(AuthContext)!;
  const router = useRouter();

  useEffect(() => {
    if (token) {
      router.push("/"); // redirect logged-in users away
    }
  }, [token, router]);

  return <>{children}</>;
}
