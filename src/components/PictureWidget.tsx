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
    'https://firebasestorage.googleapis.com/v0/b/vtv-app-e0209.appspot.com/o/assets%2F1.jpeg?alt=media&token=5baf10fa-2563-4b8e-9b90-e8497e6412e9',
    'https://firebasestorage.googleapis.com/v0/b/vtv-app-e0209.appspot.com/o/assets%2F2.jpeg?alt=media&token=6cd12bf3-ccf0-4aba-b89c-2dd1f17caf27',
    'https://firebasestorage.googleapis.com/v0/b/vtv-app-e0209.appspot.com/o/assets%2F3.jpg?alt=media&token=3e53e027-a44a-4ac7-b95a-78ab9dbdcd22',
    'https://firebasestorage.googleapis.com/v0/b/vtv-app-e0209.appspot.com/o/assets%2F4.jpg?alt=media&token=b20a6b53-f2ca-4a3d-905c-dad830aea1e2',
  ];

  return (
    <div className="w-full h-full ">
      <Slider images={images} />
    </div>
  );
};

export default PictureWidget;
