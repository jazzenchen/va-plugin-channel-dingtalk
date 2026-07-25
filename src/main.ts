#!/usr/bin/env node
/**
 * VibeAround DingTalk Plugin — ACP Client
 *
 * Spawned by the Rust host as a child process.
 * DingTalk uses Stream API (WebSocket) — no public IP required.
 */

import { createRequire } from "node:module";

import { runChannelPlugin } from "@vibearound/plugin-channel-sdk";

import { DingTalkBot } from "./bot.js";
import { AgentStreamHandler } from "./agent-stream.js";

const packageVersion = (
  createRequire(import.meta.url)("../package.json") as { version: string }
).version;

runChannelPlugin({
  name: "vibearound-dingtalk",
  version: packageVersion,
  requiredConfig: ["client_id", "client_secret"],
  createBot: ({ config, agent, log, cacheDir, channelInstanceId, actorId }) =>
    new DingTalkBot(
      {
        client_id: config.client_id as string,
        client_secret: config.client_secret as string,
      },
      agent,
      log,
      cacheDir,
      channelInstanceId,
      actorId,
    ),
  createRenderer: (bot, _log, verbose) =>
    new AgentStreamHandler(bot, verbose),
  healthCheck: async (bot) => bot.isConnected(),
});
