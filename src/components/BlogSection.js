import React, { useEffect } from "react";
import FontAwesome from "react-fontawesome";
import { Link } from "react-router-dom";
import { excerpt } from "../utility";
import { DeleteOutlined } from "@ant-design/icons";
import { EditOutlined } from "@ant-design/icons";

const BlogSection = ({
  id,
  title,
  description,
  category,
  imgUrl,
  userImg,
  userId,
  author,
  timestamp,
  user,
  handleDelete,
}) => {

  const profileId = userId?.split("@")[0];
  return (
    console.log("BlogSection", userImg),
    <div className=" ">
      <div className="row  postsGo pb-4 bg border my-2 p-2 " key={id}>
        <div className="col-md-5 ">
          <div className="hover-blogs-img">
            <div className="blogs-img">
              <img src={imgUrl} alt={title} />
              <div></div>
            </div>
          </div>
        </div>
        <div className="col-md-7 bg-stone-100 p-1">
          <div className="text-start">
            <h6 className="category catg-color">{category}</h6>
            <span className="title py-2">{title}</span>
            <span className="meta-info bg-white p-1 m-2 rounded-md">
              <Link  to={`/profile/${profileId}`}className="author no-underline text-rose-400">{author}</Link> 
             
            </span>
            <div className="text-xs p-1 bg-slate-100 rounded-md ">
          &nbsp;
              {timestamp.toDate().toDateString()}
          </div>
         
          </div>
          <div className="short-description text-start bg-white text-black p-1 m-1 border-rounded">
            {excerpt(description, 120)}
          </div>
          <Link to={`/detail/${id}`}>
            <button className=" border-none p-2 m-2  rounded-md bg-yellow-100 font-bold hover:bg-slate-50">Read More</button>
          </Link>
         
         
         
          {userId && user?.uid === userId && (
            <div style={{ float: "right" }}>
              <DeleteOutlined
                name="trash"
                style={{ margin: "15px", cursor: "pointer", fontSize: "30px" }}
               
                onClick={() => handleDelete(id)}
              />
              <Link to={`/update/${id}`}>
                <EditOutlined
                  name="edit"
                  style={{ cursor: "pointer", fontSize: "30px" }}
                
                />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogSection;