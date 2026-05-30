import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb"

const region = process.env.AWS_REGION

if (!region) {
  throw new Error("Missing AWS_REGION environment variable")
}

const client = new DynamoDBClient({
  region,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
})

export const docClient = DynamoDBDocumentClient.from(client)

export const TABLES = {
  users: process.env.DYNAMODB_USERS_TABLE || "TeamUpUsers",
  matches: process.env.DYNAMODB_MATCHES_TABLE || "TeamUpMatches",
  joinRequests:
    process.env.DYNAMODB_JOIN_REQUESTS_TABLE || "TeamUpJoinRequests",
  notifications:
    process.env.DYNAMODB_NOTIFICATIONS_TABLE || "TeamUpNotifications",
}