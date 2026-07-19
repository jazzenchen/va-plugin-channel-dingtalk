import assert from "node:assert/strict";
import test from "node:test";

import axios from "axios";
import { DingTalkBot } from "../dist/bot.js";

const target = {
  channelInstanceId: "dingtalk-primary",
  actorId: "dingtalk-bot",
  chatId: "conversation-1",
  topicId: undefined,
  replyTo: "message-1",
};

function createBot() {
  return new DingTalkBot(
    { client_id: "client-id", client_secret: "client-secret" },
    {},
    () => {},
    "/tmp/vibearound-dingtalk-test",
    target.channelInstanceId,
    target.actorId,
  );
}

test("DingTalk adapter rejects a reply without a valid webhook", async () => {
  const bot = createBot();

  await assert.rejects(
    bot.sendText(target, "answer"),
    /DingTalk reply webhook is unavailable/,
  );
  await assert.rejects(
    bot.sendMarkdown(target, "VibeAround", "answer"),
    /DingTalk reply webhook is unavailable/,
  );
});

test("DingTalk adapter propagates webhook request failure", async () => {
  const bot = createBot();
  bot.webhooks.set(target.replyTo, {
    url: "https://example.invalid/webhook",
    expires: Date.now() + 60_000,
  });
  const originalPost = axios.post;
  const failure = new Error("DingTalk webhook failed");
  axios.post = async () => { throw failure; };

  try {
    await assert.rejects(
      bot.sendMarkdown(target, "VibeAround", "answer"),
      failure,
    );
  } finally {
    axios.post = originalPost;
  }
});
