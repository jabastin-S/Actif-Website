import { MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

export function ChatbotIcon() {
  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1.5, type: "spring", stiffness: 200, damping: 20 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-charcoal text-ivory shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-shadow hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)] md:bottom-10 md:right-10"
      aria-label="Open chat"
    >
      <MessageSquare className="h-6 w-6 stroke-[1.5]" />
      
      {/* Subtle notification dot */}
      <span className="absolute right-3 top-3 flex h-3 w-3">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sage opacity-75"></span>
        <span className="relative inline-flex h-3 w-3 rounded-full bg-sage"></span>
      </span>
    </motion.button>
  );
}
