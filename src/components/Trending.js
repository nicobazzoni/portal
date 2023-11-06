import React from "react";
import OwlCarousel from "react-owl-carousel";
import { Link } from "react-router-dom";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";

const Trending = ({ blogs }) => {
  const options = {
    loop: true,
    margin: 10,
    nav: true,
    responsive: {
      0: {
        items: 1,
      },
      400: {
        items: 2,
      },
      600: {
        items: 3,
      },
      1000: {
        items: 4,
      },
    },
    autoplayTimeout: 5000,  // Pause for 5 seconds between transitions
    autoplaySpeed: 1000,    // 1 second transition animation
    smartSpeed: 1000,       // 1 second for "go to" actions
    dragEndSpeed: 3000, 
  };
  return (
    <>
      <div className="">
        <div className="blog-heading text-start py-2 mb-4 ">Stories</div>
      </div>
      <OwlCarousel className="owl-theme owl-carousel" autoplay {...options} >
        {blogs?.map((item) => (
            
          <div className="item px-4 " key={item.id}>
            <Link to={`/detail/${item.id}`}>
              <div className="trending-img-position ">
                <div className="trending-img-size max-w-fit object-cover">
                  <img
                    src={item.imgUrl}
                    alt={item.title}
                    className="trending-img-relative"
                  />
                </div>
                <div className="trending-img-absolute"></div>
                <div className="trending-img-absolute-1">
                  <span className="text-white text-xl font-bold mt-3 ">{item.title}</span>
                  <div className="trending-meta-info font-poppins">
                    {item.author} - {item.timestamp.toDate().toDateString()}
                  </div>
                </div>
              </div> 
            </Link>
       
          </div>
          
        ))}
      </OwlCarousel>
    </>
  );
};

export default Trending;