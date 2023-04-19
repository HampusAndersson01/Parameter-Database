import React from 'react';
import { createBoard } from '@wixc3/react-board';
import ExcelImport from '../../../components/ExcelImport';

export default createBoard({
  name: 'ExcelImport',
  Board: () => <ExcelImport key={null} />,
});
