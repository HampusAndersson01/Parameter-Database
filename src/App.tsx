import React, { useEffect, useState } from "react";
import "./App.css";
import SearchField from "./components/SearchField";
import ParameterTable, {TableRowProps}from "./components/ParameterTable";
import Toolbar from "./components/Toolbar";



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
  const [searchString, setSearchString] = useState<string>("");
  const [searchField, setSearchField] = useState<string>("");

  useEffect(() => {
      fetch("http://localhost:3000/parameters")
        .then((response) => response.json())
        .then((data) => setData(data))
        .catch((error) => console.log(error))
        .finally(() => console.log("data loaded"));
     

  }, []);

  useEffect(() => {
    setFilteredData(filterData(data));
  }, [data]);

  function updateRows(data: dataModel): TableRowProps[] {
    return data.map((row) => {
      const imageArray = [];
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
      return {
        ...row,
        images: imageArray,
      };
    });
  }
  
  function filterData(data: dataModel) {
    return data.filter((row) => {
      if (searchString === "") {
        return true;
      }
      switch (searchField) {
        case "parameter":
          return row.name.toLowerCase().includes(searchString.toLowerCase());
        case "description":
          return row.description ? row.description.toLowerCase().includes(searchString.toLowerCase()) : false;
        case "unit":
          return row.unit_name ? row.unit_name.toLowerCase().includes(searchString.toLowerCase()) : false;
        case "RIG_FAM":
          return row.rigfamily_name ? row.rigfamily_name.toLowerCase().includes(searchString.toLowerCase()) : false;
        case "comment":
          return row.comment ? row.comment.toLowerCase().includes(searchString.toLowerCase()) : false;
        default:
          return true;
      }
    }
    );
  }
  function handleSearch(value: string,field: string) {
    setSearchString(value);
    setSearchField(field);
    console.log(value, field);
  }

  useEffect(() => {
    setFilteredData(filterData(data));
  }, [searchString, searchField]);


  return (
    <div className="App">
      <header className="App-header">
        {/* Toolbar */}
        <Toolbar></Toolbar>
      
        <SearchField
          id="ParameterSearch"
          data={Array.from(new Set(data.map((row) => row.name)))}
          placeholder="Parameter"
          onSearch={(searchString: string) =>  handleSearch(searchString, "parameter")}
        />
        <SearchField
          id="DescriptionSearch"
          data={Array.from(new Set(data.map((row) => row.description)))}
          placeholder="Description"
          onSearch={(searchString: string) =>  handleSearch(searchString, "description")}
        />
        <SearchField
          id="UnitSearch"
          data={Array.from(new Set(data.map((row) => row.unit_name)))}
          placeholder="Unit"
          onSearch={(searchString: string) =>  handleSearch(searchString, "unit")}
        />
        <SearchField
          id="RigFamSearch"
          data={Array.from(new Set(data.map((row) => row.rigfamily_name)))}
          placeholder="RIG_FAM"
          onSearch={(searchString: string) =>  handleSearch(searchString, "RIG_FAM")}
        />
        <SearchField
          id="CommentSearch"
          data={
            (Array.from(
              new Set(
                data.map((row) => row.comment).filter((name) => name != null)
              )
            ) as unknown) as string[]
          }
          placeholder="Comment"
          onSearch={(searchString: string) =>  handleSearch(searchString, "comment")}
        />
      </header>
      <ParameterTable rows={updateRows(filteredData)} />
    </div>
  );
}

export default App;
