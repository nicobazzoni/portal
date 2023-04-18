

import axios from 'axios';
import { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';



function App() {

  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(false);


  //Make api call to news api
  async function getNewsData() {
    //Set loading boolean to true so that we know to show loading text
    setLoading(true);

    //Make news api call using axios
    const resp = await axios.get("https://newsapi.org/v2/everything?q=news&apiKey=b738ed2669c54125aae96fba7c1107d5&pageSize=10");
    setNewsData(resp.data.articles);

    //Set loading boolean to false so that we know to show news articles
    setLoading(false);
  }

  useEffect(() => {
    getNewsData();
  }, []);



  return (
    //display each news article in ticker marquee format
    <div className="ticker text-center">
       

                        
                            <Card.Title>News Ticker</Card.Title>
                           
                                <marquee className='' >
                                    {loading ? "Loading..." : newsData.map((news, index) => {
                                        return (
                                            <a className='ticker'  href={news.url} target="_blank"  rel="noreferrer" key={index}>{news.title} || {news.description} ||  </a>



  )
})}
                                </marquee>
                            
                       
         
    </div>
    );
}

export default App;