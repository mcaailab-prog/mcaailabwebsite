'use client';

import { useState } from 'react';

interface SearchResult {
  type: string;
  title: string;
  url: string;
}

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!query) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/search?query=${query}`);
      if (!response.ok) {
        throw new Error('Search failed');
      }
      const data = await response.json();
      setResults(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Search</h1>
      <div className="flex mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full border rounded-l-md px-3 py-2"
          placeholder="Search for projects, news, publications..."
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-4 py-2 rounded-r-md"
        >
          Search
        </button>
      </div>

      {loading && <div>Loading...</div>}
      {error && <div className="text-red-500">{error}</div>}

      <div>
        {results.map((result, index) => (
          <div key={index} className="mb-4 p-4 border rounded-md">
            <span className="text-sm font-semibold text-gray-500">{result.type}</span>
            <h2 className="text-xl font-bold">
              <a href={result.url} className="text-blue-500 hover:underline">
                {result.title}
              </a>
            </h2>
          </div>
        ))}
      </div>
    </div>
  );
}
