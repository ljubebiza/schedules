import "./main.scss"
import 'react-data-grid/lib/styles.css';
import DataGrid from 'react-data-grid';
import moment from 'moment';
import { useState, useEffect } from "react";

function App() {
    const [weekStart, setWeekStart] = useState(moment().startOf('isoWeek'))
    const [weekEnd, setWeekEnd] = useState(moment().endOf('isoWeek'))
    const [daysOfWeek, setDaysOfWeek] = useState([]);

 const getWeekArray = (startOfWeek, endOfWeek)  => {
    const days = [];
    let day = startOfWeek;
    let endDay = endOfWeek;
    if (typeof startOfWeek === "string") {
        day = moment(startOfWeek).startOf('isoWeek');
    }
    if (typeof endOfWeek === "string") {
        endDay = moment(endOfWeek).endOf('isoWeek')
    }
    while (day <= endDay) {
        
        days.push(day.format('YYYY-MM-DD'));
        day = day.clone().add(1, 'd');
    }
    return days;
 }


useEffect(() => {
    setDaysOfWeek(getWeekArray(weekStart, weekEnd));
}, [weekStart, weekEnd])

const getColumns = () => {
    let daysArr = [{key: "name", name: "Name"}]
    daysOfWeek.forEach((weekDay) => {
        if (weekDay === moment().format('YYYY-MM-DD')) {
            daysArr.push({key: moment().day(weekDay).format(),
                    name: <span className="bg-column">
                    {moment(weekDay).format('ddd DD/MM')}</span>
                })
        } else {
            daysArr.push({key: weekDay, name:  moment(weekDay).format('ddd DD/MM')});
        }
    });
    return daysArr;
}
    const columns = getColumns();

      const rows =  daysOfWeek.map((weekDay, index) => {
        let rowObject = {};
        daysOfWeek.forEach((dayOfweek, index) => {
                if (index % 2) {
                    rowObject[dayOfweek] = "7:30";
                } else {
                    rowObject[dayOfweek] = "";
                }
            })
            if (index % 2) {
                rowObject["name"] = "Zika"
            } else {
                rowObject["name"] = "Pera"
            }
            return rowObject;
      })


      const switchWeek = (direction) => {
        switch(direction) {
            case "next":
               setWeekStart( moment(weekStart).add(7, "days").format("YYYY-MM-DD"));
               setWeekEnd(moment(weekEnd).add(7, "days").format("YYYY-MM-DD"));
                ;
                break;
            case "prev":
                setWeekStart(moment(weekStart).subtract(7, "days").format("YYYY-MM-DD"));
                setWeekEnd(moment(weekEnd).subtract(7, "days").format("YYYY-MM-DD"));
                break;
            default:
                break;
        }

      }
      return (
        <div className="w-75 mx-auto mt-5">
            <div>
                <div className="d-flex justify-content-between">
                    <div className="d-flex">
                        <button className="btn bg-primary text-white mb-2 me-2"
                        onClick={() => {switchWeek("prev")}}
                        >
                            prev
                        </button>
                        <button className="btn bg-primary text-white mb-2"
                        onClick={() => {switchWeek("next")}}
                        >
                            next
                        </button>
                    </div>
                </div>
                {daysOfWeek.length && <DataGrid columns={columns} rows={rows} />}
            </div>
    </div>
  );
}

export default App;
