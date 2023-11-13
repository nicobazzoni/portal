import React, { useEffect, useState } from 'react';
import axios from 'axios';
import OwlCarousel from 'react-owl-carousel';
import '../style.scss';

function Ticker() {
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const newsLimit = 20;

  const getNewsData = async () => {
    setLoading(true);

    const options = {
      method: 'POST',
      url: 'https://newsnow.p.rapidapi.com/newsv2',
      headers: {
        'content-type': 'application/json',
        'X-RapidAPI-Key': '90d9cad4aemsh0c2ae781060c8c2p1a0ee0jsna36176967a11',
        'X-RapidAPI-Host': 'newsnow.p.rapidapi.com'
      },
      data: {
        query: 'Ai', // Change this to your qu
        page: 1,
        time_bounded: true,
        from_date: '01/02/2021',
        to_date: '05/06/2021',
        location: '',
        category: '',
        source: ''
      }
    };

    try {
      const response = await axios.request(options);
      setNewsData(response.data.news);
      console.log(response.data.news, 'news');
    } catch (error) {
      console.error(error);
      // Handle the error or set default data if needed
    }

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
    <div className='bg-black text-white space-x-2 w-screen h-screen'>
      <h5 style={{ fontStyle: 'bold' }}>News</h5>
      <OwlCarousel options={options} items={3} autoplay={true} loop={true} nav={true} margin={10}>
      {newsData.map((article, index) => (
        console.log(article, 'article'), 
  <div key={index} className="w-full sm:w-1/2 lg:w-1/3 px-4 mb-8 text-white">
    <div className="max-w-sm rounded overflow-hidden shadow-lg text-white">
      <img className="w-full" src={article.image} alt={article.title} />
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{article.title}</div>
        <p className="text-gray-600 text-sm mb-2">
          {article.source} - {article.date}
        </p>
        <p className="text-gray-700 text-base">{article.body}</p>
      </div>
      <div className="px-6 pt-4 pb-2">
        <a
          href={article.url}
          className="text-blue-500 hover:underline"
          target="_blank"
          rel="noreferrer"
        >
          Read More
        </a>
      </div>
    </div>
  </div>
))}
      </OwlCarousel>
    </div>
  );
}

export default Ticker;
