function MovieRow({ title, movies, onClick }) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">{title}</h2>

      <div className="flex gap-4 overflow-x-scroll">
        {movies.map((movie) => (
          <img
            key={movie.id}
            src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
            alt=""
            onClick={() => onClick(movie)}
            className="w-44 rounded cursor-pointer transform hover:scale-110 transition duration-300"
          />
        ))}
      </div>
    </div>
  );
}

export default MovieRow;