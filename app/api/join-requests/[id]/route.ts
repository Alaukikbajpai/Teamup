import { NextRequest, NextResponse } from "next/server"
import {
  GetCommand,
  PutCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb"
import { docClient, TABLES } from "@/lib/dynamodb"

type RouteParams = {
  params: Promise<{
    id: string
  }>
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const body = await request.json()

    const decision = body.status
    const organizerId = body.organizerId

    if (!decision || !["approved", "rejected"].includes(decision)) {
      return NextResponse.json(
        { error: "status must be approved or rejected" },
        { status: 400 }
      )
    }

    if (!organizerId) {
      return NextResponse.json(
        { error: "Missing organizerId" },
        { status: 400 }
      )
    }

    const requestResult = await docClient.send(
      new GetCommand({
        TableName: TABLES.joinRequests,
        Key: {
          requestId: id,
        },
      })
    )

    const joinRequest = requestResult.Item

    if (!joinRequest) {
      return NextResponse.json(
        { error: "Join request not found" },
        { status: 404 }
      )
    }

    if (joinRequest.organizerId !== organizerId) {
      return NextResponse.json(
        { error: "You are not allowed to update this request" },
        { status: 403 }
      )
    }

    if (joinRequest.status !== "pending") {
      return NextResponse.json(
        { error: "This request is already completed" },
        { status: 400 }
      )
    }

    const now = new Date().toISOString()

    const updatedRequestResult = await docClient.send(
      new UpdateCommand({
        TableName: TABLES.joinRequests,
        Key: {
          requestId: id,
        },
        UpdateExpression: "SET #status = :status, updatedAt = :updatedAt",
        ExpressionAttributeNames: {
          "#status": "status",
        },
        ExpressionAttributeValues: {
          ":status": decision,
          ":updatedAt": now,
        },
        ReturnValues: "ALL_NEW",
      })
    )

    let updatedMatch = null

    const matchResult = await docClient.send(
      new GetCommand({
        TableName: TABLES.matches,
        Key: {
          matchId: joinRequest.matchId,
        },
      })
    )

    const match = matchResult.Item

    if (!match) {
      return NextResponse.json(
        { error: "Related match not found" },
        { status: 404 }
      )
    }

    if (decision === "approved") {
      const existingApprovedPlayers = match.approvedPlayers || []

      if (match.spotsLeft <= 0) {
        return NextResponse.json(
          { error: "No spots left in this match" },
          { status: 400 }
        )
      }

      const newSpotsLeft = Math.max(Number(match.spotsLeft) - 1, 0)
      const newStatus = newSpotsLeft === 0 ? "full" : "open"

      const updatedMatchResult = await docClient.send(
        new UpdateCommand({
          TableName: TABLES.matches,
          Key: {
            matchId: joinRequest.matchId,
          },
          UpdateExpression:
            "SET approvedPlayers = :approvedPlayers, approvedPlayersCount = :approvedPlayersCount, spotsLeft = :spotsLeft, #status = :status, updatedAt = :updatedAt",
          ExpressionAttributeNames: {
            "#status": "status",
          },
          ExpressionAttributeValues: {
            ":approvedPlayers": [
              ...existingApprovedPlayers,
              joinRequest.requesterId,
            ],
            ":approvedPlayersCount":
              Number(match.approvedPlayersCount || 0) + 1,
            ":spotsLeft": newSpotsLeft,
            ":status": newStatus,
            ":updatedAt": now,
          },
          ReturnValues: "ALL_NEW",
        })
      )

      updatedMatch = updatedMatchResult.Attributes
    }

    const notification = {
      notificationId: `notification_${Date.now()}`,
      userId: joinRequest.requesterId,
      type: decision === "approved" ? "request_approved" : "request_rejected",
      title:
        decision === "approved"
          ? "Your request was approved"
          : "Your request was rejected",
      message:
        decision === "approved"
          ? `Your request to join ${match.sport} at ${match.venue} was approved.`
          : `Your request to join ${match.sport} at ${match.venue} was rejected.`,
      read: false,
      createdAt: now,
    }

    await docClient.send(
      new PutCommand({
        TableName: TABLES.notifications,
        Item: notification,
      })
    )

    return NextResponse.json({
      joinRequest: updatedRequestResult.Attributes,
      match: updatedMatch,
      notification,
    })
  } catch (error) {
    console.error("Update join request error:", error)

    return NextResponse.json(
      { error: "Failed to update join request" },
      { status: 500 }
    )
  }
}