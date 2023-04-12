import React from 'react';
import "./style/GenericData.css";

export default function GenericData(props: { data: any, label: string }) {
    const [data, setData] = React.useState<any>(props.data);

    //if data is date, convert to string
    if (data instanceof Date) {
        setData(data.toLocaleDateString());
    }


    return (
        <div className="genericData">
            <h3>{props.label}</h3>
            <div className={data ? "genericDataValue" : "genericDataValue isnull"}>
                {data ? data : "No data"}
            </div>
        </div>
    )

}
