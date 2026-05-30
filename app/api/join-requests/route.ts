import { NextRequest, NextResponse } from "next/server"
import { PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb"
import { docClient, TABLES } from "@/lib/dynamodb"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const requiredFields = [
      "requestId",
      "matchId",
      "requesterId",
      "requesterName",
      "organizerId",
      "message",
    ]

    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }

    const now = new Date().toISOString()

    const joinRequest = {
      requestId: body.requestId,
      matchId: body.matchId,
      requesterId: body.requesterId,
      requesterName: body.requesterName,
      organizerId: body.organizerId,
      message: body.message,
      status: "pending",
      createdAt: now,
      updatedAt: now,
    }

    await docClient.send(
      new PutCommand({
        TableName: TABLES.joinRequests,
        Item: joinRequest,
      })
    )

    return NextResponse.json({ joinRequest }, { status: 201 })
  } catch (error) {
    console.error("Create join request error:", error)

    return NextResponse.json(
      { error: "Failed to create join request" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const requesterId = searchParams.get("requesterId")
    const matchId = searchParams.get("matchId")

    if (!requesterId && !matchId) {
      return NextResponse.json(
        { error: "Pass requesterId or matchId" },
        { status: 400 }
      )
    }

    if (requesterId) {
      const result = await docClient.send(
        new QueryCommand({
          TableName: TABLES.joinRequests,
          IndexName: "requesterId-index",
          KeyConditionExpression: "requesterId = :requesterId",
          ExpressionAttributeValues: {
            ":requesterId": requesterId,
          },
        })
      )

      return NextResponse.json({ joinRequests: result.Items || [] })
    }

    const result = await docClient.send(
      new QueryCommand({
        TableName: TABLES.joinRequests,
        IndexName: "matchId-index",
        KeyConditionExpression: "matchId = :matchId",
        ExpressionAttributeValues: {
          ":matchId": matchId,
        },
      })
    )

    return NextResponse.json({ joinRequests: result.Items || [] })
  } catch (error) {
    console.error("Fetch join requests error:", error)

    return NextResponse.json(
      { error: "Failed to fetch join requests" },
      { status: 500 }
    )
  }
}