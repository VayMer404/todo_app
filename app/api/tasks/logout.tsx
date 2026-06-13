"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
    });
    console.log("URL:", req.url);
    console.log("HEADERS:", req.headers.get("cookie"));

    router.push("/login");
    router.refresh();
  };

  return <button onClick={handleLogout}>Выйти</button>;
}
