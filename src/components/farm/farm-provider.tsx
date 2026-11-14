"use client";

import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { INITIAL_FARM, type FarmDraft } from "@/lib/farm";

const FarmContext = createContext<{
  farm: FarmDraft;
  setFarm: Dispatch<SetStateAction<FarmDraft>>;
} | null>(null);

export function FarmProvider({ children }: { children: React.ReactNode }) {
  const [farm, setFarm] = useState(INITIAL_FARM);
  return (
    <FarmContext.Provider value={{ farm, setFarm }}>
      {children}
    </FarmContext.Provider>
  );
}

export function useFarm() {
  const context = useContext(FarmContext);
  if (!context) throw new Error("useFarm must be used within FarmProvider");
  return context;
}
