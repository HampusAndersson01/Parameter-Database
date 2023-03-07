import React, { useState, useEffect, useRef } from "react";
import "./style/Toolbar.css";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

function Toolbar(props:any){
    const [isToolbarExpanded, setIsToolbarExpanded] = useState<boolean>(false);
    const [isSecondToolbarExpanded, setIsSecondToolbarExpanded] = useState<boolean>(false);
    const [secondToolbarValue, setSecondToolbarValue] = useState<string>("");
    const ref = useRef<HTMLDivElement>(null);

    const handleClickButton = () => {
        setIsToolbarExpanded(!isToolbarExpanded);
        setIsSecondToolbarExpanded(false);
    }
    const handleClickSecondButton = () => {
        setIsSecondToolbarExpanded(false);
    }

    const handleClickOutside = (event: MouseEvent) => {
        if (ref.current && !ref.current.contains(event.target as Node)) {
            setIsToolbarExpanded(false);
            setIsSecondToolbarExpanded(false);
        }
    }
    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleSecondToolbarClick = (value: string) => {
        setIsSecondToolbarExpanded(!isSecondToolbarExpanded);
        setSecondToolbarValue(value);
    }




    return (
        <>
        <div ref={ref} className="toolbarContainer">
        <nav  className={ isToolbarExpanded ? "toolbar open" : "toolbar"}>
        <div className="toolbarLogo" onClick={() => handleSecondToolbarClick("logo")}><AccountCircleIcon></AccountCircleIcon></div>
        {/* Nav buttons */}
        < div className="toolbarButtons">
            <ul>
                <li className="toolbarButton" onClick={() => handleSecondToolbarClick("addParameter")}>Add parameter(s)</li>
                <li className="toolbarButton">About</li>
            </ul>
        
        </div>
        <button className={isSecondToolbarExpanded ? "toggleButton primary secondaryOpen" : "toggleButton primary"} onClick={handleClickButton}>{isToolbarExpanded ? (<ExpandLessIcon></ExpandLessIcon>) : (<ExpandMoreIcon></ExpandMoreIcon>)}</button>
        </nav>
        <nav className={ isSecondToolbarExpanded ? "expandingToolbar open" : "expandingToolbar"}>
        <button className={isSecondToolbarExpanded ? "toggleButton second open" : "toggleButton second" } onClick={handleClickSecondButton}><ExpandLessIcon></ExpandLessIcon></button>
        <div className={secondToolbarValue === "user" ? "expandingToolbarItems active" : "expandingToolbarItems"}>
            <ul>
                <li>Profile</li>
                <li>Settings</li>
                <li>Logout</li>
            </ul>

        </div>
        <div className={secondToolbarValue === "addParameter" ? "expandingToolbarItems active" : "expandingToolbarItems"}>
            <ul>
                <li>Button 1</li>
                <li>Button 2</li>
                <li>Button 3</li>
            </ul>
        </div>


        </nav>
        </div>
        </>
)

}

export default Toolbar;