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

test("DingTalk turn completion exposes final delivery failure", async () => {
  const renderer = new AgentStreamHandler({
    async sendText() {},
    async sendMarkdown() { throw new Error("DingTalk final delivery failed"); },
  });

  renderer.onPromptSent(target);
  renderer.onSessionUpdate(target, {
    sessionId: "session",
    update: {
      sessionUpdate: "agent_message_chunk",
      content: { type: "text", text: "final response" },
      messageId: "message-final",
    },
  });

  await assert.rejects(
    renderer.onTurnEnd(target),
    /DingTalk final delivery failed/,
  );
});
