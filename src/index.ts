/** 
* @file index.js (Main Driver)
 * @description Listens to designated community channels, uses agent 
 *              to triage bug reports, adds metadata to the message, and 
 *              pushes the ticket.
**/

import "dotenv/config";
import { Client, GatewayIntentBits, TextChannel, EmbedBuilder } from "discord.js";
import { analyzeCommunityMessage } from "./agent.js";
import { pushTicketToBacklog } from "./mergeSync.js";

// Initialize the Discord Client with explicit permission flags to monitor chat strings
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once("clientReady", () => {
  console.log(`Community Bug Tracker agent is active and running as ${client.user?.tag}`);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  
  //console.log(`Received message in: '${message.channelId}' | Expected target: '${process.env.TARGET_CHANNEL_ID}'`);

  if (message.channelId.trim() !== process.env.TARGET_CHANNEL_ID?.trim()) {
    console.log("Message skipped: Not in the targeted channel.");
    return;
  }

  console.log(`Analyzing incoming message from user: ${message.author.username}`);
  
  // pass the message over to our OpenAI triaging agent
  const analysis = await analyzeCommunityMessage(message.content);

  if (!analysis.isBug || !analysis.title || !analysis.description) {
    console.log("Message categorized as standard conversation. Ignoring.");
    return;
  }

  // build out a metadata block for locating newly created issue
  const enrichedBody = `${analysis.description}\n\n` +
    `--- \n` +
    `**Context & Source Metadata:**\n` +
    `* **Author:** ${message.author.tag}\n` +
    `* **Channel Name:** ${(message.channel as TextChannel).name}\n` +
    `* **Discord Message Link:** [Jump to Message](${message.url})`;

  // forward theformatted metrics over to Merge syncing module
  const ticketId = await pushTicketToBacklog({
    title: analysis.title,
    body: enrichedBody,
    priority: analysis.priority || "NORMAL",
  });

  // send confirmation back to the community channel if the issue is created successfully
  if (ticketId) {
    const successEmbed = new EmbedBuilder()
      .setColor(0x00ff88)
      .setTitle("🫙←🐞  Bug Captured and Recorded Successfully  📁→🗄️")
      .setDescription(`Hey ${message.author.displayName}, our AI handler converted your report into an official engineering backlog item!`)
      .addFields(
        { name: "Ticket Title Assigned", value: analysis.title },
        { name: "Estimated Urgency Level", value: analysis.priority || "NORMAL", inline: true }
      )
      .setFooter({ text: "Synced automatically via Merge Unified API Framework" });

    await message.reply({ embeds: [successEmbed] });
  } else {
    await message.reply("⚠️ I detected a valid bug report, but encountered an infrastructure error sending it to our backlog tracker.");
  }
});

client.login(process.env.DISCORD_TOKEN);