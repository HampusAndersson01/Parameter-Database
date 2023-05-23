/**
 * @file DebugContext.tsx
 * 
 * @module Contexts/DebugContext
 * 
 * @description
 * Provides the debug mode state.
 * 
 * @example
 * <DebugContext.Provider value={{ debugMode: debugMode, setDebugMode: setDebugMode }}>
 */
import React, { Dispatch, SetStateAction } from "react";

interface DebugContextType {
  debugMode: boolean;
  setDebugMode: Dispatch<SetStateAction<boolean>>;
}

export const DebugContext = React.createContext<DebugContextType>({
  debugMode: false,
  setDebugMode: () => {},
});
