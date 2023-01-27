import React from "react";

function EmployeeCell(props) {
    console.log(props.weekHoursSum);
    return (
        <div>
            <span className="employee-name">{props.employee.name}</span>
        </div>
    );
}

export default EmployeeCell;
