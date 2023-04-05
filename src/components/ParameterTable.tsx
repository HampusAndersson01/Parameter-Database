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
import { useNavigate } from "react-router-dom";

import MaterialReactTable, { MRT_FullScreenToggleButton, MRT_Row, MRT_ShowHideColumnsButton } from "material-react-table";
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
import { AccountCircle } from "@mui/icons-material";

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
    ],
    []
  );

  useEffect(() => {
    console.log("Selected rows: ", rowSelection);
  }, [rowSelection]);

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
        renderTopToolbarCustomActions={() => (
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
        muiTableBodyCellProps={({ cell }) => ({
          onDoubleClick: () => {
            navigate(`/parameter/${cell.row.original.id}`);
          },
          sx: {
            cursor: 'double-arrow',
          },
        })}
        renderToolbarInternalActions={({ table }) => (
          <>
            <p>To open details, double click on a parameter row.</p>
            <MRT_ShowHideColumnsButton table={table} />
            <MRT_FullScreenToggleButton table={table} />
          </>
        )}

      ></MaterialReactTable>
    </div>
  );
}
export default ParameterTable;
