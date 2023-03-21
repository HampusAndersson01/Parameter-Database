import React, { Dispatch, SetStateAction } from "react";

interface PendingReloadContextType {
  pendingReload: boolean;
  setPendingReload: Dispatch<SetStateAction<boolean>>;
}

export const PendingReloadContext = React.createContext<PendingReloadContextType>({
  pendingReload: false,
  setPendingReload: () => {},
});
