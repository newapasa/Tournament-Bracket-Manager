"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { generateBracket } from "@/lib/bracket-utils"
import { Users } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

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

interface BracketViewProps {
  teams: Team[]
  bracket: any
  onUpdate: (bracket: any) => void
  onTeamSelect?: (team: Team) => void
}

export function BracketView({ teams, bracket, onUpdate, onTeamSelect }: BracketViewProps) {
  const [bracketData, setBracketData] = useState(null)

  useEffect(() => {
    if (teams && teams.length > 0) {
      // If we already have a bracket, use it, otherwise generate a new one
      if (bracket) {
        setBracketData(bracket)
      } else {
        const newBracket = generateBracket(teams)
        setBracketData(newBracket)
        onUpdate(newBracket)
      }
    }
  }, [teams, bracket, onUpdate])

  const handleWinnerSelection = (roundIndex, matchIndex, teamIndex) => {
    if (!bracketData) return

    const updatedBracket = JSON.parse(JSON.stringify(bracketData))

    // Mark the selected team as winner
    updatedBracket.rounds[roundIndex].matches[matchIndex].winner = teamIndex

    // If not the final round, propagate the winner to the next round
    if (roundIndex < updatedBracket.rounds.length - 1) {
      const nextRoundIndex = roundIndex + 1
      const nextMatchIndex = Math.floor(matchIndex / 2)
      const nextTeamIndex = matchIndex % 2

      // Get the winning team
      const winningTeam = updatedBracket.rounds[roundIndex].matches[matchIndex].teams[teamIndex]

      // Update the next round with the winner
      updatedBracket.rounds[nextRoundIndex].matches[nextMatchIndex].teams[nextTeamIndex] = winningTeam
    }

    setBracketData(updatedBracket)
    onUpdate(updatedBracket)
  }

  if (!bracketData) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Add teams to generate the bracket</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-8 p-4 min-w-max">
        {bracketData.rounds.map((round, roundIndex) => (
          <div key={roundIndex} className="flex flex-col gap-4">
            <div className="text-center font-medium">{round.name}</div>
            <div className="flex flex-col gap-8 justify-around h-full">
              {round.matches.map((match, matchIndex) => (
                <div
                  key={`${roundIndex}-${matchIndex}`}
                  className="flex flex-col gap-2"
                  style={{
                    marginTop: roundIndex > 0 ? `${Math.pow(2, roundIndex) * 2}rem` : 0,
                    marginBottom: roundIndex > 0 ? `${Math.pow(2, roundIndex) * 2}rem` : 0,
                  }}
                >
                  {match.teams.map((team, teamIndex) => (
                    <TooltipProvider key={teamIndex}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Card
                            className={`p-3 w-48 cursor-pointer transition-colors ${
                              match.winner === teamIndex
                                ? "bg-green-100 dark:bg-green-900"
                                : match.winner !== undefined && match.winner !== teamIndex
                                  ? "bg-red-100 dark:bg-red-900"
                                  : ""
                            }`}
                            onClick={() => handleWinnerSelection(roundIndex, matchIndex, teamIndex)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium w-6 h-6 flex items-center justify-center bg-primary/10 rounded-full">
                                  {team?.seed || "-"}
                                </span>
                                <span>{team?.name || "TBD"}</span>
                              </div>
                              {team?.players && team.players.length > 0 && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 ml-1"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    onTeamSelect && onTeamSelect(team)
                                  }}
                                >
                                  <Users className="h-3 w-3" />
                                </Button>
                              )}
                            </div>
                          </Card>
                        </TooltipTrigger>
                        <TooltipContent>
                          {team?.players && team.players.length > 0 ? (
                            <div className="space-y-1 max-w-xs">
                              <p className="font-medium">{team.name} Roster:</p>
                              <ul className="text-xs space-y-1">
                                {team.players.slice(0, 5).map((player, idx) => (
                                  <li key={idx}>
                                    {player.name}
                                    {player.number && <span> #{player.number}</span>}
                                    {player.position && <span> ({player.position})</span>}
                                  </li>
                                ))}
                                {team.players.length > 5 && <li>+{team.players.length - 5} more players</li>}
                              </ul>
                            </div>
                          ) : (
                            <p>Click to select winner</p>
                          )}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

