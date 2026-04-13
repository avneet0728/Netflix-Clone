import { useEffect, useState } from "react";
import axios from "axios";
import MovieRow from "./MovieRow";

function App() {
  const API_KEY = "33162b70e1fba1766c95372e8ebae858";

  const [trending, setTrending] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [action, setAction] = useState([]);
  const [banner, setBanner] = useState(null);

  const [trailerUrl, setTrailerUrl] = useState("");
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [myList, setMyList] = useState([]);

  useEffect(() => {
    axios
      .get(`https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}`)
      .then((res) => {
        setTrending(res.data.results);
        setBanner(
          res.data.results[
            Math.floor(Math.random() * res.data.results.length)
          ]
        );
      });

    axios
      .get(`https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}`)
      .then((res) => setTopRated(res.data.results));

    axios
      .get(
        `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=28`
      )
      .then((res) => setAction(res.data.results));
  }, []);

  // 🎬 Trailer
  const handleClick = (movie) => {
    setTrailerUrl("");

    axios
      .get(
        `https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${API_KEY}`
      )
      .then((res) => {
        const trailer = res.data.results.find(
          (vid) => vid.type === "Trailer"
        );
        if (trailer) setTrailerUrl(trailer.key);
      });
  };

  // 🔍 Search
  const handleSearch = (e) => {
    const query = e.target.value;
    setSearch(query);

    if (query.length > 2) {
      axios
        .get(
          `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${query}`
        )
        .then((res) => setSearchResults(res.data.results));
    } else {
      setSearchResults([]);
    }
  };

  // ❤️ My List
  const addToList = (movie) => {
    if (!myList.find((m) => m.id === movie.id)) {
      setMyList([...myList, movie]);
    }
  };

  return (
    <div className="bg-black text-white min-h-screen">

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-gradient-to-b from-black to-transparent px-8 py-4 flex justify-between items-center">
        <h1 className="text-red-600 text-3xl font-bold">NETFLIX</h1>

        <input
          type="text"
          value={search}
          onChange={handleSearch}
          placeholder="Search movies..."
          className="bg-gray-800 px-4 py-2 rounded outline-none"
        />
      </nav>

      {/* Banner */}
      {banner && (
        <div
          className="h-[80vh] flex flex-col justify-end px-10 pb-20 bg-cover bg-center relative"
          style={{
            backgroundImage: `url(https://image.tmdb.org/t/p/original${banner.backdrop_path})`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>

          <div className="relative z-10 max-w-xl">
            <h1 className="text-6xl font-bold mb-4">
              {banner.title}
            </h1>

            <div className="flex gap-4 mb-4">
              <button
                className="bg-white text-black px-6 py-2 rounded font-semibold"
                onClick={() => handleClick(banner)}
              >
                ▶ Play
              </button>

              <button
                className="bg-gray-700 px-6 py-2 rounded"
                onClick={() => addToList(banner)}
              >
                + My List
              </button>
            </div>

            <p className="text-gray-300 text-sm">
              {banner.overview?.slice(0, 150)}...
            </p>
          </div>
        </div>
      )}

      {/* Trailer Popup */}
      {trailerUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <button
            className="absolute top-5 right-5 text-white text-2xl"
            onClick={() => setTrailerUrl("")}
          >
            ✖
          </button>

          <iframe
            width="800"
            height="450"
            src={`https://www.youtube.com/embed/${trailerUrl}`}
            title="Trailer"
            allowFullScreen
            className="rounded-lg"
          ></iframe>
        </div>
      )}

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="px-8 mt-24">
          <MovieRow
            title="Search Results"
            movies={searchResults}
            onClick={handleClick}
          />
        </div>
      )}

      {/* Rows */}
      <div className="px-8 mt-[-100px] space-y-10 relative z-10">

        {myList.length > 0 && (
          <MovieRow
            title="My List"
            movies={myList}
            onClick={handleClick}
          />
        )}

        <MovieRow
          title="Trending"
          movies={trending}
          onClick={handleClick}
        />

        <MovieRow
          title="Top Rated"
          movies={topRated}
          onClick={handleClick}
        />

        <MovieRow
          title="Action Movies"
          movies={action}
          onClick={handleClick}
        />
      </div>
    </div>
  );
}

export default App;