import React from 'react'
import { Spring } from 'react-spring/renderprops'
import '../../assets/about-styles/about.css'
import checkList from '../../assets/images/checklist.svg'

export default function About() {
  return (
    <div className="container mt-5">
      <div className="row m-0">
        <Spring
          from={{ opacity: 0 }}
          to={{ opacity: 1 }}
          config={{ duration: 300 }}
        >
          {props => (
            <div style={props}>
              <div className="col-12 col-sm-12 ">
                <h1 style={{ fontWeight: 'lighter mt-5' }}>
                  <span className="font-italic">About HRMS</span>
                </h1>
                <p className="lead font-italic">
                  One stop software to manage your employees
                </p>
                <h1 className="font-italic">Features</h1>
                <p className="mb-1 font-italic">Login/Register feature</p>
                <p className="mb-1 font-italic">Integrated Payroll system</p>
                <p className="mb-1 font-italic">Add, Edit, Delete employees</p>
                <p className="mb-1 font-italic">Search and filter employees</p>
                <p className="mb-1 font-italic">
                  Apply for leaves, loans, bonus
                </p>
                <p className="mb-1 font-italic">
                  Manage your tickets all at one place
                </p>
                <p className="mb-1 font-italic">
                  Cool admin dashboard with statistics
                </p>
                <p className="mb-1 font-italic">
                  Add reminders directly to your google calender!
                </p>
                <p className="text-secondary font-italic mt-5">Version 1.0.0</p>
                <a
                  href="https://github.com/vineetagarwal1352/HRMS_Synopsis"
                  target="_blank"
                  rel="noreferrer"
                >
                  <b>GitHub Repo</b>
                </a>
                <br />
                <a
                  href="https://docs.google.com/presentation/d/1xl_azzorlwGAVUE0AuH5aude_alx_MPIs8mI6dWEm0s/edit?usp=sharing"
                  target="_blank"
                  rel="noreferrer"
                >
                  <b>Project Report</b>
                </a>
              </div>

              <div className="col">
                <img className="aboutSVG" src={checkList} alt="" />
              </div>
            </div>
          )}
        </Spring>
      </div>
    </div>
  )
}
