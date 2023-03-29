import React, { useState } from "react";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { TableRowProps } from "./ParameterTable";
import "./style/Images.css";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";

export default function Images(props: { row: TableRowProps; onChange: any }) {
  const [currentImage, setCurrentImage] = useState<number>(0);
  const [images, setImages] = useState<any[]>([]);

  const HandlePrevButton = () => {
    // decrease this id currentImage
    if (currentImage != 0) {
      setCurrentImage((prevState) => prevState - 1);
    }
  };

  const HandleNextButton = (length: number) => {
    // increase this id currentImage
    if (currentImage != length - 1) {
      setCurrentImage((prevState) => prevState + 1);
    }
  };

  const handleDeleteImage = () => {
    // delete image from images array
    props.onChange("delete", props.row.id, currentImage);
  };
  return (
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
              ? (props.row.images[currentImage].image_name as string)
              : ""
          }
        />
      )}
      <div className="Image-Nav">
        <AddIcon
          className="add"
          onClick={() => props.onChange("add", props.row.id)}
        />
        {props.row.images !== null &&
          props.row.images !== undefined &&
          props.row.images.length > 1 && (
            <>
              <ArrowBackIcon
                className={currentImage === 0 ? "prev Disabled" : "prev"}
                onClick={() => HandlePrevButton()}
              />
              <p>
                {currentImage + 1}/{props.row.images.length}
              </p>
              <ArrowForwardIcon
                className={
                  currentImage === props.row.images.length - 1
                    ? "next Disabled"
                    : "next"
                }
                onClick={() =>
                  HandleNextButton(
                    props.row.images ? props.row.images.length : 0
                  )
                }
              />
            </>
          )}
        <DeleteIcon className="delete" onClick={handleDeleteImage} />
      </div>
    </div>
  );
}
