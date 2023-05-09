import React, { useState } from 'react'
import { Image } from '../models/Parameters'
import './style/Images.css'
import { allowEdit } from "../hooks/EditMode/EditMode";
import Tooltip from '@mui/material/Tooltip';
import VisibilityIcon from '@mui/icons-material/Visibility';

/**
 * Component to display images
 * 
 * @module Images
 * @param props Images to display
 */
export default function Images(props: { images: Image[] | null | undefined }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [images, setImages] = useState<Image[]>([]);

  const [editAccess, setEditAccess] = React.useState<boolean>(false);//TODO: implement edit mode based on user role
  const [editAllowed, setEditAllowed] = React.useState<boolean>(allowEdit(true, editAccess));
  const [editActive, setEditActive] = React.useState<boolean>(false);



  React.useEffect(() => {
    if (props.images !== undefined && props.images !== null) {
      //Set images to props.images if url is not empty
      setImages(props.images.filter((image) => image.image_url !== ""));
    }
  }, [props.images]);



  const handlePrevClick = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? prevIndex : prevIndex - 1
    );
  };

  const handleNextClick = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? prevIndex : prevIndex + 1
    );
  };

  /**
   * Function to handle new image button click
   * 
   * Creates a new empty image and adds it to the images array.
   */
  const handleNewClick = () => {
    //Create new empty image
    const newImage: Image = {
      image_url: "",
      image_name: "",
      image_description: ""
    };
    //Add new image to images array
    setImages((prevImages) => [...prevImages, newImage]);
    //Set current image to new image
    setCurrentImageIndex(images.length);
  };

  /**
   * Function to handle delete image button click
   * 
   * Removes the current image from the images array.
   * Sets the current image to the previous image if it exists.
  */
  const handleDeleteClick = () => {
    //Remove image from images array
    setImages((prevImages) => {
      const newImages = [...prevImages];
      newImages.splice(currentImageIndex, 1);
      return newImages;
    });
    //Set current image to previous image if it exists
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? prevIndex : prevIndex - 1
    );
  };

  const handleEditClick = () => {
    //TODO implement edit image functionality
    setEditActive(!editActive);
  };

  return (
    <div className="imagesContainer">
      <h3>Image {images.length > 0 ? (
        <span>({currentImageIndex + 1}/{images.length})</span>
      ) : ""}  {editAccess ? (<>
        <button className="deleteButton" onClick={handleDeleteClick} disabled={!editAllowed}>Delete</button>
        <button className="editButton" onClick={handleEditClick} disabled={!editAllowed}>{editActive ? (<>Done</>) : (<>Edit</>)}</button></>) : ""}
      </h3>
      {images.length > 0 ? (
        <>
          <button onClick={handlePrevClick} disabled={currentImageIndex <= 0}>&lt;</button>

          {
            editActive ?
              (<>
                {/* Image editor */}
                <div className="imageEditContainer">
                  <div className="imageEdit">
                    <label htmlFor="imageURL">URL</label>
                    <input type="text" id="imageURL" name="imageURL" value={images[currentImageIndex].image_url} onChange={(e) => {
                      const newImages = [...images];
                      newImages[currentImageIndex].image_url = e.target.value;
                      setImages(newImages);
                    }} />
                  </div>
                  <div className="imageEdit">
                    <label htmlFor="imageName">Name</label>
                    <input type="text" id="imageName" name="imageName" value={images[currentImageIndex].image_name || ""} onChange={(e) => {
                      const newImages = [...images];
                      newImages[currentImageIndex].image_name = e.target.value;
                      setImages(newImages);
                    }} />
                  </div>
                  <div className="imageEdit">
                    <label htmlFor="imageDescription">Description</label>
                    <input type="text" id="imageDescription" name="imageDescription" value={images[currentImageIndex].image_description || ""} onChange={(e) => {
                      const newImages = [...images];
                      newImages[currentImageIndex].image_description = e.target.value;
                      setImages(newImages);
                    }} />
                  </div>
                  <VisibilityIcon className="imagePreviewIcon" ></VisibilityIcon>
                  <div className="imagePreviewContainer">
                    <img className='imagePreview'
                      src={images[currentImageIndex].image_url} />
                  </div>
                </div>
              </>) :
              (<>
                {/* Image gallery */}
                <Tooltip
                  title={
                    <span
                      dangerouslySetInnerHTML={{
                        __html: images[currentImageIndex].image_name + "<br />" + images[currentImageIndex].image_description
                      }
                      } />}
                  followCursor
                  arrow
                  enterDelay={1000}>
                  <img
                    src={images[currentImageIndex].image_url} />
                </Tooltip></>
              )
          }
          {
            currentImageIndex < images.length - 1 || !editAccess ? (
              <button onClick={handleNextClick} disabled={currentImageIndex >= (images.length - 1)}>&gt;</button>
            ) : (
              <button onClick={handleNewClick}>+</button>
            )

          }
        </>
      ) : editAccess ? (
        <button onClick={handleNewClick}>+</button>
      ) : (
        <div className='noImages'>No images</div>
      )


      }

    </div >
  );
}
