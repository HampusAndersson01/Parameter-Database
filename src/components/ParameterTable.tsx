import React, {
  useContext,
  useEffect,
  useMemo,
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

import MaterialReactTable, { } from "material-react-table";
import type { MRT_ColumnDef } from "material-react-table";
import {
  Box,
  Button,
  IconButton,
} from "@mui/material";
import { APIContext } from "../context/APIContext";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import DeleteIcon from '@mui/icons-material/Delete';

function ParameterTable(props: { data: TableRowProps[] }) {
  const { debugMode } = useContext(DebugContext);
  const { editMode } = useContext(EditModeContext);
  const [rowSelection, setRowSelection] = useState({});
  const { hostname } = useContext(APIContext);
  const navigate = useNavigate();

  const [createModalOpen, setCreateModalOpen] = useState(false);

  const { pendingReload, setPendingReload } = useContext(PendingReloadContext);

  const root = document.documentElement;

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
        accessorKey: "unit.name",
        header: "Unit",
      },
      {
        accessorFn: (originalRow) => originalRow.rigFamily.map((rigFamily) => rigFamily.name).join(", "),
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
        accessorKey: "creation_date",
        id: "creation_date",
        header: "Creation Date",
        filterFn: 'equals',
        sortingFn: 'datetime',
        //render string date in custom format
        Cell: ({ cell }) => {
          var dateTmp = cell.getValue() as Date | null;
          if (dateTmp === null || dateTmp === undefined) return "";
          return dateTmp.toLocaleDateString('sv-SE', { year: 'numeric', month: '2-digit', day: '2-digit' });
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
        accessorKey: "modified_date",
        id: "modified_date",
        header: "Last Modified",
        filterFn: 'equals',
        sortingFn: 'datetime',
        //render string date in custom format
        Cell: ({ cell }) => {
          var dateTmp = cell.getValue() as Date | null;
          if (dateTmp === null || dateTmp === undefined) return "";
          return dateTmp.toLocaleDateString('sv-SE', { year: 'numeric', month: '2-digit', day: '2-digit' });
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
    if (Object.keys(rowSelection).length !== 0) {
      root.style.setProperty("--tableHeight", "calc(100vh - var(--Toolbar-Height) - (56px * 2) - 15px - 55px)");

    } else {
      root.style.setProperty("--tableHeight", "calc(100vh - var(--Toolbar-Height) - (56px * 2) - 15px)");
    }
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
        var dbID = props.data[parseInt(key)].id;
        deleteData(dbID);
      }
    }
  };


  return (
    <div className="Table-Container">
      <MaterialReactTable
        columns={columns}
        data={
          props.data
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
        onRowSelectionChange={setRowSelection}
        autoResetPageIndex={false}
        autoResetExpanded={false}
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
