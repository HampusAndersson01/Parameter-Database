import React, { useState } from 'react'
import { Image } from '../models/Parameters'

export default function Images(props: { images: Image[] | null }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!props.images) {
    return null;
  }

  const handlePrevClick = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? props.images.length - 1 : prevIndex - 1
    );
  };

  const handleNextClick = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === props.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="image-gallery">
      <button onClick={handlePrevClick}>&lt;</button>
      <img src={props.images[currentImageIndex].image_url} />
      <button onClick={handleNextClick}>&gt;</button>
    </div>
  );
}
