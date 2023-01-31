import moment from "moment";
import React, { useState, useEffect } from "react";
import { Col, Container, Row, Tabs, Tab } from "react-bootstrap";
import { FiArrowRight } from "react-icons/fi";
import SlidingPane from "react-sliding-pane";
import "react-sliding-pane/dist/react-sliding-pane.css";
import ShiftsForm from "./ShiftsForm";

function CreateShiftSidePane({
    choosenShiftDate,
    employee,
    visible,
    closePane,
    daysOfweek,
    templates,
    setTemplates
}) {
    const [shiftStartTimeOptions, setShiftStartTimeOptions] = useState([]);
    const [shiftEndTimeOptions, setShiftEndTimeOptions] = useState([]);
    const [shiftStartOvertimeOptions, setShiftStartOvertimeOptions] = useState([]);
    const [shiftEndOvertimeOptions, setShiftEndOvertimeOptions] = useState([]);
    const [shift, setShift] = useState({
        shiftStart: moment(choosenShiftDate).hour(9).minute(0).format(),
        shiftEnd: moment(choosenShiftDate).hour(17).minute(0).format(),
        overtimeStart: moment(choosenShiftDate).hour(17).minute(30).format(),
        overtimeEnd: moment(choosenShiftDate).hour(18).minute(0).format(),
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
    const [selectedTab, setSelectedTab] = useState("");
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
        setShiftStartOvertimeOptions(getHoursOfADay());
        setShiftEndOvertimeOptions(getHoursOfADay());

        setShift({
            ...shift,
            shiftStart: moment(choosenShiftDate).hour(9).minute(0).format(),
            shiftEnd: moment(choosenShiftDate).hour(17).minute(0).format(),
            overtimeStart: moment(choosenShiftDate).hour(17).minute(30).format(),
            overtimeEnd: moment(choosenShiftDate).hour(18).minute(0).format()
        });
        setSelectedTab("createShift");
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
        if (selectedTab === "createTemplate") {
            createTmeplate();
        }
    };

    const createTmeplate = () => {
        setTemplates([...templates, shift]);
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
                                {selectedTab === "createShift" ? (
                                    <>
                                        <span>
                                            {choosenShiftDate
                                                ? moment(choosenShiftDate).format("ll")
                                                : ""}
                                        </span>
                                        <span>{employee?.name}</span>{" "}
                                    </>
                                ) : (
                                    <span>Crete Template</span>
                                )}
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Tabs
                                defaultActiveKey="createShift"
                                id="candidate-features"
                                onSelect={(tabKey) => {
                                    setSelectedTab(tabKey);
                                }}
                                className="mb-3">
                                <Tab eventKey="createShift" title="Create Shift">
                                    <ShiftsForm
                                        selectedTab={selectedTab}
                                        handleSubmit={handleSubmit}
                                        shift={shift}
                                        updateShift={updateShift}
                                        shiftEndTimeOptions={shiftEndTimeOptions}
                                        shiftStartTimeOptions={shiftStartTimeOptions}
                                        workingHours={workingHours}
                                        daysOfweek={daysOfweek}
                                        handleShiftRepetition={handleShiftRepetition}
                                        setSelectedTab={setSelectedTab}
                                        shiftStartOvertimeOptions={shiftStartOvertimeOptions}
                                        shiftEndOvertimeOptions={shiftEndOvertimeOptions}
                                    />
                                </Tab>
                                <Tab eventKey="createTemplate" title="Create Template">
                                    <ShiftsForm
                                        selectedTab={selectedTab}
                                        handleSubmit={handleSubmit}
                                        shift={shift}
                                        updateShift={updateShift}
                                        shiftEndTimeOptions={shiftEndTimeOptions}
                                        shiftStartTimeOptions={shiftStartTimeOptions}
                                        workingHours={workingHours}
                                        daysOfweek={daysOfweek}
                                        handleShiftRepetition={handleShiftRepetition}
                                        setSelectedTab={setSelectedTab}
                                        createTmeplate={createTmeplate}
                                    />
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
