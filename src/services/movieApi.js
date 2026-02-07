const API_KEY = ''; // Thay key của bạn vào đây
const BASE_URL = 'https://api.themoviedb.org/3';

export const getPopularMovies = async (page = 1) => {
  try {
    const response = await fetch(
      `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=vi-VN&page=${page}`
    );
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.error("Fetch error:", error);
    return { results: [], total_pages: 0 };
  }
};