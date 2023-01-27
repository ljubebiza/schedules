import moment from "moment";
import React, { useState, useEffect } from "react";
import { Col, Container, Row, Tabs, Tab, Form, Button } from "react-bootstrap";
import { FiArrowRight, FiClock } from "react-icons/fi";
import SlidingPane from "react-sliding-pane";
import "react-sliding-pane/dist/react-sliding-pane.css";

function CreateShiftSidePane({ choosenShiftDate, employee, visible, closePane, daysOfweek }) {
    const [shiftStartTimeOptions, setShiftStartTimeOptions] = useState([]);
    const [shiftEndTimeOptions, setShiftEndTimeOptions] = useState([]);
    const [shift, setShift] = useState({
        shiftStart: moment(choosenShiftDate).hour(9).minute(0).format(),
        shiftEnd: moment(choosenShiftDate).hour(17).minute(0).format(),
        overTimeStart: "",
        overTimeEnd: "",
        break: 60,
        workingHours: "",
        note: "",
        leaveType: "",
        applayOnDays: [moment(choosenShiftDate).format("ddd")],
        repeat: 1,
        repeatPeriod: "Weeks",
        isHoliday: ""
    });
    const [workingHours, setWorkingHours] = useState("");

    const getHoursOfADay = (startTime = null) => {
        return Array.from({ length: 24 }, (_, i) => i).reduce((r, hour) => {
            if (startTime) {
                if (startTime.minutes === "30") {
                    r.push(
                        moment(choosenShiftDate)
                            .hour(parseInt(startTime.hour) + hour + 1)
                            .minute(0)
                            .format()
                    );
                    r.push(
                        moment(choosenShiftDate)
                            .hour(parseInt(startTime.hour) + hour + 1)
                            .minute(30)
                            .format()
                    );
                    return r;
                }
                // make sure to have half an hour diff between start and end date ranges
                if (hour > 0) {
                    r.push(
                        moment(choosenShiftDate)
                            .hour(parseInt(startTime.hour) + hour)
                            .minute(0)
                            .format()
                    );
                }
                r.push(
                    moment(choosenShiftDate)
                        .hour(parseInt(startTime.hour) + hour)
                        .minute(30)
                        .format()
                );
                return r;
            }
            r.push(moment(choosenShiftDate).hour(hour).minute(0).format());
            r.push(moment(choosenShiftDate).hour(hour).minute(30).format());
            return r;
        }, []);
    };

    useEffect(() => {
        setShiftStartTimeOptions(getHoursOfADay());
        setShiftEndTimeOptions(getHoursOfADay(setStartHour(shift.shiftStart)));

        setShift({
            ...shift,
            shiftStart: moment(choosenShiftDate).hour(9).minute(0).format(),
            shiftEnd: moment(choosenShiftDate).hour(17).minute(0).format()
        });
        setWorkingHours(getWorkingHours("shiftStart", shift.shiftStart));
        // eslint-disable-next-line
      }, [choosenShiftDate])

    const updateShift = (e) => {
        if (e.target.name === "shiftStart" && shift.shiftEnd < e.target.value) {
            setShiftEndTimeOptions(getHoursOfADay(setStartHour(e.target.value)));
            setShift({
                ...shift,
                shiftStart: e.target.value,
                shiftEnd: moment(e.target.value).add(30, "minutes").format()
            });
            return;
        }

        shift[e.target.name] = e.target.value;
        setShift({ ...shift });

        if (e.target.name === "shiftStart") {
            setShiftEndTimeOptions(getHoursOfADay(setStartHour(e.target.value)));
        }
        if (e.target.name === "shiftStart" || e.target.name === "shiftEnd") {
            setWorkingHours(getWorkingHours(e.target.name, e.target.value));
        }
    };

    const setStartHour = (beginAt) => {
        return { hour: moment(beginAt).format("HH"), minutes: moment(beginAt).format("mm") };
    };

    const getWorkingHours = (shiftPartName, shiftPartValue) => {
        let hours = "";
        if (shiftPartName === "shiftStart") {
            const diff = moment(shift.shiftEnd).diff(shiftPartValue, "minutes");
            hours = moment.duration().add(diff, "minutes").asHours("mm");
        }
        if (shiftPartName === "shiftEnd") {
            const diff = moment(shiftPartValue).diff(shift.shiftStart, "minutes");
            hours = moment.duration().add(diff, "minutes").asHours("mm");
        }

        if (Number.isInteger(hours)) {
            return hours + ":00";
        }
        return parseInt(hours) + ":30";
    };

    const handleShiftRepetition = (e) => {
        if (shift.applayOnDays.includes(e.target.id)) {
            setShift({
                ...shift,
                applayOnDays: shift.applayOnDays.filter((day) => day !== e.target.id)
            });
        } else {
            setShift({ ...shift, applayOnDays: [...shift.applayOnDays, e.target.id] });
        }
    };
    const handleSubmit = (e) => {
        e.preventDefault();
    };

    return (
        <div>
            <SlidingPane
                className="some-custom-class"
                overlayClassName="some-custom-overlay-class"
                isOpen={visible}
                hideHeader
                width={window.innerWidth < 600 ? "100%" : "500px"}
                onRequestClose={closePane}>
                <Container className="h-100">
                    <Row className="py-3">
                        <Col xl={2}>
                            <FiArrowRight size={30} title="Close" onClick={closePane} />
                        </Col>
                        <Col xl={10}>
                            <div className="d-flex justify-content-around w-100">
                                <span>
                                    {choosenShiftDate ? moment(choosenShiftDate).format("ll") : ""}
                                </span>
                                <span>{employee?.name}</span>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Tabs
                                defaultActiveKey="createShift"
                                id="candidate-features"
                                className="mb-3">
                                <Tab eventKey="createShift" title="Create Shift">
                                    <Form className="create-shift-holder" onSubmit={handleSubmit}>
                                        <Row className="pt-5 mb-3">
                                            <Col className="pe-0" md={5}>
                                                <Form.Group
                                                    className="shift-slots justify-content-between"
                                                    controlId="shiftStart">
                                                    <Form.Label className="d-flex align-items-center">
                                                        <FiClock className="me-2" />
                                                        Start
                                                    </Form.Label>
                                                    <Form.Select
                                                        name="shiftStart"
                                                        value={shift.shiftStart}
                                                        onChange={(e) => updateShift(e)}>
                                                        {shiftStartTimeOptions.map(
                                                            (value, index) => {
                                                                return (
                                                                    <option
                                                                        key={index}
                                                                        value={value}>
                                                                        {moment(value).format(
                                                                            "h:mm A"
                                                                        )}
                                                                    </option>
                                                                );
                                                            }
                                                        )}
                                                    </Form.Select>
                                                </Form.Group>
                                            </Col>
                                            <Col className="ps-0" md={7}>
                                                <Form.Group
                                                    className="shift-slots justify-content-around"
                                                    controlId="shiftEnd">
                                                    <Form.Label>End</Form.Label>
                                                    <Form.Select
                                                        name="shiftEnd"
                                                        value={shift.shiftEnd}
                                                        onChange={(e) => updateShift(e)}>
                                                        {shiftEndTimeOptions.map((value, index) => {
                                                            return (
                                                                <option
                                                                    key={index * 17}
                                                                    value={value}>
                                                                    {moment(value).format("h:mm A")}
                                                                </option>
                                                            );
                                                        })}
                                                    </Form.Select>
                                                    <strong>{workingHours} Hours</strong>
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col className="mt-4">
                                                <hr />
                                            </Col>
                                        </Row>

                                        <Form.Group
                                            as={Row}
                                            className="mb-3 mt-2"
                                            controlId="breakLength">
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

                                        <Form.Group
                                            as={Row}
                                            className="mb-3"
                                            controlId="exampleForm.ControlTextarea1">
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
                                        <Row>
                                            <Col className="mt-4">
                                                <hr />
                                            </Col>
                                        </Row>
                                        <Row className="mt-2 py-3 px-2">
                                            <Col className="border">
                                                <Row className="border-bottom p-2">
                                                    <Col sm="3 d-flex align-items-center">
                                                        Applay on
                                                    </Col>
                                                    <Col sm="9">
                                                        <div
                                                            className="btn-group"
                                                            role="group"
                                                            aria-label="Days">
                                                            {daysOfweek.map((day, index) => {
                                                                return (
                                                                    <button
                                                                        id={moment(day).format(
                                                                            "ddd"
                                                                        )}
                                                                        key={index}
                                                                        type="button"
                                                                        className={
                                                                            shift.applayOnDays.includes(
                                                                                moment(day).format(
                                                                                    "ddd"
                                                                                )
                                                                            )
                                                                                ? "clicked-shift-day"
                                                                                : "shift-day"
                                                                        }
                                                                        onClick={(e) => {
                                                                            handleShiftRepetition(
                                                                                e
                                                                            );
                                                                        }}>
                                                                        {moment(day).format("ddd")}
                                                                    </button>
                                                                );
                                                            })}
                                                        </div>
                                                    </Col>
                                                </Row>
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

                                                    <Form.Group
                                                        className="repeat-actions"
                                                        as={Col}
                                                        controlId="repeat">
                                                        <Form.Control
                                                            className="repeat-input"
                                                            type="number"
                                                            name="repeat"
                                                            value={shift.repeat}
                                                            onChange={(e) => updateShift(e)}
                                                        />
                                                    </Form.Group>
                                                </Row>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>
                                                <Button
                                                    type="submit"
                                                    className="position-absolute bottom-0 mb-5">
                                                    Create Shift
                                                </Button>
                                            </Col>
                                        </Row>
                                    </Form>
                                </Tab>
                                <Tab eventKey="createTemplate" title="Create Template">
                                    Templates
                                </Tab>
                            </Tabs>
                        </Col>
                    </Row>
                </Container>
            </SlidingPane>
        </div>
    );
}

export default CreateShiftSidePane;
