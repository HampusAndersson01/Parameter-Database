import React, { useState } from "react";
import "./SearchField.css";
import { createComponent } from "@lit-labs/react";
import { SystemIcon as SystemIconWebComponent } from "@volvo/vcdk";

// React component wrapper
const VolvoIcon = createComponent(
  React,
  "volvo-system-icon",
  SystemIconWebComponent,
  {
    onClick: "click",
  }
);

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
    //FIXME Not selecting anything on click
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
        <VolvoIcon
          className="Search-Icon"
          icon="search"
          onclick={handleClick}
        ></VolvoIcon>
        <input
          className="SearchField-Input"
          onChange={handleInputChange}
          placeholder={showLabel ? "" : props.placeholder}
          value={searchValue}
          onFocus={handleFocus}
          onBlur={handleBlur}
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
