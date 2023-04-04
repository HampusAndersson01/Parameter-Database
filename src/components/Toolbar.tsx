import React, { useState, useEffect, useRef, useContext } from "react";
import "./style/Toolbar.css";
import { ExpandMore, ExpandLess, AccountCircle } from '@mui/icons-material';
import { DebugContext } from "../context/DebugContext";
import { EditModeContext } from "../context/EditModeContext";
import { CreatingParameterContext } from "../context/CreatingParameterContext";
import { Squeeze as Hamburger } from 'hamburger-react'

function Toolbar() {
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