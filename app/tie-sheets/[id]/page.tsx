"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft, Save, Users } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { BracketView } from "@/components/bracket-view"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { TeamDetail } from "@/components/team-details"

export default function TieSheetDetail() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const id = params.id

  const [tieSheet, setTieSheet] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [selectedTeam, setSelectedTeam] = useState(null)

  useEffect(() => {
    if (id) {
      fetchTieSheet()
    }
  }, [id])

  const fetchTieSheet = async () => {
    try {
      const response = await fetch(`/api/tie-sheets/${id}`)

      if (!response.ok) {
        throw new Error("Failed to fetch tie sheet")
      }

      const data = await response.json()
      setTieSheet(data)
    } catch (error) {
      console.error("Error fetching tie sheet:", error)
      toast({
        title: "Error",
        description: "Failed to load tie sheet",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleBracketUpdate = (updatedBracket) => {
    setTieSheet((prev) => ({
      ...prev,
      bracket: updatedBracket,
    }))
  }

  const saveTieSheet = async () => {
    setSaving(true)

    try {
      const response = await fetch(`/api/tie-sheets/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(tieSheet),
      })

      if (!response.ok) {
        throw new Error("Failed to update tie sheet")
      }

      toast({
        title: "Success",
        description: "Tie sheet saved successfully",
      })
    } catch (error) {
      console.error("Error saving tie sheet:", error)
      toast({
        title: "Error",
        description: "Failed to save tie sheet",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleTeamSelect = (team) => {
    setSelectedTeam(team)
  }

  if (loading) {
    return (
      <div className="container py-10">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Skeleton className="h-8 w-64" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[400px] w-full" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!tieSheet) {
    return (
      <div className="container py-10">
        <div className="text-center py-12">
          <h2 className="text-xl font-medium mb-4">Tie sheet not found</h2>
          <p className="text-muted-foreground mb-6">The requested tie sheet could not be found</p>
          <Button onClick={() => router.push("/dashboard")}>Return to Dashboard</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.push("/dashboard")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold">{tieSheet.name}</h1>
        </div>
        <Button onClick={saveTieSheet} disabled={saving}>
          <Save className="mr-2 h-4 w-4" />
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Tournament Bracket</CardTitle>
        </CardHeader>
        <CardContent>
          <BracketView
            teams={tieSheet.teams}
            bracket={tieSheet.bracket}
            onUpdate={handleBracketUpdate}
            onTeamSelect={handleTeamSelect}
          />
        </CardContent>
      </Card>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="mb-8">
            <Users className="mr-2 h-4 w-4" />
            View Team Rosters
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Team Rosters</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 max-h-[60vh] overflow-y-auto pr-2">
            {tieSheet.teams.map((team) => (
              <TeamDetail key={team.id} team={team} />
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

