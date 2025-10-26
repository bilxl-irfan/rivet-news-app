const API_KEY = 'b0b2991be8a84ac3b3e5110c298df62c'; // Make sure your API key is here

export const getNews = async (category: string = '') => {
  try {
    // Build URL based on category
    const baseURL = 'https://newsapi.org/v2/top-headlines';
    const params = new URLSearchParams({
      country: 'us',
      apiKey: API_KEY,
    });
    
    // Add category if specified
    if (category && category !== 'all') {
      params.append('category', category);
    }
    
    const URL = `${baseURL}?${params.toString()}`;
    
    const response = await fetch(URL);
    const result = await response.json();
    return result.articles;
  } catch (error) {
    console.error('Error fetching news:', error);
    throw error;
  }
};
