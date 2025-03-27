"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, X, User } from "lucide-react"

interface Player {
  id: string
  name: string
  position?: string
  number?: string
}

interface PlayerFormProps {
  players: Player[]
  onChange: (players: Player[]) => void
}

export function PlayerForm({ players = [], onChange }: PlayerFormProps) {
  const [newPlayer, setNewPlayer] = useState<Partial<Player>>({
    name: "",
    position: "",
    number: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewPlayer((prev) => ({ ...prev, [name]: value }))
  }

  const addPlayer = () => {
    if (!newPlayer.name?.trim()) return

    const player: Player = {
      id: crypto.randomUUID(),
      name: newPlayer.name.trim(),
      position: newPlayer.position?.trim() || undefined,
      number: newPlayer.number?.trim() || undefined,
    }

    onChange([...players, player])

    // Reset form
    setNewPlayer({
      name: "",
      position: "",
      number: "",
    })
  }

  const removePlayer = (id: string) => {
    onChange(players.filter((player) => player.id !== id))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addPlayer()
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <Label htmlFor="name">Player Name</Label>
          <Input
            id="name"
            name="name"
            placeholder="Enter name"
            value={newPlayer.name || ""}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
          />
        </div>
        <div>
          <Label htmlFor="position">Position (optional)</Label>
          <Input
            id="position"
            name="position"
            placeholder="E.g., Forward"
            value={newPlayer.position || ""}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
          />
        </div>
        <div>
          <Label htmlFor="number">Number (optional)</Label>
          <Input
            id="number"
            name="number"
            placeholder="E.g., 23"
            value={newPlayer.number || ""}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
          />
        </div>
      </div>

      <Button type="button" onClick={addPlayer} disabled={!newPlayer.name?.trim()}>
        <Plus className="mr-2 h-4 w-4" /> Add Player
      </Button>

      {players.length > 0 ? (
        <div className="space-y-2 mt-4">
          <Label>Team Roster ({players.length} players)</Label>
          <div className="max-h-[300px] overflow-y-auto space-y-2 pr-2">
            {players.map((player) => (
              <div key={player.id} className="flex items-center justify-between p-3 bg-muted rounded-md">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{player.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {[player.position && `Position: ${player.position}`, player.number && `#${player.number}`]
                        .filter(Boolean)
                        .join(" • ")}
                    </p>
                  </div>
                </div>
                <Button type="button" variant="ghost" size="icon" onClick={() => removePlayer(player.id)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-4 text-muted-foreground">No players added yet</div>
      )}
    </div>
  )
}

