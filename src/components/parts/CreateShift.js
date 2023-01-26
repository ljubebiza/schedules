import React from 'react'
import { FiPlus, FiMenu } from "react-icons/fi";

function CreateShift({
    shiftData,
    forDay,
    setEmployee,
    setIsCreateShiftSidePaneOpen,
    setChoosenShiftDate
}) {
    const handleShiftCreate = () => {
        setIsCreateShiftSidePaneOpen({ isPaneOpen: true })
        setChoosenShiftDate(shiftData[forDay].date)
        setEmployee(shiftData.employee)
    }
  return (
    <div className="container create-shift-actions">
        <div className="row hide-actions">
            <div className="col d-flex justify-content-center">
                <div className="create-icons" title="Create Shift">
                    <FiPlus onClick={() => handleShiftCreate()} />
                </div>
                <div className="create-icons" title="Choose template">
                    <FiMenu />
                </div>
            </div>
        </div>
    </div>
  )
}

export default CreateShift
