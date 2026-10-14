import { useState, useEffect, useRef, useCallback } from "react";
import { AlertCircle } from "lucide-react";

/**
 * The voice SDK ships a ~2 MB WebAssembly resampler, so it is loaded on demand (first hover,
 * focus or press of the orb) instead of with the page. Agent states are the SDK's own string values.
 */
type MillisModule = typeof import("@millisai/web-sdk");
type AgentState = "idle" | "prepare_answer" | "answer" | "pause";
const AgentState = {
  IDLE: "idle",
  PREPARE_ANSWER: "prepare_answer",
  ANSWER: "answer",
  PAUSE: "pause",
} as const satisfies Record<string, AgentState>;
let sdkPromise: Promise<MillisModule> | null = null;
const loadSdk = () => (sdkPromise ??= import("@millisai/web-sdk"));
import { cn } from "@/lib/utils";

type SessionState = "idle" | "connecting" | "active" | "error";
type Phase = "idle" | "connecting" | "listening" | "thinking" | "speaking" | "error";

const LABEL: Record<Phase, string> = {
  idle: "Talk to ACTIF",
  connecting: "Connecting",
  listening: "Listening",
  thinking: "One moment",
  speaking: "Speaking",
  error: "Could not connect",
};

/**
 * Floating voice orb for the existing Millis agent. The session starts and ends in place:
 * no modal, no panel, no route change. Connection logic is unchanged from the original
 * integration; only the presentation and accessibility were reworked.
 */
export function MillisOrb() {
  const [sessionState, setSessionState] = useState<SessionState>("idle");
  const [agentState, setAgentState] = useState<AgentState>(AgentState.IDLE);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const clientRef = useRef<ReturnType<MillisModule["default"]["createClient"]> | null>(null);

  const publicKey = import.meta.env["VITE_MILLIS_PUBLIC_KEY"] || "dummy_public_key";
  const agentId = import.meta.env["VITE_MILLIS_AGENT_ID"] || "dummy_agent_id";

  const cleanup = useCallback(async () => {
    if (clientRef.current) {
      try {
        await clientRef.current.stop();
      } catch (e) {
        console.error("Error stopping Millis client:", e);
      }
      clientRef.current = null;
    }
    setSessionState("idle");
    setAgentState(AgentState.IDLE);
    setErrorMessage(null);
  }, []);

  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  const toggleSession = async () => {
    if (sessionState === "idle" || sessionState === "error") {
      setSessionState("connecting");
      setErrorMessage(null);

      try {
        if (!clientRef.current) {
          const { default: Millis } = await loadSdk();
          clientRef.current = Millis.createClient({
            publicKey: publicKey,
          });

          clientRef.current.on("onready", () => {
            setSessionState("active");
          });

          clientRef.current.on("onagentstate", (state: AgentState) => {
            setAgentState(state);
          });

          clientRef.current.on("onerror", (err: unknown) => {
            console.error("Millis error:", err);
            setSessionState("error");
            setErrorMessage("Connection failed");
            setTimeout(() => {
              cleanup();
            }, 5000);
          });

          clientRef.current.on("onclose", () => {
            cleanup();
          });
        }

        await clientRef.current.start({
          agent: {
            agent_id: agentId,
          },
        });
      } catch (error) {
        console.error("Failed to start Millis session:", error);
        setSessionState("error");
        setErrorMessage("Microphone or connection failed");
        setTimeout(() => {
          cleanup();
        }, 5000);
      }
    } else {
      // Clicking again ends the session
      await cleanup();
    }
  };

  const phase: Phase =
    sessionState === "idle"
      ? "idle"
      : sessionState === "connecting"
        ? "connecting"
        : sessionState === "error"
          ? "error"
          : agentState === AgentState.PREPARE_ANSWER
            ? "thinking"
            : agentState === AgentState.ANSWER
              ? "speaking"
              : "listening";

  const live = phase === "listening" || phase === "thinking" || phase === "speaking";
  const status = phase === "error" && errorMessage ? errorMessage : LABEL[phase];
  const showLabel = phase !== "idle";
  const ariaLabel = live
    ? "End the conversation with ACTIF"
    : phase === "connecting"
      ? "Connecting. Select to cancel"
      : "Talk to ACTIF by voice";

  return (
    <div
      className="pointer-events-none fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-50 flex flex-row-reverse items-center gap-3 md:right-8 md:bottom-8"
    >
      <button
        type="button"
        onClick={toggleSession}
        onPointerEnter={() => void loadSdk()}
        onFocus={() => void loadSdk()}
        aria-label={ariaLabel}
        aria-pressed={live}
        className={cn(
          "peer pointer-events-auto relative flex size-14 shrink-0 items-center justify-center rounded-full ring-1 transition-[background-color,box-shadow,transform] duration-500 ease-out hover:scale-105 focus-visible:outline-none focus-visible:shadow-[0_0_0_3px_var(--ivory),0_0_0_5px_var(--charcoal)] md:size-16",
          "shadow-[0_10px_28px_-8px_rgb(0_0_0/0.5)]",
          phase === "error"
            ? "bg-destructive text-on-dark ring-on-dark/50"
            : "bg-charcoal text-on-dark ring-on-dark/30",
          live && "ring-olive-soft",
          // two breaths once the hero entrance has landed, then still: an endless loop in the
          // corner pulls the eye while reading, and WCAG 2.2.2 caps unpausable motion at 5s
          phase === "idle" && "animate-[orb-breathe_2.4s_ease-in-out_1.8s_2]",
        )}
      >
        {/* state rings */}
        {phase === "speaking" && (
          <>
            <span aria-hidden className="absolute inset-0 rounded-full ring-1 ring-olive-soft animate-[orb-ring_2.4s_var(--ease-out)_infinite]" />
            <span aria-hidden className="absolute inset-0 rounded-full ring-1 ring-olive-soft/70 animate-[orb-ring_2.4s_var(--ease-out)_0.8s_infinite]" />
          </>
        )}
        {phase === "listening" && (
          <span aria-hidden className="absolute inset-0 rounded-full ring-1 ring-on-dark/50 animate-[orb-ring_3s_ease-out_infinite]" />
        )}
        {(phase === "connecting" || phase === "thinking") && (
          <svg
            aria-hidden
            viewBox="0 0 64 64"
            className="absolute -inset-1.25 size-[calc(100%+10px)] animate-[orb-spin_1.6s_linear_infinite]"
          >
            <circle cx="32" cy="32" r="30" fill="none" stroke="var(--olive-soft)" strokeWidth="1.5" strokeDasharray="22 166" strokeLinecap="round" />
          </svg>
        )}

        {phase === "error" ? (
          <AlertCircle aria-hidden className="size-6 stroke-[1.5]" />
        ) : (
          <span aria-hidden className="flex h-6 items-center gap-0.75">
            {[0.55, 1, 0.7, 0.9, 0.5].map((height, index) => (
              <span
                key={index}
                className="block w-0.75 origin-center rounded-full bg-current"
                style={{
                  height: `${height * 100}%`,
                  animation:
                    phase === "speaking"
                      ? `orb-wave ${0.7 + index * 0.11}s ease-in-out ${index * 0.07}s infinite`
                      : phase === "listening"
                        ? `orb-wave ${1.8 + index * 0.2}s ease-in-out ${index * 0.15}s infinite`
                        : undefined,
                  opacity: phase === "connecting" || phase === "thinking" ? 0.5 : 1,
                }}
              />
            ))}
          </span>
        )}

        {/* the crimson marker thread: identity dot */}
        <span
          aria-hidden
          className={cn(
            "absolute top-1 right-1 size-2 rounded-full ring-2 ring-charcoal",
            phase === "error" ? "bg-ivory" : "bg-olive-soft",
          )}
        />
      </button>

      <span
        aria-hidden
        className={cn(
          "pointer-events-none whitespace-nowrap bg-charcoal px-4 py-2 text-[0.8125rem] font-medium text-on-dark shadow-[0_6px_20px_-6px_rgb(0_0_0/0.45)] ring-1 ring-on-dark/20 transition-[opacity,transform] duration-500 ease-out",
          showLabel
            ? "translate-x-0 opacity-100"
            : "translate-x-2 opacity-0 peer-hover:translate-x-0 peer-hover:opacity-100 peer-focus-visible:translate-x-0 peer-focus-visible:opacity-100",
        )}
      >
        {status}
      </span>

      <span role="status" aria-live="polite" className="sr-only">
        {phase === "idle" ? "" : status}
      </span>
    </div>
  );
}
