import assert from "node:assert/strict";
import test from "node:test";

import { AgentStreamHandler } from "../dist/agent-stream.js";

const target = {
  channelInstanceId: "dingtalk-primary",
  actorId: "dingtalk-bot",
  chatId: "conversation-1",
  topicId: undefined,
  replyTo: "message-1",
};

test("DingTalk renderer exposes markdown delivery failure", async () => {
  const failure = new Error("DingTalk markdown failed");
  const renderer = new AgentStreamHandler({
    async sendText() {},
    async sendMarkdown() { throw failure; },
  });

  await assert.rejects(
    renderer.sendBlock(target, "text", "answer"),
    failure,
  );
});
