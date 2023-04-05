import React, { useState, useEffect, useRef, useContext } from "react";
import "./style/Toolbar.css";
import { AccountCircle, LightMode, DarkMode } from "@mui/icons-material";
import { DebugContext } from "../context/DebugContext";
import { EditModeContext } from "../context/EditModeContext";
import { CreatingParameterContext } from "../context/CreatingParameterContext";
import { Squeeze as Hamburger } from "hamburger-react";

function Toolbar() {
  const [isOpen, setOpen] = useState(false);
  const [currentMenu, setCurrentMenu] = useState("main");
  const [isMobile, setIsMobile] = useState(false);
  const { creatingParameter, setCreatingParameter } = useContext(
    CreatingParameterContext
  );
  const { editMode, setEditMode } = useContext(EditModeContext);
  const { debugMode, setDebugMode } = useContext(DebugContext);
  const [theme, setTheme] = useState("light");

  const handleResize = () => {
    if (window.innerWidth < 768) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  };

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isMobile) {
      setOpen(false);
    }
  }, [isMobile]);

  const handleThemeChange = () => {
    if (theme === "light") {
      setTheme("dark");
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      setTheme("light");
      document.documentElement.setAttribute("data-theme", "light");
    }
  };



  const Main = () => {
    return (
      <ul>
        <li className="toolbarButton" onClick={() => setCurrentMenu("addParameter")}>
          Add parameter(s)
        </li>
        <li className="toolbarButton" onClick={() => setEditMode(!editMode)}>Edit mode </li>
        {isMobile ? <li className="toolbarButton">My Account</li> : null}
        {/* TODO: Only show debug if account is developer */}
        <li className="toolbarButton" onClick={() => setDebugMode(!debugMode)}>Debug mode</li>
      </ul>
    )
  }

  const AddParameter = () => {
    return (
      <ul>
        <li className="toolbarButton" onClick={() => setCreatingParameter(true)}>Create new</li>
        <li className="toolbarButton">
          Import from Excel
        </li>
        <li className="toolbarButton" onClick={() => setCurrentMenu("main")}>Back</li>
      </ul>
    )
  }



  return (
    <div className="toolbarContainer">
      <div className="toolbarTitle">
        Parameter Database
      </div>
      <nav className={isOpen ? "toolbar open" : "toolbar"} >
        <div className="toolbarButtons">
          {currentMenu === "main" ? <Main /> : null}
          {currentMenu === "addParameter" ? <AddParameter /> : null}

        </div>
        <div className="toolbarTheme" onClick={handleThemeChange}>
          {theme === "light" ? (<DarkMode></DarkMode>) : (<LightMode></LightMode>)}
        </div>
        <div className="toolbarAccount">
          <AccountCircle></AccountCircle>
        </div>
        
      </nav>
      <div className="toolbarMenu">
        <Hamburger
          toggled={isOpen}
          toggle={setOpen}
          color="var(--backgroundPrimary)"
        ></Hamburger>
      </div>
    </div>
  );
};

export default Toolbar;
