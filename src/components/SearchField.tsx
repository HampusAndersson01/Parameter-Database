import React, { useState } from "react";
import "./SearchField.css";
import SearchIcon from "@mui/icons-material/Search";

function SearchField(props: {
  data: string[];
  placeholder: string;
  id?: string;
}) {
  const [searchValue, setSearchValue] = useState<string>("");
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [showLabel, setShowLabel] = useState<boolean>(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  const handleCategorySelect = (value: string) => {
    console.log("Selected: " + value);
    setSearchValue(value);
    setIsDropdownOpen(false);
  };

  const handleFocus = () => {
    setShowLabel(true);
    setTimeout(() => {
      setIsDropdownOpen(true);
    }, 100);
  };

  const handleBlur = (event: any) => {
    setTimeout(() => {
      if (event.target.value === "") {
        setShowLabel(false);
      }
      setIsDropdownOpen(false);
    }, 100);
  };
  const handleClick = () => {
    console.log("Clicked");
    //TODO Add search functionality
  };
  const handleKeyDown = (event: any) => {
    if (event.key === "Enter") {
      //TODO Add search functionality
      console.log("Enter pressed");
    }
  };

  function getFilteredData() {
    if (searchValue === "") {
      return props.data;
    }
    return props.data.filter((value) => {
      return value.toLowerCase().includes(searchValue.toLowerCase());
    });
  }

  return (
    <div className="SearchField-Container " id={props.id}>
      <fieldset className="Search-Container">
        <legend
          className={
            showLabel ? "SearchField-Label show-label" : "SearchField-Label"
          }
        >
          {props.placeholder}
        </legend>
        <SearchIcon className="Search-Icon" onClick={handleClick}></SearchIcon>
        <input
          className="SearchField-Input"
          onChange={handleInputChange}
          placeholder={showLabel ? "" : props.placeholder}
          value={searchValue}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
        ></input>
        <div className="Dropdown-Container-Div">
          {isDropdownOpen && (
            <ul className="Dropdown-Container">
              {getFilteredData().map((value) => (
                <li key={value} onClick={() => handleCategorySelect(value)}>
                  {value}
                </li>
              ))}
            </ul>
          )}
        </div>
      </fieldset>
    </div>
  );
}

export default SearchField;
