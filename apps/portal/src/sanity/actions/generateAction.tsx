import { useState } from "react";
import {
  type DocumentActionComponent,
  type DocumentActionProps,
  type DocumentActionConfirmDialogProps,
} from "sanity";
import { useToast } from "@sanity/ui";

type IntakeDraft = {
  _id?: string;
  status?: string;
  businessName?: string;
  targetClient?: { _ref?: string } | null;
};

const SPARKLE = (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5z" />
    <path d="M19 14l.8 2.2L22 17l-2.2.8L19 20l-.8-2.2L16 17l2.2-.8z" />
  </svg>
);

export const GenerateAction: DocumentActionComponent = (
  props: DocumentActionProps,
) => {
  const toast = useToast();
  const [busy, setBusy] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const doc = (props.draft ?? props.published) as IntakeDraft | null;
  const intakeId = doc?._id?.replace(/^drafts\./, "") ?? props.id;
  const targetSet = Boolean(doc?.targetClient?._ref);

  const onClick = () => setConfirmOpen(true);

  const onConfirm = async () => {
    setConfirmOpen(false);
    setBusy(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ intakeId }),
      });

      type GenerateResponse = {
        ok?: boolean;
        error?: string;
        status?: string;
        targetClient?: { displayName?: string };
        primaryUrl?: string | null;
      };
      const text = await res.text();
      let json: GenerateResponse | null = null;
      try {
        json = JSON.parse(text) as GenerateResponse;
      } catch {
        const snippet = text.slice(0, 160).trim();
        throw new Error(`HTTP ${res.status} — server returned non-JSON: ${snippet || "(empty)"}`);
      }
      if (!res.ok || !json?.ok) {
        throw new Error(json?.error ?? `Generation failed (HTTP ${res.status})`);
      }

      const target = json.targetClient?.displayName ?? "the target client";
      toast.push({
        status: "info",
        title: "Generation started",
        description: `Claude is writing pages for ${target}. Refresh this doc in 2–3 min to see the result. Status will move to "Generated" or "Generation failed".`,
        duration: 12_000,
      });
    } catch (err) {
      toast.push({
        status: "error",
        title: "Could not start generation",
        description: (err as Error)?.message ?? "Unknown error",
        duration: 15_000,
      });
    } finally {
      setBusy(false);
    }
  };

  const dialog: DocumentActionConfirmDialogProps | null = confirmOpen
    ? {
        type: "confirm",
        tone: "primary",
        message: `Generate site content for "${doc?.businessName ?? "this intake"}"? This will overwrite any existing pages + siteSettings in the target Sanity project.`,
        onCancel: () => setConfirmOpen(false),
        onConfirm,
      }
    : null;

  let disabledReason: string | undefined;
  if (busy) disabledReason = "Kicking off…";
  else if (!targetSet) disabledReason = "Set the Target client reference first";

  return {
    label: busy ? "Starting…" : "Generate with AI",
    icon: () => SPARKLE,
    onHandle: onClick,
    disabled: Boolean(disabledReason),
    title: disabledReason,
    dialog,
  };
};
