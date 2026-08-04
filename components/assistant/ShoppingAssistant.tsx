"use client";

import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import { Bot, Send, Sparkles, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type Message = {
  id: number;
  role: "assistant" | "user";
  content: string;
  error?: boolean;
  retryContent?: string;
};

const initialMessages: Message[] = [
  {
    id: 1,
    role: "assistant",
    content:
      "Hi! I'm your SmartBuy AI Shopping Assistant.\n\nI can help you:\n• Find products\n• Compare products\n• Recommend products based on your budget\n• Explain product features",
  },
];

export function ShoppingAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(false);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const conversationEndRef = useRef<HTMLDivElement>(null);
  const nextMessageId = useRef(2);

  useEffect(() => {
    if (!open) return;

    const frame = window.requestAnimationFrame(() => inputRef.current?.focus());
    return () => window.cancelAnimationFrame(frame);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    conversationEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, loading, open]);

  function closePanel() {
    setOpen(false);
    window.requestAnimationFrame(() => launcherRef.current?.focus());
  }

  function handlePanelKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      closePanel();
      return;
    }

    if (event.key !== "Tab" || !panelRef.current) return;

    const focusable = Array.from(
      panelRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), input:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
      ),
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  }

  async function sendMessage(content: string, appendUser = true) {
    if (!content || loading) return;

    const conversation = messages.filter((message) => !message.error);
    const historySource = !appendUser
      && conversation.at(-1)?.role === "user"
      && conversation.at(-1)?.content === content
        ? conversation.slice(0, -1)
        : conversation;
    const history = historySource
      .slice(-20)
      .map(({ role, content: messageContent }) => ({ role, content: messageContent }));

    if (appendUser) {
      setMessages((current) => [...current, { id: nextMessageId.current++, role: "user", content }]);
      setDraft("");
    }
    setLoading(true);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ history, message: content }),
      });
      const data: { response?: string; error?: string } = await response.json().catch(() => ({}));

      if (!response.ok || !data.response) {
        throw new Error(data.error || "The assistant is unavailable right now. Please try again.");
      }

      setMessages((current) => [
        ...current,
        { id: nextMessageId.current++, role: "assistant", content: data.response! },
      ]);
    } catch (error) {
      const errorMessage = error instanceof Error
        ? error.message
        : "The assistant is unavailable right now. Please try again.";
      setMessages((current) => [
        ...current,
        { id: nextMessageId.current++, role: "assistant", content: errorMessage, error: true, retryContent: content },
      ]);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await sendMessage(draft.trim());
  }

  async function retryMessage(message: Message) {
    if (!message.retryContent || loading) return;
    setMessages((current) => current.filter((item) => item.id !== message.id));
    await sendMessage(message.retryContent, false);
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 sm:bottom-6 sm:right-6">
      {open && (
        <div
          id="shopping-assistant-panel"
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="shopping-assistant-title"
          aria-describedby="shopping-assistant-description"
          onKeyDown={handlePanelKeyDown}
          className="flex h-[min(620px,calc(100dvh-2rem))] w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-xl motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-3 motion-safe:duration-200 sm:h-[600px] sm:w-[390px]"
        >
          <header className="flex items-center gap-3 border-b bg-primary px-4 py-3.5 text-primary-foreground">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-foreground/15">
              <Bot className="size-5" aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <h2 id="shopping-assistant-title" className="truncate text-base font-semibold tracking-normal text-current">
                SmartBuy AI Assistant
              </h2>
              <p id="shopping-assistant-description" className="text-xs text-primary-foreground/80">
                Electronics shopping support
              </p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={closePanel}
              className="text-primary-foreground hover:bg-primary-foreground/15 hover:text-primary-foreground"
              aria-label="Close AI shopping assistant"
            >
              <X className="size-5" />
            </Button>
          </header>

          <div
            className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain bg-muted/35 p-4"
            aria-live="polite"
            aria-label="Conversation"
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn("flex items-end gap-2", message.role === "user" && "justify-end")}
              >
                {message.role === "assistant" && (
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Sparkles className="size-3.5" aria-hidden="true" />
                  </span>
                )}
                <div
                  className={cn(
                    "max-w-[82%] whitespace-pre-line rounded-2xl px-3.5 py-3 text-sm leading-6 shadow-xs",
                    message.role === "user"
                      ? "rounded-br-md bg-primary text-primary-foreground"
                      : message.error
                        ? "rounded-bl-md border border-destructive/30 bg-destructive/5 text-foreground"
                        : "rounded-bl-md border bg-card text-card-foreground",
                  )}
                >
                  <p>{message.content}</p>
                  {message.error && message.retryContent && (
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="mt-3"
                      onClick={() => retryMessage(message)}
                      disabled={loading}
                    >
                      Try again
                    </Button>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-end gap-2" role="status" aria-label="Assistant is typing">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Sparkles className="size-3.5" aria-hidden="true" />
                </span>
                <div className="flex items-center gap-1 rounded-2xl rounded-bl-md border bg-card px-4 py-3 shadow-xs">
                  {[0, 1, 2].map((dot) => (
                    <span
                      key={dot}
                      className="size-1.5 animate-pulse rounded-full bg-muted-foreground motion-reduce:animate-none"
                      style={{ animationDelay: `${dot * 140}ms` }}
                    />
                  ))}
                  <span className="sr-only">Assistant is typing</span>
                </div>
              </div>
            )}
            <div ref={conversationEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="border-t bg-card p-3">
            <div className="flex items-center gap-2">
              <label htmlFor="shopping-assistant-input" className="sr-only">Message the AI shopping assistant</label>
              <Input
                ref={inputRef}
                id="shopping-assistant-input"
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder="Ask about electronics..."
                autoComplete="off"
                maxLength={2000}
                disabled={loading}
                className="bg-background"
              />
              <Button
                type="submit"
                size="icon"
                disabled={!draft.trim() || loading}
                aria-label="Send message"
              >
                <Send className="size-4" />
              </Button>
            </div>
            <p className="mt-2 px-1 text-center text-[11px] text-muted-foreground">
              AI responses may contain mistakes. Verify important details.
            </p>
          </form>
        </div>
      )}

      <Button
        ref={launcherRef}
        type="button"
        size="lg"
        onClick={() => setOpen(true)}
        className={cn(
          "ml-auto mt-3 h-14 rounded-full px-4 shadow-xl transition-transform hover:scale-[1.03] motion-reduce:transform-none sm:px-5",
          open && "sr-only",
        )}
        aria-label="Open SmartBuy AI shopping assistant"
        aria-expanded={open}
        aria-controls="shopping-assistant-panel"
      >
        <Sparkles className="size-5" />
        <span className="hidden sm:inline">Ask SmartBuy AI</span>
      </Button>
    </div>
  );
}
