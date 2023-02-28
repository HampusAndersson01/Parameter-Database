import React, { useEffect, useState } from "react";
import "./ParameterTable.css";
import { createComponent } from "@lit-labs/react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

type TableRowProps = {
  id: number;
  name: string;
  description: string;
  unit: string;
  unit_description: string;
  rigfamily: string;
  rigfamily_description: string;
  decimals: number;
  min: number;
  max: number;
  datatype: string;
  modified_date: string;
  active?: boolean;
  images: string[];
};
interface ImageState {
  [key: number]: number;
  
}


function ParameterTable(props: { rows: TableRowProps[] }) {
  const [expandedRows, setExpandedRows] = useState<number[]>([]);
  const [currentImage, setCurrentImage] = useState<ImageState>({});

  const HandleClickParameter = (event: any, id: number) => {
    console.log(currentImage)
    const isExpanded = expandedRows.includes(id);
    if (isExpanded) {
      setExpandedRows(expandedRows.filter((rowId) => rowId !== id));
    } else {
      setExpandedRows([...expandedRows, id]);
    }
    if (event.target.parentElement.tagName === "TR") {
      event.target.parentElement.classList.toggle("Active-Row");
    } else {
      event.target.parentElement.parentElement.classList.toggle("Active-Row");
    }
  };

  const HandlePrevButton = (event: any, id: number) => {
    // decrease this id currentImage
    if (currentImage[id] != 0) {
      if (currentImage[id] - 1 == 0) {
        event.target.classList.toggle("Disabled-Button")
      }
      setCurrentImage((prevState) => ({
        ...prevState,
        [id]: prevState[id] - 1,
    }));
    
    
    }
  };
  const HandleNextButton = (event: any, id: number, length: number) => {
    // increase this id currentImage
    if (currentImage[id] != length - 1) {
      setCurrentImage((prevState) => ({
        ...prevState,
        [id]: prevState[id] + 1,
      }));
    }
  };

  useEffect(() => {
    const rowLength = props.rows.length;
    for (let i = 0; i < rowLength; i++) {
      setCurrentImage((prevState) => ({
        ...prevState,
        [props.rows[i].id]: 0,
      }));
    }
  }, [props.rows]);

  return (
    <div className="Table-Container">
      <table>
        <thead>
          <tr>
            <th></th>
            <th>Name</th>
            <th>Description</th>
            <th>Unit</th>
            <th>Unit Description</th>
            <th>Rig Family</th>
            <th>Rig Family Description</th>
            <th>Decimals</th>
            <th>Min</th>
            <th>Max</th>
            <th>Datatype</th>
            <th>Modified Date</th>
          </tr>
        </thead>
        <tbody>
          {props.rows.map((row) => (
            <>
              <tr
                key={row.id}
                onClick={(event) => HandleClickParameter(event, row.id)}
              >
                <td className="Table-Arrow">
                  <ExpandMoreIcon></ExpandMoreIcon>
                </td>
                <td>{row.name}</td>
                <td>{row.description}</td>
                <td>{row.unit}</td>
                <td>{row.unit_description}</td>
                <td>{row.rigfamily}</td>
                <td>{row.rigfamily_description}</td>
                <td>{row.decimals}</td>
                <td>{row.min}</td>
                <td>{row.max}</td>
                <td>{row.datatype}</td>
                <td>{row.modified_date}</td>
              </tr>

              <tr
                key={row.id + "expandable"}
                className={
                  expandedRows.includes(row.id)
                    ? "Expandable-Row Active-Row"
                    : "Expandable-Row"
                }
              >
                <td colSpan={12}>
                  <div className="Expandable-Area">
                    <div className="Images-Container">
                      
                        
                        { 

                            <img className="Image" src={row.images[currentImage[row.id]]}></img>
                        
                        }
                      
                      
                      <button className="Image-ButtonLeft" onClick={(event) => HandlePrevButton(event, row.id)}><ArrowBackIcon></ArrowBackIcon></button>
                      <button className="Image-ButtonRight" onClick={(event) => HandleNextButton(event, row.id, row.images.length)}><ArrowForwardIcon></ArrowForwardIcon></button>
                    
                    </div>
                  </div>
                </td>
              </tr>
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export default ParameterTable;
