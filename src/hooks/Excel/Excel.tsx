import React, { useState } from "react";
import { read, readFile, utils } from 'xlsx';

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
