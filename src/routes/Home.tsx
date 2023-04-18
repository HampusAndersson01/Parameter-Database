import React, { useEffect, useState, useContext } from "react";
import "./style/Home.css";
import ParameterTable from "../components/ParameterTable";
import { TableRowProps, RigFamily, Unit, Image, Possible_value } from "../models/Parameters";
import Toolbar from "../components/Toolbar";
import ParameterForm from "../components/ParameterForm";

import { DebugContext } from "../context/DebugContext";
import { EditModeContext } from "../context/EditModeContext";
import { DataContext } from "../context/DataContext";
import { APIContext } from "../context/APIContext";
import { CreatingParameterContext } from "../context/CreatingParameterContext";
import { unitModel } from "../models/Unit";
import { datatypeModel } from "../models/Datatype";
import { PendingReloadContext } from "../context/PendingReloadContext";
import { stringToDate } from "../hooks/ConvertParameters/ConvertParameters";

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
  possible_values: string | null;
  possible_values_description: string | null;
}[];

function Home() {
  const [data, setData] = useState<dataModel>([]);
  const [debugMode, setDebugMode] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [rigFamilies, setRigFamilies] = useState<RigFamily[]>([]);
  const [units, setUnits] = useState<unitModel>([]);
  const [dataTypes, setDataTypes] = useState<datatypeModel>([]);
  const { hostname } = useContext(APIContext);
  const [creatingParameter, setCreatingParameter] = useState<boolean>(false);

  const [clearAll, setClearAll] = useState<boolean>(false);

  const [pendingReload, setPendingReload] = useState<boolean>(true);



  useEffect(() => {
    if (pendingReload) {
      fetch(hostname + "parameters")
        .then((response) => response.json())
        .then((data) => setData(data))
        .catch((error) => console.log(error))
        .finally(() => console.log("parameters loaded", data.length));

      fetch(hostname + "rigfamilies")
        .then((response) => response.json())
        .then((data) => setRigFamilies(data))
        .catch((error) => console.log(error))
        .finally(() => console.log("rigfamilies loaded"));

      fetch(hostname + "units")
        .then((response) => response.json())
        .then((data) => setUnits(data))
        .catch((error) => console.log(error))
        .finally(() => console.log("units loaded"));
    }
  }, [pendingReload]);

  useEffect(() => {
    // Set the data types from the data unique values
    const dataTypes = data
      .map((row) => row.datatype)
      .filter((value, index, self) => self.indexOf(value) === index);
    setDataTypes(dataTypes);

    if (pendingReload) {
      setPendingReload(false);
    }
  }, [data]);


  function updateRows(data: dataModel): TableRowProps[] {
    return data.map((row) => {
      const imageArray: Image[] = [];
      const possibleValuesArray: Possible_value[] = [];
      const rigFamilyArray: RigFamily[] = [];
      // Split the image urls and names into an array of objects
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
      // Split the possible values and descriptions into an array of objects
      if (row.possible_values) {
        const values = row.possible_values.split(";");
        const descriptions =
          row.possible_values_description !== undefined &&
            row.possible_values_description !== null
            ? row.possible_values_description.split(";")
            : Array(values.length).fill(null);

        for (let i = 0; i < values.length; i++) {
          // console.log(values[i], descriptions[i]);
          possibleValuesArray.push({
            value: values[i],
            description: descriptions[i],
          });
        }
      }

      // Split the rig family names and descriptions into an array of objects
      // Convert to RigFamily[]
      if (row.rigfamily_name) {
        const names = row.rigfamily_name.split(";");
        const descriptions =
          row.rigfamily_description !== undefined &&
            row.rigfamily_description !== null
            ? row.rigfamily_description.split(";")
            : Array(names.length).fill(null);

        for (let i = 0; i < names.length; i++) {
          rigFamilyArray.push({
            name: names[i],
            description: descriptions[i],
          });
        }
      }

      //Make unit object from unit_name and unit_description
      const unit: Unit = {
        name: row.unit_name ? row.unit_name : "",
        description: row.unit_description,
      };

      return {
        ...row,
        unit: unit,
        rigFamily: rigFamilyArray,
        images: imageArray,
        possible_values: possibleValuesArray,
        modified_date: stringToDate(row.modified_date),
        creation_date: stringToDate(row.creation_date),
      };
    });
  }


  return (
    <DebugContext.Provider value={{ debugMode, setDebugMode }}>
      <EditModeContext.Provider
        value={{ editMode, setEditMode, clearAll, setClearAll }}
      >
        <PendingReloadContext.Provider
          value={{ pendingReload, setPendingReload }}
        >
          <DataContext.Provider
            value={{
              rigFamilies,
              setRigFamilies,
              units,
              setUnits,
              dataTypes,
              setDataTypes,
            }}
          >
            <APIContext.Provider value={{ hostname }}>
              <CreatingParameterContext.Provider
                value={{ creatingParameter, setCreatingParameter }}
              >
                <div className="App">
                  <header className="App-header">
                    {/* Toolbar */}
                    <Toolbar></Toolbar>
                  </header>
                  <ParameterTable data={updateRows(data)} />
                  <ParameterForm
                    data={updateRows(data)}
                  ></ParameterForm>
                </div>
              </CreatingParameterContext.Provider>
            </APIContext.Provider>
          </DataContext.Provider>
        </PendingReloadContext.Provider>
      </EditModeContext.Provider>
    </DebugContext.Provider>
  );
}


export default Home;
