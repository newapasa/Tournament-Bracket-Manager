import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET() {
  try {
    const { db } = await connectToDatabase()

    const tieSheets = await db.collection("tieSheets").find({}).sort({ createdAt: -1 }).toArray()

    return NextResponse.json(tieSheets)
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({ error: "Failed to fetch tie sheets" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const { db } = await connectToDatabase()
    const data = await request.json()

    // Add timestamps
    const tieSheetData = {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("tieSheets").insertOne(tieSheetData)

    // Get the inserted document
    const insertedTieSheet = await db.collection("tieSheets").findOne({ _id: result.insertedId })

    return NextResponse.json(insertedTieSheet)
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({ error: "Failed to create tie sheet" }, { status: 500 })
  }
}

