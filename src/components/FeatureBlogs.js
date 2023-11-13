import React from "react";
import { useNavigate } from "react-router-dom";
import cellphone from "../components/assets/cellphone.png";
import drink from "../components/assets/drink.png";
import OwlCarousel from 'react-owl-carousel';

const FeatureBlogs = ({ blogs, title }) => {
  const ads = [
    {
      id: 1,
      imgUrl: cellphone,
    },
    {
      id: 2,
      imgUrl: drink,
    },
  ];

  const navigate = useNavigate();

  const options = {
    items: 1,
    nav: true,
    rewind: true,
    autoplay: true,
    loop: true,
    margin: 10,
    
    autoplayTimeout: 5000,  // Pause for 5 seconds between transitions
    autoplaySpeed: 1000,    // 1 second transition animation
    smartSpeed: 1000,       // 1 second for "go to" actions
    dragEndSpeed: 3000,  // time for each slide to show (5 seconds)
  };

  return (
 
      <div>
        <div className="blog-heading text-start">{title}</div>
        <OwlCarousel className="owl-theme" {...options}>
          {ads?.map((item) => (
            <div
              key={item.id}
              style={{ cursor: "pointer", display: "flex", justifyContent: "center" }}
              onClick={() => navigate(`/detail/${item.id}`)}
            >
              <img
                src={item.imgUrl}
                alt={`Item ${item.id}`}
                className="h-70 object-cover"
              />
            </div>
          ))}
        </OwlCarousel>

      </div>

    );




}



export default FeatureBlogs;
