import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import Carousel from 'react-bootstrap/Carousel';

//Homepage including Bootstrap carousel 
const HomePage = () => {
  return (
    <div className='container'>
      <h1 className='title'>Welcome to the Board Game Shoppe!</h1>
      <h2>Top Ranked Board Games. Prices You Can't Beat.</h2>
      <Carousel variant='dark'>
        <Carousel.Item>
          <img
            className="h-50 w-50"
            src="https://cf.geekdo-images.com/7k_nOxpO9OGIjhLq2BUZdA__imagepage/img/zoz-t_z9nqqxL7OwQenbqp9PRl8=/fit-in/900x600/filters:no_upscale():strip_icc()/pic3163924.jpg"
            alt="Scythe"
          />
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="h-50 w-50"
            src="https://d2k4q26owzy373.cloudfront.net/700x700/games/uploaded/1540147295104"
            alt="Root"
          />
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="h-80 w-50"
            src="https://i.gzn.jp/img/2021/02/08/spirit-island-review/si-01.jpg"
            alt="Spirit Island"
          />
        </Carousel.Item>
      </Carousel>


    </div>
  )
}

export default HomePage