import React from "react";
import { Row, Col, Form, Button } from "react-bootstrap";
import { FiClock } from "react-icons/fi";
import { GiStopwatch } from "react-icons/gi";
import moment from "moment";
import { useEffect } from "react";

function ShiftsForm({
    selectedTab,
    handleSubmit,
    shift,
    updateShift,
    shiftEndTimeOptions,
    shiftStartTimeOptions,
    workingHours,
    daysOfweek,
    handleShiftRepetition,
    setSelectedTab,
    shiftStartOvertimeOptions,
    shiftEndOvertimeOptions
}) {
    useEffect(() => {
        return () => setSelectedTab("createShift");
    }, []);

    return (
        <Form className="create-shift-holder" onSubmit={handleSubmit}>
            {selectedTab === "createTemplate" && (
                <Form.Group as={Row} controlId="templateTitel">
                    <Form.Label column sm="2">
                        Title
                    </Form.Label>
                    <Col sm="10">
                        <Form.Control
                            name="title"
                            placeholder="Template title..."
                            onChange={(e) => updateShift(e)}
                        />
                    </Col>
                </Form.Group>
            )}
            <Row className="pt-5 mb-3">
                <Col className="pe-0" md={5}>
                    <Form.Group
                        className="shift-slots justify-content-between"
                        controlId="shiftStart">
                        <Form.Label
                            className="d-flex align-items-center"
                            title="Add shift duration">
                            <FiClock className="me-2" />
                            Start
                        </Form.Label>
                        <Form.Select
                            name="shiftStart"
                            value={shift.shiftStart}
                            onChange={(e) => updateShift(e)}>
                            {shiftStartTimeOptions.map((value, index) => {
                                return (
                                    <option key={index} value={value}>
                                        {moment(value).format("h:mm A")}
                                    </option>
                                );
                            })}
                        </Form.Select>
                    </Form.Group>
                </Col>
                <Col className="ps-0" md={7}>
                    <Form.Group className="shift-slots justify-content-around" controlId="shiftEnd">
                        <Form.Label>End</Form.Label>
                        <Form.Select
                            name="shiftEnd"
                            value={shift.shiftEnd}
                            onChange={(e) => updateShift(e)}>
                            {shiftEndTimeOptions.map((value, index) => {
                                return (
                                    <option key={index * 17} value={value}>
                                        {moment(value).format("h:mm A")}
                                    </option>
                                );
                            })}
                        </Form.Select>
                        <strong>{workingHours} Hours</strong>
                    </Form.Group>
                </Col>
            </Row>
            {selectedTab === "createShift" && (
                <Row>
                    <Col className="pe-0" md="5">
                        <Form.Group
                            controlId="overtimeStart"
                            className="shift-slots justify-content-between">
                            <Form.Label className="d-flex align-items-center" title="Add overtime">
                                <GiStopwatch className="me-2" />
                                Start
                            </Form.Label>
                            <Form.Select
                                name="overtimeStart"
                                value={shift.overtimeStart}
                                onChange={(e) => updateShift(e)}>
                                {shiftStartOvertimeOptions?.map((value, index) => {
                                    return (
                                        <option key={index * 13} value={value}>
                                            {moment(value).format("h:mm A")}
                                        </option>
                                    );
                                })}
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col className="ps-0" md="7">
                        <Form.Group
                            controlId="overtimeEnd"
                            className="shift-slots justify-content-around">
                            <Form.Label>End</Form.Label>
                            <Form.Select
                                name="overtimeEnd"
                                value={shift.overtimeEnd}
                                onChange={(e) => updateShift(e)}>
                                {shiftEndOvertimeOptions?.map((value, index) => {
                                    return (
                                        <option key={index * 57} value={value}>
                                            {moment(value).format("h:mm A")}
                                        </option>
                                    );
                                })}
                            </Form.Select>
                            <strong>{workingHours} Hours</strong>
                        </Form.Group>
                    </Col>
                </Row>
            )}
            <Row>
                <Col className="mt-4">
                    <hr />
                </Col>
            </Row>
            <Row>
                <Col>
                    <Form.Group as={Row} className="mb-3 mt-2" controlId="breakLength">
                        <Form.Label column sm="2">
                            Break
                        </Form.Label>
                        <Col sm="3" className="d-flex align-items-center">
                            <Form.Control
                                type="number"
                                name="break"
                                value={shift.break}
                                onChange={(e) => {
                                    updateShift(e);
                                }}
                            />
                            <span className="ms-2">min</span>
                        </Col>
                        <Col sm="7"></Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3" controlId="exampleForm.ControlTextarea1">
                        <Form.Label column sm="2">
                            Note
                        </Form.Label>
                        <Col sm="10">
                            <Form.Control
                                as="textarea"
                                name="note"
                                placeholder="Type here"
                                onChange={(e) => {
                                    updateShift(e);
                                }}
                                rows={3}
                            />
                        </Col>
                    </Form.Group>
                </Col>
            </Row>
            <Row>
                <Col className="mt-4">
                    <hr />
                </Col>
            </Row>
            <Row className="mt-2 py-3 px-2">
                <Col className="border">
                    <Row className="border-bottom p-2">
                        <Col sm="3 d-flex align-items-center">Applay on</Col>
                        <Col sm="9">
                            <div className="btn-group" role="group" aria-label="Days">
                                {daysOfweek.map((day, index) => {
                                    return (
                                        <button
                                            id={moment(day).format("ddd")}
                                            key={index}
                                            type="button"
                                            className={
                                                shift.applayOnDays.includes(
                                                    moment(day).format("ddd")
                                                )
                                                    ? "clicked-shift-day"
                                                    : "shift-day"
                                            }
                                            onClick={(e) => {
                                                handleShiftRepetition(e);
                                            }}>
                                            {moment(day).format("ddd")}
                                        </button>
                                    );
                                })}
                            </div>
                        </Col>
                    </Row>
                    {selectedTab === "createShift" && (
                        <Row className="py-3 px-2">
                            <Form.Group
                                className="repeat-actions"
                                as={Col}
                                controlId="repeatPeriod">
                                <Form.Label>Repeat</Form.Label>
                                <Form.Select
                                    className="ms-5"
                                    name="repeatPeriod"
                                    value={shift.repeatPeriod}
                                    onChange={(e) => updateShift(e)}>
                                    <option value={"weeks"}>Weeks</option>
                                    <option value={"months"}>Months</option>
                                </Form.Select>
                            </Form.Group>

                            <Form.Group className="repeat-actions" as={Col} controlId="repeat">
                                <Form.Control
                                    className="repeat-input"
                                    type="number"
                                    name="repeat"
                                    value={shift.repeat}
                                    onChange={(e) => updateShift(e)}
                                />
                            </Form.Group>
                        </Row>
                    )}
                </Col>
            </Row>
            <Row>
                <Col>
                    <Button type="submit" className="position-absolute bottom-0 mb-5">
                        {`${selectedTab.charAt(0).toUpperCase()}${selectedTab.slice(1, 6)}
                            ${selectedTab.slice(6)}`}
                    </Button>
                </Col>
            </Row>
        </Form>
    );
}

export default ShiftsForm;
