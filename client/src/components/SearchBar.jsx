import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";

const SearchBar = ({
  value,
  onSearch,
}) => {
  /*
  ==================================================
  LOCAL SEARCH INPUT
  ==================================================
  */

  const [input, setInput] = useState(
    value || ""
  );

  /*
  ==================================================
  KEEP INPUT IN SYNC WITH REDUX
  ==================================================
  */

  useEffect(() => {
    setInput(value || "");
  }, [value]);

  /*
  ==================================================
  DEBOUNCED SEARCH
  ==================================================

  Search automatically after the user stops
  typing for 400 milliseconds.

  Example:

  l
  ↓
  wait 400ms
  ↓
  search

  la
  ↓
  wait 400ms
  ↓
  search

  lap
  ↓
  wait 400ms
  ↓
  search

  laptop
  ↓
  wait 400ms
  ↓
  search
  */

  useEffect(() => {
    /*
    Don't search again when the input
    is initially synchronized from Redux.
    */

    const timer = setTimeout(() => {
      const trimmedInput =
        input.trim();

      /*
      Only call onSearch when the value
      is different from the current
      parent value.
      */

      if (
        trimmedInput !==
        (value || "").trim()
      ) {
        onSearch(trimmedInput);
      }
    }, 400);

    /*
    Clear the previous timer when the
    user types another character.
    */

    return () => {
      clearTimeout(timer);
    };
  }, [
    input,
    value,
    onSearch,
  ]);

  /*
  ==================================================
  MANUAL SEARCH BUTTON
  ==================================================
  */

  const handleSubmit = (
    event
  ) => {
    event.preventDefault();

    /*
    Search immediately when the user
    explicitly clicks the Search button.
    */

    onSearch(
      input.trim()
    );
  };

  /*
  ==================================================
  CLEAR SEARCH
  ==================================================
  */

  const handleClear = () => {
    setInput("");

    /*
    Immediately clear the Redux search
    instead of waiting 400ms.
    */

    onSearch("");
  };

  /*
  ==================================================
  UI
  ==================================================
  */

  return (
    <form
      onSubmit={handleSubmit}
      className="shopsphere-search-form"
    >

      {/* ==========================================
          SEARCH INPUT
      ========================================== */}

      <div className="shopsphere-search-input-wrapper">

        <FaSearch
          className="shopsphere-search-icon"
        />

        <input
          type="search"
          className="shopsphere-search-input"
          placeholder="Search laptops, phones, headphones..."
          value={input}
          onChange={(event) =>
            setInput(
              event.target.value
            )
          }
          aria-label="Search products"
        />

        {/* ========================================
            CLEAR BUTTON
        ======================================== */}

        {input && (
          <button
            type="button"
            className="shopsphere-search-clear"
            onClick={handleClear}
            aria-label="Clear search"
          >
            ×
          </button>
        )}

      </div>


      {/* ==========================================
          SEARCH BUTTON
      ========================================== */}

      <button
        type="submit"
        className="shopsphere-search-button"
      >

        <FaSearch />

        <span>
          Search
        </span>

      </button>

    </form>
  );
};

export default SearchBar;