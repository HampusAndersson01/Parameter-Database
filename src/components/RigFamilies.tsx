import React, { useContext, useEffect, useState } from 'react';
import CreatableSelect from 'react-select/creatable';
import { RigFamily } from '../models/Parameters';
import './style/RigFamilies.css';
import { DataContext } from '../context/DataContext';
import { APIContext } from '../context/APIContext';
import { allowEdit } from "../hooks/EditMode/EditMode";


interface Option {
    readonly label: string;
    readonly value: string;
}

export default function RigFamilies(props: { rigFamily: RigFamily[] | null | undefined }) {

    const { hostname } = useContext(APIContext);
    /**
     * rigFamilies is an array of rig families in the database.
     */
    const [rigFamilies, setRigFamilies] = useState<RigFamily[]>([]);
    /**
     * selectedRigFamilies is an array of rig families in current parameter.
    */
    const [selectedRigFamilies, setSelectedRigFamilies] = useState<RigFamily[]>([]);
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [value, setValue] = useState<Option | null>();


    const [editAccess, setEditAccess] = React.useState<boolean>(false);//TODO: implement edit mode based on user role

    /**
     * editAllowed is a boolean that determines if the user is allowed to edit the rig family.
     */
    const [editAllowed, setEditAllowed] = React.useState<boolean>(allowEdit(true, editAccess));

    /**
     * useEffect is called when the component is mounted.
     * It fetches the rig families from the API.
     */
    useEffect(() => {
        //Fetch rig families from API
        fetch(hostname + "rigfamilies")
            .then((response) => response.json())
            .then((data) => {
                setRigFamilies(data.map((rigFamily: any) => {
                    return {
                        name: rigFamily.name,
                        description: rigFamily.description
                    }
                }));
            }
            )
            .catch((error) => console.log(error))
            .finally(() => console.log("Loaded rig families"));
    }, []);

    /**
     * useEffect is called when the rig family props is updated.
     * It updates the selected rig families.
     * It also updates the value of the dropdown menu.
     */
    useEffect(() => {
        if (props.rigFamily !== undefined && props.rigFamily !== null) {
            setSelectedRigFamilies(props.rigFamily);
            setValue({ value: props.rigFamily[currentIndex].name, label: props.rigFamily[currentIndex].name });
        }
    }, [props.rigFamily]);


    /**
     * handleCreate is called when the user creates a new rig family.
     * 
     * @param inputValue The name of the new rig family.
     */
    const handleCreate = (inputValue: string) => {
        const newRigFamily: RigFamily = {
            name: inputValue.toUpperCase(),
            description: ""
        };
        //Replace rig family in selected rig families in current index
        const newSelectedRigFamilies = [...selectedRigFamilies];
        newSelectedRigFamilies[currentIndex] = newRigFamily;
        setSelectedRigFamilies(newSelectedRigFamilies);
        //Add rig family to rig families
        setRigFamilies([...rigFamilies, newRigFamily]);
        setValue({ value: inputValue.toUpperCase(), label: inputValue.toUpperCase() })
    };

    /**
     * handleValueChange is called when the user changes the value of the dropdown menu.
     * It updates the selected rig families.
     * It also updates the value of the dropdown menu.
     * 
     * @param newValue The new value of the dropdown menu.
     */
    const handleValueChange = (newValue: Option | null) => {
        if (newValue !== null) {
            const newRigFamily: RigFamily = {
                name: newValue.value,
                description: ""
            };
            var rigFamilyExists = false;
            rigFamilies.forEach((rigFamily) => {
                if (rigFamily.name === newRigFamily.name) {
                    rigFamilyExists = true;
                    newRigFamily.description = rigFamily.description;
                }
            });

            const newSelectedRigFamilies = [...selectedRigFamilies];
            newSelectedRigFamilies[currentIndex] = newRigFamily;
            setSelectedRigFamilies(newSelectedRigFamilies);
            setValue(newValue);
        }
    };

    /**
     * handlePrevClick is called when the user clicks the previous button.
     */
    const handlePrevClick = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
            setValue({ value: selectedRigFamilies[currentIndex - 1].name, label: selectedRigFamilies[currentIndex - 1].name });
        }
    };

    /**
     * handleNextClick is called when the user clicks the next button.
    */
    const handleNextClick = () => {
        if (currentIndex < selectedRigFamilies.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setValue({ value: selectedRigFamilies[currentIndex + 1].name, label: selectedRigFamilies[currentIndex + 1].name });
        }
    };

    /**
     * handleNewClick is called when the user clicks the new button.
     * It adds a new rig family to the selected rig families.
     * It also updates the value of the dropdown menu.
     */
    const handleNewClick = () => {
        const newSelectedRigFamilies = [...selectedRigFamilies];
        newSelectedRigFamilies.push({ name: "", description: "" });
        setSelectedRigFamilies(newSelectedRigFamilies);
        setCurrentIndex(currentIndex + 1);
        setValue({ value: "", label: "" });
    };

    /**
     * handleDescriptionChange is called when the user changes the description of the rig family.
     * It updates the selected rig families.
     * 
     * @param event The event that triggered the function.
     */
    const handleDescriptionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newSelectedRigFamilies = [...selectedRigFamilies];
        newSelectedRigFamilies[currentIndex].description = event.target.value;
        setSelectedRigFamilies(newSelectedRigFamilies);
    }

    /**
     * handleDeleteClick is called when the user clicks the delete button.
     * It deletes the rig family from the selected rig families.
     * It also updates the value of the dropdown menu.
     * If the rig family is the only rig family in the selected rig families, it replaces the rig family with an empty rig family.
     */
    const handleDeleteClick = () => {
        if (selectedRigFamilies.length > 1) {
            const newSelectedRigFamilies = [...selectedRigFamilies];
            newSelectedRigFamilies.splice(currentIndex, 1);
            setSelectedRigFamilies(newSelectedRigFamilies);
            if (currentIndex > 0) {
                var newIndex = currentIndex - 1;
                setCurrentIndex(newIndex);
            } else {
                var newIndex = currentIndex;
            }
            console.log("newIndex: " + newIndex)
            setValue({ value: newSelectedRigFamilies[newIndex].name, label: newSelectedRigFamilies[newIndex].name });
        } else {
            //Replace rig family with empty
            const newSelectedRigFamilies = [...selectedRigFamilies];
            newSelectedRigFamilies[currentIndex] = { name: "", description: "" };
            setSelectedRigFamilies(newSelectedRigFamilies);
            setValue({ value: "", label: "" });
        }
    }

    return (
        <div className="rigFamilyContainer">
            {
                props.rigFamily !== undefined && props.rigFamily !== null ? (<>
                    <h3>Rig family ({currentIndex + 1}/{selectedRigFamilies.length}) {editAccess ? (<button className="deleteButton" onClick={handleDeleteClick} disabled={!editAllowed}>Delete</button>) : ""} </h3>
                    <div className="rigFamilyData">
                        <button onClick={handlePrevClick} disabled={currentIndex <= 0}>&lt;</button>
                        <div className="rigFamilyCenter">
                            <CreatableSelect
                                options={rigFamilies.map((rigFamily) => {
                                    return { value: rigFamily.name, label: rigFamily.name }
                                })}
                                onCreateOption={handleCreate}
                                value={value}
                                onChange={(newValue) => handleValueChange(newValue)}
                                isDisabled={!editAllowed}
                            />
                            <div className="rigFamilyDescription">
                                <textarea value={selectedRigFamilies[currentIndex] !== null ? selectedRigFamilies[currentIndex]?.description || "" : ""} onChange={handleDescriptionChange} disabled={!editAllowed}></textarea>
                            </div>
                        </div>
                        {
                            currentIndex < selectedRigFamilies.length - 1 || !editAccess ? (
                                <button onClick={handleNextClick} disabled={currentIndex >= (selectedRigFamilies.length - 1)}>&gt;</button>
                            ) : (
                                <button onClick={handleNewClick}>+</button>
                            )

                        }

                    </div>
                </>
                ) : <p>Loading...</p>}



        </div>
    );
}