import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET(request, { params }) {
  try {
    const { db } = await connectToDatabase()
    const id = params.id

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid tie sheet ID" }, { status: 400 })
    }

    const tieSheet = await db.collection("tieSheets").findOne({ _id: new ObjectId(id) })

    if (!tieSheet) {
      return NextResponse.json({ error: "Tie sheet not found" }, { status: 404 })
    }

    return NextResponse.json(tieSheet)
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({ error: "Failed to fetch tie sheet" }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    const { db } = await connectToDatabase()
    const id = params.id

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid tie sheet ID" }, { status: 400 })
    }

    const data = await request.json()

    // Update timestamp
    const updateData = {
      ...data,
      updatedAt: new Date(),
    }

    // Remove _id from update data if it exists
    if (updateData._id) {
      delete updateData._id
    }

    const result = await db.collection("tieSheets").updateOne({ _id: new ObjectId(id) }, { $set: updateData })

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Tie sheet not found" }, { status: 404 })
    }

    const updatedTieSheet = await db.collection("tieSheets").findOne({ _id: new ObjectId(id) })

    return NextResponse.json(updatedTieSheet)
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({ error: "Failed to update tie sheet" }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const { db } = await connectToDatabase()
    const id = params.id

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid tie sheet ID" }, { status: 400 })
    }

    const result = await db.collection("tieSheets").deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Tie sheet not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({ error: "Failed to delete tie sheet" }, { status: 500 })
  }
}

