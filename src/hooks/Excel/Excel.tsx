import React, { useState } from "react";
import { read, readFile, utils } from 'xlsx';
import { NewParameter } from "../../models/Parameters";

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
            // [
            //     [
            //         "name",
            //         "description",
            //         "datatype",
            //         "decimals",
            //         "min",
            //         "max",
            //         "comment",
            //         "unit_name",
            //         "rigfamily_name",
            //         "image_name",
            //         "image_description",
            //         "image_urls",
            //         "possible_values",
            //         "possible_values_description"
            //     ],
            // ]
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