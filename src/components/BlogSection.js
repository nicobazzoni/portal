import React from "react";
import { Link } from "react-router-dom";
import { excerpt } from "../utility";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

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
  profilePicURL,
}) => {
  const profileId = userId?.split("@")[0];
  const userAvatarURL = userId?.photoURL || userId?.profilePicURL; 
  console.log(userAvatarURL, 'avatar');


  return (
    <div className="my-4">
      <div className="md:flex items-center bg-black text-white shadow-lg rounded-lg p-4">
        <div className="md:w-1/2 md:mr-4">
          <div className="hover:opacity-75 ">
            <img src={imgUrl} alt={title} className="w-full rounded-lg" />
          </div>
        </div>
        <div className="md:w-1/2 mt-4 md:mt-0">
        {userAvatarURL && (
         <img src={userAvatarURL} alt={author} className="rounded-full w-20 h-20" />
)}
        
          <h2 className="text-2xl font-semibold mt-2">{title}</h2>
        
          <div className="text-sm text-gray-300 mb-2">
            <Link
              to={`/profile/${profileId}`}
              className="text-rose-400 no-underline hover:text-white "
            >
              {author}
            </Link>
           
           
          </div> 
          {timestamp.toDate().toDateString()}
          <div className="text-sm text-black rounded-md bg-sky-200 mt-4">
            {excerpt(description, 120)}
          </div>
          <h6 className=" text-sm mt-4 bg-slate-100 rounded-md text-black uppercase">{category}</h6>
          <Link to={`/detail/${id}`}>
            <button className="mt-4 px-4 py-2 bg-rose-500 text-white border-none rounded-lg hover:bg-sky-400">
              Read More
            </button>
          </Link>
          {userId && user?.uid === userId && (
            <div className="flex justify-end mt-4">
              <DeleteOutlined
                name="trash"
                style={{ cursor: "pointer", fontSize: "30px" }}
                onClick={() => handleDelete(id)}
              />
              <Link to={`/update/${id}`} className="ml-4">
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
