import React, { useContext, useEffect } from "react";
import { TableRowProps } from "../models/Parameters";
import { imagesToArray, rigFamilyToArray, stringToDate, possibleValuesToArray } from "../hooks/ConvertParameters/ConvertParameters";
import Toolbar from "../components/Toolbar";
import { useParams } from "react-router-dom";
import { APIContext } from "../context/APIContext";
import Images from "../components/Images";
import "./style/ParameterPage.css";
import PossibleValues from "../components/PossibleValues";
import RigFamilies from "../components/RigFamilies";
import Units from "../components/Units";
import GenericData from "../components/GenericData";
import { allowEdit } from "../hooks/EditMode/EditMode";

export default function ParameterPage() {
    //Get parameter id from url
    const { id } = useParams();
    const { hostname } = useContext(APIContext);
    const [parameter, setParameter] = React.useState<TableRowProps>();

    const [isLoading, setIsLoading] = React.useState<boolean>(true);

    const [editAccess] = React.useState<boolean>(false);//TODO: implement edit mode based on user role

    const [editAllowed] = React.useState<boolean>(allowEdit(true, editAccess));

    // Fetch parameter data from API
    useEffect(() => {
        fetch(hostname + "parameters/" + id)
            .then((response) => {
                if (response.status === 500) {
                    setIsLoading(false); // Set isLoading to false
                    throw new Error("Server error");
                }
                return response.json();
            })
            .then((data) => {
                console.log("data", data);
                setParameter(
                    {
                        id: data[0].id,
                        name: data[0].name,
                        description: data[0].description,
                        unit: { name: data[0].unit_name, description: data[0].unit_description },
                        rigFamily: rigFamilyToArray(data[0].rigfamily_name
                            , data[0].rigfamily_description),
                        decimals: data[0].decimals,
                        min: data[0].min,
                        max: data[0].max,
                        datatype: data[0].datatype,
                        created_by: data[0].created_by,
                        modified_by: data[0].modified_by,
                        creation_date: stringToDate(data[0].creation_date),
                        modified_date: stringToDate(data[0].modified_date),
                        comment: data[0].comment,
                        images: data[0].image_urls !== null ? imagesToArray(data[0].image_urls, data[0].image_name, data[0].image_description) : [],
                        possible_values: possibleValuesToArray(data[0].possible_values, data[0].possible_values_description)
                    }
                );
            })
            .catch((error) => console.error(error))
            .finally(
                () => {
                    console.log("Fetching parameter data finished");
                }
            );
    }, []);

    const handleValueChange = (value: any, key: string) => {
        //TODO Implement this function 
        if (parameter) {
            setParameter({ ...parameter, [key]: value });
        }
    }

    return (
        <div className="App">
            <header className="App-header">
                {/* Toolbar */}
                <Toolbar singleParameter></Toolbar> {/* TODO: Hide new parameter here using props */}
            </header>
            <main>
                {parameter ? (<>
                    <div className="topContainer">
                        {/* <h1 className="parameterTitle">{parameter.name}</h1>
                        <p className="parameterId">ID: {parameter.id}</p>
                        <p className="parameterDescription">{parameter.description}</p> */}
                        <input className="parameterTitle" value={parameter.name} onChange={(e) => { handleValueChange(e.target.value, "name") }} disabled={!editAllowed}></input>
                        <p className="parameterId">ID: {parameter.id}</p>
                        <input className="parameterDescription" value={parameter.description || ""} onChange={(e) => { handleValueChange(e.target.value, "description") }} disabled={!editAllowed}></input>
                    </div>

                    <div className="mainContainer">
                        <RigFamilies rigFamily={parameter.rigFamily}></RigFamilies>
                        <Units unit={parameter.unit}></Units>
                        <div className="genericDataRow numbers">
                            <GenericData data={parameter.decimals} label="Decimals" editable></GenericData>
                            <GenericData data={parameter.min} label="Min" editable></GenericData>
                            <GenericData data={parameter.max} label="Max" editable></GenericData>
                            <GenericData data={parameter.datatype} label="Datatype" editable></GenericData>
                        </div>
                        <div className="genericDataRow dates">
                            <GenericData data={parameter.created_by} label="Created by"></GenericData>
                            <GenericData data={parameter.modified_by} label="Modified by"></GenericData>
                            <GenericData data={parameter.creation_date} label="Created"></GenericData>
                            <GenericData data={parameter.modified_date} label="Modified"></GenericData>
                        </div>
                        <div className="genericDataRow comment">
                            <GenericData data={parameter.comment} label="Comment" editable textArea></GenericData>
                        </div>
                    </div>

                    <div className="rightContainer">
                        <Images images={parameter.images}></Images>
                        <PossibleValues data={parameter.possible_values} onChange={(value: any) => {
                            handleValueChange(value, "possible_values");
                        }}></PossibleValues>
                    </div></>) :
                    isLoading ? (<h2 className="notFoundMsg"> Loading...</h2>) : (<h2 className="notFoundMsg">Parameter not found</h2>)


                }
            </main>

        </div>
    );
}