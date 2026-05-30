import { NextRequest, NextResponse } from "next/server"
import { PutCommand, ScanCommand } from "@aws-sdk/lib-dynamodb"
import { docClient, TABLES } from "@/lib/dynamodb"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const requiredFields = [
      "matchId",
      "organizerId",
      "organizerName",
      "sport",
      "city",
      "area",
      "venue",
      "matchDateTime",
      "timeSlot",
      "skillLevel",
      "playersNeeded",
      "description",
    ]

    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }

    const playersNeeded = Number(body.playersNeeded)
    const now = new Date().toISOString()

    const match = {
      matchId: body.matchId,
      organizerId: body.organizerId,
      organizerName: body.organizerName,
      sport: body.sport,
      city: body.city,
      area: body.area,
      venue: body.venue,
      matchDateTime: body.matchDateTime,
      timeSlot: body.timeSlot,
      skillLevel: body.skillLevel,
      playersNeeded,
      approvedPlayers: [],
      approvedPlayersCount: 0,
      spotsLeft: playersNeeded,
      status: "open",
      description: body.description,
      citySport: `${body.city}#${body.sport}`,
      createdAt: now,
      updatedAt: now,
    }

    await docClient.send(
      new PutCommand({
        TableName: TABLES.matches,
        Item: match,
      })
    )

    return NextResponse.json({ match }, { status: 201 })
  } catch (error) {
    console.error("Create match error:", error)

    return NextResponse.json(
      { error: "Failed to create match" },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const result = await docClient.send(
      new ScanCommand({
        TableName: TABLES.matches,
      })
    )

    const matches = result.Items || []

    matches.sort((a, b) => {
      return (
        new Date(b.createdAt || 0).getTime() -
        new Date(a.createdAt || 0).getTime()
      )
    })

    return NextResponse.json({ matches })
  } catch (error) {
    console.error("Fetch matches error:", error)

    return NextResponse.json(
      { error: "Failed to fetch matches" },
      { status: 500 }
    )
  }
}