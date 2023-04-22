import React from "react";
import { useNavigate } from "react-router-dom";

const FeatureBlogs = ({ blogs, title }) => {
  const navigate = useNavigate();
  return (
    <div>
      <div className=" blog-heading text-start pt-3  py-2 mb-4">{title}</div>
      {blogs?.map((item) => (
        <div
          className="row-2  recent pb-3 featblog  bg-light border-bottom border-2 my-2"
          key={item.id}
          style={{ cursor: "pointer" }}
          onClick={() => navigate(`/detail/${item.id}`)}
        >
          <div className="col-8 align-self-center m-4 recent padding ">
            <img
              src={item.imgUrl}
              alt={item.title}
              className="most-popular-img"
            />
          </div>
          <div className=" text-left justify-content-center bgRecent">
            <div className="most-popular-font">{item.title}</div>
            <div className=" most-popular-font-meta">
              {item.timestamp.toDate().toDateString()}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FeatureBlogs;