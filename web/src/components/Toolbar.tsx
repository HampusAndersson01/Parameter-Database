/**
 * @file Toolbar.tsx
 * 
 * @module Components/Toolbar
 * 
 * @description
 * A component that allows the user to display a label and a text input field.
 * 
 * @example Default
 * <Toolbar />
 */
import React, { useState, useEffect, useRef, useContext } from "react";
import "./style/Toolbar.css";
import { AccountCircle, LightMode, DarkMode } from "@mui/icons-material";
import { DebugContext } from "../context/DebugContext";
import { EditModeContext } from "../context/EditModeContext";
import { CreatingParameterContext, ImportingParametersContext } from "../context/CreatingParameterContext";
import { Squeeze as Hamburger } from "hamburger-react";
import { Link } from "react-router-dom";


/**
 * @typedef {Object} ToolbarProps
 * @property {boolean} singleParameter - Whether the toolbar is displayed in the single parameter view
 * 
 * @returns {JSX.Element} - The resulting JSX element
 */
function Toolbar(props: {
  singleParameter: boolean;
}) {
  const [isOpen, setOpen] = useState(false);
  const [currentMenu, setCurrentMenu] = useState(props.singleParameter ? "mainParameter" : "main");
  const [isMobile, setIsMobile] = useState(false);
  const { creatingParameter, setCreatingParameter } = useContext(
    CreatingParameterContext
  );
  const { importingParameters, setImportingParameters } = useContext(
    ImportingParametersContext
  );
  const { editMode, setEditMode } = useContext(EditModeContext);
  const [editAccess, setEditAccess] = React.useState<boolean>(false);//TODO: implement edit mode based on user role
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
        {
          editAccess ? (<li className="toolbarButton" onClick={() => setCurrentMenu("addParameter")}>
            Add parameter(s)
          </li>) : null
        }
        {isMobile ? <li className="toolbarButton">My Account</li> : null}
      </ul>
    )
  }


  const AddParameter = () => {
    return (
      <ul>
        <li className="toolbarButton" onClick={() => setCreatingParameter(true)}>Create new</li>
        <li className="toolbarButton" onClick={() => setImportingParameters(true)}>
          Import from Excel
        </li>
        <li className="toolbarButton" onClick={() => setCurrentMenu("main")}>Back</li>
      </ul>
    )
  }

  const MainParameter = () => {
    return (
      <ul>

      </ul>
    )
  }




  return (
    <div className="toolbarContainer">
      <Link to="/" className="toolbarTitle">
        Parameter Database
      </Link>
      <nav className={isOpen ? "toolbar open" : "toolbar"} >
        <div className="toolbarButtons">
          {currentMenu === "main" ? <Main /> : null}
          {currentMenu === "mainParameter" ? <MainParameter /> : null}
          {currentMenu === "addParameter" ? <AddParameter /> : null}

        </div>
        {/* <div className="toolbarTheme" onClick={handleThemeChange}>
          {theme === "light" ? (<DarkMode></DarkMode>) : (<LightMode></LightMode>)}
        </div> */}
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

Toolbar.defaultProps = {
  singleParameter: false,
};

export default Toolbar;
