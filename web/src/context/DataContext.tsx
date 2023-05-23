/**
 * @file DataContext.tsx
 * 
 * @module Contexts/DataContext
 * 
 * @description
 * This file contains the DataContext, which is used to store the data that is used in the application.
 * 
 * @example
 * <DataContext.Provider value={{ rigFamilies: rigFamilies, setRigFamilies: setRigFamilies, units: units, setUnits: setUnits, dataTypes: dataTypes, setDataTypes: setDataTypes }}>
 */
import React, { Dispatch, SetStateAction } from "react";
import { RigFamily } from "../models/Parameters";
import { unitModel } from "../models/Unit";
import { datatypeModel } from "../models/Datatype";

/**
 * @typedef DataContextType
 * @type {object}
 */
interface DataContextType {
  rigFamilies: RigFamily[];
  setRigFamilies: Dispatch<SetStateAction<RigFamily[]>>;
  units: unitModel;
  setUnits: Dispatch<SetStateAction<unitModel>>;
  dataTypes: datatypeModel;
  setDataTypes: Dispatch<SetStateAction<datatypeModel>>;
}

export const DataContext = React.createContext<DataContextType>({
  rigFamilies: [],
  setRigFamilies: () => {},
  units: [],
  setUnits: () => {},
  dataTypes: [],
  setDataTypes: () => {},
});
