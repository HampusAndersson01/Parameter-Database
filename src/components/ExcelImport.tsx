import React, { useContext, useEffect } from "react";
import { useExcelToJson, JsonToParameters } from "../hooks/Excel/Excel";
import { ImportingParametersContext } from "../context/CreatingParameterContext";
import "./style/ExcelImport.css";
import { NewParameter } from "../models/Parameters";
import { APIContext } from "../context/APIContext";

export default function ExcelImport() {
    const { importingParameters, setImportingParameters } = useContext(ImportingParametersContext);
    const excelData = useExcelToJson();
    const { jsonData, convertToJson } = excelData;
    const [parameters, setParameters] = React.useState<NewParameter[]>([]);
    const { hostname } = useContext(APIContext);

    const handleFileUpload = (event: any) => {
        //Loop through all the selected files

        for (let i = 0; i < event.target.files.length; i++) {
            //Validate whether File is valid Excel file.
            const file = event.target.files[i];
            if (!file) {
                console.error('No file selected.');
                continue;
            }
            if (!file.name.match(/.(xls|xlsx|csv)$/i)) {
                console.error('Selected file is not a valid Excel file.');
                continue;
            }
            convertToJson(file);
        }


    }

    const postParameters = () => {
        console.log("Post parameters", parameters);
        fetch(hostname + "parameters", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(parameters),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("Success:", data);
                setParameters([]);
            }
            )
            .catch((error) => {
                console.error("Error:", error);
            }
            );

    }

    const handleClose = () => {
        setImportingParameters(false);
        console.log("Close");
    }

    useEffect(() => {
        setParameters(JsonToParameters(jsonData));
    }, [jsonData]);

    useEffect(() => {
        if (parameters.length > 0) {
            postParameters();
        }
    }, [parameters]);


    return (
        <div className={importingParameters ? "importExcelOverlay active" : "importExcelOverlay"} onClick={handleClose}>
            <div className="importExcelContainer">
                <button className="closeButton" onClick={handleClose}>X</button>

                <h1>Excel Import</h1>
                <input type="file" accept=".xlsx, .xls, .csv" onChange={handleFileUpload} />

                <a href="%PUBLIC_URL%/Template.xlsx" download>Download Excel Import Template</a>
            </div>
        </div>
    );
}
