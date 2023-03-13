import React, { useContext, useEffect, useState } from "react";
import "./style/ExpandedData.css";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import StyledBoxWLabel from "./StyledBoxWLabel";
import { TableRowProps } from "./ParameterTable";
import SaveIcon from "@mui/icons-material/Save";
import { EditModeContext } from "../context/EditModeContext";
import { RigFamiliesContext } from "../context/RigFamiliesContext";
import DeleteIcon from '@mui/icons-material/Delete';

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
    description: string | null;
  };
  images: {
    name: string | null;
    description: string | null;
    url: string | null;
  };
}



function ExpandedData(props: {
  row: TableRowProps;
  isExpanded: boolean;
}) {
  const [currentImage, setCurrentImage] = useState<number>(0);
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
  });
  const { editMode } = useContext(EditModeContext);
  const { rigFamilies } = useContext(RigFamiliesContext);
  const [currentRigFamily, setCurrentRigFamily] = useState<string>("");

  const HandlePrevButton = (event: any, id: number) => {
    // decrease this id currentImage
    if (currentImage != 0) {
      setCurrentImage((prevState) => prevState - 1);
    }
  };

  const HandleNextButton = (event: any, id: number, length: number) => {
    // increase this id currentImage
    if (currentImage != length - 1) {
      setCurrentImage((prevState) => prevState + 1);
    }
  };

  const handleValueChange = (value: any, key: string) => {
    setParameter((prevState) => {
      return { ...prevState, [key]: value };
    });
  };

  const handleRigFamilyChange = (value: any) => {
    //Set rigfamily description based on rigfamily name
    console.log("handleRigFamilyChange", value);
    if (value < 0 || parameter.rigfamily_name[value] === "") {
      setCurrentRigFamily("");
      return;
    }else if (rigFamilies) {
      parameter.rigfamily_name.forEach((rigFamilyName: string, index: number) => {
        rigFamilies.forEach((rigFamily: any) => {
          if (rigFamily.name === rigFamilyName && index === value) {
            setCurrentRigFamily(rigFamily.description);
          }
          }
        );
        });
      }
    };


  useEffect(() => {
    //Set rigfamily description based on rigfamily name
    handleRigFamilyChange(0);
  }, [parameter.rigfamily_name]);

 

  const handleSave = () => {
    const result = window.confirm("Are you sure you want to save?");
    if (result) {
      // TODO: Save to database

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
          description: parameter.rigfamily_description.join(";"),
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
      };
      console.log(updatedParameter, props.row.id);
      // put request to update parameter
      const fetchData = async () => {
        try {
          await fetch(`http://localhost:3000/parameters/${props.row.id}`, {
            method: "PUT",
            headers: {
              //Allowing CORS
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedParameter),
          })
            .catch((error) => console.log(error))
            .finally(() => console.log("data loaded"));
          console.log(result);
        } catch (error) {
          console.error(error);
        }
      };
      fetchData();
    }
  };

  const handleDelete = () => {
    const result = window.confirm("Are you sure you want to delete?");
    if (result) {
      //TODO: Delete from database
      // delete request to delete parameter
    }
  };

  return (
    <>
      <tr
        key={props.row.id + "expandable"}
        className={
          props.isExpanded ? "Expandable-Row Active-Row" : "Expandable-Row"
        }
      >
        <td colSpan={9}>
          <div className={ editMode ? "Expandable-Area editing" : "Expandable-Area"}>
            <div className="expandableAreaToolbar">
            <div
              className="Expandable-Save"
              onClick={handleSave}
            >
              <SaveIcon></SaveIcon>
            </div>
            <div 
            className="Expandable-Delete"
            onClick={handleDelete}>
              <DeleteIcon></DeleteIcon>
            </div>
            </div>

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
                data={props.row.rigfamily_name}
                editable={true}
                // add rig family names to rigFamilyModel
                options={rigFamilies.map((rigFamily) => {rigFamily.name})}
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
                html={<>
                  
                      <input
                  className="styledBoxWLabelData active"
                  value={currentRigFamily}
                  readOnly={true}
                />
                  </>}
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
                data={props.row.creation_date}
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
                data={props.row.modified_date}
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
                html={<></>}
                editable={false}
                onChange={(value: any) => {
                  handleValueChange(value, "possible_values");
                }}
              ></StyledBoxWLabel>

              {/* Column 5 */}
              <StyledBoxWLabel
                id={props.row.id}
                label="Images"
                data={props.row.images}
                html={
                  <div className="Images-Container">
                    {props.row.images && props.row.images.length > 0 && (
                      <img
                        src={
                          props.row.images[currentImage]
                            ? props.row.images[currentImage].image_url
                            : ""
                        }
                        alt={
                          props.row.images[currentImage]
                            ? (props.row.images[currentImage]
                                .image_name as string)
                            : ""
                        }
                      />
                    )}
                    {props.row.images && props.row.images.length > 1 && (
                      <div className="Image-Nav">
                        <ArrowBackIcon
                          className={
                            currentImage === 0
                              ? "Image-Nav-Button Disabled"
                              : "Image-Nav-Button"
                          }
                          onClick={(event) =>
                            HandlePrevButton(event, props.row.id)
                          }
                        />

                        <p>
                          {currentImage + 1}/{props.row.images.length}
                        </p>
                        <ArrowForwardIcon
                          className={
                            currentImage === props.row.images.length - 1
                              ? "Image-Nav-Button Disabled"
                              : "Image-Nav-Button"
                          }
                          onClick={(event) =>
                            HandleNextButton(
                              event,
                              props.row.id,
                              props.row.images ? props.row.images.length : 0
                            )
                          }
                        />
                      </div>
                    )}
                  </div>
                }
                editable={false}
                onChange={(value: any) => {
                  handleValueChange(value, "images");
                }}
              ></StyledBoxWLabel>
            </div>
          </div>
        </td>
      </tr>
    </>
  );
}
export default ExpandedData;
