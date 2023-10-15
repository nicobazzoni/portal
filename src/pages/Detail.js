import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
  orderBy,
  where,
} from "firebase/firestore";
import { isEmpty } from "lodash";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import CommentBox from "../components/CommentBox";
import Like from "../components/Like";
import FeatureBlogs from "../components/FeatureBlogs";
import RelatedBlog from "../components/RelatedBlog";
import Tags from "../components/Tags";
import UserComments from "../components/UserComments";
import { db } from "../firebase";
import Spinner from "../components/Spinner";

const Detail = ({ setActive, user }) => {
  const userId = user?.uid;
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [blog, setBlog] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [tags, setTags] = useState([]);
  const [comments, setComments] = useState([]);
  let [likes, setLikes] = useState([]);
  const [userComment, setUserComment] = useState("");
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const navigate = useNavigate();
  
  
  useEffect(() => {
    const getBlogDetail = async () => {
      setLoading(true);
      try {
        const blogRef = collection(db, "blogs");
        const docRef = doc(db, "blogs", id);
        const blogDetail = await getDoc(docRef);
        setBlog(blogDetail.data());

        // Set tags
        const allBlogsSnapshot = await getDocs(blogRef);
        const allTags = allBlogsSnapshot.docs.flatMap(doc => doc.get("tags"));
        setTags([...new Set(allTags)]);

        // Related blogs
        const blogTags = blogDetail.data().tags || [];
        if (blogTags.length > 0) {
          const relatedBlogsQuery = query(
            blogRef,
            where("tags", "array-contains-any", blogTags),
            limit(3)
          );
          const relatedBlogSnapshot = await getDocs(relatedBlogsQuery);
          setRelatedBlogs(relatedBlogSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } else {
          setRelatedBlogs([]);
        }

        // Set comments and likes
        setComments(blogDetail.data().comments || []);
        setLikes(blogDetail.data().likes || []);
      } catch (error) {
        console.error("Error fetching blog details:", error.message);
      } finally {
        setLoading(false);
      }
    };

    id && getBlogDetail();
  }, [id]);




  const getBlogDetail = async () => {
    setLoading(true);
    const blogRef = collection(db, "blogs");
    const docRef = doc(db, "blogs", id);
    const blogDetail = await getDoc(docRef);
    const blogs = await getDocs(blogRef);
    let tags = [];
    blogs.docs.map((doc) => tags.push(...doc.get("tags")));
    let uniqueTags = [...new Set(tags)];
    setTags(uniqueTags);
    setBlog(blogDetail.data());
    const relatedBlogsQuery = query(
      blogRef,
      where("tags", "array-contains-any", blogDetail.data().tags, limit(3))
    );
    setComments(blogDetail.data().comments ? blogDetail.data().comments : []);
    setLikes(blogDetail.data().likes ? blogDetail.data().likes : []);
    const relatedBlogSnapshot = await getDocs(relatedBlogsQuery);
    const relatedBlogs = [];
    relatedBlogSnapshot.forEach((doc) => {
      relatedBlogs.push({ id: doc.id, ...doc.data() });
    });
    setRelatedBlogs(relatedBlogs);
    setActive(null);
    setLoading(false);
  };

  const handleComment = async (e) => {
    e.preventDefault();
    const newComment = {
      createdAt: Timestamp.fromDate(new Date()),
      userId,
      name: user?.displayName,
      body: userComment,
    };
    try {
      await updateDoc(doc(db, "blogs", id), {
        ...blog,
        comments: [...comments, newComment],
        timestamp: serverTimestamp(),
      });
      setComments(prevComments => [...prevComments, newComment]);
      setUserComment("");
      toast.success("Comment posted successfully");
    } catch (error) {
      console.error("Error posting comment:", error.message);
    }
  };

  const handleLike = async () => {
    if (!userId) return;

    let updatedLikes;
    if (blog?.likes?.includes(userId)) {
      updatedLikes = likes.filter(id => id !== userId);
    } else {
      updatedLikes = [...likes, userId];
    }

    try {
      await updateDoc(doc(db, "blogs", id), {
        ...blog,
        likes: updatedLikes,
        timestamp: serverTimestamp(),
      });
      setLikes(updatedLikes);
    } catch (error) {
      console.error("Error updating likes:", error.message);
    }
  };

  const handleBack = () => { 
    navigate(-1);
  };
  
  

  console.log("relatedBlogs", relatedBlogs);
  return (
    <div className="single">
      <button className="btn btn-primary pt-2 pb-2 m-2 p-4" onClick={handleBack}> Back </button>
      <div
        className="blog-title-box"
        style={{ backgroundImage: `url('${blog?.imgUrl}')` }}
      >
        <div className="overlay"></div>
        <div className="blog-title">
          <span>{blog?.timestamp.toDate().toDateString()}</span>
          <h2>{blog?.title}</h2>
        </div>
      </div>
      <div className="container-fluid pb-4 pt-4 padding blog-single-content">
        <div className="container padding">
          <div className="row mx-0">
            <div className="col-md-8">
              <span className="meta-info text-start">
                By <p className="author">{blog?.author}</p> -&nbsp;
                {blog?.timestamp.toDate().toDateString()}
                <Like handleLike={handleLike} likes={likes} userId={userId} />
              </span>
              <p className="text-start">{blog?.description}</p>
              <div className="text-start">
                <Tags tags={blog?.tags} />
              </div>
              <br />
              <div className="custombox">
                <div className="scroll">
                  <h4 className="small-title">{comments?.length} Comment</h4>
                  {isEmpty(comments) ? (
                    <UserComments
                      msg={
                        "No Comment yet posted on this blog. Be the first to comment"
                      }
                    />
                  ) : (
                    <>
                      {comments?.map((comment, index) => (
        <UserComments key={index} {...comment} />
      ))}
                    </>
                  )}
                </div>
              </div>
              <CommentBox
                userId={userId}
                userComment={userComment}
                setUserComment={setUserComment}
                handleComment={handleComment}
              />
            </div>
            <div className="col-md-3">
              <div className="blog-heading text-start py-2 mb-4">Tags</div>
              <Tags tags={tags} />
              <FeatureBlogs title={"Recent Blogs"} blogs={blogs} />
            </div>
          </div>
          <RelatedBlog id={id} blogs={relatedBlogs} />
        </div>
      </div>
    </div>
  );
};

export default Detail;