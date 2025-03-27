"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { User } from "lucide-react"

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
  players?: Player[]
}

interface TeamDetailProps {
  team: Team
}

export function TeamDetail({ team }: TeamDetailProps) {
  if (!team) return null

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="font-medium w-10 h-10 flex items-center justify-center bg-primary/10 rounded-full text-lg">
            {team.seed || "-"}
          </div>
          <div>
            <h3 className="text-xl font-bold">{team.name}</h3>
            <p className="text-sm text-muted-foreground">{team.players?.length || 0} players on roster</p>
          </div>
        </div>

        {team.players && team.players.length > 0 ? (
          <div className="space-y-4">
            <h4 className="font-medium">Team Roster</h4>
            <div className="grid gap-3 sm:grid-cols-2">
              {team.players.map((player, index) => (
                <div key={player.id || index} className="flex items-center gap-3 p-3 bg-muted rounded-md">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="font-medium">{player.name}</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {player.position && <Badge variant="outline">{player.position}</Badge>}
                      {player.number && <Badge variant="secondary">#{player.number}</Badge>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-6 text-muted-foreground">No players added to this team</div>
        )}
      </CardContent>
    </Card>
  )
}

