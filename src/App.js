import { useEffect, useState } from 'react';
import { Loader } from './components/Loader';
import { ErrorMessage } from './components/ErrorMessage';
import NavBar from './components/NavBar';
import { Search } from './components/Search';
import { NumResults } from './components/NumResults';
import { Main } from './components/Main';
import { Box } from './components/Box';
import { MovieList } from './components/MovieList';
import MovieDetails from './components/MovieDetails';
import { WatchedSummary } from './components/WatchedSummary';
import { WatchedMovieList } from './components/WatchedMovieList';

export const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

export const KEY = 'cf44ad70';

export default function App() {
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState(null);

  function handleSelectMovie(id) {
    setSelectedId((selectedId) => (id === selectedId ? null : id));
  }

  function handleCloseSelectedMovie() {
    setSelectedId(null);
  }

  function handleAddWatcheded(movie) {
    setWatched((watched) => [...watched, movie]);
  }

  function deleteWatched(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

  useEffect(
    function () {
      const controller = new AbortController();
      async function fetchMovies() {
        try {
          setIsLoading(true);
          setError('');
          const res = await fetch(
            `https://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
            { signal: controller.signal },
          );

          if (!res.ok)
            throw new Error('Something went wrong with fetching data');

          const data = await res.json();
          if (data.Response === 'False') throw new Error('Movie not found');

          setMovies(data.Search);
          setError('');
        } catch (err) {
          if (err.name !== 'AbortError') setError(err.message);
        } finally {
          setIsLoading(false);
        }
      }
      if (query.length < 2) {
        setMovies([]);
        setError('');
        return;
      }

      handleCloseSelectedMovie();
      fetchMovies();

      return function () {
        controller.abort();
      };
    },
    [query],
  );

  return (
    <>
      <NavBar>
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>
      <Main>
        <Box>
          {/* {isLoading ? <Loader /> : <MovieList movies={movies} />} */}
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MovieList movies={movies} onSelectMovie={handleSelectMovie} />
          )}
          {error && <ErrorMessage message={error} />}
        </Box>
        <Box>
          {selectedId ? (
            <>
              <MovieDetails
                selectedId={selectedId}
                onCloseMovie={handleCloseSelectedMovie}
                onAddWatched={handleAddWatcheded}
                watched={watched}
              />
            </>
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMovieList
                watched={watched}
                onDeleteWatched={deleteWatched}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}
