import React, { Dispatch, SetStateAction } from "react";
import { rigFamilyModel } from "../models/RigFamily";



interface RigFamiliesContextType {
    rigFamilies: rigFamilyModel;
    setRigFamilies: Dispatch<SetStateAction<rigFamilyModel>>;
}

export const RigFamiliesContext = React.createContext<RigFamiliesContextType>({
    rigFamilies: [],
    setRigFamilies: () => {},
});
