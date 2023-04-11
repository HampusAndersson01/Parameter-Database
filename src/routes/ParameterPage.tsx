import React, { useEffect } from "react";
import { TableRowProps, Image } from "../models/Parameters";
import { imagesToArray } from "../hooks/ConvertParameters/ConvertParameters";
import Toolbar from "../components/Toolbar";
import { useParams } from "react-router-dom";
import { APIContext } from "../context/APIContext";
import Images from "../components/Images";
import "./style/ParameterPage.css";
import PossibleValues from "../components/PossibleValues";

export default function ParameterPage() {
    //Get parameter id from url
    const { id } = useParams();
    const { hostname } = React.useContext(APIContext);
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
                        unit_name: data[0].unit_name,
                        unit_description: data[0].unit_description,
                        rigfamily_name: data[0].rigfamily_name,
                        rigfamily_description: data[0].rigfamily_description,
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
            });
    }, []);

    const handleValueChange = (value: any, key: string) => {
        setParameter((prevParameter) => {
            const newParameter = { ...prevParameter };
            newParameter[key] = value;
            return newParameter;
        });
    };




    return (
        <div className="App">
            <header className="App-header">
                {/* Toolbar */}
                <Toolbar singleParameter></Toolbar> {/* TODO: Hide new parameter here using props */}
            </header>
            <main>
                <div className="topContainer">
                    <h2 className="parameterTitle">{parameter ? parameter.name : ""}</h2>
                    <p className="parameterId">ID: {parameter ? parameter.id : ""}</p>
                    <p className="parameterDescription">{parameter ? parameter.description : ""}</p>
                </div>
                <div className="rightContainer">
                    <Images images={parameter ? parameter.images : null}></Images>
                    <PossibleValues data={parameter ? parameter : null} onChange={(value: any) => {
                        handleValueChange(value, "possible_values");
                    }}></PossibleValues>
                </div>




            </main>

        </div>
    );
}