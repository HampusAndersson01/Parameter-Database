import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import "./style/ParameterTable.css";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandedData from "./ExpandedData";
import { DebugContext } from "../context/DebugContext";
import { EditModeContext } from "../context/EditModeContext";
import CachedIcon from "@mui/icons-material/Cached";
import { PendingReloadContext } from "../context/PendingReloadContext";
import { Delete, Edit } from '@mui/icons-material';
import { TableRowProps } from "../models/Parameters";

import MaterialReactTable from 'material-react-table';
import type { MRT_ColumnDef } from 'material-react-table';




function ParameterTable(props: { rows: TableRowProps[] }) {
  const { debugMode } = useContext(DebugContext);
  const { editMode } = useContext(EditModeContext);
  const [rowSelection, setRowSelection] = useState({});
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [expandedRows, setExpandedRows] = useState({});
  const [data, setData] = useState<TableRowProps[]>();

  const { pendingReload, setPendingReload } = useContext(PendingReloadContext);

  const columns = useMemo<MRT_ColumnDef<TableRowProps>[]>(
    () => [    
      {
        accessorKey: 'name', 
        header: 'Name',
        enableClickToCopy: true,
      },
      {
        accessorKey: 'description', 
        header: 'Description',
      },
      {
        accessorKey: 'unit_name', 
        header: 'Unit',
      },
      {
        accessorKey: 'rigfamily_name', 
        header: 'Rig Family',
      },
      {
        accessorKey: 'decimals', 
        header: 'Decimals',
      },
      {
        accessorKey: 'min', 
        header: 'Min',
      },
      {
        accessorKey: 'max',
        header: 'Max',
      },
      {
        accessorKey: 'datatype', 
        header: 'Datatype',
      },
    ],
    []
  );

  useEffect(() => {
    console.log("Selected rows: ", rowSelection);
    //Get selected ids from props.rows and log them
    for (const [key, value] of Object.entries(rowSelection)) {
      if (value) {
        //Set selectedIds to the ids of the selected rows
        setSelectedIds((selectedIds) => [...selectedIds, parseInt(key)]);

      }
    }
  }, [rowSelection]);

  return (
    <div className="Table-Container">
      <MaterialReactTable
      columns={columns}
      data={
        // Iterate through props.rows and return all rows as usual except for the arrays that should be displayed as a string
        props.rows.map((row) => {
          return {
            ...row,
            rigfamily_name: row.rigfamily_name.join(", "),
          };
        })
       }
      enableRowSelection
      enableColumnOrdering
      enableGlobalFilter={false}
      enableStickyHeader
      enableColumnResizing
      enablePinning
      enableHiding
      renderDetailPanel={({ row }) => (
        <ExpandedData
          row={row.original}
          ></ExpandedData>
      )}
      state={{ isLoading: pendingReload, rowSelection }}
      onRowSelectionChange={setRowSelection}

    />
    </div>
  );
}
export default ParameterTable;
