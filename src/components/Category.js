import React from "react";
import { Link } from "react-router-dom";

const Category = ({ catgBlogsCount }) => {
  return (
    <div className="widget w-screen">
      <div className="blog-heading text-start py-2 mb-4">Categories</div>
      <div className="link-widget">
        <ul>
          {catgBlogsCount?.map((item, index) => (
            <li key={index}>
              <Link
                to={`/category/${item.category}`}
                style={{ textDecoration: "none", float: "left", color: "#777" }}
              >
                {item.category}
                <span>({item.count})</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Category;