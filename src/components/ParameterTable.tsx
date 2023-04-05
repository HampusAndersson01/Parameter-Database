import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import "./style/ParameterTable.css";
import { DebugContext } from "../context/DebugContext";
import { EditModeContext } from "../context/EditModeContext";
import { PendingReloadContext } from "../context/PendingReloadContext";
import { TableRowProps } from "../models/Parameters";
import { Link, useNavigate } from "react-router-dom";

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import MaterialReactTable, { MRT_FullScreenToggleButton, MRT_Row, MRT_ShowHideColumnsButton, MRT_ToggleDensePaddingButton, MRT_ToggleFiltersButton } from "material-react-table";
import type { MRT_ColumnDef } from "material-react-table";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  IconButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Tooltip,
} from "@mui/material";
import { APIContext } from "../context/APIContext";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import DeleteIcon from '@mui/icons-material/Delete';
import { sortingFns } from "@tanstack/table-core";

function ParameterTable(props: { rows: TableRowProps[] }) {
  const { debugMode } = useContext(DebugContext);
  const { editMode } = useContext(EditModeContext);
  const [rowSelection, setRowSelection] = useState({});
  const { hostname } = useContext(APIContext);
  const navigate = useNavigate();

  const [createModalOpen, setCreateModalOpen] = useState(false);

  const { pendingReload, setPendingReload } = useContext(PendingReloadContext);

  const columns = useMemo<MRT_ColumnDef<TableRowProps>[]>(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        enableClickToCopy: true,
      },
      {
        accessorKey: "name",
        header: "Name",
        enableClickToCopy: true,
      },
      {
        accessorKey: "description",
        header: "Description",
      },
      {
        accessorKey: "unit_name",
        header: "Unit",
      },
      {
        accessorKey: "rigfamily_name",
        header: "Rig Family",
      },
      {
        accessorKey: "decimals",
        header: "Decimals",
      },
      {
        accessorKey: "min",
        header: "Min",
      },
      {
        accessorKey: "max",
        header: "Max",
      },
      {
        accessorKey: "comment",
        header: "Comment",
      },
      {
        accessorKey: "datatype",
        header: "Datatype",
      },
      {
        accessorFn: (row) => row.creation_date !== null ? new Date(row.creation_date) : "",
        id: "creation_date",
        header: "Creation Date",
        filterFn: 'equals',
        sortingFn: 'datetime',
        //render string date in custom format
        Cell: ({ cell }) => {
          var dateTmp = cell.getValue();
          if (dateTmp === "" || dateTmp === undefined) return "";
          const date = new Date(dateTmp);
          return date.toLocaleDateString('sv-SE', { year: 'numeric', month: '2-digit', day: '2-digit' });
        },
        //render date picker for filtering
        Filter: ({ column }) => (
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              format="YYYY-MM-DD"
              onChange={(newValue) => {
                column.setFilterValue(newValue);
              }}
              slotProps={{
                textField: {
                  helperText: 'Filter Mode: Equals',
                  sx: { minWidth: '120px' },
                  variant: 'standard',
                },
              }}
              value={column.getFilterValue()}
            />
          </LocalizationProvider>
        ),

      },
      {
        accessorFn: (row) => row.modified_date !== null ? new Date(row.modified_date) : "",
        id: "modified_date",
        header: "Last Modified",
        filterFn: 'equals',
        sortingFn: 'datetime',
        //render string date in custom format
        Cell: ({ cell }) => {
          var dateTmp = cell.getValue();
          if (dateTmp === "" || dateTmp === undefined) return "";
          const date = new Date(dateTmp);
          return date.toLocaleDateString('sv-SE', { year: 'numeric', month: '2-digit', day: '2-digit' });
        },
        //render date picker for filtering
        Filter: ({ column }) => (
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              format="YYYY-MM-DD"
              onChange={(newValue) => {
                column.setFilterValue(newValue);
              }}
              slotProps={{
                textField: {
                  helperText: 'Filter Mode: Equals',
                  sx: { minWidth: '120px' },
                  variant: 'standard',
                },
              }}
              value={column.getFilterValue()}
            />
          </LocalizationProvider>
        ),

      },
      {
        accessorKey: "created_by",
        header: "Created By",
      },
      {
        accessorKey: "modified_by",
        header: "Last Modified By",
      },
    ],
    []
  );

  useEffect(() => {
    console.log("Selected rows: ", rowSelection);
  }, [rowSelection]);

  // Docs: Function to delete a row from the database using the id
  const deleteData = async (id: number) => {
    try {
      await fetch(hostname + `parameters/${id}`, {
        method: "DELETE",
      })
        .catch((error) => console.log(error))
        .finally(() => console.log(id + " Deleted"));
      setPendingReload(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteRows = () => {
    if (Object.keys(rowSelection).length === 0) {
      alert("No rows selected");
      return;
    }
    if (
      !confirm(
        "Are you sure you want to delete selected row(s)? This cannot be undone."
      )
    ) {
      return;
    }
    console.log("Deleting rows: ", rowSelection);

    for (const [key, value] of Object.entries(rowSelection)) {
      if (value) {
        var dbID = props.rows[parseInt(key)].id;
        deleteData(dbID);
      }
    }
  };


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
        enableColumnFilterModes
        enableGlobalFilter={false}
        enableStickyHeader
        enableColumnResizing
        enablePinning
        enableHiding
        state={{ isLoading: pendingReload, rowSelection }}
        initialState={{
          density: "compact",
          pagination: { pageSize: 25, pageIndex: 0 },
          showColumnFilters: true,
          columnVisibility: {
            comment: false,
            datatype: false,
            id: false,
            creation_date: false,
            modified_date: false,
            created_by: false,
            modified_by: false,
          },
        }}
        defaultColumnFilter={{
          openOnLoad: true,
        }}
        onRowSelectionChange={setRowSelection}
        autoResetPageIndex={false}
        autoResetSelectedRows={false}
        autoResetSortBy={false}
        autoResetExpanded={false}
        autoResetFilters={false}
        enableMultiRemove={true}
        //If rowSelection is empty, hide the delete button
        renderTopToolbarCustomActions={() => (
          Object.keys(rowSelection).length === 0 ? null :
          <Button
            color="primary"
            onClick={() => {
              handleDeleteRows();
            }}
            variant="outlined"
          >
            Delete Selected
            </Button> 

        )}
        enableRowActions
        displayColumnDefOptions={{
          'mrt-row-actions': {
            header: 'Open | Delete', //change header text
            size: 100, //make actions column wider
          },
        }}
        renderRowActions={({ row }) => (
          <Box>
            {/* <IconButton className="openIcon" key="open" onClick={() => navigate(`/parameter/${row.original.id}`)}>
              <ArrowForwardIcon />
            </IconButton > */}
            <Link to={`/parameter/${row.original.id}`}>
              <IconButton className="openIcon" key="open" >
                <ArrowForwardIcon />
              </IconButton >
            </Link>

            <IconButton className="deleteIcon" key="delete" onClick={() => {
              if (confirm("Are you sure you want to delete this row? This cannot be undone.")) {
                deleteData(row.original.id)
              }
            }}>
              <DeleteIcon />
            </IconButton >
          </Box>
        )}

      ></MaterialReactTable>
    </div>
  );
}
export default ParameterTable;
