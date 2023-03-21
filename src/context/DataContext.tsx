import React, { Dispatch, SetStateAction } from "react";
import { rigFamilyModel } from "../models/RigFamily";
import { unitModel } from "../models/Unit";
import { datatypeModel } from "../models/Datatype";



interface DataContextType {
    rigFamilies: rigFamilyModel;
    setRigFamilies: Dispatch<SetStateAction<rigFamilyModel>>;
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
