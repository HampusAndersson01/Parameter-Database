import React, { useEffect, useState } from "react";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { TableRowProps } from "./ParameterTable";
import "./style/Images.css";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { EditModeContext } from "../context/EditModeContext";

interface Image {
  image_url: string;
  image_name: string | null;
  image_description: string | null;
}
export default function Images(props: { row: TableRowProps; onChange: any }) {
  const [currentImage, setCurrentImage] = useState<number>(0);
  const [images, setImages] = useState<Image[]>(props.row.images || []);
  const { editMode } = React.useContext(EditModeContext);

  //set onchange for images
  useEffect(() => {
    props.onChange(images);
  }, [images]);

  // decrease this id currentImage
  const HandlePrevButton = () => {
    if (currentImage != 0) {
      setCurrentImage((prevState) => prevState - 1);
    }
  };

  // increase this id currentImage
  const HandleNextButton = () => {
    if (currentImage != images.length - 1) {
      setCurrentImage((prevState) => prevState + 1);
    }
  };

  const handleDeleteImage = () => {
    // delete image from images array
    if (currentImage > 0 && currentImage === images.length - 1) {
      setCurrentImage((prevState) => prevState - 1);
    }
    setImages((prevValues) => {
      const newValues = [...prevValues];
      newValues.splice(currentImage, 1);

      return newValues;
    });
  };

  const handleAddImage = () => {
    // Add image to images array
    setImages((prevValues) => {
      const newValues = [...prevValues];
      newValues.push({
        image_url: "",
        image_name: null,
        image_description: null,
      });
      // Set current image to the new image
      setCurrentImage(newValues.length - 1);
      return newValues;
    });
  };

  // On edit mode exit, remove empty images
  useEffect(() => {
    if (!editMode) {
      setCurrentImage(0);
      setImages((prevValues) => {
        const newValues = [...prevValues];
        const filteredValues = newValues.filter(
          (image) => image.image_url !== ""
        );
        return filteredValues;
      });
    }
  }, [editMode]);

  const onFormChange = (value: string, type: string) => {
    setImages((prevValues) => {
      const newValues = [...prevValues];
      if (type === "url") {
        newValues[currentImage] = {
          ...newValues[currentImage],
          image_url: value,
        };
      } else if (type === "name") {
        newValues[currentImage] = {
          ...newValues[currentImage],
          image_name: value,
        };
      } else if (type === "description") {
        newValues[currentImage] = {
          ...newValues[currentImage],
          image_description: value,
        };
      }
      return newValues;
    });
  };
  return (
    <div
      className={editMode ? "Images-Container editMode" : "Images-Container"}
    >
      {props.row.images && props.row.images.length > 0 && (
        <>
          <img
            src={
              images[currentImage].image_url
                ? images[currentImage].image_url
                : ""
            }
            alt={
              "Image unavailable: " + images[currentImage].image_name ||
              images[currentImage].image_url
            }
          />
          <div className={editMode ? "imageForm" : "imageForm disabled"}>
            <label>Image Name</label>
            <input
              type="text"
              placeholder="Image Name"
              value={
                images[currentImage].image_name !== null
                  ? images[currentImage].image_name
                  : ""
              }
              onChange={(e) => onFormChange(e.target.value, "name")}
            />
            <label>Image Description</label>
            <input
              type="text"
              placeholder="Image Description"
              value={
                images[currentImage].image_description !== null
                  ? images[currentImage].image_description
                  : ""
              }
              onChange={(e) => onFormChange(e.target.value, "description")}
            />
            <label>Image URL*</label>
            <input
              required
              type="text"
              placeholder="Image URL"
              value={images[currentImage] ? images[currentImage].image_url : ""}
              onChange={(e) => onFormChange(e.target.value, "url")}
            />
          </div>
        </>
      )}

      <div className="Image-Nav">
        <AddIcon
          className={editMode ? "add" : "add disabled"}
          onClick={handleAddImage}
        />
        {images !== null && images !== undefined && images.length > 1 && (
          <>
            <ArrowBackIcon
              className={currentImage === 0 ? "prev Disabled" : "prev"}
              onClick={() => HandlePrevButton()}
            />
            <p>
              {currentImage + 1}/{images.length}
            </p>
            <ArrowForwardIcon
              className={
                currentImage === images.length - 1 ? "next Disabled" : "next"
              }
              onClick={() => HandleNextButton()}
            />
          </>
        )}
        <DeleteIcon
          className={editMode ? "delete" : "delete disabled"}
          onClick={handleDeleteImage}
        />
      </div>
    </div>
  );
}
