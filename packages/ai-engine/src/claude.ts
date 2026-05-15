import Anthropic from "@anthropic-ai/sdk";

export function createAnthropic(apiKey: string): Anthropic {
  return new Anthropic({ apiKey });
}

export type GenerateOptions = {
  client: Anthropic;
  model: string;
  systemBlocks: { text: string; cache?: boolean }[];
  userMessage: string;
  maxTokens?: number;
  temperature?: number;
};

export type GenerateResult<T> = {
  parsed: T;
  raw: string;
  usage: {
    inputTokens: number;
    outputTokens: number;
    cacheReadTokens?: number;
    cacheCreationTokens?: number;
  };
};

const JSON_BLOCK_RE = /```(?:json)?\s*([\s\S]*?)```/;

function extractJson(raw: string): string {
  const trimmed = raw.trim();
  const fenced = trimmed.match(JSON_BLOCK_RE);
  if (fenced && fenced[1]) return fenced[1].trim();
  const firstBrace = Math.min(
    ...["{", "["]
      .map((c) => trimmed.indexOf(c))
      .filter((i) => i >= 0),
  );
  if (Number.isFinite(firstBrace)) {
    return trimmed.slice(firstBrace);
  }
  return trimmed;
}

export async function generateJson<T>(opts: GenerateOptions): Promise<GenerateResult<T>> {
  const systemBlocks = opts.systemBlocks.map((block) =>
    block.cache
      ? {
          type: "text" as const,
          text: block.text,
          cache_control: { type: "ephemeral" as const },
        }
      : { type: "text" as const, text: block.text },
  );

  const response = await opts.client.messages.create({
    model: opts.model,
    max_tokens: opts.maxTokens ?? 4096,
    temperature: opts.temperature ?? 0.6,
    system: systemBlocks,
    messages: [{ role: "user", content: opts.userMessage }],
  });

  const textBlock = response.content.find((b) => b.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("Claude response had no text content");
  }
  const raw = textBlock.text;
  const jsonText = extractJson(raw);

  let parsed: T;
  try {
    parsed = JSON.parse(jsonText) as T;
  } catch (err) {
    throw new Error(
      `Failed to parse model output as JSON. First 400 chars:\n${raw.slice(0, 400)}\n\nError: ${(err as Error).message}`,
    );
  }

  const usage = response.usage as {
    input_tokens: number;
    output_tokens: number;
    cache_read_input_tokens?: number;
    cache_creation_input_tokens?: number;
  };

  return {
    parsed,
    raw,
    usage: {
      inputTokens: usage.input_tokens,
      outputTokens: usage.output_tokens,
      cacheReadTokens: usage.cache_read_input_tokens,
      cacheCreationTokens: usage.cache_creation_input_tokens,
    },
  };
}
