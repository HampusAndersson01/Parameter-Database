import React, { useEffect, useState, useContext } from "react";
import "./App.css";
import SearchField from "./components/SearchField";
import ParameterTable, { TableRowProps } from "./components/ParameterTable";
import Toolbar from "./components/Toolbar";
import ParameterForm from "./components/ParameterForm";

import { DebugContext } from "./context/DebugContext";
import { EditModeContext } from "./context/EditModeContext";
import { DataContext } from "./context/DataContext";
import { rigFamilyModel } from "./models/RigFamily";
import { APIContext } from "./context/ApiContext";
import { CreatingParameterContext } from "./context/CreatingParameterContext";
import { unitModel } from "./models/Unit";
import { datatypeModel } from "./models/Datatype";


type dataModel = {
  id: number;
  name: string;
  description: string | null;
  datatype: string | null;
  decimals: number | null;
  min: number | null;
  max: number | null;
  creation_date: null | string;
  modified_date: string | null;
  created_by: string | null;
  modified_by: string | null;
  comment: null | string;
  unit_name: string | null;
  unit_description: string | null;
  rigfamily_name: string | null;
  rigfamily_description: string | null;
  image_name: string | null;
  image_description: string | null;
  image_urls: string | null;
}[];


function App() {
  const [data, setData] = useState<dataModel>([]);
  const [filteredData, setFilteredData] = useState<dataModel>([]);
  const [debugMode, setDebugMode] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [rigFamilies, setRigFamilies] = useState<rigFamilyModel>([]);
  const [units, setUnits] = useState<unitModel>([]);
  const [dataTypes, setDataTypes] = useState<datatypeModel>([]);
  const { hostname } = useContext(APIContext);
  const [creatingParameter, setCreatingParameter] = useState<boolean>(true);


  // variable to store the search strings for the different fields
  const [searchStrings, setSearchStrings] = useState<{ [key: string]: string }>(
    {}
  );

  useEffect(() => {
    fetch(hostname+"parameters")
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.log(error))
      .finally(() => console.log("parameters loaded"));

    fetch(hostname+"rigfamilies")
      .then((response) => response.json())
      .then((data) => setRigFamilies(data))
      .catch((error) => console.log(error))
      .finally(() => console.log("rigfamilies loaded"));

    fetch(hostname+"units")
      .then((response) => response.json())
      .then((data) => setUnits(data))
      .catch((error) => console.log(error))
      .finally(() => console.log("units loaded"));
  }, []);

  useEffect(() => {
    // Set the data types from the data unique values
    const dataTypes = data
      .map((row) => row.datatype)
      .filter((value, index, self) => self.indexOf(value) === index);
    setDataTypes(dataTypes);


    // Update the filtered data when the data changes
    setFilteredData(filterData((data)));
  }, [data]);

  function updateRows(data: dataModel): TableRowProps[] {
    return data.map((row) => {
      const imageArray = [];
      var rigfamily_name: string[] = [];
      var rigfamily_description: string[] = []
      if (row.image_urls) {
        const urls = row.image_urls.split(";");
        const names = row.image_name
          ? row.image_name.split(";")
          : Array(urls.length).fill(null);
        var descriptions =
          row.image_description !== undefined && row.image_description !== null
            ? row.image_description.split(";")
            : Array(urls.length).fill(null);

        for (let i = 0; i < urls.length; i++) {
          imageArray.push({
            image_url: urls[i],
            image_name: names[i],
            image_description: descriptions[i],
          });
        }
      }
      if(row.rigfamily_name){
        rigfamily_name = row.rigfamily_name.split(";");
        rigfamily_description = row.rigfamily_description
          ? row.rigfamily_description.split(";")
          : Array(rigfamily_name.length).fill("");
      }
      return {
        ...row,
        rigfamily_name,
        rigfamily_description,
        images: imageArray,
      };
    });
  }

  

  function filterData(data: dataModel) {
    return data.filter((row) => {
      if (Object.keys(searchStrings).length === 0) {
        return false;
      }
      // Iterate over the search strings and check if the row includes all of them
      return Object.entries(searchStrings).every(([field, value]) => {
        if (!value) {
          return true;
        }

        switch (field) {
          case "parameter":
            return row.name.toLowerCase().includes(value.toLowerCase());

          case "description":
            return row.description
              ? row.description.toLowerCase().includes(value.toLowerCase())
              : false;

          case "unit":
            return row.unit_name
              ? row.unit_name.toLowerCase().includes(value.toLowerCase())
              : false;

          case "RIG_FAM":
            return row.rigfamily_name
              ? row.rigfamily_name.toLowerCase().includes(value.toLowerCase())
              : false;

          case "comment":
            return row.comment
              ? row.comment.toLowerCase().includes(value.toLowerCase())
              : false;

          default:
            return true;
        }
      });
    });
  }

  function handleValueChange(value: string, field: string) {
    setSearchStrings({ ...searchStrings, [field]: value });
  }
  function handleSearch() {
    setFilteredData(filterData(data));
  }

  return (
    <DebugContext.Provider value={{ debugMode, setDebugMode}}>
      <EditModeContext.Provider value={{ editMode, setEditMode}}>
        <DataContext.Provider value={{ rigFamilies, setRigFamilies , units, setUnits, dataTypes, setDataTypes}}>
          <APIContext.Provider value={{ hostname}}>
            <CreatingParameterContext.Provider value={{ creatingParameter, setCreatingParameter}}>
      <div className="App">
        <header className="App-header">
          {/* Toolbar */}
          <Toolbar></Toolbar>

          <SearchField
            id="ParameterSearch"
            data={Array.from(new Set(data.map((row) => row.name)))}
            placeholder="Parameter"
            onChange={(value: any) => {
              handleValueChange(value, "parameter");
            }}
          />
          <SearchField
            id="DescriptionSearch"
            data={Array.from(new Set(data.map((row) => row.description)))}
            placeholder="Description"
            onChange={(value: any) => {
              handleValueChange(value, "description");
            }}
          />
          <SearchField
            id="UnitSearch"
            data={Array.from(new Set(data.map((row) => row.unit_name)))}
            placeholder="Unit"
            onChange={(value: any) => {
              handleValueChange(value, "unit");
            }}
          />
          <SearchField
            id="RigFamSearch"
            data={rigFamilies.map((row) => row.name)}
            placeholder="RIG_FAM"
            onChange={(value: any) => {
              handleValueChange(value, "RIG_FAM");
            }}
          />
          <SearchField
            id="CommentSearch"
            data={
              Array.from(
                new Set(
                  data.map((row) => row.comment).filter((name) => name != null)
                )
              ) as unknown as string[]
            }
            placeholder="Comment"
            onChange={(value: any) => {
              handleValueChange(value, "comment");
            }}
          />
          <button id="searchButton" onClick={handleSearch}>
            Search
          </button>
        </header>
        <ParameterTable rows={updateRows(filteredData)} />
        <ParameterForm data={updateRows(filteredData)}></ParameterForm>
      </div>
      </CreatingParameterContext.Provider>
      </APIContext.Provider>
      </DataContext.Provider>
      </EditModeContext.Provider>
    </DebugContext.Provider>
  );
}

export default App;
