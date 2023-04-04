import React, { useContext, useEffect, useState } from "react";
import "./style/ExpandedData.css";
import StyledBoxWLabel from "./StyledBoxWLabel";
import { TableRowProps } from "../models/Parameters";
import SaveIcon from "@mui/icons-material/Save";
import { EditModeContext } from "../context/EditModeContext";
import { DataContext } from "../context/DataContext";
import DeleteIcon from "@mui/icons-material/Delete";
import { APIContext } from "../context/APIContext";
import { PendingReloadContext } from "../context/PendingReloadContext";
import PossibleValues from "./PossibleValues";
import Images from "./Images";

interface UpdateParameter {
  name: string;
  description: string | null;
  datatype: string | null;
  decimals: number | null;
  min: number | null;
  max: number | null;
  creation_date: string | null;
  modified_date: string | null;
  created_by: string | null;
  modified_by: string | null;
  comment: string | null;
  unit: {
    name: string | null;
    description: string | null;
  };
  rigfamily: {
    name: string | null;
  };
  images: {
    name: string | null;
    description: string | null;
    url: string | null;
  };
  possible_values: {
    value: string | null;
    description?: string | null;
  };
}

function ExpandedData(props: { row: TableRowProps }) {
  const [parameter, setParameter] = useState<TableRowProps>({
    id: props.row.id,
    name: props.row.name,
    description: props.row.description,
    rigfamily_name: props.row.rigfamily_name,
    rigfamily_description: props.row.rigfamily_description,
    unit_name: props.row.unit_name,
    unit_description: props.row.unit_description,
    decimals: props.row.decimals,
    min: props.row.min,
    max: props.row.max,
    datatype: props.row.datatype,
    created_by: props.row.created_by,
    modified_by: props.row.modified_by,
    creation_date: props.row.creation_date,
    modified_date: props.row.modified_date,
    images: props.row.images,
    comment: props.row.comment,
    possible_values: props.row.possible_values,
  });
  const { editMode } = useContext(EditModeContext);
  const { rigFamilies } = useContext(DataContext);
  const [currentRigFamily, setCurrentRigFamily] = useState<string>("");
  const { hostname } = useContext(APIContext);
  const { setPendingReload } = useContext(PendingReloadContext);

  // Function to handle changes in input fields
  // Usage: <input onChange={(e) => handleValueChange(e.target.value, "name")} />
  const handleValueChange = (value: any, key: string) => {
    setParameter((prevState) => {
      return { ...prevState, [key]: value };
    });
  };

  // Function to handle changes in rigfamily dropdown
  // Usage: <select onChange={(e) => handleRigFamilyChange(e.target.value)} />
  const handleRigFamilyChange = (value: any) => {
    //Set rigfamily description based on rigfamily name
    if (value < 0 || parameter.rigfamily_name[value] === "") {
      setCurrentRigFamily("");
      return;
    } else if (rigFamilies) {
      Array.from(parameter.rigfamily_name.toString().split(", ")).forEach(
        (rigFamilyName: string, index: number) => {
          rigFamilies.forEach((rigFamily: any) => {
            if (rigFamily.name === rigFamilyName && index === value) {
              setCurrentRigFamily(rigFamily.description);
            }
          });
        }
      );
    }
  };

  // Set rigfamily description based on rigfamily name
  useEffect(() => {
    handleRigFamilyChange(0);
  }, [parameter.rigfamily_name]);

  // Function to handle save button
  // Usage: <button onClick={handleSave}>Save</button>
  const handleSave = () => {
    const result = window.confirm("Are you sure you want to save?");
    if (result) {
      // console.log(parameter);
      // console.log(parameter.rigfamily_description);

      let updatedParameter: UpdateParameter = {
        name: parameter.name,
        description: parameter.description,
        datatype: parameter.datatype,
        decimals: parameter.decimals,
        min: parameter.min,
        max: parameter.max,
        creation_date: parameter.creation_date,
        modified_date: new Date().toISOString(),
        created_by: parameter.created_by,
        modified_by: "admin", //FIXME: get user from context
        comment: parameter.comment,
        unit: {
          name: parameter.unit_name,
          description: parameter.unit_description,
        },
        rigfamily: {
          name: parameter.rigfamily_name.join(";"),
        },
        images: {
          name: parameter.images
            ? parameter.images.map((image) => image.image_name).join(";")
            : null,
          description: parameter.images
            ? parameter.images.map((image) => image.image_description).join(";")
            : null,
          url: parameter.images
            ? parameter.images.map((image) => image.image_url).join(";")
            : null,
        },
        possible_values: {
          value: parameter.possible_values
            ? parameter.possible_values.map((value) => value.value).join(";")
            : null,
          description: parameter.possible_values
            ? parameter.possible_values
                .map((value) => value.description)
                .join(";")
            : null,
        },
      };
      // console.log(updatedParameter, props.row.id);
      // put request to update parameter
      const setData = async () => {
        try {
          await fetch(hostname + `parameters/${props.row.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedParameter),
          })
            .catch((error) => console.log(error))
            .finally(() => console.log(props.row.id + " Updated"));
          console.log(result);
        } catch (error) {
          console.error(error);
        }
      };
      setData();
    }
  };

  return (
    <>
      <div className={editMode ? "Expandable-Area editing" : "Expandable-Area"}>
        <div className="Expandable-Left">
          {/* Column 1 */}
          <StyledBoxWLabel
            id={props.row.id}
            label="Name"
            data={props.row.name}
            editable={true}
            onChange={(value: any) => {
              handleValueChange(value, "name");
            }}
          ></StyledBoxWLabel>
          <StyledBoxWLabel
            id={props.row.id}
            label="Description"
            data={props.row.description}
            editable={true}
            onChange={(value: any) => {
              handleValueChange(value, "description");
            }}
          ></StyledBoxWLabel>
          <StyledBoxWLabel
            id={props.row.id}
            label="Rig Family"
            data={parameter.rigfamily_name.toString().split(", ")}
            editable={true}
            // add rig family names to rigFamilyModel
            options={rigFamilies.map((rigFamily) => {
              rigFamily.name;
            })}
            onChange={(value: any) => {
              handleValueChange(value, "rigfamily_name");
            }}
            currentIndexOut={(currentIndex: number) => {
              handleRigFamilyChange(currentIndex);
            }}
            iterable={true}
          ></StyledBoxWLabel>
          <StyledBoxWLabel
            id={props.row.id}
            label="Rig Family Description"
            html={
              <>
                <input
                  className="styledBoxWLabelData active"
                  value={currentRigFamily}
                  readOnly={true}
                />
              </>
            }
            editable={false}
            onChange={(value: any) => {
              handleValueChange(value, "rigfamily_description");
            }}
          ></StyledBoxWLabel>
        </div>
        <div className="Expandable-Right">
          {/* Column 2 */}
          <StyledBoxWLabel
            id={props.row.id}
            label="Unit"
            data={props.row.unit_name}
            editable={true}
            onChange={(value: any) => {
              handleValueChange(value, "unit_name");
            }}
          ></StyledBoxWLabel>
          <StyledBoxWLabel
            id={props.row.id}
            label="Decimals"
            data={props.row.decimals}
            editable={true}
            onChange={(value: any) => {
              handleValueChange(value, "decimals");
            }}
          ></StyledBoxWLabel>
          <StyledBoxWLabel
            id={props.row.id}
            label="Min"
            data={props.row.min}
            editable={true}
            onChange={(value: any) => {
              handleValueChange(value, "min");
            }}
          ></StyledBoxWLabel>
          <StyledBoxWLabel
            id={props.row.id}
            label="Max"
            data={props.row.max}
            editable={true}
            onChange={(value: any) => {
              handleValueChange(value, "max");
            }}
          ></StyledBoxWLabel>
          <StyledBoxWLabel
            id={props.row.id}
            label="Type"
            data={props.row.datatype}
            editable={true}
            onChange={(value: any) => {
              handleValueChange(value, "datatype");
            }}
          ></StyledBoxWLabel>

          {/* Column 3 */}

          <StyledBoxWLabel
            id={props.row.id}
            label="Created"
            data={
              props.row.creation_date !== null
                ? props.row.creation_date.toString().split("T")[0]
                : null
            }
            editable={false}
            onChange={(value: any) => {
              handleValueChange(value, "creation_date");
            }}
          ></StyledBoxWLabel>
          <StyledBoxWLabel
            id={props.row.id}
            label="Created By"
            data={props.row.created_by}
            editable={false}
            onChange={(value: any) => {
              handleValueChange(value, "created_by");
            }}
          ></StyledBoxWLabel>
          <StyledBoxWLabel
            id={props.row.id}
            label="Last Modified"
            data={
              props.row.modified_date !== null
                ? props.row.modified_date.toString().split("T")[0]
                : null
            }
            editable={false}
            onChange={(value: any) => {
              handleValueChange(value, "modified_date");
            }}
          ></StyledBoxWLabel>
          <StyledBoxWLabel
            id={props.row.id}
            label="Modified By"
            data={props.row.modified_by}
            editable={false}
            onChange={(value: any) => {
              handleValueChange(value, "modified_by");
            }}
          ></StyledBoxWLabel>
          <StyledBoxWLabel
            id={props.row.id}
            label="Comment"
            data={props.row.comment}
            editable={true}
            onChange={(value: any) => {
              handleValueChange(value, "comment");
            }}
          ></StyledBoxWLabel>

          {/* Column 4 */}
          <StyledBoxWLabel
            id={props.row.id}
            label="Possible Values"
            html={
              <PossibleValues
                onChange={(value: any) => {
                  handleValueChange(value, "possible_values");
                }}
                row={props.row}
              ></PossibleValues>
            }
            editable={false}
            onChange={(value: any) => {}}
          ></StyledBoxWLabel>

          {/* Column 5 */}
          <StyledBoxWLabel
            id={props.row.id}
            label="Images"
            data={props.row.images}
            html={
              <Images
                onChange={(value: any) => {
                  handleValueChange(value, "images");
                }}
                row={props.row}
              ></Images>
            }
            editable={false}
            onChange={(value: any) => {
              handleValueChange(value, "images");
            }}
          ></StyledBoxWLabel>
        </div>
      </div>
    </>
  );
}
export default ExpandedData;
