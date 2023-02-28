import React, { useState } from "react";
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

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <SearchField
          id="ParameterSearch"
          data={["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"]}
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
