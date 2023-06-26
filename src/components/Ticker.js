import axios from 'axios';
import { useEffect, useState } from 'react';

function Ticker() {

  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const newsLimit = 10;  // Set limit here

  //Make api call to news api
  async function getNewsData() {
    setLoading(true);
    
    const resp = axios.get('https://bing-news-search1.p.rapidapi.com/news' , {
      headers: {
          'x-bingapis-sdk': 'true',
          'x-rapidapi-key':  '90d9cad4aemsh0c2ae781060c8c2p1a0ee0jsna36176967a11',
          'X-RapidAPI-Host': 'bing-news-search1.p.rapidapi.com'
      }
    });

    setNewsData((await resp).data.value.slice(0, newsLimit));
    setLoading(false);
  }

  useEffect(() => {
    getNewsData();
  }, []);

  if (loading) {
    return <div className='ticker'><img height={40} width={50} src='/favicon.ico' /></div>;
  }

  return (
    <div className=''> 
      <marquee scrollamount="8">
            {newsData.map((news, index) => (
                <span key={index}>
                    <a style={{textDecoration: 'none', color: 'black !important'}} href={news.url} target="_blank" rel="noreferrer">
                        {news.name} - {news.description}
                    </a>
                </span>
            ))} 
        </marquee>
    </div>
  );
}

export default Ticker;
