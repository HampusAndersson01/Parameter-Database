import React, { useState, useEffect, useRef, useContext } from "react";
import "./style/Toolbar.css";
import { ExpandMore, ExpandLess, AccountCircle } from '@mui/icons-material';
import { DebugContext } from "../context/DebugContext";
import { EditModeContext } from "../context/EditModeContext";
import { CreatingParameterContext } from "../context/CreatingParameterContext";
import { Squeeze as Hamburger } from 'hamburger-react'

function Toolbar() {
  // const [isToolbarExpanded, setIsToolbarExpanded] = useState<boolean>(false);
  // const [isSecondToolbarExpanded, setIsSecondToolbarExpanded] =
  //   useState<boolean>(false);
  // const [secondToolbarValue, setSecondToolbarValue] = useState<string>("");
  // const ref = useRef<HTMLDivElement>(null);
  // const { debugMode, setDebugMode } = useContext(DebugContext);
  // const { editMode, setEditMode } = useContext(EditModeContext);
  // const { creatingParameter, setCreatingParameter } = useContext(
  //   CreatingParameterContext
  // );

  // const handleClickButton = () => {
  //   setIsToolbarExpanded(!isToolbarExpanded);
  //   setIsSecondToolbarExpanded(false);
  // };
  // const handleClickSecondButton = () => {
  //   setIsSecondToolbarExpanded(false);
  //   setSecondToolbarValue("");
  // };

  // const handleClickOutside = (event: MouseEvent) => {
  //   if (ref.current && !ref.current.contains(event.target as Node)) {
  //     setIsToolbarExpanded(false);
  //     setIsSecondToolbarExpanded(false);
  //     setSecondToolbarValue("");
  //   }
  // };
  // useEffect(() => {
  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, []);

  // const handleSecondToolbarClick = (value: string) => {
  //   if (isSecondToolbarExpanded && secondToolbarValue === value) {
  //     setIsSecondToolbarExpanded(false);
  //     setSecondToolbarValue("");
  //     setSelectedToolbarButton("");
  //     return;
  //   } else if (isSecondToolbarExpanded && secondToolbarValue !== value) {
  //     setSecondToolbarValue(value);
  //     setSelectedToolbarButton("");
  //     return;
  //   } else if (isToolbarExpanded) {
  //     setIsSecondToolbarExpanded(true);
  //     setSecondToolbarValue(value);
  //     setSelectedToolbarButton("");
  //     return;
  //   }
  // };
  // const handleDebugMode = () => {
  //   setDebugMode(!debugMode);
  // };
  // const handleEditMode = () => {
  //   setEditMode(!editMode);
  // };
  // const [selectedToolbarButton, setSelectedToolbarButton] =
  //   useState<string>("");

  // const handleItemClick = (value: string) => {
  //   if (value === "create new parameter") {
  //     setCreatingParameter(true);
  //   } else {
  //     setSelectedToolbarButton(value);
  //     return;
  //   }
  // };

  // return (
  //   <>
  //     <div ref={ref} className="toolbarContainer">
  //       <nav className={isToolbarExpanded ? "toolbar open" : "toolbar"}>
  //         <div
  //           className="toolbarLogo"
  //           onClick={() => handleSecondToolbarClick("user")}
  //         >
  //           {/* TODO: Replace with proper profile */}
  //         </div>
  //         {/* Nav buttons */}
  //         <div className="toolbarButtons">
  //           <ul>
  //             <li
  //               className="toolbarButton"
  //               onClick={() => handleSecondToolbarClick("addParameter")}
  //             >
  //               Add parameter(s)
  //             </li>
  //             <li
  //               className={
  //                 editMode ? "toolbarButton editActive" : "toolbarButton"
  //               }
  //               onClick={handleEditMode}
  //             >
  //               Edit mode
  //             </li>
  //           </ul>
  //         </div>
  //         <button
  //           className={
  //             isSecondToolbarExpanded
  //               ? "toggleButton primary secondaryOpen"
  //               : "toggleButton primary"
  //           }
  //           onClick={handleClickButton}
  //         >
  //           {isToolbarExpanded ? (
  //             <ExpandLessIcon></ExpandLessIcon>
  //           ) : (
  //             <ExpandMoreIcon></ExpandMoreIcon>
  //           )}
  //         </button>
  //       </nav>
  //       <nav
  //         className={
  //           isSecondToolbarExpanded
  //             ? "expandingToolbar open"
  //             : "expandingToolbar"
  //         }
  //       >
          
  //         <div
  //           className={
  //             secondToolbarValue === "user"
  //               ? "expandingToolbarItems active"
  //               : "expandingToolbarItems"
  //           }
  //         >
  //           <ul
  //             className={
  //               selectedToolbarButton === ""
  //                 ? "itemsPrimary open"
  //                 : "itemsPrimary"
  //             }
  //           >
  //             <li>Profile</li>
  //             <li onClick={() => handleItemClick("settings")}>Settings</li>
  //             <li>Logout</li>
  //           </ul>
  //           <ul
  //             className={
  //               selectedToolbarButton === "settings"
  //                 ? "itemsSecondary open"
  //                 : "itemsSecondary"
  //             }
  //           >
  //             <li onClick={handleDebugMode}>Toggle Debug mode</li>
  //             <li onClick={() => handleItemClick("")}>Back</li>
  //           </ul>
  //         </div>
  //         <div
  //           className={
  //             secondToolbarValue === "addParameter"
  //               ? "expandingToolbarItems active"
  //               : "expandingToolbarItems"
  //           }
  //         >
  //           <ul
  //             className={
  //               selectedToolbarButton === ""
  //                 ? "itemsPrimary open"
  //                 : "itemsPrimary"
  //             }
  //           >
  //             <li onClick={() => handleItemClick("create new parameter")}>
  //               Create new parameter
  //             </li>
  //             <li onClick={() => handleItemClick("importparameters")}>
  //               Import new parameter(s) from Excel
  //             </li>
  //           </ul>
  //           <ul
  //             className={
  //               selectedToolbarButton === "importparameters"
  //                 ? "itemsSecondary open"
  //                 : "itemsSecondary"
  //             }
  //           >
  //             <li>Upload file</li>
  //             <li>Download template</li>
  //             <li onClick={() => handleItemClick("")}>Back</li>
  //           </ul>
  //         </div>
  //       </nav>
  //     </div>
  //   </>
  // );
  const [isOpen, setOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)


  return (
    <div className="toolbarContainer">
      <div className="toolbarTitle"><h2>Parameter Database</h2></div>
      <nav className={isOpen ? "toolbar open" : "toolbar"}>
        
        <div className="toolbarButtons">
          <ul>
            {/* Add parameters should change the buttons to create parameter, import parameter(s) and back */}
            <li className="toolbarButton">Add parameter(s)
              <ul>
                <li className="toolbarButton">Create new parameter</li>
                <li className="toolbarButton">Import new parameter(s) from Excel</li>
                <li className="toolbarButton">Back</li>
              </ul>
            </li>
            <li className="toolbarButton">Edit mode</li>
            
          </ul>
          
        </div>
        <div className="toolbarAccount"><AccountCircle></AccountCircle></div>
        
      </nav>
      {<div className={isOpen ? "toolbarMenu open" : "toolbarMenu"}>
        <Hamburger toggled={isOpen} toggle={setOpen} />
      </div>
      }
    </div>

  );


}

export default Toolbar;
