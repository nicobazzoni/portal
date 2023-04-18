

import axios from 'axios';
import { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';



function Ticker() {

  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(false);


  //Make api call to news api
  async function getNewsData() {
    //Set loading boolean to true so that we know to show loading text
    setLoading(true);

    //Make news api call using axios
 const resp =  axios.get('https://bing-news-search1.p.rapidapi.com/news' , {
    headers: {
        'x-bingapis-sdk': 'true',
        'x-rapidapi-key':  '90d9cad4aemsh0c2ae781060c8c2p1a0ee0jsna36176967a11',
        'X-RapidAPI-Host': 'bing-news-search1.p.rapidapi.com'
    }
   
})
console.log(resp)

    //Set newsData to the data returned from the api call
    setNewsData((await resp).data.value);

    //Set loading boolean to false so that we know to show news articles
    setLoading(false);
  }

  useEffect(() => {
    getNewsData();
  }, []);



  return (
    //display each news article in ticker marquee format
    <div className='ticker '>
        <marquee>
            {newsData.map((news, index) => (
                <span key={index}>
                    <a href={news.url} target="_blank" rel="noreferrer">

                        {news.name} - {news.description}


                    </a>
                   

                    </span>
            ))}
        </marquee>
    </div>


    );

}


export default Ticker;