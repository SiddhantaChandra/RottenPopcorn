import { useEffect } from 'react';
import { useRef } from 'react';

export function Search({ query, setQuery }) {
  const inputElement = useRef(null);

  useEffect(() => {
    function callback(e) {
      if (document.activeElement === inputElement.current) return;

      if (e.code === 'Enter') {
        inputElement.current.focus();
        setQuery('');
      }
    }

    document.addEventListener('keydown', callback);
    return () => document.addEventListener('keydown', callback);
  }, [setQuery]);

  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      ref={inputElement}
    />
  );
}
