import React, { useState } from 'react';
import { useEffect } from 'react';

function Images({ selectedId }) {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const url = `https://online-movie-database.p.rapidapi.com/title/get-images?tconst=${selectedId}&limit=99`;
      const options = {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key':
            '67d094026bmsh028f38a79d5c096p128cd4jsne63a7e24582c',
          'X-RapidAPI-Host': 'online-movie-database.p.rapidapi.com',
        },
      };

      try {
        const response = await fetch(url, options);
        const result = await response.json();
        const dataObj = result.images;
        const dataArr = [];
        dataObj.forEach((element) => {
          dataArr.push(element);
        });
        setImages(dataArr);
        console.log(dataArr);
      } catch (error) {
        console.error(error);
      }
      setIsLoading(false);
    };
    fetchData();
  }, [selectedId]);

  return (
    <div>
      <h4>Images</h4>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div>
          {images.map((el) => {
            return <img alt={el.caption} src={el.url} key={el.id} />;
          })}
        </div>
      )}
    </div>
  );
}

export default Images;
