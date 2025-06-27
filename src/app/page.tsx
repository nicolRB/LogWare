"use client";

import {useRouter} from "next/navigation";
import {useEffect} from "react";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    router.push("/login");
  }, [router]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#1a1a1a",
        color: "#ffffff",
      }}
    >
      <p>Redirecionando para a página de login...</p>
    </div>
  );
}
