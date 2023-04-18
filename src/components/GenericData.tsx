import React, { useEffect } from 'react';
import "./style/GenericData.css";
import { allowEdit } from "../hooks/EditMode/EditMode";

/**
 * A generic data component that can be used to display a label and a text input field.
 * 
 * @module GenericData
 * @param props - A generic data object containing a label, data and an optional editable flag.
 * @returns A div containing a label and a text input field.
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

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setData(event.target.value);
    }

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
