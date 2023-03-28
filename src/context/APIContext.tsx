import React, { Dispatch, SetStateAction } from "react";

interface APIContextType {
  hostname: string;
}

export const APIContext = React.createContext<APIContextType>({
  hostname: "http://localhost:3000/",
});
