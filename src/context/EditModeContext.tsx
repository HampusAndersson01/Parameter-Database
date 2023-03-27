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
  setClearAll: () => {}
});
