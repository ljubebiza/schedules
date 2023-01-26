import moment from "moment";
import React, { useState, useEffect } from "react";
import { Col, Container, Row, Tabs, Tab, Form } from "react-bootstrap";
import { FiArrowRight, FiClock } from "react-icons/fi";
import SlidingPane from "react-sliding-pane";
import "react-sliding-pane/dist/react-sliding-pane.css";



function CreateShiftSidePane({
    choosenShiftDate,
    employee,
    visible,
    closePane
}) {
    const [shiftStartTimeOptions, setShiftStartTimeOptions] = useState([]);
    const [shiftEndTimeOptions, setShiftEndTimeOptions] = useState([]);
    const [shiftDuration, setShiftDuration] = useState({
        shiftStart:moment(choosenShiftDate).hour(9).minute(0).format(),
        shiftEnd: moment(choosenShiftDate).hour(17).minute(0).format()
    })
    const [workingHours, setWorkingHours] = useState("00:00")

    const getHoursOfADay = (startTime = null) => {
        return Array.from({length: 24}, (_,i) => i).reduce((r,hour) => {
            if (startTime) {
                if (startTime.minutes === "30") {
                    r.push(moment(choosenShiftDate).hour(parseInt(startTime.hour) + hour + 1).minute(0).format());
                    r.push(moment(choosenShiftDate).hour(parseInt(startTime.hour) + hour + 1).minute(30).format());
                    return r
                }
                //make sure to have half an hour diff between start and end date ranges
                if (hour > 0) {
                    r.push(moment(choosenShiftDate).hour(parseInt(startTime.hour) + hour).minute(0).format());
                }
                r.push(moment(choosenShiftDate).hour(parseInt(startTime.hour) + hour).minute(30).format());
                return r;
            }
           r.push(moment(choosenShiftDate).hour(hour).minute(0).format());
           r.push(moment(choosenShiftDate).hour(hour).minute(30).format());
           return r;
        }, []);
      }

      useEffect(() => {
        setShiftStartTimeOptions(getHoursOfADay());
        setShiftEndTimeOptions(getHoursOfADay(setStartHour(shiftDuration.shiftStart)));

        setShiftDuration({
            shiftStart:moment(choosenShiftDate).hour(9).minute(0).format(),
            shiftEnd: moment(choosenShiftDate).hour(17).minute(0).format()
        })
        setWorkingHours(getWorkingHours("shiftStart", shiftDuration.shiftStart));
        // eslint-disable-next-line
      }, [choosenShiftDate])

      const updateShift = (e) => {
            if (e.target.name === "shiftStart" && shiftDuration.shiftEnd < e.target.value) {
                setShiftEndTimeOptions(getHoursOfADay(setStartHour(e.target.value)));
                setShiftDuration(
                    {
                        shiftStart:e.target.value,
                        shiftEnd: moment(e.target.value).add(30, "minutes").format()
                    }
                );
                return;
            }

            shiftDuration[e.target.name] = e.target.value;
            setShiftDuration({...shiftDuration});

           if (e.target.name !== "shiftEnd") {
                setShiftEndTimeOptions(getHoursOfADay(setStartHour(e.target.value)));
           }
           setWorkingHours(getWorkingHours(e.target.name, e.target.value));
      }

      const setStartHour = (beginAt) => {
        return { hour: moment(beginAt).format("HH"), minutes: moment(beginAt).format("mm") };
      };

      const getWorkingHours = (shiftPartName, shiftPartValue) => {
            let hours = ""
            if (shiftPartName === "shiftStart") {
                const diff = moment(shiftDuration.shiftEnd).diff(shiftPartValue, "minutes");
                hours  = moment.duration().add(diff, "minutes").asHours("mm")
            }
            if (shiftPartName === "shiftEnd") {
                const diff = moment(shiftPartValue).diff(shiftDuration.shiftStart, "minutes");
                hours = moment.duration().add(diff, "minutes").asHours("mm")
            }

            if (Number.isInteger(hours)) {
                return hours + ":00"
            }
            return parseInt(hours) + ":30";

      }

  return (
    <div>
        <SlidingPane
            className="some-custom-class"
            overlayClassName="some-custom-overlay-class"
            isOpen={visible}
            hideHeader
            width={window.innerWidth < 600 ? "100%": "500px"}
            onRequestClose={closePane}
      >
         <Container>
            <Row className="border-bottom py-3">
                <Col xl={2}>
                    <FiArrowRight size={30}  title="Close" onClick={closePane}/>
                </Col>
                <Col xl={10}>
                    <div className="d-flex justify-content-around w-100">
                    <span>{choosenShiftDate ? moment(choosenShiftDate).format("ll") : ""}</span>
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
                           <div className="create-shift-holder">
                                <div className="shift-slots">
                                    <div className="d-flex align-items-center">
                                        <FiClock  className="me-2"/>
                                        Start
                                    </div>
                                    <Form.Select
                                        name="shiftStart"
                                        value={shiftDuration.shiftStart}
                                        onChange={(e) => updateShift(e)}>
                                        {shiftStartTimeOptions.map((value, index) => {
                                            return (
                                                <option
                                                    key={index}
                                                    value={value}
                                                >
                                                    {moment(value).format("h:mm A")}
                                                </option>
                                            )
                                        })}
                                    </Form.Select>
                                    End
                                    <Form.Select
                                    name="shiftEnd"
                                        value={shiftDuration.shiftEnd}
                                        onChange={(e) => updateShift(e)}>
                                        {shiftEndTimeOptions.map((value, index) => {
                                            return (
                                                <option
                                                    key={index * 17}
                                                    value={value}
                                                >
                                                    {moment(value).format("h:mm A")}
                                                </option>)
                                        })}
                                    </Form.Select>
                                   <strong>
                                        {workingHours} Hours
                                   </strong>
                                </div>
                           </div>
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
  )
}

export default CreateShiftSidePane
