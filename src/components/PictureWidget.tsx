import React, { useState, useEffect } from 'react';

const Slider: React.FC<{ images: string[] }> = ({ images }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      goToNextSlide();
    }, 5000); // Thay đổi mỗi 5 giây 

    return () => {
      clearInterval(interval);
    };
  }, [currentSlideIndex]);

  const goToNextSlide = () => {
    setCurrentSlideIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };

  return (
    <div className="relative w-full h-full">
      {images.map((imageUrl, index) => (
        <img
          key={index}
          src={imageUrl}
          alt={`Slide ${index}`}
          className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 rounded-3xl ${
            index === currentSlideIndex ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}
    </div>
  );
};

const PictureWidget: React.FC = () => {
  const images = [
    '/src/assets/img/1.jpeg', 
    '/src/assets/img/2.jpeg', 
    '/src/assets/img/3.jpg',
    '/src/assets/img/4.jpg'
];

  return (
    <div className="w-full h-full ">
      <Slider images={images} />
    </div>
  );
};

export default PictureWidget;
