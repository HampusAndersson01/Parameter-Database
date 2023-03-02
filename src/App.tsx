import React, { useEffect, useState } from "react";
import "./App.css";
import SearchField from "./components/SearchField";
import ParameterTable,{TableRowProps} from "./components/ParameterTable";

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
  const [rows, setRows] = useState<TableRowProps[]>([]);

  useEffect(() => {
      fetch("http://10.222.15.227:3000/parameters")
        .then((response) => response.json())
        .then((data) => setData(data))
        .catch((error) => console.log(error))
        .finally(() => console.log("data loaded"));
     

  }, []);

  function updateRows(data : dataModel) {
    if (data.length === 0) {
      console.log("no data");
      return [];
    }
    const rowsTemp = data.map((row) => {
      const imageArray = [];
      if (row.image_urls) {
        const urls = row.image_urls.split(";");
        const names = row.image_name ? row.image_name.split(";") : Array(urls.length).fill(null);
        var descriptions = row.image_description !== undefined && row.image_description !== null ? row.image_description.split(";") : Array(urls.length).fill(null);

        for (let i = 0; i < urls.length; i++) {
          imageArray.push({
            image_url: urls[i],
            image_name: names[i],
            image_description: descriptions[i] || null,
          });
        }
      }
      return {
        ...row,
        images: imageArray,
      };
    });
    console.log(rowsTemp);
    return rowsTemp;
    
  }
  

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
          data={Array.from(new Set(data.map((row) => row.description)))}
          placeholder="Description"
        />
        <SearchField
          id="UnitSearch"
          data={Array.from(new Set(data.map((row) => row.unit_name)))}
          placeholder="Unit"
        />
        <SearchField
          id="RigFamSearch"
          data={Array.from(new Set(data.map((row) => row.rigfamily_name)))}
          placeholder="RIG_FAM"
        />
        <SearchField
          id="CommentSearch"
          data={Array.from(new Set(data.map((row) => row.comment).filter((name) => name != null))) as unknown as string[]}
          placeholder="Comment"
        />
      </header>
      <ParameterTable rows={updateRows(data) as dataModel} />
    </div>
  );
}

export default App;
