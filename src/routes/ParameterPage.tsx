import React, { useContext, useEffect } from "react";
import { TableRowProps, Image } from "../models/Parameters";
import { imagesToArray, rigFamilyToArray } from "../hooks/ConvertParameters/ConvertParameters";
import Toolbar from "../components/Toolbar";
import { useParams } from "react-router-dom";
import { APIContext } from "../context/APIContext";
import Images from "../components/Images";
import "./style/ParameterPage.css";
import PossibleValues from "../components/PossibleValues";
import RigFamilies from "../components/RigFamilies";
import Units from "../components/Units";

export default function ParameterPage() {
    //Get parameter id from url
    const { id } = useParams();
    const { hostname } = useContext(APIContext);
    const [parameter, setParameter] = React.useState<TableRowProps>();


    // Fetch parameter data from API
    useEffect(() => {
        fetch(hostname + "parameters/" + id)
            .then((response) => response.json())
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
                        creation_date: data[0].creation_date,
                        modified_date: data[0].modified_date,
                        comment: data[0].comment,
                        images: imagesToArray(data[0].image_urls, data[0].image_name, data[0].image_description),
                        possible_values: data[0].possible_values
                    }


                );
            })
            .catch((error) => console.log(error))
            .finally(() => console.log("Loaded parameter data"));



    }, []);


    const handleValueChange = (value: any, key: string) => {

    };




    return (
        <div className="App">
            <header className="App-header">
                {/* Toolbar */}
                <Toolbar singleParameter></Toolbar> {/* TODO: Hide new parameter here using props */}
            </header>
            <main>
                {parameter ? (<>
                <div className="topContainer">
                        <h2 className="parameterTitle">{parameter.name}</h2>
                        <p className="parameterId">ID: {parameter.id}</p>
                        <p className="parameterDescription">{parameter.description}</p>
                </div>

                    <div className="mainContainer">
                        <RigFamilies rigFamily={parameter.rigFamily}></RigFamilies>
                        <Units unit={parameter.unit}></Units>
                    </div>

                <div className="rightContainer">
                        <Images images={parameter.images}></Images>
                        <PossibleValues data={parameter.possible_values} onChange={(value: any) => {
                        handleValueChange(value, "possible_values");
                    }}></PossibleValues>
                    </div></>) : <p>Loading...</p>}




            </main>

        </div>
    );
}