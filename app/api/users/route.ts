import { NextRequest, NextResponse } from "next/server"
import { GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb"
import { docClient, TABLES } from "@/lib/dynamodb"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const requiredFields = [
      "userId",
      "name",
      "email",
      "city",
      "area",
      "preferredSports",
      "skillLevel",
      "availability",
    ]

    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }

    const user = {
      userId: body.userId,
      name: body.name,
      email: body.email,
      city: body.city,
      area: body.area,
      preferredSports: body.preferredSports,
      skillLevel: body.skillLevel,
      availability: body.availability,
      rating: body.rating ?? 4.8,
      matchesPlayed: body.matchesPlayed ?? 0,
      createdAt: body.createdAt ?? new Date().toISOString(),
    }

    await docClient.send(
      new PutCommand({
        TableName: TABLES.users,
        Item: user,
      })
    )

    return NextResponse.json({ user }, { status: 201 })
  } catch (error) {
    console.error("Create user error:", error)

    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json(
        { error: "Missing userId query parameter" },
        { status: 400 }
      )
    }

    const result = await docClient.send(
      new GetCommand({
        TableName: TABLES.users,
        Key: {
          userId,
        },
      })
    )

    if (!result.Item) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ user: result.Item })
  } catch (error) {
    console.error("Get user error:", error)

    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    )
  }
}