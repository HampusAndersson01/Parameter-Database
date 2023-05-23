/**
 * @file APIContext.tsx
 * 
 * @module Contexts/APIContext
 * 
 * @description
 * Provides the hostname of the API.
 * 
 * @example
 * <APIContext.Provider value={{ hostname: "http://localhost:3000/" }}>
 */
import React, { Dispatch, SetStateAction } from "react";

interface APIContextType {
  hostname: string;
}

export const APIContext = React.createContext<APIContextType>({
  hostname: "http://localhost:3000/",
});
