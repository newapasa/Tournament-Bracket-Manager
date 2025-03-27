"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, X } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Player {
  id: string
  name: string
  position?: string
  number?: string
}

interface Team {
  id: string
  name: string
  seed?: number
  _id?: string // For database teams
  players?: Player[]
}

interface TeamInputProps {
  teams: Team[]
  onChange: (teams: Team[]) => void
}

export function TeamInput({ teams = [], onChange }: TeamInputProps) {
  const [newTeamName, setNewTeamName] = useState("")
  const [existingTeams, setExistingTeams] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedTeamId, setSelectedTeamId] = useState("")
  const [activeTab, setActiveTab] = useState("existing")

  // Fetch existing teams from the database
  useEffect(() => {
    const fetchTeams = async () => {
      setLoading(true)
      try {
        const response = await fetch("/api/teams")
        const data = await response.json()
        setExistingTeams(data)
      } catch (error) {
        console.error("Error fetching teams:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTeams()
  }, [])

  // Add a new team manually
  const addTeam = () => {
    if (!newTeamName.trim()) return

    const newTeam: Team = {
      id: crypto.randomUUID(),
      name: newTeamName.trim(),
      seed: teams.length + 1,
      players: [],
    }

    onChange([...teams, newTeam])
    setNewTeamName("")
  }

  // Add an existing team from the database
  const addExistingTeam = () => {
    if (!selectedTeamId) return

    const teamToAdd = existingTeams.find((team) => team._id === selectedTeamId)

    if (teamToAdd && !teams.some((t) => t.id === teamToAdd._id)) {
      const newTeam: Team = {
        id: teamToAdd._id,
        name: teamToAdd.name,
        seed: teamToAdd.seed || teams.length + 1,
        _id: teamToAdd._id, // Store the original database ID
        players: teamToAdd.players || [],
      }

      onChange([...teams, newTeam])
      setSelectedTeamId("")
    }
  }

  const removeTeam = (id: string) => {
    const updatedTeams = teams.filter((team) => team.id !== id)
    onChange(updatedTeams)
  }

  // Filter out teams that are already selected
  const availableTeams = existingTeams.filter((existingTeam) => !teams.some((team) => team.id === existingTeam._id))

  return (
    <div className="space-y-4">
      <Tabs defaultValue="existing" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="existing">Use Existing Teams</TabsTrigger>
          <TabsTrigger value="new">Add New Team</TabsTrigger>
        </TabsList>

        <TabsContent value="existing" className="space-y-4">
          <div className="space-y-2">
            <div className="flex gap-2">
              <Select
                value={selectedTeamId}
                onValueChange={setSelectedTeamId}
                disabled={loading || availableTeams.length === 0}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue
                    placeholder={
                      loading
                        ? "Loading teams..."
                        : availableTeams.length === 0
                          ? "No more teams available"
                          : "Select a team"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {availableTeams.map((team) => (
                    <SelectItem key={team._id} value={team._id}>
                      {team.name} {team.seed ? `(Seed: ${team.seed})` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button type="button" onClick={addExistingTeam} disabled={!selectedTeamId || loading}>
                <Plus className="h-4 w-4 mr-2" /> Add
              </Button>
            </div>
            {existingTeams.length === 0 && !loading && (
              <p className="text-sm text-muted-foreground">
                No teams found. Create teams on the Team Management page first.
              </p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="new" className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter team name"
              value={newTeamName}
              onChange={(e) => setNewTeamName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTeam())}
            />
            <Button type="button" onClick={addTeam} size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Note: Teams created here won't be saved to your team database. Use the Team Management page to create
            permanent teams.
          </p>
        </TabsContent>
      </Tabs>

      {/* Display selected teams */}
      {teams.length > 0 ? (
        <div className="space-y-2 mt-6">
          <Label>Selected Teams</Label>
          <div className="max-h-[300px] overflow-y-auto space-y-2 pr-2">
            {teams.map((team) => (
              <div key={team.id} className="flex items-center justify-between p-2 bg-muted rounded-md">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium w-6 h-6 flex items-center justify-center bg-primary/10 rounded-full">
                    {team.seed}
                  </span>
                  <span>{team.name}</span>
                  {team._id && <span className="text-xs text-muted-foreground">(From database)</span>}
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => removeTeam(team.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-4 text-muted-foreground">No teams selected yet</div>
      )}
    </div>
  )
}

