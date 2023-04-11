import React from 'react';
import "./style/GenericData.css";

export default function GenericData(props: { data: any, label: string }) {
    return (
        <div className="genericData">
            <h3>{props.label}</h3>
            <div className="genericDataValue">
                {props.data ? props.data : "No data"}
            </div>
        </div>
    )

}
