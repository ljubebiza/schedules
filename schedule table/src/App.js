// import { useEffect, useState, useMemo } from "react";
// import axios from "axios";
// import ScheduleTable from "./components/ScheduleTable";
import Timetable from 'react-timetable-events'

function App() {

    const events = {
        monday: [
          {
            id: 1,
            name: "Custom Event 1",
            type: "custom",
            startTime: new Date("2018-02-23T11:30:00"),
            endTime: new Date("2018-02-23T13:30:00"),
          },
        ],
        tuesday: [],
        wednesday: [],
        thursday: [],
        friday: [],
      };
  return (
   <div className="d-flex w-100 justify-content-center pt-5">
     <Timetable 
        style={{height: "500px", width : "75%"}}
        events={events}
    />
   </div>
  )
}

export default App;
