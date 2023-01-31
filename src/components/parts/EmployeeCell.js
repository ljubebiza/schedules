import React from "react";
import { Row, Col } from "react-bootstrap";
import { FiClock, FiSidebar } from "react-icons/fi";

function EmployeeCell(props) {
    const weeklyWorkinghours = props.getEmployeeWeekHoursAndDaysSum;
    return (
        <div>
            <Row>
                <Col>
                    <span className="employee-name">{props.employee.name}</span>
                </Col>
            </Row>
            <Row>
                <Col className="emlpoyee-shifts-sum">
                    <FiClock title="Working hours for this week" />{" "}
                    <span>
                        {weeklyWorkinghours.hoursOfWork > 0 ? weeklyWorkinghours.hoursOfWork : "--"}{" "}
                    </span>
                    <FiSidebar title="Number of shifts" className="ms-2" />{" "}
                    <span>
                        {weeklyWorkinghours.daysOfWork > 0 ? weeklyWorkinghours.daysOfWork : "--"}
                    </span>
                </Col>
            </Row>
        </div>
    );
}

export default EmployeeCell;
