import React, { useContext, useEffect, useState } from 'react'
import { Unit } from '../models/Parameters'
import './style/Units.css'
import CreatableSelect from 'react-select/creatable';
import { APIContext } from '../context/APIContext';

interface Option {
    readonly label: string;
    readonly value: string;
}

export default function Units(props: { unit: Unit | null | undefined }) {
    const [unitOptions, setUnitOptions] = useState<Unit[]>([]);
    const [unit, setUnit] = useState<Unit | null | undefined>(props.unit);
    const [value, setValue] = useState<Option | null>();
    const { hostname } = useContext(APIContext);

    /**
     * useEffect is called when the component is mounted.
     * It fetches the units from the API.
     */
    useEffect(() => {
        //Fetch units from API
        fetch(hostname + "units")
            .then((response) => response.json())
            .then((data) => {
                setUnitOptions(data.map((unit: any) => {
                    return {
                        name: unit.name,
                        description: unit.description
                    }
                }));
            }
            )
            .catch((error) => console.log(error))
            .finally(() => console.log("Loaded units"));
    }, []);

    useEffect(() => {
        if (props.unit !== undefined && props.unit !== null) {
            setUnit(props.unit);
            setValue({ value: props.unit.name, label: props.unit.name });
        }
    }, [props.unit]);


    /**
     * handleCreate is called when the user creates a new unit.
     * 
     * @param inputValue The name of the new unit.
     */
    const handleCreate = (inputValue: string) => {
        const newUnit: Unit = {
            name: inputValue,
            description: ""
        };
        setUnit(newUnit);
        setValue({ value: inputValue, label: inputValue });
        setUnitOptions([...unitOptions, newUnit]);
    };


    /**
     * handleValueChange is called when the user changes the value of the dropdown menu.
     * 
     * @param newValue The new value of the dropdown menu.
     */
    const handleValueChange = (newValue: Option | null) => {
        setValue(newValue);
        if (newValue !== null) {
            const newUnit: Unit = {
                name: newValue.value,
                description: ""
            };
            var unitExists = false;
            unitOptions.forEach((unit) => {
                if (unit.name === newValue.value) {
                    unitExists = true;
                    newUnit.description = unit.description;
                    return;
                }
            }
            );
            setUnit(newUnit);


        }
    };

    /**
        handleDescriptionChange is called when the user changes the description of the unit.
        The description is stored in the unit state variable.
        The description is also updated in the unit options state variable.
        This is done to ensure that the description is updated in the dropdown menu.

        @param event The event that triggered the function call.
    */
    const handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (unit !== null && unit !== undefined) {
            const newUnit: Unit = {
                name: unit.name,
                description: event.target.value
            };
            setUnit(newUnit);

            //Update description in unit options
            const newUnitOptions = [...unitOptions];
            newUnitOptions.forEach((unitOption) => {
                if (unitOption.name === newUnit.name) {
                    unitOption.description = newUnit.description;
                }
            }
            );
            setUnitOptions(newUnitOptions);

        }
    };



    return (<>
        <div className="unitContainer">
            <h3>Unit</h3>
            <div className="unitData">
                <CreatableSelect
                    options={unitOptions.map((unit) => {
                        return { value: unit.name, label: unit.name }
                    })}
                    onCreateOption={handleCreate}
                    value={value}
                    onChange={(newValue: Option) => handleValueChange(newValue)}
                    disabled={/*TODO Access control*/ false}
                />
                <input type="text" value={unit ? unit.description : ""} onChange={handleDescriptionChange} disabled={/*TODO Access control*/ false}></input>
            </div>
        </div>
    </>)
}
