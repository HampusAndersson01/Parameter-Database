/**
 * @file PendingReloadContext.tsx
 * 
 * @module Contexts/PendingReloadContext
 * 
 * @description
 * Provides the pending reload state.
 * 
 * @example
 * <PendingReloadContext.Provider value={{ pendingReload: pendingReload, setPendingReload: setPendingReload }}>
 */
import React, { Dispatch, SetStateAction } from "react";

interface PendingReloadContextType {
  pendingReload: boolean;
  setPendingReload: Dispatch<SetStateAction<boolean>>;
}

export const PendingReloadContext =
  React.createContext<PendingReloadContextType>({
    pendingReload: false,
    setPendingReload: () => {},
  });
