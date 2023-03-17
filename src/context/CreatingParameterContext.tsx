import React, { Dispatch, SetStateAction } from "react";

interface CreatingParameterContextType {
    creatingParameter: boolean;
    setCreatingParameter: Dispatch<SetStateAction<boolean>>;
}

export const CreatingParameterContext = React.createContext<CreatingParameterContextType>({
    creatingParameter: false,
    setCreatingParameter: () => {}
});