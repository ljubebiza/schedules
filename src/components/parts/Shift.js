import React from "react";

function Shift({ shiftData, forDay }) {
    return (
        <div className="bg-shift d-flex flex-column justify-content-center align-items-center">
            <span>{shiftData[forDay].shiftDuration}</span>
            Some Text
        </div>
    );
}

export default Shift;
