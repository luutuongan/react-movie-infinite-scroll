import React, { useState, useEffect, useRef } from 'react';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll';
import { getPopularMovies } from '../../services/movieApi';
import { Star, Film, Loader2 } from 'lucide-react';

// Import SCSS Module ở đây
import styles from './MovieList.module.scss';

const MovieListTable = () => {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // CHIẾC KHÓA QUAN TRỌNG: 
  // useRef không thay đổi khi component re-render, giúp chặn trigger trùng lặp
  const isFetching = useRef(false);

  const loadMovies = async (pageNum) => {
    // Nếu đang bận thì tuyệt đối không làm gì cả
    if (isFetching.current) return;
    
    isFetching.current = true;
    setLoading(true);
    
    console.log(`🚀 Đang gọi API cho trang: ${pageNum}`);
    
    try {
      const data = await getPopularMovies(pageNum);
      
      if (data.results && data.results.length > 0) {
        setMovies(prev => [...prev, ...data.results]);
        setHasMore(pageNum < data.total_pages);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      // Chỉ mở khóa sau khi đã nhận xong data
      setLoading(false);
      isFetching.current = false;
    }
  };

  // Chỉ dùng useEffect cho lần đầu tiên (Trang 1)
  useEffect(() => {
    loadMovies(1);
  }, []);

  // Lắng nghe sự thay đổi của page để gọi trang tiếp theo
  useEffect(() => {
    if (page > 1) {
      loadMovies(page);
    }
  }, [page]);

  const lastRowRef = useInfiniteScroll(loading, hasMore, () => {
    // Chỉ tăng page nếu không đang trong quá trình fetch
    if (!isFetching.current && hasMore) {
      setPage(prev => prev + 1);
    }
  });

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1><Film /> Movie Explorer</h1>
        <span>Trang: {page}</span>
      </header>

      <div className={styles.tableWrapper}>
        <table>
          <thead>
            <tr>
              <th>Poster</th>
              <th>Tên phim</th>
              <th>Ngày chiếu</th>
              <th>Đánh giá</th>
            </tr>
          </thead>
          <tbody>
            {movies.map((movie, index) => {
              const isLast = movies.length === index + 1;
              return (
                <tr key={`${movie.id}-${index}`} ref={isLast ? lastRowRef : null}>
                  <td>
                    <img 
                      className={styles.posterImg}
                      src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`} 
                      alt="" 
                    />
                  </td>
                  <td>
                    <div className={styles.movieTitle}>{movie.title}</div>
                  </td>
                  <td>{movie.release_date}</td>
                  <td><Star size={14} /> {movie.vote_average}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {loading && (
          <div className={styles.loadingArea}>
            <Loader2 className="animate-spin" />
            <p>Đang tải phim...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieListTable;