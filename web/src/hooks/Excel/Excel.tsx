/**
 * @file Excel.tsx
 * 
 * @module Hooks/Excel
 * 
 * @description
 * Provides the excel to json conversion.
 */
import React, { useState } from "react";
import { read, readFile, utils, writeFile } from 'xlsx';
import { NewParameter, RigFamily, TableRowProps } from "../../models/Parameters";

/**
 * @function useExcelToJson
 * 
 * @description
 * Provides the excel to json conversion.
 * 
 * @returns {object} jsonData - The json data from the excel file.
 */
export const useExcelToJson = () => {
    const [jsonData, setJsonData] = useState<any>();

    const convertToJson = (file: any) => {
        const reader = new FileReader();
        reader.readAsBinaryString(file);
        reader.onload = (event) => {
            const workbook = read(reader.result, { type: 'binary' });
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const data = utils.sheet_to_json(worksheet, { header: 1 });
            setJsonData(data)
        };
        reader.onerror = () => {
            console.error('Error occurred while reading the file.');
        };
    };
    return { jsonData, convertToJson };
};

/**
 * @function JsonToParameters
 * 
 * @description
 * Converts the json data to TableRowProps.
 * 
 * @param {object} jsonData - The json data from the excel file.
 * 
 * @returns {object} parameters - The TableRowProps.
 */
export const JsonToParameters = (jsonData: any) => {
    // Convert the json data to TableRowProps
    const parameters: NewParameter[] = [];
    if (jsonData === undefined) {
        return parameters;
    }
    jsonData.forEach((row: any, index: number) => {
        if (index === 0) {
            // Skip the header
            return;
        } else {
            const parameter: NewParameter = {
                name: row[0],
                description: row[1],
                datatype: row[2],
                decimals: row[3],
                min: row[4],
                max: row[5],
                comment: row[6],
                unit: {
                    name: row[7] || null,
                },

                rigfamily: {
                    name: row[8] || null,
                },
                images: {
                    name: row[9] || null,
                    description: row[10] || null,
                    url: row[11] || null,
                },
                possible_values: {
                    value: row[12] || null,
                    description: row[13] || null,
                },
                created_by: "admin", //TODO: Change to logged in user
                modified_by: "admin", //TODO: Change to logged in user
                creation_date: new Date().toISOString().split("T")[0],
                modified_date: new Date().toISOString().split("T")[0],
            };
            parameters.push(parameter);
        }
    });
    return parameters;
}

/**
 * @function idsToExcel
 * 
 * @description
 * Converts the ids to excel file.
 * 
 * @param {number[]} ids - The ids of the parameters.
 * @param {object[]} parameters - The TableRowProps.
 * 
 * @returns {object} excel file - The excel file.
 */
export const idsToExcel = (ids: number[], parameters: TableRowProps[]) => {
    // Convert the ids to json data
    const data = [];
    data.push([
        "name",
        "description",
        "datatype",
        "decimals",
        "min",
        "max",
        "comment",
        "unit_name",
        "rigfamily_name",
        "image_name",
        "image_description",
        "image_urls",
        "possible_values",
        "possible_values_description"
    ]);
    ids.forEach((id: number) => {
        //Find parameter with matching id
        const parameter = parameters.find((parameter: TableRowProps) => parameter.id === id);
        if (parameter === undefined) {
            return;
        }
        data.push([
            parameter.name,
            parameter.description,
            parameter.datatype,
            parameter.decimals,
            parameter.min,
            parameter.max,
            parameter.comment,
            parameter.unit.name,
            parameter.rigFamily.map((rigfamily: RigFamily) => rigfamily.name).join(";"),
            parameter.images?.map((image: any) => image.name).join(";"),
            parameter.images?.map((image: any) => image.description).join(";"),
            parameter.images?.map((image: any) => image.url).join(";"),
            parameter.possible_values?.map((possible_value: any) => possible_value.value).join(";"),
            parameter.possible_values?.map((possible_value: any) => possible_value.description).join(";"),
        ]);
    });
    const wb = utils.book_new();
    const ws = utils.json_to_sheet(data);
    utils.book_append_sheet(wb, ws, 'Parameters');
    writeFile(wb, 'Exported Parameters.xlsx');
}