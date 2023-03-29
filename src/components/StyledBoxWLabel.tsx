import React, { useContext, useEffect, useState } from "react";
import "./style/StyledBoxWLabel.css";
import { EditModeContext } from "../context/EditModeContext";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { DataContext } from "../context/DataContext";

function StyledBoxWLabel(props: {
  id: number;
  label: string;
  data?: any | null;
  html?: any;
  editable?: boolean;
  options?: any[];
  onChange: any;
  currentIndexOut?: (index: number) => void;
  iterable?: boolean;
}) {
  const { editMode } = useContext(EditModeContext);
  const [value, setValue] = useState(props.data);
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const { rigFamilies } = useContext(DataContext);

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
    // console.log("handleSelect");
    // console.log("index: " + index);
    if (index !== undefined && event !== undefined) {
      if (Array.isArray(value)) {
        let temp = value;
        // console.log("before: " + temp);
        temp[index] = event.target.value;
        setValue(temp);
        // console.log("after: " + temp);
      } else {
        setValue(event.target.value);
      }

      handleSetCurrentIndex(currentIdx);
    } else if (event !== undefined) {
      setValue([event.target.value]);
    }
  };

  const handleSetCurrentIndex = (index: number) => {
    // console.log("handleSetCurrentIndex");
    // console.log("index: " + index);
    if (props.currentIndexOut) {
      props.currentIndexOut(index);
    }
  };

  const handleNextOption = () => {
    if (
      value[currentIdx] !== "" &&
      value[currentIdx] !== undefined &&
      value[currentIdx] !== null
    ) {
      if (currentIdx < value.length - 1) {
        handleSetCurrentIndex(currentIdx + 1);
        setCurrentIdx(currentIdx + 1);
      }
    } else {
      alert("Please select a value or remove the option");
    }
  };
  const handlePreviousOption = () => {
    if (
      value[currentIdx] !== "" &&
      value[currentIdx] !== undefined &&
      value[currentIdx] !== null
    ) {
      if (currentIdx > 0) {
        handleSetCurrentIndex(currentIdx - 1);
        setCurrentIdx(currentIdx - 1);
      }
    } else {
      alert("Please select a value or remove the option");
    }
  };
  const handleAddOption = () => {
    if (Array.isArray(value) && value[value.length - 1] !== "") {
      let temp = value;
      temp.push("");
      setValue(temp);
      setCurrentIdx(temp.length - 1);
      handleSetCurrentIndex(-1);
    }
  };

  const handleRemoveOption = () => {
    if (Array.isArray(value)) {
      let temp = value;
      // console.log("Before: " + value);
      temp.splice(currentIdx, 1);
      // console.log("After: " + temp);
      setValue(temp);
      if (currentIdx === 0) {
        setCurrentIdx(0);
        if (temp.length > 0) {
          handleSetCurrentIndex(0);
        } else {
          handleSetCurrentIndex(-1);
        }
      } else {
        setCurrentIdx(currentIdx - 1);
        handleSetCurrentIndex(currentIdx - 1);
      }
    }
  };

  const checkNextArrow = () => {
    // Disable next arrow if there is no next option
    if (Array.isArray(value)) {
      if (value.length > 0) {
        if (
          value[currentIdx] !== "" &&
          value[currentIdx] !== undefined &&
          value[currentIdx] !== null
        ) {
          if (currentIdx < value.length - 1) {
            return true;
          } else {
            return false;
          }
        } else {
          return false;
        }
      } else {
        return false;
      }
    } else {
      return false;
    }
  };
  const checkPreviousArrow = () => {
    // Disable previous arrow if there is no previous option
    if (Array.isArray(value)) {
      if (value.length > 0) {
        if (
          value[currentIdx] !== "" &&
          value[currentIdx] !== undefined &&
          value[currentIdx] !== null
        ) {
          if (currentIdx > 0) {
            return true;
          } else {
            return false;
          }
        } else {
          return false;
        }
      } else {
        return false;
      }
    } else {
      return false;
    }
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
          ) : (
            <>
              {props.iterable ? (
                <div className="controlContainer">
                  <legend
                    className={editMode ? "controls" : "controls hidden"}
                    onClick={handleRemoveOption}
                  >
                    <RemoveIcon></RemoveIcon>
                  </legend>
                  <legend
                    className={editMode ? "controls" : "controls hidden"}
                    onClick={handleAddOption}
                  >
                    <AddIcon></AddIcon>
                  </legend>
                  <legend
                    className={
                      checkPreviousArrow() ? "controls" : "controls disabled"
                    }
                    onClick={handlePreviousOption}
                  >
                    <ArrowBackIcon></ArrowBackIcon>
                  </legend>
                  <legend
                    className={
                      checkNextArrow() ? "controls" : "controls disabled"
                    }
                    onClick={handleNextOption}
                  >
                    <ArrowForwardIcon></ArrowForwardIcon>
                  </legend>
                </div>
              ) : (
                <></>
              )}
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
                              index === currentIdx
                                ? "styledBoxWLabelData active"
                                : "styledBoxWLabelData"
                            }
                            value={val}
                            onChange={(event) => handleSelect(event, index)}
                          >
                            {/* Map over the options prop to create the select options */}
                            <option key="-1" value=""></option>
                            {props.options !== undefined ? (
                              rigFamilies.map((option, index) => {
                                return (
                                  <option key={index} value={option.name}>
                                    {option.name}
                                  </option>
                                );
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
                        value={value}
                      >
                        {/* Map over the options prop to create the select options */}
                        <option key="-1" value=""></option>
                        {rigFamilies.map((option, index) => {
                          return (
                            <option key={index} value={option.name}>
                              {option.name}
                            </option>
                          );
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
                            index === currentIdx
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
