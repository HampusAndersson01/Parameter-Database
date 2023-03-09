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
            <>{props.html ? props.html : <></>}</>
          ) : 
            <>
            {props.options ? <>{editMode ? <select defaultValue={value} className="styledBoxWLabelData" onChange={handleSelect}>
              {props.options.map((option, index) => {
                return <option key={index}>{option}</option>
              })}
            </select> : <input className="styledBoxWLabelData" value={value} readOnly ></input>}
            </> :
            <input className="styledBoxWLabelData" value={value} readOnly={props.editable ? !editMode : true} onChange={handleChange}/>}
            </>
          }
        </fieldset>
      </div>
    </>
  );
}

export default StyledBoxWLabel;
