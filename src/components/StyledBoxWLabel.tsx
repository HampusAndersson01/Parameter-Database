import React, { useContext, useEffect, useState } from "react";
import "./style/StyledBoxWLabel.css";
import { EditModeContext } from "../context/EditModeContext";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';


function StyledBoxWLabel(props: {
  id: number;
  label: string;
  data?: any | null;
  html?: any;
  editable?: boolean;
  options?: string[];
  onChange: any;
  iterable?: boolean;
}) {
  const { editMode } = useContext(EditModeContext);
  const [value, setValue] = useState(props.data);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (props.data !== undefined && props.data !== null) {
      setValue(props.data);
    } else {
      setValue("");
    }
  }, []);

  useEffect(() => {
    props.onChange(value);
  }, [value]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };
  const handleSelect = (
    event: React.ChangeEvent<HTMLSelectElement> | undefined,
    index?: number
  ) => {
    if (index !== undefined && event !== undefined) {
      if (Array.isArray(value)) {
        let temp = value;
        temp[index] = event.target.value;
        setValue(temp);
      } else {
        setValue(event.target.value);
      }
    }
  };

  const handleNextOption = () => {
    if (currentIndex < value.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  }
  const handlePreviousOption = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  }
  const handleAddOption = () => {
    if (Array.isArray(value)) {
      let temp = value;
      temp.push("");
      setValue(temp);
      setCurrentIndex(temp.length - 1);
    }
  }

  const handleRemoveOption = () => {
    if (Array.isArray(value)) {
      let temp = value;
      temp.splice(currentIndex, 1);
      setValue(temp);
      if (currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
      }
    }
  }

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
          ) : (
            <>
              {props.iterable ? (
                <div className="controlContainer">
                <legend className={editMode ? "controls" : "controls hidden"} onClick={handleRemoveOption}><RemoveIcon></RemoveIcon></legend>
                <legend className={editMode ? "controls" : "controls hidden"} onClick={handleAddOption}><AddIcon></AddIcon></legend>
                <legend className="controls" onClick={handlePreviousOption}><ArrowBackIcon></ArrowBackIcon></legend>
                <legend className="controls" onClick={handleNextOption}><ArrowForwardIcon></ArrowForwardIcon></legend>
                </div>
                ) : <></>}
              {props.options ? (
                // Render a select element if the options prop exists
                <>
                  {editMode ? (
                    // If in edit mode, render the select element with options
                    // if value is array, render multiple select elements
                    Array.isArray(value) && value.length > 0 ? (
                      

                      value.map((val, index) => {
                        return (
                          <select
                            defaultValue={val}
                            className={
                              index === currentIndex
                                ? "styledBoxWLabelData active"
                                : "styledBoxWLabelData"
                            }
                            onChange={(event) => handleSelect(event, index)}
                          >
                            {/* Map over the options prop to create the select options */}
                            <option value=""></option>
                            {props.options !== undefined ? (
                              props.options.map((option, index) => {
                                return <option key={index}>{option}</option>;
                              })
                            ) : (
                              <></>
                            )}
                          </select>
                        );
                      })
                    ) : (
                      <select
                        defaultValue={value}
                        className="styledBoxWLabelData active"
                        onChange={handleSelect}
                      >
                        {/* Map over the options prop to create the select options */}
                        <option value=""></option>
                        {props.options.map((option, index) => {
                          return <option key={index}>{option}</option>;
                        })}
                      </select>
                    )
                  ) : // If not in edit mode, render a read-only input element
                  // value.map((val: string, index:number) => {
                  Array.isArray(value) ? (
                    value.map((val, index) => {
                      return (
                        <input
                        className={
                          index === currentIndex
                            ? "styledBoxWLabelData active"
                            : "styledBoxWLabelData"
                        }
                          value={val}
                          readOnly
                        ></input>
                      );
                    })
                  ) : (
                    <>
                      <input
                        className="styledBoxWLabelData active"
                        value={value}
                        readOnly
                      ></input>
                    </>
                  )}
                  {/* // ) : 
            // <input className="styledBoxWLabelData" value={value} readOnly></input>} */}
                </>
              ) : (
                // If the options prop doesn't exist, render a regular input element
                <input
                  className="styledBoxWLabelData active"
                  value={value}
                  readOnly={props.editable ? !editMode : true}
                  onChange={handleChange}
                />
              )}
            </>
          )}
        </fieldset>
      </div>
    </>
  );
}

export default StyledBoxWLabel;
