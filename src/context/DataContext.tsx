import React, { Dispatch, SetStateAction } from "react";
import { RigFamily } from "../models/Parameters";
import { unitModel } from "../models/Unit";
import { datatypeModel } from "../models/Datatype";

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
