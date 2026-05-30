import { NextRequest, NextResponse } from "next/server"
import { QueryCommand } from "@aws-sdk/lib-dynamodb"
import { docClient, TABLES } from "@/lib/dynamodb"

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
      new QueryCommand({
        TableName: TABLES.notifications,
        IndexName: "userId-index",
        KeyConditionExpression: "userId = :userId",
        ExpressionAttributeValues: {
          ":userId": userId,
        },
      })
    )

    const notifications = result.Items || []

    notifications.sort((a, b) => {
      return (
        new Date(b.createdAt || 0).getTime() -
        new Date(a.createdAt || 0).getTime()
      )
    })

    return NextResponse.json({ notifications })
  } catch (error) {
    console.error("Fetch notifications error:", error)

    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 }
    )
  }
}