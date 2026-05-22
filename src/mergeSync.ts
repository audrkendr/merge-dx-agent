/**
 * @file mergeSync.ts
 * @description Syncs processed bug data directly into ticketing tools using the Merge Unified API.
 */

import { MergeClient } from "@mergeapi/merge-node-client";

const merge = new MergeClient({
  apiKey: process.env.MERGE_API_KEY || "",
  accountToken: process.env.MERGE_ACCOUNT_TOKEN || "",
});

interface CreateTicketParams {
  title: string;
  body: string;
  priority: "LOW" | "NORMAL" | "HIGH" | "URGENT";
}

export async function pushTicketToBacklog(params: CreateTicketParams): Promise<string | null> {
    // Grab our target repository collection ID from our environment variables
  const collectionId = process.env.TARGET_COLLECTION_ID;

  if (!collectionId) {
    console.error("Error: TARGET_COLLECTION_ID is missing from your .env file!");
    return null;
  }

  try {
    const response = await merge.ticketing.tickets.create({
      model: {
        name: params.title,
        description: params.body,
        status: "OPEN",
        ticketType: "BUG",
        priority: params.priority,
        collections: [collectionId]
      }
    });

    return response.model?.id || "Success";
  } catch (error) {
    console.error("Failed to push issue through Merge SDK:", error);
    return null;
  }
}