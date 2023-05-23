/**
 * @file GenericData.tsx
 * @module Components/GenericData
 * 
 * @description
 * A component that allows the user to display a label and a text input field.
 * 
 * @example Default
 * <GenericData data={data} label="Label" editable={true} />
 * 
 * @example Text area
 * <GenericData data={data} label="Label" editable={true} textArea={true} />
 */

import React, { useEffect } from 'react';
import "./style/GenericData.css";
import { allowEdit } from "../hooks/EditMode/EditMode";

/**
 * @typedef {Object} GenericDataProps
 * @property {any} data - The data to display
 * @property {string} label - The label to display
 * @property {boolean} [editable] - Whether the data is editable
 * @property {boolean} [textArea] - Whether the data is a text area
 */

/**
 * @param {GenericDataProps} props - The props object with the following properties:
 * @param {any} props.data - The data to display
 * @param {string} props.label - The label to display
 * @param {boolean} [props.editable] - Whether the data is editable (optional)
 * @param {boolean} [props.textArea] - Whether the data is a text area (optional)
 * @returns {JSX.Element} - The resulting JSX element
 */

export default function GenericData(props: { data: any, label: string, editable?: boolean, textArea?: boolean }) {
    const [data, setData] = React.useState<any>(props.data);
    const [editAccess, setEditAccess] = React.useState<boolean>(false);//TODO: implement edit mode based on user role
    //Default value of editable usestate is false
    const [editable, setEditable] = React.useState<boolean>(props.editable ? props.editable : false);

    const [editAllowed, setEditAllowed] = React.useState<boolean>(allowEdit(editable, editAccess));

    const [textArea, setTextArea] = React.useState<boolean>(props.textArea ? props.textArea : false);



    //if data is date, convert to string
    if (data instanceof Date) {
        setData(data.toLocaleDateString());
    }

    // Handle changes in props
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setData(event.target.value);
    }

    // Handle changes in props
    const handleTextAreaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setData(event.target.value);
    }


    return (
        <div className="genericData">
            <h3>{props.label}</h3>
            <div className={data ? "genericDataValue" : "genericDataValue"}>
                {textArea ? <textarea value={data ? data : ""} onChange={handleTextAreaChange} disabled={!editAllowed}></textarea> :
                    <input type="text" value={data ? data : ""} onChange={handleChange} disabled={!editAllowed}></input>}
            </div>
        </div>
    )

}
