"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Trophy } from "lucide-react"

export function Navbar() {
  const pathname = usePathname()

  return (
    <header className="w-full border-b bg-background">
      <div className="container flex h-16 items-center px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Trophy className="h-6 w-6" />
          <span className="text-lg font-bold">Bracket Manager</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link href="/dashboard">
            <Button variant={pathname === "/dashboard" ? "default" : "ghost"}>Dashboard</Button>
          </Link>
          <Link href="/teams">
            <Button variant={pathname === "/teams" ? "default" : "ghost"}>Teams</Button>
          </Link>
          <Link href="/create">
            <Button variant={pathname === "/create" ? "default" : "ghost"}>Create New</Button>
          </Link>
        </nav>
      </div>
    </header>
  )
}

