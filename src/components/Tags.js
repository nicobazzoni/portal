import React, { useState } from "react";
import { Link } from "react-router-dom";


//create a  component that limits the number of tags displayed to 3





const Tags = ({ tags  }) => {
  const [limit, setLimit] = useState(5);
  const loadMore = () => {
    setLimit(limit + 3);
  };
  
  return (
    <div>
      <div className="tags">
        {tags?.slice(0, limit).map((tag, index) => (
          <p className="tag" key={index}>
          <Link  to={`/tag/${tag}`} style={{ textDecoration: "none", color: "black" }}>
            <span className="">{tag}</span>
          </Link>
          </p>
        ))}
      </div>
      {tags?.length > limit && (
        <button className="btn   btn-primary p-2 m-1" onClick={loadMore}>
          Load More
        </button>
      )}
    </div>
  );
};

export default Tags;