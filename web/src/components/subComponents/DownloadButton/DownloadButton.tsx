/**
 * @file DownloadButton.tsx
 * 
 * @module Components/DownloadButton
 * 
 * @description
 * A component that allows the user to download a file.
 * 
 * @example Default
 * <DownloadButton file={file} />
 */
import './DownloadButton.css';
import React from 'react';
import DownloadIcon from '@mui/icons-material/Download';
import { saveAs } from 'file-saver';

/**
 * @typedef {Object} DownloadButtonProps
 * 
 * @property {string} [className] - The class name to apply to the component.
 * @property {string} [text] - The text to display on the button.
 * @property {string} [file] - The file to download.
 */
export interface DownloadButtonProps {
  className?: string;
  text?: string;
  file?: string;
}

// Handle the download of the file
const handleDownload = (file: string) => {
  if (!file || file === '') {
    return;
  }
  // get file name from file path
  const fileName = file.split('/').pop();
  saveAs(file, fileName);
};

/**
 * @description
 * A component that allows the user to download a file.
 * 
 * @param {DownloadButtonProps} props - The props object with the following properties:
 * 
 * @param {string} [props.className] - The class name to apply to the component.
 * @param {string} [props.text] - The text to display on the button.
 * @param {string} [props.file] - The file to download.
 * 
 * @returns {React.ReactElement} A React component that allows the user to download a file.
 */ 
export const DownloadButton: React.FC<DownloadButtonProps> = ({
  className = '',
  text = 'Download',
  file = '',
}) => (
  <div className={`${className} deleteButtonContainer`}>
    <button onClick={() => handleDownload(file)}>{text} <DownloadIcon></DownloadIcon></button>
  </div>
);
