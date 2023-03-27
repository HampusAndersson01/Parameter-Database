import React, { useContext, useEffect, useRef, useState } from "react";
import "./style/ParameterTable.css";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandedData from "./ExpandedData";
import { DebugContext } from "../context/DebugContext";
import { EditModeContext } from "../context/EditModeContext";
import CachedIcon from '@mui/icons-material/Cached';
import { PendingReloadContext } from "../context/PendingReloadContext";

interface Image {
  image_url: string;
  image_name: string | null;
  image_description: string | null;
}
interface Possible_value {
  possible_value: string;
  possible_value_description: string | null;
}
export interface TableRowProps {
  id: number;
  name: string;
  description: string | null;
  unit_name: string | null;
  unit_description: string | null;
  rigfamily_name: string[];
  rigfamily_description: (string | null)[];
  decimals: number | null;
  min: number | null;
  max: number | null;
  datatype: string | null;
  created_by: string | null;
  modified_by: string | null;
  creation_date: string | null;
  modified_date: string | null;
  active?: boolean;
  images?: Image[] | null;
  comment: string | null;
  possible_values?: Possible_value[] | null;
}

function ParameterTable(props: {
  rows: TableRowProps[];
}) {
  const { debugMode } = useContext(DebugContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [allDataLoaded, setAllDataLoaded] = useState(false);

  const tableRef = useRef<HTMLTableElement>(null);
  const [isSticky, setIsSticky] = useState(false);

  const [expandedRows, setExpandedRows] = useState<number[]>([]);
  const { pendingReload, setPendingReload } = useContext(PendingReloadContext);


  // Load more data when the current page changes
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScroll = () => {
    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;

    // If user has scrolled to the bottom of the page and there is more data to load, update the current page
    if (scrollTop + clientHeight >= scrollHeight && !allDataLoaded) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    if (currentPage * rowsPerPage >= props.rows.length) {
      setAllDataLoaded(true);
    }
  }, [currentPage, rowsPerPage, props.rows.length]);

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

  const handleReload = () => {
    //TODO: Reload data/table
    if(!pendingReload){
      setPendingReload(true);
    }
  }

  return (
    <div className="Table-Container">
      <table ref={tableRef}>
        <thead className={isSticky ? "sticky" : ""}>
          <tr>
            <th id="TableIndex"><CachedIcon className={pendingReload ? "reloadButton reloading" : "reloadButton"} onClick={handleReload}></CachedIcon></th>
            <th id="TableName">Name</th>
            <th id="TableDescription">Description</th>
            <th id="TableUnit">Unit</th>
            <th id="TableRig">Rig Family</th>
            <th id="TableDecimals">Decimals</th>
            <th id="TableMin">Min</th>
            <th id="TableMax">Max</th>
            <th id="TableDataType">Datatype</th>
          </tr>
        </thead>
        <tbody>
          {props.rows.slice(0, currentPage * rowsPerPage).map((row) => (
            <>
              <tr
                key={row.id}
                onClick={(event) => HandleClickParameter(event, row.id)}
              >
                <td className={expandedRows.includes(row.id) ? "tableArrow expanded" : "tableArrow"}>
                  <ExpandMoreIcon></ExpandMoreIcon>
                </td>
                <td>
                  {debugMode ? row.id + ": " : <></>}
                  {row.name}
                </td>
                <td>{row.description}</td>
                <td>{row.unit_name}</td>
                <td>{row.rigfamily_name.join(", ")}</td>
                <td>{row.decimals}</td>
                <td>{row.min}</td>
                <td>{row.max}</td>
                <td>{row.datatype}</td>
              </tr>
              <ExpandedData
                row={row}
                isExpanded={expandedRows.includes(row.id)}
              ></ExpandedData>
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export default ParameterTable;
