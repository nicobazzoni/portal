import React, { useEffect, useState } from 'react';
import axios from 'axios';
import OwlCarousel from 'react-owl-carousel';


function Ticker() {
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const newsLimit = 20;

  const getNewsData = async () => {
    setLoading(true);

    const resp = await axios.get('https://bing-news-search1.p.rapidapi.com/news', {
      headers: {
        'x-bingapis-sdk': 'true',
        'x-rapidapi-key': '90d9cad4aemsh0c2ae781060c8c2p1a0ee0jsna36176967a11',
        'X-RapidAPI-Host': 'bing-news-search1.p.rapidapi.com'
      }
    });

    setNewsData((resp.data.value || []).slice(0, newsLimit));
    setLoading(false);
  };

  useEffect(() => {
    getNewsData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  const options = {
    items: 1,
    loop: true,
    margin: 20,
    autoplay: true,
    autoplayTimeout: 3000, // adjust this to control the speed
  };

  return (
    <div>
      <h5 style={{fontStyle: 'bold' }}>News</h5>
    <OwlCarousel items={3} autoplay={true} loop={true} nav={true} margin={10}>
  {newsData.slice(0,20).map((news, index) => (
    <div key={index}>
      <a style={{textDecoration: 'none'}} href={news.url} target="_blank" rel="noreferrer">
        <img 
          src={news.image?.thumbnail?.contentUrl} 
          alt={news.name}
          className="news-image"
        />
        <p className="news-text">{news.description}</p>
      </a>
    </div>
  ))}
</OwlCarousel>

    </div>
  );
}

export default Ticker;
