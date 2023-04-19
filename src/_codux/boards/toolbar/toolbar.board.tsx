import React from 'react';
import { createBoard } from '@wixc3/react-board';
import Toolbar from '../../../components/Toolbar';

export default createBoard({
    name: 'Toolbar',
    Board: () => <Toolbar />
});
