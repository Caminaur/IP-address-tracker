import React from "react";
import arrowIcon from "../assets/images/icon-arrow.svg";

interface InputIPSearchProps {
  inputValue: string;
  handleDataEntry: (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.KeyboardEvent<HTMLInputElement>
  ) => void;
  handleSearchEvent: () => void;
  errorValue: string;
}

function InputIPSearch({
  inputValue,
  handleDataEntry,
  handleSearchEvent,
  errorValue,
}: InputIPSearchProps) {
  return (
    <div className="flex flex-col items-center justify-center w-full  max-w-140">
      <div className="bg-white rounded-lg overflow-hidden w-full flex justify-between">
        <input
          className="w-full pl-4 border-gray-500 focus:border-gray-300 pointer-events-auto font-semibold cursor-pointer"
          type="text"
          max={15}
          value={inputValue}
          onKeyDown={(e) => handleDataEntry(e)}
          onChange={handleDataEntry}
          placeholder="Search for any IP address or domain"
        />
        <button
          className="bg-black p-5 cursor-pointer pointer-events-auto transition-colors duration-300 hover:bg-very-dark-gray"
          type="button"
          onClick={handleSearchEvent}
          aria-label="Search"
        >
          <img src={arrowIcon} alt="" />
        </button>
      </div>
      <p className="text-red-500">{errorValue}</p>
    </div>
  );
}

export default InputIPSearch;
