import React, { useState, useEffect } from "react";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  onSnapshot,
  query,
  orderBy,
  where,
  startAfter,
} from "firebase/firestore";
import BlogSection from "../components/BlogSection";
import Spinner from "../components/Spinner";
import { db } from "../firebase";
import { toast } from "react-toastify";
import Tags from "../components/Tags";
import FeatureBlogs from "../components/FeatureBlogs";
import Trending from "../components/Trending";
import Search from "../components/Search";
import { isEmpty, isNull } from "lodash";
import { useLocation } from "react-router-dom";
import Category from "../components/Category";
import MoodCarousel from "../components/Moods";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const Home = ({ setActive, user, active }) => {
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState([]);
  const [tags, setTags] = useState([]);
  const [trendBlogs, setTrendBlogs] = useState([]);
  const [totalBlogs, setTotalBlogs] = useState([]);
  const queryString = useQuery();
  const searchQuery = queryString.get("searchQuery");
  const location = useLocation();

  // Fetch trending blogs
  const getTrendingBlogs = async () => {
    const blogRef = collection(db, "blogs");
    const trendQuery = query(blogRef, where("trending", "==", "yes"));
    const querySnapshot = await getDocs(trendQuery);
    const trendBlogs = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setTrendBlogs(trendBlogs);
    console.log("Trending Blogs:", trendBlogs);
  };

  // Fetch all blogs
  const getBlogs = async () => {
    const blogRef = collection(db, "blogs");
    const firstFour = query(blogRef, orderBy("title"), limit(4));
    const docSnapshot = await getDocs(firstFour);
    const blogsData = docSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setBlogs(blogsData);
    setTotalBlogs(blogsData); // Update totalBlogs for category count
    console.log("Fetched Blogs:", blogsData);
    setLoading(false);
  };

  // Search blogs
  const searchBlogs = async () => {
    const blogRef = collection(db, "blogs");
    const searchTitleQuery = query(blogRef, where("title", "==", searchQuery));
    const searchTagQuery = query(blogRef, where("tags", "array-contains", searchQuery));
    const titleSnapshot = await getDocs(searchTitleQuery);
    const tagSnapshot = await getDocs(searchTagQuery);

    const searchTitleBlogs = titleSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    const searchTagBlogs = tagSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    const combinedSearchBlogs = [...searchTitleBlogs, ...searchTagBlogs];

    setBlogs(combinedSearchBlogs);
    console.log("Search Results:", combinedSearchBlogs);
    setLoading(false);
  };

  useEffect(() => {
    getTrendingBlogs();
    getBlogs();
    setActive("home");
  }, [setActive]);

  useEffect(() => {
    if (!isNull(searchQuery)) {
      searchBlogs();
    }
  }, [searchQuery]);

  if (loading) {
    return <Spinner />;
  }

  if (blogs.length === 0 && trendBlogs.length === 0) {
    return <div className="text-white text-center">No blogs to display.</div>;
  }

  return (
    <div className="container-fluid pb-4 pt-4 padding">
      <div className="container padding">
        <MoodCarousel path="/moods" user={user} active={active} />
        <Trending blogs={trendBlogs} />
        <div className="row">
          {blogs.map((blog) => (
            <BlogSection key={blog.id} user={user} {...blog} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;