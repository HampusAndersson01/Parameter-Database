import React, { Dispatch, SetStateAction } from "react";

interface EditModeContextType {
  editMode: boolean;
  setEditMode: Dispatch<SetStateAction<boolean>>;
}

export const EditModeContext = React.createContext<EditModeContextType>({
  editMode: false,
  setEditMode: () => {},
});
