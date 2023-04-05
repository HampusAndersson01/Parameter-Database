import React, { useEffect } from "react";
import { TableRowProps } from "../models/Parameters";
import Toolbar from "../components/Toolbar";
import { useParams } from "react-router-dom";
import { APIContext } from "../context/APIContext";

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
                setParameter(data);
            });
    }, []);

    useEffect(() => {
        console.log("parameter", parameter);
    }, [parameter]);



    return (
        <div className="App">
            <header className="App-header">
                {/* Toolbar */}
                <Toolbar></Toolbar> {/* TODO: Hide new parameter here using props */}
            </header>
            <main>
                <h1>Parameter Page</h1>
                <p>Parameter ID: {id}</p>



            </main>

        </div>
    );
}