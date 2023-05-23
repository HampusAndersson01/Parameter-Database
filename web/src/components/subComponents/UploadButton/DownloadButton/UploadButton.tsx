/**
 * @file UploadButton.tsx
 * 
 * @module Components/UploadButton
 * 
 * @description
 * A component that allows the user to upload a file.
 * 
 * @example Default
 * <UploadButton onChange={onChange} />
 */
import './UploadButton.css';
import React, { useRef } from 'react';
import UploadIcon from '@mui/icons-material/Upload';
import { saveAs } from 'file-saver';

/**
 * @typedef {Object} UploadButtonProps
 * 
 * @property {string} [className] - The class name to apply to the component.
 * @property {string} [text] - The text to display on the button.
 * @property {function} [onChange] - The function to call when the file is uploaded.
 */
export interface UploadButtonProps {
  className?: string;
  text?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;

}

/**
 * @description
 * A component that allows the user to upload a file.
 * 
 * @param {UploadButtonProps} props - The props object with the following properties:
 * 
 * @param {string} [props.className] - The class name to apply to the component.
 * @param {string} [props.text] - The text to display on the button.
 * @param {function} [props.onChange] - The function to call when the file is uploaded.
 * 
 * @returns {React.ReactElement} A React component that allows the user to upload a file.
 */
export const UploadButton: React.FC<UploadButtonProps> = ({
  className = '',
  text = 'Upload',
  onChange = () => { },
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle the click of the button
  const handleClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  return (
    <div className={`${className} uploadButtonContainer`}>
      <label htmlFor="excelUpload">
        <button onClick={handleClick}>{text} <UploadIcon></UploadIcon></button>
      </label>
      <input
        ref={inputRef}
        type="file"
        accept=".xlsx, .xls, .csv"
        onChange={onChange}
      />
    </div>
  );
};
