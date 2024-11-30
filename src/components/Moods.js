import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { Link } from "react-router-dom";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";

function MoodCarousel() {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const unsubscribe = onSnapshot(
        query(collection(db, "images"), orderBy("uploadedAt")),
        (snapshot) => {
          const fetchedImages = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setImages(fetchedImages);
          setLoading(false);
        },
        (error) => {
          console.error("Error fetching images:", error);
          setLoading(false);
        }
      );
  
      return () => unsubscribe();
    }, []);
  
    const options = {
      loop: true,
      margin: 10,
      nav: true, // Enable navigation
      navText: ["<div class='nav-btn prev-slide'>◀</div>", "<div class='nav-btn next-slide'>▶</div>"], // Custom navigation icons
      responsive: {
        0: { items: 1 },
        400: { items: 2 },
        600: { items: 3 },
        1000: { items: 4 },
        1400: { items: 6 },
      },
      autoplayTimeout: 2000,
      autoplaySpeed: 500,
      smartSpeed: 1000,
      dragEndSpeed: 1000,
    };
  
    if (loading) {
      return <div>Loading...</div>;
    }
    const LazyImage = ({ src, alt, onError }) => {
        const [isVisible, setIsVisible] = useState(false);
        const imgRef = React.useRef();
      
        useEffect(() => {
          const observer = new IntersectionObserver(
            (entries) => {
              if (entries[0].isIntersecting) {
                setIsVisible(true);
                observer.disconnect();
              }
            },
            { threshold: 0.1 }
          );
      
          if (imgRef.current) {
            observer.observe(imgRef.current);
          }
      
          return () => observer.disconnect();
        }, []);
      
        const handleImageClick = () => {
          if (imgRef.current) {
            if (imgRef.current.requestFullscreen) {
              imgRef.current.requestFullscreen();
            } else if (imgRef.current.webkitRequestFullscreen) {
              imgRef.current.webkitRequestFullscreen(); // Safari
            } else if (imgRef.current.mozRequestFullScreen) {
              imgRef.current.mozRequestFullScreen(); // Firefox
            } else if (imgRef.current.msRequestFullscreen) {
              imgRef.current.msRequestFullscreen(); // IE/Edge
            } else {
              console.warn("Fullscreen API is not supported by this browser.");
            }
          }
        };
      
        return (
          <div ref={imgRef} style={{ minHeight: "150px", backgroundColor: "#000" }}>
            {isVisible && (
              <img
                src={src}
                alt={alt}
                onError={onError}
                className="h-38 w-full object-cover rounded-full  mb-1 cursor-pointer"
                onClick={handleImageClick} // Expand image on click
              />
            )}
          </div>
        );
      };
  
    return (
      <div className="mood-carousel-container">
        <h2 className="text-white text-center">User Dalle AI Images</h2>
        <OwlCarousel className="owl-carousel custom-carousel" {...options}>
          {images.map((image) => (
            <div key={image.id} className="p-2">
              <LazyImage
                src={image.imageUrl}
                alt="Mood"
                className="rounded-full cursor-pointer "
              />
              <Link to={`/profile/${image.userId}`} className="no-underline">
                <p className="text-white">{image.displayName || "Anonymous User"}</p>
              </Link>
              <p className="text-white text-xs">
                {image.uploadedAt?.toDate().toLocaleString() || "Unknown date"}
              </p>
            </div>
          ))}
        </OwlCarousel>
      </div>
    );
  }
  
  export default MoodCarousel;