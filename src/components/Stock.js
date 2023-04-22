
// create fetch for this api https://twelve-data1.p.rapidapi.com/stocks with key '90d9cad4aemsh0c2ae781060c8c2p1a0ee0jsna36176967a11' and host 'twelve-data1.p.rapidapi.com'
import React, { useState, useEffect } from 'react'
import axios from 'axios'

const Stock = () => {
    const [stockData, setStockData] = useState([])
   
    
  //automatically replace data with new data every 5 seconds





    const getStockData = async () => {
        const resp = await axios.get('https://latest-stock-price.p.rapidapi.com/any', {
            METHOD: 'GET',
            headers: {
                'x-rapidapi-key': '90d9cad4aemsh0c2ae781060c8c2p1a0ee0jsna36176967a11',
                'x-rapidapi-host': 'latest-stock-price.p.rapidapi.com'
            }
        })

        setStockData(resp.data)
    }
  
    useEffect(() => { 
        getStockData()
    }
    , [stockData])

    return (
       <div className='stock bg '>
        <marquee scrollamount="8">
        {stockData.map((stock, index) => (
            <span key={index}>
                <a>{''}{stock.symbol} - ${stock.lastPrice}{''} ||</a> 

                
              
            </span>

        ))}
        </marquee>


       </div>
    )

}

export default Stock







    
















 

           
              


  












