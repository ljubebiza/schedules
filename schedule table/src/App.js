import "./main.scss"
import moment from 'moment';
import { useState, useEffect } from "react";
import ScheduleTable from "./components/ScheduleTable";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import Shift from "./components/parts/Shift"
import  EmployeeCell from "./components/parts/EmployeeCell"
import CreateShift from "./components/parts/CreateShift";
import { Button } from 'react-bootstrap';
import CreateShiftSidePane from "./components/parts/CreateShiftSidePane";

function App() {
    const [weekStart, setWeekStart] = useState(moment().startOf('isoWeek'))
    const [weekEnd, setWeekEnd] = useState(moment().endOf('isoWeek'))
    const [columns, setColumns] = useState([]);
    const [data, setData] = useState([]);
    const [navigationDay, setNavigationDay] = useState(moment());
    const [isCreateShiftSidePaneOpen, setIsCreateShiftSidePaneOpen] = useState({
        isPaneOpen: false,
        isPaneOpenLeft: false,
      });
    const [choosenShiftDate, setChoosenShiftDate] = useState(moment());
    const [employee, setEmployee] = useState(null);

 const getWeekArray = (startOfWeek, endOfWeek)  => {
    const days = [];
    let day = moment(startOfWeek).startOf('isoWeek');
    let endDay = moment(endOfWeek).endOf('isoWeek');

    while (day <= endDay) {
        days.push(day.format('YYYY-MM-DD'));
        day = day.clone().add(1, 'd');
    }
    return days;
 }


useEffect(() => {
    const daysOfWeek = getWeekArray(weekStart, weekEnd);
    setTimeout(() => {
        setColumns(getColumns(daysOfWeek))
        setData(getData(daysOfWeek));
    }, 500);
}, [weekStart, weekEnd])

const getData = (daysOfWeek) => {
    const data = daysOfWeek.map((_, index) => {
        let rowObject = {};
        daysOfWeek.forEach((dayOfweek) => {
                if (Math.floor(Math.random() * 5) % 2) {
                    rowObject[moment(dayOfweek).format('ddd')] = { shiftDuration:"08am - 16pm", date: dayOfweek };
                } else {
                    rowObject[moment(dayOfweek).format('ddd')] = { shiftDuration: "", date: dayOfweek };
                }
            })

            rowObject["employee"] = {name: `Employee Sirname${index}`, id: index}

            return rowObject;
      })
      return data;
}

      const switchWeek = (direction) => {
        switch(direction) {
            case "next":
                setWeekStart(moment(weekStart).add(7, "days").format("YYYY-MM-DD"));
                setWeekEnd(moment(weekEnd).add(7, "days").format("YYYY-MM-DD"));
                setNavigationDay(navigationDay.add(7, "day"));
                break;
            case "prev":
                setWeekStart(moment(weekStart).subtract(7, "days").format("YYYY-MM-DD"));
                setWeekEnd(moment(weekEnd).subtract(7, "days").format("YYYY-MM-DD"));
                setNavigationDay(navigationDay.subtract(7, "day"));
                break;
            case "today":
                setWeekStart(moment().startOf('isoWeek'));
                setWeekEnd(moment().endOf('isoWeek'));
                setNavigationDay(moment());
                break;
            default:
                break;
        }

      }

      const switchMonth = (direction) => {
        switch(direction) {
            case "next":
                setWeekStart(moment(weekStart).add(1, "month").format("YYYY-MM-DD"));
                setWeekEnd(moment(weekStart).add(1, "month").endOf('isoWeek').format("YYYY-MM-DD"));
                setNavigationDay(navigationDay.add(1, "month"));
                break;
            case "prev":
                setWeekStart(moment(weekStart).subtract(1, "month").format("YYYY-MM-DD"));
                setWeekEnd(moment(weekStart).subtract(1, "month").endOf('isoWeek').format("YYYY-MM-DD"));
                setNavigationDay(navigationDay.subtract(1, "month"));
                break;
            default:
                break;

        }
      }

const getColumns = (daysOfWeek) => {
    let daysArr = [{
        Header: "Name",
        accessor: "employee.name",
        Cell: ({cell: {value}}) =>  <EmployeeCell employee={value} />
    }]
    daysOfWeek.forEach((weekDay) => {
            daysArr.push({
                Header: moment(weekDay).format('ddd DD/MM'),
                accessor: moment(weekDay).format('ddd'),
                Cell: ({row}) =>
                    handleCellComponents(
                        row.original,
                        moment(weekDay).format('ddd'),
                        row.original.employee
                    )
            })
    })
    return daysArr;
}

const handleCellComponents = (shiftData, forDay, employee) => {
    if (!shiftData[forDay].shiftDuration) {
        return <CreateShift
                    shiftData={shiftData}
                    forDay={forDay}
                    setEmployee={setEmployee}
                    setIsCreateShiftSidePaneOpen={setIsCreateShiftSidePaneOpen}
                    setChoosenShiftDate={setChoosenShiftDate}
                />
    }
    return <Shift shiftData={shiftData} forDay={forDay} employee={employee} />
}

  return <div className="container mt-5">
            <h1 className="text-center text-info">Schedule Table</h1>
            <div className="row">
                <div className="col">
                    <div className="d-flex justify-content-between navigation-holder">
                        <div>
                            <div className="btn border mb-3">
                            <FiChevronLeft  onClick={() => switchMonth("prev")}/>
                              {navigationDay.format("MMMM")} {navigationDay.format("YYYY")}
                            <FiChevronRight onClick={() => switchMonth("next")} />
                            </div>
                        </div>
                        <div className="d-flex">
                            <Button className="border mb-3 me-2" onClick={() => switchWeek("prev")}>
                                prev
                            </Button>
                            <Button className="border mb-3 me-2" onClick={() => switchWeek("today")}>
                                Today
                            </Button>
                            <Button className="border mb-3" onClick={() => switchWeek("next")}>
                                next
                            </Button>
                        </div>
                    </div>
                        {columns.length > 1 &&  <ScheduleTable columns={columns} data={data}
                            handleCellComponents={handleCellComponents}/>
                        }
                        
                        <CreateShiftSidePane
                            choosenShiftDate={choosenShiftDate}
                            employee={employee}
                            visible={isCreateShiftSidePaneOpen.isPaneOpen}
                            closePane={() => {setIsCreateShiftSidePaneOpen({ isPaneOpen: false })}}
                        />
                </div>
            </div>
        </div>

}
export default App;
