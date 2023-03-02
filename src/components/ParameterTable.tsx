import React, { useEffect, useState } from "react";
import "./ParameterTable.css";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { FixedSizeList } from "react-window";

export interface TableRowProps {
  id: number;
  name: string;
  description: string | null;
  unit_name: string | null;
  unit_description: string | null;
  rigfamily_name: string | null;
  rigfamily_description: string | null;
  decimals: number | null;
  min: number | null;
  max: number | null;
  datatype: string | null;
  created_by: string | null;
  modified_by: string | null;
  creation_date: string | null;
  modified_date: string | null;
  active?: boolean;
  images?: string[] | null;
  comment: string | null;
  }
interface ImageState {
  [key: number]: number;
}


function ParameterTable(props: { rows: TableRowProps[] }) {
  const [expandedRows, setExpandedRows] = useState<number[]>([]);
  const [currentImage, setCurrentImage] = useState<ImageState>({});

  console.log(props.rows);
    

  const HandleClickParameter = (event: any, id: number) => {
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
    <React.Fragment key={row.id}>
      <tr
        key={row.id}
        onClick={(event) => HandleClickParameter(event, row.id)}
      >
        <td className="Table-Arrow">
          <ExpandMoreIcon />
        </td>
        <td>{row.name}</td>
        <td>{row.description}</td>
        <td>{row.unit_name}</td>
        <td>{row.unit_description}</td>
        <td>{row.rigfamily_name}</td>
        <td>{row.rigfamily_description}</td>
        <td>{row.decimals}</td>
        <td>{row.min}</td>
        <td>{row.max}</td>
        <td>{row.datatype}</td>
        <td>{row.modified_date}</td>
      </tr>

      {expandedRows.includes(row.id) && (
        <tr
          key={row.id + "expandable"}
          className="Expandable-Row Active-Row"
        >
          <td colSpan={12}>
            <div className="Expandable-Area">
              <div className="Images-Container">
                {row.images && (
                  <>
                    <img
                      className="Image"
                      src={row.images[currentImage[row.id]]}
                      alt=""
                    />
                    <legend>
                      {currentImage[row.id] + 1}/{row.images.length}
                    </legend>
                    <button
                      className="Image-Button Image-ButtonLeft"
                      onClick={(event) => HandlePrevButton(event, row.id)}
                    >
                      <ArrowBackIcon />
                    </button>
                    <button
                      className="Image-Button Image-ButtonRight"
                      onClick={(event) =>
                        HandleNextButton(
                          event,
                          row.id,
                          row.images ? row.images.length : 0
                        )
                      }
                    >
                      <ArrowForwardIcon />
                    </button>
                  </>
                )}
              </div>
            </div>
          </td>
        </tr>
      )}
    </React.Fragment>
  ))}
</tbody>
      </table>
    </div>
  );
}
export default ParameterTable;
