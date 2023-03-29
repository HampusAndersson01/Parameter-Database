import React, { useContext, useEffect, useState } from "react";
import "./style/SearchField.css";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import { EditModeContext } from "../context/EditModeContext";

function SearchField(props: {
  onChange: any;
  data: (string | null)[];
  placeholder: string;
  id?: string;
  defaultValue?: string | null;
}) {
  const [searchValue, setSearchValue] = useState<string>(props.defaultValue || "");
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [showLabel, setShowLabel] = useState<boolean>(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const { clearAll, setClearAll } = useContext(EditModeContext);

  useEffect(() => {
    props.onChange(searchValue);
  }, [searchValue]);

  useEffect(() => {
    if (clearAll) {
      setSearchValue("");
      setShowLabel(false);
      setClearAll(false);
    }
  }, [clearAll]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
    if (!isDropdownOpen) {
      setIsDropdownOpen(true);
      setSelectedIndex(-1);
    }
  };

  const handleCategorySelect = (value: string) => {
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
  const handleKeyDown = (event: any) => {
    if (event.key === "Enter") {
      if (isDropdownOpen) {
        if (selectedIndex === -1) {
          setIsDropdownOpen(false);
        } else {
          handleCategorySelect(getFilteredData()[selectedIndex]);
        }
      }
    }
    if (event.key === "Escape") {
      setIsDropdownOpen(false);
    }
    if (event.key === "ArrowDown") {
      if (selectedIndex < getFilteredData().length - 1) {
        setSelectedIndex(selectedIndex + 1);
        if (listRef.current) {
          listRef.current.children[selectedIndex + 1].scrollIntoView({
            block: "end",
            behavior: "smooth",
          });
        }
      }
    }
    if (event.key === "ArrowUp") {
      if (selectedIndex > 0) {
        setSelectedIndex(selectedIndex - 1);
      }
    }
  };
  const handleHoverEnter = (event: any) => {
    setSelectedIndex(parseInt(event.target.id));
  };
  const handleHoverLeave = (event: any) => {
    setSelectedIndex(-1);
  };

  const handleClear = () => {
    setSearchValue("");
    setShowLabel(false);
  };

  function getFilteredData() {
    const filteredData = props.data.filter(
      (value) => value !== null
    ) as string[];
    if (searchValue === "") {
      return filteredData;
    }
    return filteredData.filter((value) =>
      value.toLowerCase().includes(searchValue.toLowerCase())
    );
  }

  const listRef = React.useRef<HTMLUListElement>(null);
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

        <input
          className="SearchField-Input"
          onChange={handleInputChange}
          placeholder={showLabel ? "" : props.placeholder}
          value={searchValue}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          
        ></input>
        <div className={searchValue !== "" ? "clearIcon show" : "clearIcon"}>
          <ClearIcon onClick={handleClear}></ClearIcon>
        </div>

        <div className="Dropdown-Container-Div">
          {isDropdownOpen && (
            <ul className="Dropdown-Container" ref={listRef}>
              {getFilteredData().map((value, index) => (
                <li
                  className={selectedIndex === index ? "selected" : ""}
                  id={index.toString()}
                  onMouseEnter={handleHoverEnter}
                  onMouseLeave={handleHoverLeave}
                  key={value}
                  onClick={() => handleCategorySelect(value)}
                >
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
