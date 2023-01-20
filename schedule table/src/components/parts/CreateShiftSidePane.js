import moment from "moment";
import React, { useState, useEffect } from "react";
import { Col, Container, Row, Tabs, Tab, Form } from "react-bootstrap";
import { FiArrowRight } from "react-icons/fi";
import SlidingPane from "react-sliding-pane";
import "react-sliding-pane/dist/react-sliding-pane.css";
import axios from "axios";



function CreateShiftSidePane({
    choosenShiftDate,
    employee,
    visible,
    closePane
}) {
    const [shiftTimeRange, setShiftTimeRange] = useState([]);
    const [shiftTime, setShiftTime] = useState({
        shiftStart:moment(choosenShiftDate).hour(9).minute(0).format('DD/MM/YYYY h:mm A'),
        shiftEnd: moment(choosenShiftDate).hour(17).minute(0).format('DD/MM/YYYY h:mm A')
    })


    const getHoursOfADay = () => {
        return Array.from({length: 24}, (_,i) => i).reduce((r,hour) => {
           r.push(moment(choosenShiftDate).hour(hour).minute(0).format('DD/MM/YYYY h:mm A'));
           r.push(moment(choosenShiftDate).hour(hour).minute(30).format('DD/MM/YYYY h:mm A'));
           return r;
        }, []);
      }

      useEffect(() => {
        setShiftTimeRange(getHoursOfADay());
      }, [choosenShiftDate])

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
                                   <div className="d-flex">
                                        Shift start:
                                        <Form.Select 
                                            value={shiftTime.shiftStart}
                                            onChange={(e) =>
                                                setShiftTime({
                                                    ...shiftTime, shiftStart: e.target.value
                                                })
                                            }>
                                            {shiftTimeRange.map((value, index) => {
                                                return (
                                                    <option
                                                        key={index}
                                                        value={value}
                                                    >
                                                        {value}
                                                    </option>
                                                )
                                            })}
                                        </Form.Select>
                                        Shift end:
                                        <Form.Select
                                            value={shiftTime.shiftEnd}
                                            onChange={(e) =>
                                                setShiftTime({
                                                    ...shiftTime,
                                                    shiftEnd: e.target.value
                                                })
                                            }>
                                            {shiftTimeRange.map((value, index) => {
                                                return (
                                                    <option
                                                        key={index * 17}
                                                        value={value}
                                                    >
                                                        {value}
                                                    </option>)
                                            })}
                                        </Form.Select>
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
