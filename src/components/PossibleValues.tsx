import { EditModeContext } from "../context/EditModeContext";
import "./style/PossibleValues.css";
import React, { useState, useEffect, useContext } from "react";

interface Possible_value {
    value: string;
    description: string | null;
  } 

function possibleValues(props: { possibleValues: Possible_value[] }) {
    const [possibleValues, setPossibleValues] = useState<Possible_value[]>(
      props.possibleValues || [] // add a null check here
    );

    const { editMode } = useContext(EditModeContext);

    const handleValueChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const newValue = event.target.value;
        setPossibleValues((prevValues) => {
            const newValues = [...prevValues];
            newValues[index] = {
                ...newValues[index],
                value: newValue,
            };
            //if editing last row, add a new row
            if (index === newValues.length - 1){
                handleAddRow(newValues);
            }else if(newValue === ""){
                console.log("remove row")
                if(handleIfRemoveRow(newValues)){
                    newValues.pop();
                }
            }
            return newValues;
        });
    };
    
    const handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const newDescription = event.target.value;
        setPossibleValues((prevValues) => {
            const newValues = [...prevValues];
            newValues[index] = {
            ...newValues[index],
            description: newDescription,
            };
            return newValues;
        });        
    };

    const handleAddRow = (values: any) => {
        // Add a new row to the table if values[values.length - 1].value or .description is not empty
        if (values[values.length - 1].value !== "" || values[values.length - 1].description !== "") {
            setPossibleValues((prevValues) => {
                const newValues = [...prevValues];
                newValues.push({
                    value: "",
                    description: "",
                });
                return newValues;
            });
        }
    };
    
    const handleIfRemoveRow = (values: any) => {
        // Remove a row from the table if values[values.length - 2].value and .description is empty
        if (values[values.length - 2].value === "" || values[values.length - 2].value === null && values[values.length - 2].description === "" || values[values.length - 2].description === null) {
            return true;
        }
    };

    return (
        <table>
            <thead>
                <tr>
                <th>Value</th>
                <th>Description</th>
                </tr>
            </thead>
            <tbody>
                {possibleValues.length > 0 ? possibleValues.map((value: any,index) => {
                return (
                    <tr>
                    {/* If editmode replace row with input */}
                    <td>{editMode ? <input type="text" value={value.value} onChange={(event) => handleValueChange(event, index)}/> : value.value}</td>
                    <td>{editMode ? <input type="text" value={value.description} onChange={(event) => handleDescriptionChange(event, index)}/> : value.description}</td>
                    </tr>
                )
                }) :
                <tr>
                    <td>{editMode ? <input type="text" onChange={(event) => handleValueChange(event, 0)}/> : <></>}</td>
                    <td>{editMode ? <input type="text" onChange={(event) => handleDescriptionChange(event, 0)}/> : <></>}</td>
                </tr>}
            </tbody>
        </table>
    )
}

export default possibleValues;