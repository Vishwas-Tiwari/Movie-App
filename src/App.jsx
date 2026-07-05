
import React, { useEffect, useState } from 'react';
import Search from './components/Search';
import Spinner from './components/Spinner';
import MovieCard from './components/MovieCard';
import NamePrompt from './components/NamePrompt';
import { useDebounce } from 'react-use';
import { getTrendingMovies, updateSearchCount } from './appwrite';
import Filters from './components/Filters';


const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [movieList, setMovieList] = useState([]);
  const [TrendingMovies, setTrendingMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [visitorName, setVisitorName] = useState(null);
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [sortBy, setSortBy] = useState('popularity.desc');

  useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);

  const fetchMovies = async (query = '', genre = 'all', sort = 'popularity.desc') => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      let endpoint = '';
      if (query) {
        endpoint = `${API_BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`;
      } else {
        endpoint = `${API_BASE_URL}/discover/movie?api_key=${API_KEY}&sort_by=${sort}`;
        if (genre !== 'all') {
          endpoint += `&with_genres=${genre}`;
        }
        if (sort === 'vote_average.desc') {
          endpoint += `&vote_count.gte=100`;
        }
      }

      const response = await fetch(endpoint);

      if (!response.ok) {
        throw new Error('Failed to fetch movies');
      }

      const data = await response.json();
      let results = data.results || [];

      if (query) {
        if (genre !== 'all') {
          results = results.filter(movie => movie.genre_ids && movie.genre_ids.includes(genre));
        }

        if (sort === 'vote_average.desc') {
          results.sort((a, b) => b.vote_average - a.vote_average);
        } else if (sort === 'popularity.desc') {
          results.sort((a, b) => b.popularity - a.popularity);
        } else if (sort === 'primary_release_date.desc') {
          results.sort((a, b) => new Date(b.release_date || 0) - new Date(a.release_date || 0));
        } else if (sort === 'primary_release_date.asc') {
          results.sort((a, b) => new Date(a.release_date || 0) - new Date(b.release_date || 0));
        }
      }

      setMovieList(results);
      if (query && results.length > 0) {
        await updateSearchCount(query, results[0]);
      }
    } catch (error) {
      console.error(`Error fetching movies: ${error}`);
      setErrorMessage('Error fetching movies. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies();
      setTrendingMovies(movies || []);
    } catch (error) {
      console.error(`Error fetching trending movies: ${error}`);
      setTrendingMovies([]);
    }
  };

  useEffect(() => {
    fetchMovies(debouncedSearchTerm, selectedGenre, sortBy);
  }, [debouncedSearchTerm, selectedGenre, sortBy]);

  useEffect(() => {
    loadTrendingMovies();
  }, []);

  useEffect(() => {
    const storedName = localStorage.getItem('visitorName');
    if (storedName && storedName !== 'null') {
      setVisitorName(storedName);
    } else {
      localStorage.removeItem("visitorName"); // clean up
    }
  }, []);

  const handleSearch = (term) => {
    setSearchTerm(term);
    if (term.trim() !== '') {
      setSelectedGenre('all');
    }
  };

  const handleGenreChange = (genreId) => {
    setSelectedGenre(genreId);
    if (genreId !== 'all') {
      setSearchTerm('');
    }
  };

  // 🚧 If name is not entered, show NamePrompt
  if (!visitorName) {
    return <NamePrompt onNameEntered={setVisitorName} />;
  }

  // ✅ Show main app after name is entered
  return (
    <main>
      <div className="pattern" />
      <div className="wrapper">
        <header>
          <img src="/hero.png" alt="Hero banner" />
          <h1>
            Welcome, <span className="text-gradient">{visitorName}</span> Find <span className="text-gradient">Movies</span> You'll Enjoy Without the Hassle
          </h1>
          <Search searchTerm={searchTerm} onSearch={handleSearch} sortBy={sortBy} onSortChange={setSortBy} />
        </header>

        {TrendingMovies.length > 0 && (
          <section className="trending">
            <h2>Trending Movies</h2>
            <ul>
              {TrendingMovies.map((movie, index) => (
                <li key={movie.$id}>
                  <p>{index + 1}</p>
                  <img src={movie.poster_url} alt={movie.title} />
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="all-movies">
          <h2>All Movies</h2>
          <Filters
            selectedGenre={selectedGenre}
            onGenreChange={handleGenreChange}
          />
          {isLoading ? (
            <Spinner />
          ) : errorMessage ? (
            <p className="text-red-500">{errorMessage}</p>
          ) : (
            <ul>
              {movieList.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
};

export default App;
