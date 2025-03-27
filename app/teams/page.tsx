"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Pencil, Trash2, Save, X, Users, ChevronDown, ChevronUp } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { PlayerForm } from "@/components/player-form"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

export default function TeamsPage() {
  const { toast } = useToast()
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingTeam, setEditingTeam] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    seed: "",
    players: [],
  })
  const [openTeamDetails, setOpenTeamDetails] = useState(null)

  useEffect(() => {
    fetchTeams()
  }, [])

  const fetchTeams = async () => {
    try {
      const response = await fetch("/api/teams")
      const data = await response.json()
      setTeams(data)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching teams:", error)
      toast({
        title: "Error",
        description: "Failed to load teams",
        variant: "destructive",
      })
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePlayersChange = (players) => {
    setFormData((prev) => ({ ...prev, players }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.name) {
      toast({
        title: "Error",
        description: "Team name is required",
        variant: "destructive",
      })
      return
    }

    try {
      if (editingTeam) {
        // Update existing team
        await fetch(`/api/teams/${editingTeam._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            seed: formData.seed ? Number.parseInt(formData.seed) : undefined,
            players: formData.players,
          }),
        })

        toast({
          title: "Success",
          description: "Team updated successfully",
        })
      } else {
        // Create new team
        await fetch("/api/teams", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            seed: formData.seed ? Number.parseInt(formData.seed) : undefined,
            players: formData.players,
          }),
        })

        toast({
          title: "Success",
          description: "Team added successfully",
        })
      }

      // Reset form and refresh teams
      setFormData({ name: "", seed: "", players: [] })
      setEditingTeam(null)
      fetchTeams()
    } catch (error) {
      console.error("Error saving team:", error)
      toast({
        title: "Error",
        description: "Failed to save team",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (team) => {
    setEditingTeam(team)
    setFormData({
      name: team.name,
      seed: team.seed?.toString() || "",
      players: team.players || [],
    })
  }

  const handleDelete = async (id) => {
    try {
      await fetch(`/api/teams/${id}`, {
        method: "DELETE",
      })

      toast({
        title: "Success",
        description: "Team deleted successfully",
      })

      fetchTeams()
    } catch (error) {
      console.error("Error deleting team:", error)
      toast({
        title: "Error",
        description: "Failed to delete team",
        variant: "destructive",
      })
    }
  }

  const cancelEdit = () => {
    setEditingTeam(null)
    setFormData({ name: "", seed: "", players: [] })
  }

  const toggleTeamDetails = (teamId) => {
    setOpenTeamDetails(openTeamDetails === teamId ? null : teamId)
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-8">Team Management</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{editingTeam ? "Edit Team" : "Add New Team"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Team Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Enter team name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="seed">Seed (Optional)</Label>
                  <Input
                    id="seed"
                    name="seed"
                    type="number"
                    placeholder="Enter seed number"
                    value={formData.seed}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="text-lg font-medium mb-4">Team Players</h3>
                <PlayerForm players={formData.players} onChange={handlePlayersChange} />
              </div>

              <div className="flex gap-2">
                <Button type="submit">
                  {editingTeam ? (
                    <>
                      <Save className="mr-2 h-4 w-4" /> Update Team
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" /> Add Team
                    </>
                  )}
                </Button>
                {editingTeam && (
                  <Button type="button" variant="outline" onClick={cancelEdit}>
                    <X className="mr-2 h-4 w-4" /> Cancel
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Teams</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-4">Loading teams...</div>
            ) : teams.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">No teams added yet</div>
            ) : (
              <div className="space-y-4">
                {teams.map((team) => (
                  <Collapsible
                    key={team._id}
                    open={openTeamDetails === team._id}
                    onOpenChange={() => toggleTeamDetails(team._id)}
                    className="border rounded-md"
                  >
                    <div className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-4">
                        <div className="font-medium w-8 h-8 flex items-center justify-center bg-primary/10 rounded-full">
                          {team.seed || "-"}
                        </div>
                        <div>
                          <h3 className="font-medium">{team.name}</h3>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Users className="h-3 w-3 mr-1" />
                            {team.players?.length || 0} players
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleEdit(team)
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDelete(team._id)
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <CollapsibleTrigger asChild>
                          <Button variant="ghost" size="icon">
                            {openTeamDetails === team._id ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </Button>
                        </CollapsibleTrigger>
                      </div>
                    </div>
                    <CollapsibleContent>
                      <div className="px-4 pb-4 pt-1 border-t">
                        {team.players && team.players.length > 0 ? (
                          <div className="space-y-2">
                            <h4 className="text-sm font-medium">Team Roster</h4>
                            <div className="space-y-2">
                              {team.players.map((player, index) => (
                                <div
                                  key={player.id || index}
                                  className="flex items-center justify-between p-2 bg-muted rounded-md"
                                >
                                  <div>
                                    <span className="font-medium">{player.name}</span>
                                    {(player.position || player.number) && (
                                      <span className="text-sm text-muted-foreground ml-2">
                                        {[player.position && `${player.position}`, player.number && `#${player.number}`]
                                          .filter(Boolean)
                                          .join(" • ")}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="text-sm text-muted-foreground">No players added to this team</div>
                        )}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

