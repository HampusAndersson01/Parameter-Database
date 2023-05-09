import React, { useContext, useEffect } from "react";
import { useExcelToJson, JsonToParameters } from "../hooks/Excel/Excel";
import { ImportingParametersContext } from "../context/CreatingParameterContext";
import "./style/ExcelImport.css";
import { NewParameter } from "../models/Parameters";
import { APIContext } from "../context/APIContext";
import CloseIcon from "@mui/icons-material/Close";
import { DownloadButton } from "./subComponents/DownloadButton/DownloadButton";
import { UploadButton } from "./subComponents/UploadButton/DownloadButton/UploadButton";
import { PendingReloadContext } from "../context/PendingReloadContext";

export default function ExcelImport() {
    const { importingParameters, setImportingParameters } = useContext(ImportingParametersContext);
    const excelData = useExcelToJson();
    const { jsonData, convertToJson } = excelData;
    const [parameters, setParameters] = React.useState<NewParameter[]>([]);
    const { hostname } = useContext(APIContext);
    const { setPendingReload } = useContext(PendingReloadContext);

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

        //Reset File upload control
        event.target.value = null;

        //Close the dialog
        handleClose();

        //Reload data from server after 200ms
        setTimeout(() => {
            setPendingReload(true);
        }, 200);

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

    function handleKeyPress(event: KeyboardEvent) {
        if (event.key === "Escape") {
            handleClose();
        }
    }
    document.addEventListener("keydown", handleKeyPress);

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
        <div className={importingParameters ? "importExcelOverlay active" : "importExcelOverlay"} >
            <div className="importExcelContainer">
                <CloseIcon
                    onClick={handleClose}
                    className="closeButton"
                >
                    X
                </CloseIcon>
                <h1>Excel Import</h1>
                <UploadButton text="Upload Excel file" className="uploadButton" onChange={handleFileUpload} />
                <DownloadButton text="Download Template" className="downloadButton" file="Template.xlsx" />
            </div>
        </div>
    );
}
