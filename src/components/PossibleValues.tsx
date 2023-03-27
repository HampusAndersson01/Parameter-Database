import { EditModeContext } from "../context/EditModeContext";
import "./style/PossibleValues.css";
import React, { useState, useEffect, useContext } from "react";

interface Possible_value {
    value: string;
    description: string | null;
  } 

function possibleValues(props: { possibleValues: Possible_value[], onChange: any;}) {
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
                var remove = handleIfRemoveRow(newValues,index)
                if(remove && index === newValues.length - 2){
                    newValues.pop();
                } else if(remove){ 
                    newValues.splice(index,1);
                }
            }
            props.onChange(newValues);
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
            props.onChange(newValues);
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
    useEffect(() => {
        handleEditToggle();
    }, [editMode]);

    
    const handleIfRemoveRow = (values: any, index: number) => {
        // Remove a row from the table if values[values.length - 2].value and .description is empty
        console.log(values)
        if (values[index].value === "" || values[index].value === null && values[index].description === "" || values[index].description === null) {
            return true;
        }

        return false;
    };
    const handleEditToggle = () => {
        // When editmode is toggled, add a new row if the last row is not empty
        if (editMode) {
            setPossibleValues((prevValues) => {
                const newValues = [...prevValues];
                newValues.push({
                    value: "",
                    description: "",
                });
                return newValues;
            });
        }else{
            // When editmode is toggled, remove the last row if it is empty
            if (possibleValues.length > 0){
                if (possibleValues[possibleValues.length - 1].value === "" && possibleValues[possibleValues.length - 1].description === "") {
                    setPossibleValues((prevValues) => {
                        const newValues = [...prevValues];
                        newValues.pop();
                        return newValues;
                    });
                }
            }
        }
    };


    return (
        <table className="possibleValues">
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
                }) : null
                // <tr>
                //     <td>{editMode ? <input type="text" onChange={(event) => handleValueChange(event, 0)}/> : <></>}</td>
                //     <td>{editMode ? <input type="text" onChange={(event) => handleDescriptionChange(event, 0)}/> : <></>}</td>
                // </tr>
            }
            </tbody>
        </table>
    )
}

export default possibleValues;