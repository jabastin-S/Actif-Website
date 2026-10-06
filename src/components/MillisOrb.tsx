import { useState, useEffect, useRef, useCallback } from "react";
import { Mic, Loader2, Square, AlertCircle, Bot } from "lucide-react";
import Millis, { AgentState } from "@millisai/web-sdk";

export function MillisOrb() {
  const [sessionState, setSessionState] = useState<"idle" | "connecting" | "active" | "error">("idle");
  const [agentState, setAgentState] = useState<AgentState>(AgentState.IDLE);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showStatus, setShowStatus] = useState(false);
  const clientRef = useRef<any>(null);
  const publicKey = import.meta.env['VITE_MILLIS_PUBLIC_KEY'] || "dummy_public_key";
  const agentId = import.meta.env['VITE_MILLIS_AGENT_ID'] || "dummy_agent_id";

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
    setShowStatus(false);
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
      setShowStatus(true);

      try {
        if (!clientRef.current) {
          clientRef.current = Millis.createClient({
            publicKey: publicKey,
          });

          clientRef.current.on("onready", () => {
            setSessionState("active");
            setTimeout(() => setShowStatus(false), 3000); // hide status after a while
          });

          clientRef.current.on("onagentstate", (state: AgentState) => {
            setAgentState(state);
            // Show status briefly when state changes if we want, or keep hidden if active
          });

          clientRef.current.on("onerror", (err: any) => {
            console.error("Millis error:", err);
            setSessionState("error");
            setErrorMessage("Connection error");
            setShowStatus(true);
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
        setErrorMessage("Microphone/Connection failed");
        setShowStatus(true);
        setTimeout(() => {
          cleanup();
        }, 5000);
      }
    } else {
      // Disconnect
      await cleanup();
    }
  };

  // Determine appearance based on state
  let icon = <Bot className="h-6 w-6" />;
  let orbClass = "bg-primary text-primary-foreground hover:bg-primary/90";
  let statusText = "Talk to ACTIF AI";
  let pulseClass = "";

  if (sessionState === "connecting") {
    icon = <Loader2 className="h-6 w-6 animate-spin" />;
    statusText = "Connecting...";
  } else if (sessionState === "active") {
    icon = <Square className="h-5 w-5 fill-current" />; // Stop icon
    orbClass = "bg-destructive text-destructive-foreground hover:bg-destructive/90";
    
    if (agentState === AgentState.PREPARE_ANSWER) {
      statusText = "Processing...";
      pulseClass = "animate-pulse";
    } else if (agentState === AgentState.ANSWER) {
      statusText = "Speaking...";
      pulseClass = "animate-[bounce_1s_infinite]"; // subtle bounce or ripple could be here
    } else {
      statusText = "Listening...";
      pulseClass = "shadow-[0_0_15px_rgba(var(--primary),0.5)]"; // glowing effect
    }
  } else if (sessionState === "error") {
    icon = <AlertCircle className="h-6 w-6" />;
    orbClass = "bg-destructive text-destructive-foreground";
    statusText = errorMessage || "Error";
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
      {/* Optional Status Label - shown briefly or during connecting/error */}
      <div 
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          showStatus && sessionState !== "idle" 
            ? "max-w-xs opacity-100 translate-x-0" 
            : "max-w-0 opacity-0 translate-x-4 pointer-events-none"
        }`}
      >
        <div className="whitespace-nowrap rounded-full bg-background/80 backdrop-blur-md px-4 py-2 text-sm font-medium shadow-sm border border-border text-foreground">
          {statusText}
        </div>
      </div>

      <button
        onClick={toggleSession}
        aria-label={sessionState === "active" ? "End ACTIF AI conversation" : "Talk to ACTIF AI"}
        className={`relative flex h-13 w-13 md:h-16 md:w-16 items-center justify-center rounded-full shadow-lg transition-all duration-300 ease-in-out hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${orbClass} ${pulseClass}`}
      >
        {/* Ripple/Glow effect for listening/speaking */}
        {sessionState === "active" && agentState === AgentState.IDLE && (
          <span className="absolute inset-0 rounded-full bg-current opacity-20 animate-ping"></span>
        )}
        
        {icon}
      </button>
    </div>
  );
}
