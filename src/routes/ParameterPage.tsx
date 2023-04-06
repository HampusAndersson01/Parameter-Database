import React, { useEffect } from "react";
import { TableRowProps } from "../models/Parameters";
import Toolbar from "../components/Toolbar";
import { useParams } from "react-router-dom";
import { APIContext } from "../context/APIContext";
import Images from "../components/Images";
import "./style/ParameterPage.css";

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
                setParameter(data[0]);
            });
    }, []);

    useEffect(() => {
        console.log("parameter", parameter);
    }, [parameter]);



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
                    {/* Possible Values */}
                </div>




            </main>

        </div>
    );
}