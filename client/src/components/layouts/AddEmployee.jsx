import axios from 'axios'
import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { Spring } from 'react-spring/renderprops'
import toast from 'toasted-notes'
import 'toasted-notes/src/styles.css'
import '../../assets/add-emp/addEmp.css'
import { Consumer } from '../../context'
import AdminSidePanel from './Admin/AdminSidePanel'

class AddEmployee extends Component {
  constructor() {
    super()
    this.state = {
      email: '',
      name: '',
      address: '',
      phoneNo: '',
      role: 'Select Role',
      team: 'Select Team',
      gender: 'Select Value',
      doj: '',
      disabled: false,
      error: '',
      teamList: [],
      roleList: [],
      teamDropdownOpen: false,
      roleDropdownOpen: false,
      genderDropdownOpen: false
    }
  }

  async componentDidMount() {
    try {
      const teamAndRoleList = await axios.get('/api/admin/getTeamsAndRoles')
      this.setState({
        teamList: teamAndRoleList.data[0].teamNames,
        roleList: teamAndRoleList.data[0].roleNames
      })
    } catch (err) {
      console.error('Error fetching team and role list', err)
    }
  }

  toggleDropdown = dropdown => {
    this.setState(prevState => ({
      [`${dropdown}DropdownOpen`]: !prevState[`${dropdown}DropdownOpen`]
    }))
  }

  onSelectGender = gender => this.setState({ gender, genderDropdownOpen: false })
  onTeamSelect = team => this.setState({ team, teamDropdownOpen: false })
  onRoleSelect = role => this.setState({ role, roleDropdownOpen: false })

  onChange = e => {
    const { name, value } = e.target
    if (name === 'phoneNo') {
      const limitedValue = value.replace(/\D/g, '').slice(0, 10)
      this.setState({ phoneNo: limitedValue })
    } else {
      this.setState({ [name]: value })
    }
  }

  onSubmit = async (dispatch, e) => {
    e.preventDefault()
    this.setState({ disabled: true })

    const { email, name, address, phoneNo, role, team, doj, gender } = this.state

    try {
      const newUser = await axios.post('/api/admin/addEmployee', {
        email,
        name,
        address,
        gender,
        phoneNo,
        role,
        team,
        doj
      })

      toast.notify('Added new employee', { position: 'top-right' })
      this.props.history.push(`/editEmpProfile/${newUser.data._id}`)
    } catch (err) {
      this.setState({
        disabled: false,
        error: err.response?.data?.msg || 'Something went wrong'
      })
    }
  }

  render() {
    return (
      <Consumer>
        {value => {
          let { user, dispatch, token } = value
          if (token === undefined) token = ''

          if (!token) return <Redirect to="/login" />
          if (user.role !== 'admin') return <Redirect to="/" />

          return (
            <Spring
              from={{ transform: 'translate3d(1000px,0,0)' }}
              to={{ transform: 'translate3d(0px,0,0)' }}
              config={{ friction: 20 }}
            >
              {props => (
                <div className="row m-0">
                  {/* left panel */}
                  <div className="col-2 p-0 leftPart">
                    <AdminSidePanel />
                  </div>

                  {/* main form */}
                  <div className="col d-flex justify-content-center">
                    <div style={props}>
                      {this.state.error && (
                        <div className="alert alert-danger my-3">
                          {this.state.error}
                        </div>
                      )}

                      <form
                        className="addEmpForm"
                        onSubmit={e => this.onSubmit(dispatch, e)}
                      >
                        <h3>ADD EMPLOYEE</h3>
                        <hr />

                        <div className="row">
                          <div className="col">
                            <label htmlFor="name">Name</label>
                            <input
                              type="text"
                              name="name"
                              className="form-control"
                              placeholder="Joey Tribbiani"
                              onChange={this.onChange}
                              required
                            />
                          </div>
                          <div className="col">
                            <label htmlFor="email">Email</label>
                            <input
                              type="email"
                              name="email"
                              className="form-control"
                              placeholder="joey@gmail.com"
                              onChange={this.onChange}
                              required
                            />
                          </div>
                        </div>

                        <div className="row">
                          <div className="col">
                            <label htmlFor="address">Address</label>
                            <textarea
                              name="address"
                              rows="1"
                              className="form-control"
                              placeholder="Mapusa, Goa"
                              onChange={this.onChange}
                              required
                            />
                          </div>
                          <div className="col">
                            <label htmlFor="phoneNo">Phone No.</label>
                            <input
                              type="text"
                              name="phoneNo"
                              className="form-control"
                              placeholder="1234567890"
                              value={this.state.phoneNo}
                              onChange={this.onChange}
                              required
                            />
                          </div>
                        </div>

                        <div className="row">
                          <div className="col">
                            <label>Team</label>
                            <div className="dropdown mb-3">
                              <button
                                type="button"
                                className="btn btn-light dropdown-toggle"
                                onClick={() => this.toggleDropdown('team')}
                              >
                                {this.state.team}
                              </button>
                              {this.state.teamDropdownOpen && (
                                <div className="dropdown-menu show">
                                  {this.state.teamList.map(teamName => (
                                    <button
                                      key={teamName}
                                      type="button"
                                      className="dropdown-item"
                                      onClick={() =>
                                        this.onTeamSelect(teamName)
                                      }
                                    >
                                      {teamName}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="col">
                            <label>Role</label>
                            <div className="dropdown mb-3">
                              <button
                                type="button"
                                className="btn btn-light dropdown-toggle"
                                onClick={() => this.toggleDropdown('role')}
                              >
                                {this.state.role}
                              </button>
                              {this.state.roleDropdownOpen && (
                                <div className="dropdown-menu show">
                                  {this.state.roleList.map(roleName => (
                                    <button
                                      key={roleName}
                                      type="button"
                                      className="dropdown-item"
                                      onClick={() =>
                                        this.onRoleSelect(roleName)
                                      }
                                    >
                                      {roleName}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="row">
                          <div className="col">
                            <label htmlFor="doj">Date Of Joining</label>
                            <input
                              type="date"
                              name="doj"
                              className="form-control"
                              onChange={this.onChange}
                              required
                              max={new Date().toISOString().split('T')[0]}
                            />
                          </div>

                          <div className="col">
                            <label>Gender</label>
                            <div className="dropdown mb-3">
                              <button
                                type="button"
                                className="btn btn-light dropdown-toggle"
                                onClick={() => this.toggleDropdown('gender')}
                              >
                                {this.state.gender}
                              </button>
                              {this.state.genderDropdownOpen && (
                                <div className="dropdown-menu show">
                                  <button
                                    type="button"
                                    className="dropdown-item"
                                    onClick={() => this.onSelectGender('Male')}
                                  >
                                    Male
                                  </button>
                                  <button
                                    type="button"
                                    className="dropdown-item"
                                    onClick={() => this.onSelectGender('Female')}
                                  >
                                    Female
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <input
                          disabled={this.state.disabled}
                          type="submit"
                          value="Submit"
                          className="btn btn-primary btn-block"
                        />
                      </form>
                    </div>
                  </div>
                </div>
              )}
            </Spring>
          )
        }}
      </Consumer>
    )
  }
}

export default AddEmployee
