"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Plus, Edit, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function Dashboard() {
  const [tieSheets, setTieSheets] = useState([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchTieSheets()
  }, [])

  const fetchTieSheets = async () => {
    try {
      const response = await fetch("/api/tie-sheets")
      const data = await response.json()
      setTieSheets(data)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching tie sheets:", error)
      setLoading(false)
      toast({
        title: "Error",
        description: "Failed to load tie sheets",
        variant: "destructive",
      })
    }
  }

  const deleteTieSheet = async (id) => {
    try {
      await fetch(`/api/tie-sheets/${id}`, {
        method: "DELETE",
      })

      toast({
        title: "Success",
        description: "Tie sheet deleted successfully",
      })

      fetchTieSheets()
    } catch (error) {
      console.error("Error deleting tie sheet:", error)
      toast({
        title: "Error",
        description: "Failed to delete tie sheet",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Your Tie Sheets</h1>
        <Link href="/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Create New
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : tieSheets.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-medium mb-4">No tie sheets found</h2>
          <p className="text-muted-foreground mb-6">Create your first tie sheet to get started</p>
          <Link href="/create">
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Create New Tie Sheet
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tieSheets.map((tieSheet) => (
            <Card key={tieSheet._id}>
              <CardHeader>
                <CardTitle>{tieSheet.name}</CardTitle>
                <CardDescription>{new Date(tieSheet.createdAt).toLocaleDateString()}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{tieSheet.description || "No description provided"}</p>
                <div className="mt-2 text-sm">
                  <span className="font-medium">{tieSheet.teams?.length || 0}</span> teams
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Link href={`/tie-sheets/${tieSheet._id}`}>
                  <Button variant="outline">
                    <Edit className="mr-2 h-4 w-4" /> Edit
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  className="text-destructive hover:text-destructive"
                  onClick={() => deleteTieSheet(tieSheet._id)}
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

