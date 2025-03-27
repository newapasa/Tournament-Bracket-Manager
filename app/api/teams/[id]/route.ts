import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET(request, { params }) {
  try {
    const { db } = await connectToDatabase()
    const id = params.id

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid team ID" }, { status: 400 })
    }

    const team = await db.collection("teams").findOne({ _id: new ObjectId(id) })

    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 })
    }

    return NextResponse.json(team)
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({ error: "Failed to fetch team" }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    const { db } = await connectToDatabase()
    const id = params.id

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid team ID" }, { status: 400 })
    }

    const data = await request.json()

    // Validate required fields
    if (!data.name) {
      return NextResponse.json({ error: "Team name is required" }, { status: 400 })
    }

    // Update timestamp
    const updateData = {
      ...data,
      updatedAt: new Date(),
    }

    const result = await db.collection("teams").updateOne({ _id: new ObjectId(id) }, { $set: updateData })

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 })
    }

    const updatedTeam = await db.collection("teams").findOne({ _id: new ObjectId(id) })

    return NextResponse.json(updatedTeam)
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({ error: "Failed to update team" }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const { db } = await connectToDatabase()
    const id = params.id

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid team ID" }, { status: 400 })
    }

    const result = await db.collection("teams").deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({ error: "Failed to delete team" }, { status: 500 })
  }
}

