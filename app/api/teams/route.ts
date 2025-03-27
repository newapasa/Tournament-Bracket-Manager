import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET() {
  try {
    const { db } = await connectToDatabase()

    const teams = await db.collection("teams").find({}).sort({ seed: 1, name: 1 }).toArray()

    return NextResponse.json(teams)
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({ error: "Failed to fetch teams" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const { db } = await connectToDatabase()
    const data = await request.json()

    // Validate required fields
    if (!data.name) {
      return NextResponse.json({ error: "Team name is required" }, { status: 400 })
    }

    // Add timestamps
    const teamData = {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("teams").insertOne(teamData)

    // Get the inserted document
    const insertedTeam = await db.collection("teams").findOne({ _id: result.insertedId })

    return NextResponse.json(insertedTeam)
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({ error: "Failed to create team" }, { status: 500 })
  }
}

