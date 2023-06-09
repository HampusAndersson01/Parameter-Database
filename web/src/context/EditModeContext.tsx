/**
 * @file EditModeContext.tsx
 * 
 * @module Contexts/EditModeContext
 * 
 * @description
 * Provides the edit mode state.
 * 
 * @example
 * <EditModeContext.Provider value={{ editMode: editMode, setEditMode: setEditMode, clearAll: clearAll, setClearAll: setClearAll }}>
 */
import React, { Dispatch, SetStateAction } from "react";

interface EditModeContextType {
  editMode: boolean;
  setEditMode: Dispatch<SetStateAction<boolean>>;
  clearAll: boolean;
  setClearAll: Dispatch<SetStateAction<boolean>>;
}

export const EditModeContext = React.createContext<EditModeContextType>({
  editMode: false,
  setEditMode: () => {},
  clearAll: false,
  setClearAll: () => {},
});
