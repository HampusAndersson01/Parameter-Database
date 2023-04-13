import "./style/PossibleValues.css";
import React, { useState, useEffect, useContext } from "react";
import { Possible_value, TableRowProps } from "../models/Parameters";
import { allowEdit } from "../hooks/EditMode/EditMode";

function PossibleValues(props: { data: Possible_value[] | null; onChange: any }) {
  const [possibleValues, setPossibleValues] = useState<Possible_value[]>([]);

  const [editAccess, setEditAccess] = React.useState<boolean>(false); //TODO: implement edit mode based on user role

  const [editAllowed, setEditAllowed] = React.useState<boolean>(
    allowEdit(true, editAccess)
  );

  useEffect(() => {
    if (props.data !== undefined && props.data !== null) {
      setPossibleValues(props.data);
    }
  }, [props.data]);

  const handleValueChange = (event: any, index: number, type: string) => {
    const values = [...possibleValues];
    if (type === "value") {
      values[index].value = event.target.value;
    } else if (type === "description") {
      values[index].description = event.target.value;
    }
    setPossibleValues(values);
    props.onChange(values);
  };

  const handleDelete = (index: number) => {
    const values = [...possibleValues];
    values.splice(index, 1);
    setPossibleValues(values);
    props.onChange(values);
  };

  const handleAddRow = () => {
    const values = [...possibleValues];
    values.push({ value: "", description: "" });
    setPossibleValues(values);
    props.onChange(values);
  };

  return (
    <>
      <div className="possibleValuesContainer">
        <h3>Possible values</h3>
        <table className="possibleValues">
          <thead>
            <tr>
              <th className="value">Value</th>
              <th className="desc">Description</th>
              <th className="delete"></th>
            </tr>
          </thead>
          <tbody>
            {
              possibleValues.length > 0
                ? possibleValues.map((value: any, index) => {
                  return (
                    <tr>
                      {/* If editmode replace row with input */}
                      <td className="value">
                        <input
                          type="text"
                          value={value.value}
                          onChange={(event) => handleValueChange(event, index, "value")}
                          disabled={!editAllowed}
                        />
                      </td>
                      <td className="desc">
                        <input
                          type="text"
                          value={value.description}
                          onChange={(event) =>
                            handleValueChange(event, index, "description")
                          }
                          disabled={!editAllowed}
                        />
                      </td>
                      <td className="delete">
                        <button
                          className="deleteButton"
                          onClick={() => { handleDelete(index) }}
                          disabled={!editAllowed}
                        >
                          X
                        </button>
                      </td>

                    </tr>
                  );
                })
                : null
            }
            {editAllowed ? (
              <tr>
                <td className="addNew"
                  colSpan={3}>
                  <button onClick={handleAddRow} className="addButton">
                    Add new
                  </button>
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default PossibleValues;
