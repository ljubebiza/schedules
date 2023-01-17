import React from "react";
import SlidingPane from "react-sliding-pane";
import "react-sliding-pane/dist/react-sliding-pane.css";


function CreateShiftSidePane({
    choosenShiftDate,
    employee,
    isCreateShiftSidePaneOpen,
    setIsCreateShiftSidePaneOpen
}) {
    console.log(choosenShiftDate);
    console.log(employee);
  return (
    <div>
        <SlidingPane
            className="some-custom-class"
            overlayClassName="some-custom-overlay-class"
            isOpen={isCreateShiftSidePaneOpen.isPaneOpen}
            title={choosenShiftDate}
            subtitle={employee.name}
            width={window.innerWidth < 600 ? "100%": "500px"}
            onRequestClose={() => {
            // triggered on "<" on left top click or on outside click
            setIsCreateShiftSidePaneOpen({ isPaneOpen: false });
            }}
      >
            Create Shifts
        </SlidingPane>
    </div>
  )
}

export default CreateShiftSidePane
