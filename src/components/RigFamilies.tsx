import React, { useContext, useEffect, useState } from 'react';
import CreatableSelect from 'react-select/creatable';
import { RigFamily } from '../models/Parameters';
import './style/RigFamilies.css';
import { DataContext } from '../context/DataContext';
import { APIContext } from '../context/APIContext';


interface Option {
    readonly label: string;
    readonly value: string;
}

export default function RigFamilies(props: { rigFamily: RigFamily[] | null | undefined }) {

    const { hostname } = useContext(APIContext);
    const [rigFamilies, setRigFamilies] = useState<RigFamily[]>([]);
    const [selectedRigFamilies, setSelectedRigFamilies] = useState<RigFamily[]>([]);
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [value, setValue] = useState<Option | null>();

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
            name: inputValue,
            description: ""
        };
        //Replace rig family in selected rig families in current index
        const newSelectedRigFamilies = [...selectedRigFamilies];
        newSelectedRigFamilies[currentIndex] = newRigFamily;
        setSelectedRigFamilies(newSelectedRigFamilies);
        //Add rig family to rig families
        setRigFamilies([...rigFamilies, newRigFamily]);
        setValue({ value: inputValue, label: inputValue })
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

    return (
        <div className="rigFamilyContainer">
            {
                props.rigFamily !== undefined && props.rigFamily !== null ? (<>
                    <h3>Rig family</h3>
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
                                disabled={/*TODO Access control*/ false}
                            />
                            <div className="rigFamilyDescription">
                                <p>{selectedRigFamilies[currentIndex] ? selectedRigFamilies[currentIndex].description : ""}</p>
                            </div>
                        </div>
                        <button onClick={handleNextClick} disabled={currentIndex >= selectedRigFamilies.length - 1}>&gt;</button>
                    </div>
                </>
                ) : <p>Loading...</p>}


        </div>
    );
}