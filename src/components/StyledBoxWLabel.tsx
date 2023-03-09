import React, { useContext, useEffect, useState } from "react";
import "./style/StyledBoxWLabel.css";
import { EditModeContext } from "../context/EditModeContext";

function StyledBoxWLabel(props: {
  id: number;
  label: string;
  data?: any | null;
  html?: any;
  editable?: boolean;
  options?: string[];
}) {
  const { editMode } = useContext(EditModeContext);
  const [value, setValue] = useState(props.data);
  
  useEffect(() => {
    setValue(props.data);
  }, [props.data]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };
  const handleSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setValue(event.target.value);
  };

  return (
    <>
      <div
        className={"styledBoxWLabelContainer " + props.label.replace(/ /g, "_")}
      >
        <fieldset className="styledBoxWLabel">
          <legend className="styledBoxWLabelLabel">{props.label}</legend>
          {props.html ? (
            // Render HTML passed in as a prop
            <>{props.html ? props.html : <></>}</>
          ) : 
            <>
            {
            props.options ? 
            // Render a select element if the options prop exists
            <>{editMode ? 
            // If in edit mode, render the select element with options
            // if value is array, render multiple select elements
            Array.isArray(value) && value.length > 0 ? value.map((val, index) => {
              return <select defaultValue={val} className={index === 0 ? "styledBoxWLabelData active" : "styledBoxWLabelData"} onChange={handleSelect}>
              {/* Map over the options prop to create the select options */}
              <option value=""></option>
              {props.options !== undefined ? props.options.map((option, index) => {
                return <option key={index}>{option}</option>
              }): <></>}
            </select>
            }) :
            
            <select defaultValue={value} className="styledBoxWLabelData" onChange={handleSelect}>
              {/* Map over the options prop to create the select options */}
              <option value=""></option>
              {props.options.map((option, index) => {
                return <option key={index}>{option}</option>
              })}
            </select> 
            // If not in edit mode, render a read-only input element
            : 
            // value.map((val: string, index:number) => {
            Array.isArray(value) ? value.map((val,index) => {
              return <input className={index === 0 ? "styledBoxWLabelData active" : "styledBoxWLabelData"} value={val} readOnly></input>
            }) : <>
            <input className="styledBoxWLabelData" value={value} readOnly ></input>
            </>
            }
            {/* // ) : 
            // <input className="styledBoxWLabelData" value={value} readOnly></input>} */}
            </>
            // If the options prop doesn't exist, render a regular input element
            : <input className="styledBoxWLabelData" value={value} readOnly={props.editable ? !editMode : true} onChange={handleChange}/>}
            </>
          }
        </fieldset>
      </div>
    </>
  );
}

export default StyledBoxWLabel;
