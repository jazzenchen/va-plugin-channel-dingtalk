/**
 * DingTalk stream renderer — send-only (no message editing).
 * Each sealed block is sent as a markdown reply via webhook.
 */

import {
  BlockRenderer,
  type BlockKind,
  type ChannelTarget,
  type VerboseConfig,
} from "@vibearound/plugin-channel-sdk";
import type { DingTalkBot } from "./bot.js";

type LogFn = (level: string, msg: string) => void;

export class AgentStreamHandler extends BlockRenderer<string> {
  private dingBot: DingTalkBot;
  private log: LogFn;

  constructor(dingBot: DingTalkBot, log: LogFn, verbose?: Partial<VerboseConfig>) {
    super({
      streaming: false,
      flushIntervalMs: 800,
      verbose,
    });
    this.dingBot = dingBot;
    this.log = log;
  }

  protected async sendText(target: ChannelTarget, text: string): Promise<void> {
    await this.dingBot.sendText(target, text);
  }

  protected formatContent(kind: BlockKind, content: string, _sealed: boolean): string {
    switch (kind) {
      case "thinking": return `> 💭 ${content}`;
      case "tool":     return `\`${content.trim()}\``;
      case "text":     return content;
    }
  }

  protected async sendBlock(target: ChannelTarget, _kind: BlockKind, content: string): Promise<string | null> {
    try {
      await this.dingBot.sendMarkdown(target, "VibeAround", content);
    } catch (err) {
      this.log("warn", `sendBlock failed chat=${target.chatId}: ${String(err)}`);
    }
    return null;
  }
}
