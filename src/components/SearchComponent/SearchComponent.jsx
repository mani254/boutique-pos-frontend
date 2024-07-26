import React, { useState, useEffect } from "react";
import { IoSearch } from "react-icons/io5";
import axios from "axios";
import Loader from "../Loader/Loader";

function SearchComponent() {
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [debounceTimeout, setDebounceTimeout] = useState(null);

  useEffect(() => {
    if (inputValue.length > 3) {
      if (debounceTimeout) clearTimeout(debounceTimeout);
      const timeout = setTimeout(() => {
        fetchData();
      }, 400); // 400ms debounce time
      setDebounceTimeout(timeout);
    } else {
      setSuggestions([]);
    }
  }, [inputValue]);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `https://pokeapi.co/api/v2/pokemon?limit=1000`,
      );
      const filteredSuggestions = response.data.results.filter((pokemon) =>
        pokemon.name.toLowerCase().includes(inputValue.toLowerCase()),
      );
      setSuggestions(filteredSuggestions);
    } catch (error) {
      console.error("Error fetching data", error);
      setSuggestions([]);
    }
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  return (
    <div className="w-full max-w-xs">
      <div className="relative">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
          <IoSearch className="text-gray-500" />
        </span>
        <input
          type="text"
          className="py-2 pl-10 pr-3 sm:text-sm"
          placeholder="Search anything"
          value={inputValue}
          onChange={handleInputChange}
        />
        {suggestions.length > 0 && (
          <ul className="absolute mt-2 max-h-40 w-full overflow-scroll rounded-md border-2 border-gray-200 bg-white px-2 shadow-lg">
            {suggestions.map((suggestion, index) => (
              <li
                className="cursor-pointer px-2 py-1 hover:bg-gray-100"
                key={index}
              >
                {suggestion.name}
              </li>
            ))}
          </ul>
        )}
        {inputValue.length > 3 && suggestions.length === 0 && (
          <div className="absolute mt-2 flex max-h-40 w-full items-center justify-center rounded-md border-2 border-gray-200 bg-white px-2 shadow-lg">
            No results found
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchComponent;
