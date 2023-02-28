import React, { useEffect, useState } from "react";
import "./App.css";
import SearchField from "./components/SearchField";
import ParameterTable from "./components/ParameterTable";

const rows = [
  {
    id: 1,
    name: "Parameter 1",
    description: "Description for Parameter 1",
    unit: "meters",
    unit_description: "Length in meters",
    rigfamily: "Rig Family 1",
    rigfamily_description: "Description for Rig Family 1",
    decimals: 2,
    min: 0,
    max: 100,
    datatype: "float",
    modified_date: "2022-01-01",
    images: ["https://picsum.photos/200/300", "https://picsum.photos/300/300"],
  },
  {
    id: 2,
    name: "Parameter 2",
    description: "Description for Parameter 2",
    unit: "seconds",
    unit_description: "Time in seconds",
    rigfamily: "Rig Family 2",
    rigfamily_description: "Description for Rig Family 2",
    decimals: 0,
    min: 0,
    max: 60,
    datatype: "integer",
    modified_date: "2022-01-02",
    images: [],
  },
  {
    id: 3,
    name: "Parameter 3",
    description: "Description for Parameter 3",
    unit: "pascals",
    unit_description: "Pressure in pascals",
    rigfamily: "Rig Family 1",
    rigfamily_description: "Description for Rig Family 1",
    decimals: 2,
    min: 0,
    max: 1000,
    datatype: "float",
    modified_date: "2022-01-03",
    images: [],
  },
  {
    id: 4,
    name: "Parameter 3",
    description: "Description for Parameter 3",
    unit: "pascals",
    unit_description: "Pressure in pascals",
    rigfamily: "Rig Family 1",
    rigfamily_description: "Description for Rig Family 1",
    decimals: 2,
    min: 0,
    max: 1000,
    datatype: "float",
    modified_date: "2022-01-03",
    images: [],
  },
];

type dataModel = {
  id: number;
  name: string;
  description: string;
  datatype: string;
  decimals: number;
  min: number;
  max: number;
  creation_date: null;
  modified_date: string;
  comment: null;
  unit_name: string;
  unit_description: string;
  rigfamily_name: string;
  rigfamily_description: string;
  image_name: string;
  image_description: null;
  image_links: string;
  sensor_names: null;
  sensor_supplier: null;
  sensor_datasheet: null;
  sensor_link_to_calibration: null;
  sensor_type: null;
}[];

function App() {
  const [data, setData] = useState<dataModel>([]);

  useEffect(() => {
      fetch("http://10.222.15.227:3000/parameters")
        .then((response) => response.json())
        .then((data) => setData(data))
        .catch((error) => console.log(error))
        .finally(() => console.log("done"));

  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <SearchField
          id="ParameterSearch"
          data={Array.from(new Set(data.map((row) => row.name)))}
          placeholder="Parameter"
        />
        <SearchField
          id="DescriptionSearch"
          data={["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"]}
          placeholder="Description"
        />
        <SearchField
          id="UnitSearch"
          data={["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"]}
          placeholder="Unit"
        />
        <SearchField
          id="RigFamSearch"
          data={["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"]}
          placeholder="RIG_FAM"
        />
        <SearchField
          id="SensorSearch"
          data={["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"]}
          placeholder="Sensor"
        />
        <SearchField
          id="CommentSearch"
          data={["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"]}
          placeholder="Comment"
        />
      </header>
      <ParameterTable rows={rows} />
    </div>
  );
}

export default App;
