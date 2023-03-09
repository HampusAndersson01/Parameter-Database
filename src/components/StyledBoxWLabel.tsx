import React from "react";
import "./style/StyledBoxWLabel.css";

function StyledBoxWLabel(props: {
  label: string;
  data?: any | null;
  html?: any;
}) {
  return (
    <>
      <div
        className={"styledBoxWLabelContainer " + props.label.replace(/ /g, "_")}
      >
        <fieldset className="styledBoxWLabel">
          <legend className="styledBoxWLabelLabel">{props.label}</legend>
          {props.data ? (
            <div className="styledBoxWLabelData">{props.data}</div>
          ) : (
            <>{props.html ? props.html : <></>}</>
          )}
        </fieldset>
      </div>
    </>
  );
}

export default StyledBoxWLabel;
