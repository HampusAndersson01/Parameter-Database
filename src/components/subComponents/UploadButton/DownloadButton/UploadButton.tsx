import './UploadButton.css';
import React, { useRef } from 'react';
import UploadIcon from '@mui/icons-material/Upload';
import { saveAs } from 'file-saver';

export interface UploadButtonProps {
  className?: string;
  text?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;

}

export const UploadButton: React.FC<UploadButtonProps> = ({
  className = '',
  text = 'Upload',
  onChange = () => { },
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

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
