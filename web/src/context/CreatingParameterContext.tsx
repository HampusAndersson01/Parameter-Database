/**
 * @file CreatingParameterContext.tsx
 * 
 * @description
 * CreatingParameterContext.tsx is a React Context API component file that provides the CreatingParameterContext and ImportingParametersContext contexts.
 */
import React, { Dispatch, SetStateAction } from "react";

interface CreatingParameterContextType {
  creatingParameter: boolean;
  setCreatingParameter: Dispatch<SetStateAction<boolean>>;
}

export const CreatingParameterContext =
  React.createContext<CreatingParameterContextType>({
    creatingParameter: false,
    setCreatingParameter: () => {},
  });

interface ImportingParametersContextType {
  importingParameters: boolean;
  setImportingParameters: Dispatch<SetStateAction<boolean>>;
}

export const ImportingParametersContext =
  React.createContext<ImportingParametersContextType>({
    importingParameters: false,
    setImportingParameters: () => { },
  });

