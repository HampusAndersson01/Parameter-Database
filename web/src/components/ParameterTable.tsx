/**
 * @file ParameterTable.tsx
 * @module Components/ParameterTable
 * 
 * @description
 * A component that allows the user to display a table of parameters.
 * 
 * @example Default
 * <ParameterTable data={data} />
 * 
 */
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
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import MaterialReactTable, { MRT_DefinedColumnDef } from "material-react-table";
import type { MRT_ColumnDef, MRT_ColumnFiltersState, MRT_PaginationState, MRT_SortingState, MRT_VisibilityState } from "material-react-table";
import {
  Box,
  Button,
  IconButton,
  Modal,
  Typography,
} from "@mui/material";
import { APIContext } from "../context/APIContext";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import DeleteIcon from '@mui/icons-material/Delete';
import CachedIcon from '@mui/icons-material/Cached';
import { idsToExcel } from "../hooks/Excel/Excel";

/**
 * @typedef {Object} ParameterTableProps
 * 
 * @property {TableRowProps[]} data - The data to display in the table
 * 
 * @returns {JSX.Element} - The resulting JSX element
 */
function ParameterTable(props: { data: TableRowProps[] }) {
  const { debugMode } = useContext(DebugContext);
  const { editMode } = useContext(EditModeContext);
  const [rowSelection, setRowSelection] = useState({});
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [deleteRows, setDeleteRows] = useState<TableRowProps[]>([]);
  const { hostname } = useContext(APIContext);
  const navigate = useNavigate();
  const [firstRender, setFirstRender] = useState(true);

  const { pendingReload, setPendingReload } = useContext(PendingReloadContext);

  const root = document.documentElement;

  //table state
  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>(
    [],
  );

  const [tempPage, setTempPage] = useState(0);

  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 50,
  });

  const defaultColumnVisibility: MRT_VisibilityState = {
    comment: false,
    datatype: false,
    id: false,
    creation_date: false,
    modified_date: false,
    created_by: false,
    modified_by: false,
    name: true,
    description: true,
    "unit.name": true,
    min: true,
    max: true,
    "rig family": true,
    decimals: true,
  }


  const [columnVisibility, setColumnVisibility] = useState<MRT_VisibilityState>(
    defaultColumnVisibility,
  );

  const [searchParams, setSearchParams] = useSearchParams();

  // Set table state from search params on initial render
  useEffect(() => {
    searchParams.forEach((value, key) => {
    });
    searchParams.forEach((value, key) => {
      if (key !== "page" && key !== "pageSize") {
        // Set default column visibility key to true if present in search params
        setColumnVisibility((prev) => ({
          ...prev,
          [key]: true,
        }));
        setColumnFilters((prev) => [
          ...prev,
          { id: key, value: value },
        ]);
      }
    });
    setPagination({
      pageIndex: 0,
      pageSize: parseInt(searchParams.get("pageSize") || "50"),
    });
    setTempPage(parseInt(searchParams.get("page") || "0"));
  }, []);

  useEffect(() => {
    if (props.data.length === 0) {
      return;
    }
    setPagination((prev) => ({
      ...prev,
      pageIndex: tempPage,
    }));
  }, [props.data]);


  // Set search params when table state changes
  useEffect(() => {
    if (firstRender) {
      setFirstRender(false);
      return;
    }
    const params = new URLSearchParams();
    //Loop through column filters and add to params
    columnFilters.forEach((filter) => {
      if (filter.value !== "") {
        params.set(filter.id, filter.value as string);
      }
    });
    if (!pendingReload) {
      if (pagination.pageIndex !== 0) params.set('page', pagination.pageIndex.toString());
      if (pagination.pageSize !== 50) params.set('pageSize', pagination.pageSize.toString());
    }

    setSearchParams(params);
  }, [columnFilters, pagination, columnVisibility]);

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
        accessorFn: (originalRow) => new Date(originalRow.creation_date || ""),
        id: "creation_date",
        header: "Creation Date",
        sortingFn: 'datetime',
        enableColumnFilter: false,
        //render string date in custom format
        Cell: ({ cell }) => {
          var dateTmp = cell.getValue() as Date | null;
          if (dateTmp === null || dateTmp === undefined) return "";
          return dateTmp.toLocaleDateString('sv-SE', { year: 'numeric', month: '2-digit', day: '2-digit' });
        },
      },
      {
        accessorFn: (originalRow) => new Date(originalRow.modified_date || ""),
        id: "modified_date",
        header: "Last Modified",
        enableColumnFilter: false,
        sortingFn: 'string',
        //render string date in custom format
        Cell: ({ cell }) => cell.getValue<Date>()?.toLocaleDateString('sv-SE', { year: 'numeric', month: '2-digit', day: '2-digit' }),
        Header: ({ column }) => <em>{column.columnDef.header}</em>,
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

  // Docs: Function to delete a row from the database using the id
  const deleteData = async (id: number) => {
    try {
      await fetch(hostname + `parameters/${id}`, {
        method: "DELETE",
      })
        .catch((error) => console.error(error))
        .finally(() => console.log(id + " Deleted"));
      setPendingReload(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteRows = (rows: any) => {
    if (rows.length === 0) {
      alert("No rows selected");
      return;
    }
    setDeleteRows(rows);
    setOpenDeleteConfirm(true);
  };

  const handleDeleteConfirm = (rows: any) => {
    for (const [key, value] of Object.entries(rows)) {
      if (value) {
        var dbID = props.data[parseInt(key)].id;
        deleteData(dbID);
      }
    }
    setOpenDeleteConfirm(false);
    setRowSelection({});
  };

  const handleExport = (rows: any) => {
    if (rows.length === 0) {
      alert("No rows selected");
      return;
    }
    let ids = [];
    for (const [key, value] of Object.entries(rowSelection)) {
      if (value === true) {
        ids.push(props.data[Number(key)].id);
      }
    }
    idsToExcel(ids, props.data);
  };

  return (
    <div className="Table-Container">
      <Modal
        className="deleteConfirmModal"
        open={openDeleteConfirm}
        onClose={() => setOpenDeleteConfirm(false)}
        aria-labelledby="deleteConfirmModal"
        aria-describedby="deleteConfirmModal"
      >
        <Box>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Delete {Object.keys(deleteRows).length} row(s)?
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Are you sure you want to delete {Object.keys(deleteRows).length} row(s)?
          </Typography>
          <Button onClick={() => handleDeleteConfirm(deleteRows)}>Delete</Button>
          <Button onClick={() => setOpenDeleteConfirm(false)}>Cancel</Button>
        </Box>
      </Modal>
      {/* https://www.material-react-table.com/ */}
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
        state={{ isLoading: pendingReload, rowSelection, columnFilters, pagination, columnVisibility }}
        initialState={{
          density: "compact",
          pagination: { pageSize: 50, pageIndex: 0 },
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
        muiTablePaginationProps={{
          rowsPerPageOptions: [10, 25, 50, 100, 250],
        }}
        onColumnFiltersChange={setColumnFilters}
        onPaginationChange={setPagination}
        onColumnVisibilityChange={setColumnVisibility}
        autoResetPageIndex={false}
        autoResetExpanded={false}
        enableMultiRemove={true}
        //If rowSelection is empty, hide the delete button
        renderTopToolbarCustomActions={() => (
          <div className="reloadSelectButtons">
            <Button
              color="primary"
              onClick={() => {
                setPendingReload(true);
              }}
              variant="text"
              className="reloadButtons"
            >
              <CachedIcon sx={{ transform: `rotate(${pendingReload ? 360 : 0}deg)` }}></CachedIcon>
            </Button>
            {Object.keys(rowSelection).length === 0 ? null :
              <>
                {/* 2 of 3227 row(s) selected */}
                <div className="selectedRowsLabel">
                  {Object.keys(rowSelection).length} of {props.data.length} row(s) selected
                </div>
                <Button
                  color="primary"
                  onClick={() => {
                    handleDeleteRows(rowSelection);
                  }}
                  variant="outlined"
                  className="selectedButtons"
                >
                  Delete Selected
                </Button>
                <Button
                  color="primary"
                  onClick={() => {
                    handleExport(rowSelection);
                  }}
                  variant="outlined"
                  className="selectedButtons"
                >
                  Export Selected to Excel
                </Button>
              </>
            }
          </div>
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
              handleDeleteRows({ [row.index]: true });
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
