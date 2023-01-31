import React from "react";
import { FiPlus, FiMenu } from "react-icons/fi";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";
import { Col, Row } from "react-bootstrap";
import moment from "moment";

function CreateShift({
    shiftData,
    forDay,
    setEmployee,
    setIsCreateShiftSidePaneOpen,
    setChoosenShiftDate,
    templates
}) {
    const handleShiftCreate = () => {
        setIsCreateShiftSidePaneOpen({ isPaneOpen: true });
        setChoosenShiftDate(shiftData[forDay].date);
        setEmployee(shiftData.employee);
    };
    const popover = (
        <Popover id="popover-basic">
            <Popover.Body>
                <h6> Templates</h6>
                {templates.map((template, index) => {
                    return (
                        <Row key={index}>
                            <Col className="template-shift">
                                <strong>
                                    {moment(template.shiftStart).format("HH A")} -{" "}
                                    {moment(template.shiftEnd).format("HH A")}
                                </strong>
                                <span>{template.title}</span>
                            </Col>
                        </Row>
                    );
                })}
            </Popover.Body>
        </Popover>
    );
    return (
        <div className="container create-shift-actions">
            <div className="row hide-actions">
                <div className="col d-flex justify-content-center">
                    <div className="create-icons" title="Create Shift">
                        <FiPlus onClick={() => handleShiftCreate()} />
                    </div>
                    <OverlayTrigger trigger="click" placement="right" overlay={popover}>
                        <div className="create-icons" title="Choose template">
                            <FiMenu />
                        </div>
                    </OverlayTrigger>
                </div>
            </div>
        </div>
    );
}

export default CreateShift;
