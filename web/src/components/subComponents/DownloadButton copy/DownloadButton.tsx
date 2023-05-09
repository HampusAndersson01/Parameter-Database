import './DownloadButton.css';
import React from 'react';
import DownloadIcon from '@mui/icons-material/Download';
import { saveAs } from 'file-saver';

export interface DownloadButtonProps {
  className?: string;
  text?: string;
  file?: string;
}
const handleDownload = (file: string) => {
  if (!file || file === '') {
    return;
  }
  // get file name from file path
  const fileName = file.split('/').pop();
  saveAs(file, fileName);
};

export const DownloadButton: React.FC<DownloadButtonProps> = ({
  className = '',
  text = 'Download',
  file = '',
}) => (
  <div className={`${className} deleteButtonContainer`}>
    <button onClick={() => handleDownload(file)}>{text} <DownloadIcon></DownloadIcon></button>
  </div>
);
