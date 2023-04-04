import React, { Dispatch, SetStateAction } from "react";

interface ThemeContextType {
    mode: string;
    setTheme: Dispatch<SetStateAction<string>>;
}

export const ThemeContext = React.createContext<ThemeContextType>({
    mode: "light",
    setTheme: () => {},
});
