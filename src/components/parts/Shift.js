import React from "react";
import moment from "moment";

function Shift({ shiftData, forDay }) {
    return (
        <div className="bg-shift d-flex flex-column justify-content-center align-items-center">
            <span>
                {moment(shiftData[forDay].shiftStart).format("HH A")} -{" "}
                {moment(shiftData[forDay].shiftEnd).format("HH A")}
            </span>
            Some Text
        </div>
    );
}

export default Shift;
