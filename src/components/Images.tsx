import React, { useState } from 'react'
import { Image } from '../models/Parameters'
import './style/Images.css'

export default function Images(props: { images: Image[] | null | undefined }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [images, setImages] = useState<Image[]>([]);

  React.useEffect(() => {
    if (props.images !== undefined && props.images !== null) {
      setImages(props.images);
    }
  }, [props.images]);



  const handlePrevClick = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleNextClick = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="imagesContainer">
      {images.length > 0 && (
        <>
          <button onClick={handlePrevClick}>&lt;</button>
          <img src={images[currentImageIndex].image_url} />
          <button onClick={handleNextClick}>&gt;</button>
        </>
      )}
      <p>{currentImageIndex + 1}/{images.length}</p>
    </div>
  );
}
