import React, { useState, useEffect, useRef, useContext } from "react";
import "./style/Toolbar.css";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { DebugContext } from "../context/DebugContext";

function Toolbar(props: any) {
  const [isToolbarExpanded, setIsToolbarExpanded] = useState<boolean>(false);
  const [isSecondToolbarExpanded, setIsSecondToolbarExpanded] =
    useState<boolean>(false);
  const [secondToolbarValue, setSecondToolbarValue] = useState<string>("");
  const ref = useRef<HTMLDivElement>(null);
  const { debugMode, setDebugMode } = useContext(DebugContext);

  const handleClickButton = () => {
    setIsToolbarExpanded(!isToolbarExpanded);
    setIsSecondToolbarExpanded(false);
  };
  const handleClickSecondButton = () => {
    setIsSecondToolbarExpanded(false);
    setSecondToolbarValue("");
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (ref.current && !ref.current.contains(event.target as Node)) {
      setIsToolbarExpanded(false);
      setIsSecondToolbarExpanded(false);
      setSecondToolbarValue("");
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSecondToolbarClick = (value: string) => {
    if (isSecondToolbarExpanded && secondToolbarValue === value) {
      setIsSecondToolbarExpanded(false);
      setSecondToolbarValue("");
      setSelectedToolbarButton("");
      return;
    } else if (isSecondToolbarExpanded && secondToolbarValue !== value) {
      setSecondToolbarValue(value);
      setSelectedToolbarButton("");
      return;
    } else if (isToolbarExpanded) {
      setIsSecondToolbarExpanded(true);
      setSecondToolbarValue(value);
      setSelectedToolbarButton("");
      return;
    }
  };
  const handleDebugMode = () => {
    setDebugMode(!debugMode);
  };
  const [selectedToolbarButton, setSelectedToolbarButton] =
    useState<string>("");

  const handleItemClick = (value: string) => {
    setSelectedToolbarButton(value);
  };

  return (
    <>
      <div ref={ref} className="toolbarContainer">
        <nav className={isToolbarExpanded ? "toolbar open" : "toolbar"}>
          <div
            className="toolbarLogo"
            onClick={() => handleSecondToolbarClick("user")}
          >
            {/* TODO: Replace with proper profile */}
          </div>
          {/* Nav buttons */}
          <div className="toolbarButtons">
            <ul>
              <li
                className="toolbarButton"
                onClick={() => handleSecondToolbarClick("addParameter")}
              >
                Add parameter(s)
              </li>
              <li className="toolbarButton">About</li>
            </ul>
          </div>
          <button
            className={
              isSecondToolbarExpanded
                ? "toggleButton primary secondaryOpen"
                : "toggleButton primary"
            }
            onClick={handleClickButton}
          >
            {isToolbarExpanded ? (
              <ExpandLessIcon></ExpandLessIcon>
            ) : (
              <ExpandMoreIcon></ExpandMoreIcon>
            )}
          </button>
        </nav>
        <nav
          className={
            isSecondToolbarExpanded
              ? "expandingToolbar open"
              : "expandingToolbar"
          }
        >
          <button
            className={
              isSecondToolbarExpanded
                ? "toggleButton second open"
                : "toggleButton second"
            }
            onClick={handleClickSecondButton}
          >
            <ExpandLessIcon></ExpandLessIcon>
          </button>
          <div
            className={
              secondToolbarValue === "user"
                ? "expandingToolbarItems active"
                : "expandingToolbarItems"
            }
          >
            <ul
              className={
                selectedToolbarButton === ""
                  ? "itemsPrimary open"
                  : "itemsPrimary"
              }
            >
              <li>Profile</li>
              <li onClick={() => handleItemClick("settings")}>Settings</li>
              <li>Logout</li>
            </ul>
            <ul
              className={
                selectedToolbarButton === "settings"
                  ? "itemsSecondary open"
                  : "itemsSecondary"
              }
            >
              <li onClick={handleDebugMode}>Toggle Debug mode</li>
              <li onClick={() => handleItemClick("")}>Back</li>
            </ul>
          </div>
          <div
            className={
              secondToolbarValue === "addParameter"
                ? "expandingToolbarItems active"
                : "expandingToolbarItems"
            }
          >
            <ul
              className={
                selectedToolbarButton === ""
                  ? "itemsPrimary open"
                  : "itemsPrimary"
              }
            >
              <li onClick={() => handleItemClick("create new parameter")}>
                Create new parameter
              </li>
              <li onClick={() => handleItemClick("importparameters")}>
                Import new parameter(s) from Excel
              </li>
            </ul>
            <ul
              className={
                selectedToolbarButton === "create new parameter"
                  ? "itemsSecondary open"
                  : "itemsSecondary"
              }
            >
              <li onClick={() => handleItemClick("")}>Back</li>
            </ul>
            <ul
              className={
                selectedToolbarButton === "importparameters"
                  ? "itemsSecondary open"
                  : "itemsSecondary"
              }
            >
              <li>Upload file</li>
              <li>Download template</li>
              <li onClick={() => handleItemClick("")}>Back</li>
            </ul>
          </div>
        </nav>
      </div>
    </>
  );
}

export default Toolbar;
