import { Poem } from '../types';

const BASE_URL = 'https://poetrydb.org';

export const fetchRandomPoem = async (): Promise<Poem> => {
  try {
    const response = await fetch(`${BASE_URL}/random`);
    if (!response.ok) {
      throw new Error(`Failed to fetch poem: ${response.statusText}`);
    }
    const data = await response.json();
    
    // PoetryDB returns an array, even for a single random item
    if (Array.isArray(data) && data.length > 0) {
      return data[0] as Poem;
    }
    
    throw new Error('Invalid response format from PoetryDB');
  } catch (error) {
    console.error('Poetry Fetch Error:', error);
    throw error;
  }
};
