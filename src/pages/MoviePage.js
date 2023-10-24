import React, { useState, useEffect } from 'react';

function RandomGangsterMovie() {
  const [movie, setMovie] = useState(null);
  const [refreshCount, setRefreshCount] = useState(0); // New state
  const API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY;

  useEffect(() => {
    async function fetchGangsterMovies() {
      const baseAPI = 'https://www.googleapis.com/youtube/v3/search';
      const directors = ['Scorsese', 'Tarantino', 'Kubrick', 'Coppola', 'Spike Lee', 'Nolan', 'Ritchie'];
      let allMovies = [];

      for (let director of directors) {
        const searchTerm = `${director}+gangster+movie`;
        const encodedSearchTerm = encodeURIComponent(searchTerm);
        const url = `${baseAPI}?part=snippet&maxResults=10&q=${encodedSearchTerm}&type=video&key=${API_KEY}`;

        try {
          const response = await fetch(url);
          const data = await response.json();
          if (data.items && data.items.length > 0) {
            allMovies = allMovies.concat(data.items);
          }
        } catch (error) {
          console.error(`Failed to fetch movies for ${director}:`, error);
        }
      }

      if (allMovies.length > 0) {
        const randomMovie = allMovies[Math.floor(Math.random() * allMovies.length)];
        setMovie(randomMovie);
      }
    }

    fetchGangsterMovies();
  }, [API_KEY, refreshCount]);

// Modified useEffect dependency

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {movie ? (
        <div className="bg-white p-4 rounded-lg shadow-lg max-w-xl w-full">
          <h2 className="text-xl font-bold mb-2">{movie.snippet.title}</h2>
          <div className="relative rounded-lg overflow-hidden shadow-md mb-4" style={{ paddingBottom: '56.25%' }}>
            <iframe 
                className="absolute top-0 left-0 w-full h-full"
                src={`https://www.youtube.com/embed/${movie.id.videoId}`} 
                title={movie.snippet.title} 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen>
            </iframe>
          </div>
          <p className="text-sm text-gray-600">{movie.snippet.description}</p>
          <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={() => setRefreshCount(refreshCount + 1)}>Fetch Another Movie</button>
        </div>
      ) : (
        <div className="bg-white p-4 rounded-lg shadow-lg max-w-xl w-full text-center">
          <p>Loading...</p>
        </div>
      )}
    </div>
  );
}

export default RandomGangsterMovie;
