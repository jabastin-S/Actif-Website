import { createContext, useContext } from "react";
import type { ChapterId } from "@/content/chapters";

export type StageValue = {
  active: ChapterId;
  setActive: (id: ChapterId) => void;
};

export const StageContext = createContext<StageValue | null>(null);

export function useStage() {
  const value = useContext(StageContext);
  if (!value) throw new Error("useStage must be used inside <StageProvider>");
  return value;
}
