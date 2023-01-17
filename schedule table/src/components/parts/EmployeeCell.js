import React from 'react'

function EmployeeCell(props) {
  return (
    <div>
        <span className="employee-name">{props.employee}</span>
    </div>
  )
}

export default EmployeeCell
