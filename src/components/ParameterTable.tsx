import React, { useEffect, useRef, useState } from "react";
import "./ParameterTable.css";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { FixedSizeList } from "react-window";
import { table } from "console";


interface Image {
  image_url: string;
  image_name: string | null;
  image_description: string | null;
}
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
  images?: Image[] | null;
  comment: string | null;
  }
interface ImageState {
  [key: number]: number;
}


function ParameterTable(props: { rows: TableRowProps[] }) {
  const [expandedRows, setExpandedRows] = useState<number[]>([]);
  const [currentImage, setCurrentImage] = useState<ImageState>({});

  // settCurrentImage on data load
  useEffect(() => {
    const newCurrentImage: ImageState = {};
    props.rows.forEach((row) => {
      if (row.images) {
        newCurrentImage[row.id] = 0;
      }
    });
    setCurrentImage(newCurrentImage);
  }, [props.rows]);


  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [allDataLoaded, setAllDataLoaded] = useState(false);

  const tableRef = useRef<HTMLTableElement>(null);
  const [isSticky, setIsSticky] = useState(false);

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
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const top = tableRef.current ? tableRef.current.getBoundingClientRect().top : 0;
      setIsSticky(top < 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="Table-Container">
      <table ref={tableRef}>
        <thead className={isSticky ? "sticky" : ""}>
          <tr>
            <th>{props.rows.length}</th>
            <th id="TableName">Name</th>
            <th id="TableDescription">Description</th>
            <th id="TableUnit">Unit</th>
            <th id="TableRig">Rig Family</th>
            <th id="TableDecimals">Decimals</th>
            <th id="TableMin">Min</th>
            <th id="TableMax">Max</th>
            <th id="TableDataType">Datatype</th>
          </tr>
        </thead >
        <tbody>
          {props.rows.slice(0, currentPage * rowsPerPage).map((row) => (
            <>
              <tr
                key={row.id}
                onClick={(event) => HandleClickParameter(event, row.id)}
              >
                <td className="Table-Arrow">
                  <ExpandMoreIcon></ExpandMoreIcon>
                </td>
                <td className="">{row.name}</td>
                <td>{row.description}</td>
                <td>{row.unit_name}</td>
                <td>{row.rigfamily_name}</td>
                <td>{row.decimals}</td>
                <td>{row.min}</td>
                <td>{row.max}</td>
                <td>{row.datatype}</td>
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
                      {row.images &&
                        row.images.length > 0 && (
                          <img
                            src={row.images[currentImage[row.id]] ? row.images[currentImage[row.id]].image_url : ""}
                            alt="error"
                          />
                        )}
                      {row.images && row.images.length > 1 && (
                        <div className="Image-Nav">
                          <ArrowBackIcon
                            className={
                              currentImage[row.id] === 0
                                ? "Image-Nav-Button Disabled"
                                : "Image-Nav-Button"
                            }
                            onClick={(event) => HandlePrevButton(event, row.id)}
                          />
                        
                          <p>
                            {currentImage[row.id] + 1}/{row.images.length}
                          </p>
                          <ArrowForwardIcon
                            className={
                              currentImage[row.id] === row.images.length - 1
                                ? "Image-Nav-Button Disabled"
                                : "Image-Nav-Button"
                            }
                            onClick={(event) =>
                              HandleNextButton(
                                event,
                                row.id,
                                row.images ? row.images.length : 0
                              )
                            }
                          />
                        </div>
                      )}
                    </div>
                    <div className="Comment-Container">
                      <p>{row.comment}</p>
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
