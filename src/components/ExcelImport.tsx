import React, { useContext } from "react";
import { useExcelToJson } from "../hooks/Excel/Excel";
import { ImportingParametersContext } from "../context/CreatingParameterContext";
import "./style/ExcelImport.css";

export default function ExcelImport() {
    const { importingParameters, setImportingParameters } = useContext(ImportingParametersContext);
    const [jsonData, convertToJson] = useExcelToJson();

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
            convertToJson(file)
            console.log("Json", jsonData);
        }

    }
    return (
        <div className={importingParameters ? "importExcelOverlay active" : "importExcelOverlay"} onClick={() => setImportingParameters(false)}>
            <div className="importExcelContainer">

                <h1>Excel Import</h1>
                <input type="file" accept=".xlsx, .xls, .csv" onChange={handleFileUpload} />

                <a href="/public/Template.xlsx" download>Download Excel Import Template</a>
            </div>
        </div>
    );
}
