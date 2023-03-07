import React, { Dispatch, SetStateAction } from "react";

interface DebugContextType {
  debugMode: boolean;
  setDebugMode: Dispatch<SetStateAction<boolean>>;
}

export const DebugContext = React.createContext<DebugContextType>({
  debugMode: false,
  setDebugMode: () => {},
});
