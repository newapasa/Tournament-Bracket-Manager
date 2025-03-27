/**
 * Generates a tournament bracket structure based on the provided teams
 */
export function generateBracket(teams) {
  // Make sure we have teams
  if (!teams || teams.length === 0) {
    return null
  }

  // Sort teams by seed if available
  const sortedTeams = [...teams].sort((a, b) => (a.seed || 0) - (b.seed || 0))

  // Calculate the number of rounds needed
  const teamCount = sortedTeams.length
  const roundCount = Math.ceil(Math.log2(teamCount))
  const perfectBracketSize = Math.pow(2, roundCount)

  // Create rounds array
  const rounds = []

  // First round with initial matchups
  const firstRoundMatches = []

  // Create matches for the first round
  for (let i = 0; i < perfectBracketSize / 2; i++) {
    const team1Index = i
    const team2Index = perfectBracketSize - 1 - i

    firstRoundMatches.push({
      id: `r1-m${i + 1}`,
      teams: [
        team1Index < teamCount ? sortedTeams[team1Index] : null,
        team2Index < teamCount ? sortedTeams[team2Index] : null,
      ],
      winner: undefined,
    })
  }

  rounds.push({
    name: "Round 1",
    matches: firstRoundMatches,
  })

  // Create subsequent rounds
  for (let r = 1; r < roundCount; r++) {
    const matchCount = perfectBracketSize / Math.pow(2, r + 1)
    const matches = []

    for (let m = 0; m < matchCount; m++) {
      matches.push({
        id: `r${r + 1}-m${m + 1}`,
        teams: [null, null],
        winner: undefined,
      })
    }

    rounds.push({
      name: r === roundCount - 1 ? "Final" : `Round ${r + 1}`,
      matches,
    })
  }

  return {
    rounds,
  }
}

/**
 * Reseeds a bracket after changes to teams
 */
export function reseedBracket(bracket, teams) {
  if (!bracket || !teams || teams.length === 0) {
    return null
  }

  const sortedTeams = [...teams].sort((a, b) => (a.seed || 0) - (b.seed || 0))
  const updatedBracket = JSON.parse(JSON.stringify(bracket))

  // Update first round with new teams
  const firstRound = updatedBracket.rounds[0]
  const perfectBracketSize = firstRound.matches.length * 2

  for (let i = 0; i < firstRound.matches.length; i++) {
    const team1Index = i
    const team2Index = perfectBracketSize - 1 - i

    firstRound.matches[i].teams = [
      team1Index < sortedTeams.length ? sortedTeams[team1Index] : null,
      team2Index < sortedTeams.length ? sortedTeams[team2Index] : null,
    ]

    // Reset winner
    firstRound.matches[i].winner = undefined
  }

  // Reset subsequent rounds
  for (let r = 1; r < updatedBracket.rounds.length; r++) {
    for (let m = 0; m < updatedBracket.rounds[r].matches.length; m++) {
      updatedBracket.rounds[r].matches[m].teams = [null, null]
      updatedBracket.rounds[r].matches[m].winner = undefined
    }
  }

  return updatedBracket
}

