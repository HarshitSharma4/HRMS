import axios from 'axios';
import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Spring } from 'react-spring/renderprops';
import toast from 'toasted-notes';
import 'toasted-notes/src/styles.css';
import { Consumer } from '../../../context';
import AdminSidePanel from './AdminSidePanel';

export default class Options extends Component {
  constructor() {
    super();

    this.state = {
      teamName: '',
      roleName: '',
      existingTeamList: [],
      existingRoleList: [],
      error: '',
      title: '',
      description: '',
      dueDate: '',
      time: ''
    };

    // bind methods to this
    this.onChange = this.onChange.bind(this);
    this.onAddTeam = this.onAddTeam.bind(this);
    this.onAddRole = this.onAddRole.bind(this);
    this.onDeleteAdminAccount = this.onDeleteAdminAccount.bind(this);
    this.addToGoogleCalendar = this.addToGoogleCalendar.bind(this);
  }

  async componentDidMount() {
    try {
      const response = await axios.get('/api/admin/getTeamsAndRoles');
      const data = response?.data[0];
      console.log("data",response)
      this.setState({
        existingTeamList: data.teamNames || [],
        existingRoleList: data.roleNames || []
      });
    } catch (err) {
      console.error('Error fetching team and role list:', err);
      toast.notify('Failed to load team and role lists', { position: 'top-right' });
    }
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value, error: '' });
  }

  async onAddTeam() {
    const { existingTeamList, teamName } = this.state;

    if (teamName.trim() === '') {
      this.setState({ error: 'Team name cannot be empty' });
      return;
    }

    if (existingTeamList.includes(teamName.trim())) {
      this.setState({ error: 'Team name already exists' });
      return;
    }

    try {
      const response = await axios.post('/api/admin/addNewTeam', { teamName: teamName.trim() });
      this.setState({
        existingTeamList: response.data.teamNames,
        teamName: '',
        error: ''
      });

      toast.notify('New team added successfully', { position: 'top-right' });
    } catch (err) {
      console.error('Error adding new team:', err);
      toast.notify('Failed to add new team', { position: 'top-right' });
    }
  }

  async onAddRole() {
    const { existingRoleList, roleName } = this.state;

    if (roleName.trim() === '') {
      this.setState({ error: 'Role name cannot be empty' });
      return;
    }

    if (existingRoleList.includes(roleName.trim())) {
      this.setState({ error: 'Role name already exists' });
      return;
    }

    try {
      
      const response = await axios.post('/api/admin/addNewRole', { roleName: roleName.trim() });
      this.setState({
        existingRoleList: response.data.roleNames,
        roleName: '',
        error: ''
      });

      toast.notify('New role added successfully', { position: 'top-right' });
    } catch (err) {
      console.error('Error adding new role:', err);
      toast.notify('Failed to add new role', { position: 'top-right' });
    }
  }

  async onDeleteAdminAccount(dispatch) {
    const adminId = localStorage.getItem('userId');

    try {
      await axios.delete(`/api/admin/deleteAdminAcc/${adminId}`);
      localStorage.removeItem('auth-token');
      localStorage.removeItem('userId');

      dispatch({ type: 'LOGGED_OUT' });

      toast.notify('Admin account deleted successfully', { position: 'top-right' });

      this.props.history.push('/login');
    } catch (err) {
      console.error('Error deleting admin account:', err);
      toast.notify('Failed to delete admin account', { position: 'top-right' });
    }
  }

  async addToGoogleCalendar(e) {
    e.preventDefault();

    try {
      const gapi = window.gapi;

      const CLIENT_ID = '487679379915-7rvf2ror46e4bbsj8t8obali4heq5qjm.apps.googleusercontent.com';
      const API_KEY = 'AIzaSyB_HYziuQ7j6s9CiqSgXV3YiGTzr5nc0xE';
      const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'];
      const SCOPES = 'https://www.googleapis.com/auth/calendar.events';

      await new Promise(resolve => gapi.load('client:auth2', resolve));

      await gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES
      });

      await gapi.auth2.getAuthInstance().signIn();

      const event = {
        summary: this.state.title,
        description: this.state.description,
        start: {
          dateTime: `${this.state.dueDate}T${this.state.time}:00`,
          timeZone: 'Asia/Kolkata'
        },
        end: {
          dateTime: `${this.state.dueDate}T${this.state.time}:00`,
          timeZone: 'Asia/Kolkata'
        },
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'email', minutes: 24 * 60 },
            { method: 'popup', minutes: 10 }
          ]
        }
      };

      const request = gapi.client.calendar.events.insert({
        calendarId: 'primary',
        resource: event
      });

      request.execute(event => {
        console.log('Event added:', event);
        toast.notify('Successfully set reminder to your Google Calendar', { position: 'top-right' });
      });
    } catch (err) {
      console.error('Error adding to Google Calendar:', err);
      toast.notify('Failed to add reminder to Google Calendar', { position: 'top-right' });
    }
  }

  render() {
    return (
      <Consumer>
        {value => {
          const { dispatch, user } = value;

          const token = localStorage.getItem('auth-token');
          if (!token) return <Redirect to="/login" />;
          if (user && user.role !== 'admin') return <Redirect to="/empDashBoard" />;

          return (
            <Spring from={{ opacity: 0 }} to={{ opacity: 1 }} config={{ duration: 300 }}>
              {props => (
                <div className="row m-0" style={props}>
                  <div className="col-2 p-0 leftPart">
                    <AdminSidePanel />
                  </div>

                  <div className="col container rightPart">
                    <div className="row">
                      <div className="col">
                        <form className="addEmpForm" onSubmit={e => e.preventDefault()}>
                          {this.state.error && (
                            <div className="alert alert-danger">{this.state.error}</div>
                          )}

                          <h3>Add new Teams and Roles</h3>
                          <hr />

                          <label>New Team</label>
                          <div className="input-group mb-3">
                            <input
                              type="text"
                              className="form-control"
                              name="teamName"
                              value={this.state.teamName}
                              onChange={this.onChange}
                            />
                            <div className="input-group-append">
                              <button
                                type="button"
                                className="btn btn-primary"
                                onClick={this.onAddTeam}
                              >
                                Add
                              </button>
                            </div>
                          </div>

                          <label>New Role</label>
                          <div className="input-group mb-3">
                            <input
                              type="text"
                              className="form-control"
                              name="roleName"
                              value={this.state.roleName}
                              onChange={this.onChange}
                            />
                            <div className="input-group-append">
                              <button
                                type="button"
                                className="btn btn-primary"
                                onClick={this.onAddRole}
                              >
                                Add
                              </button>
                            </div>
                          </div>
                        </form>

                        <div className="mt-5">
                          <button
                            className="btn btn-danger"
                            onClick={() => {
                              if (
                                window.confirm(
                                  'Are you sure you want to delete your ADMIN account? This action cannot be undone!!'
                                )
                              ) {
                                this.onDeleteAdminAccount(dispatch);
                              }
                            }}
                          >
                            Delete Admin Account
                          </button>

                          <div className="alert alert-danger mt-3">
                            <small>
                              <b>Note:</b> Deleting your admin account will remove all pending
                              requests. It is recommended to clear all requests before proceeding.
                            </small>
                          </div>
                        </div>
                      </div>

                      <div className="col">
                        <form onSubmit={this.addToGoogleCalendar} className="addEmpForm">
                          <h3>
                            Add Reminder <i className="fab fa-google text-dark"></i>
                          </h3>
                          <hr />

                          <div className="form-group">
                            <label>Title</label>
                            <input
                              required
                              type="text"
                              className="form-control"
                              name="title"
                              onChange={this.onChange}
                            />
                          </div>

                          <div className="form-group">
                            <label>Description</label>
                            <textarea
                              required
                              className="form-control"
                              name="description"
                              onChange={this.onChange}
                            />
                          </div>

                          <div className="form-group">
                            <label>Due Date</label>
                            <input
                              required
                              type="date"
                              className="form-control"
                              name="dueDate"
                              onChange={this.onChange}
                            />
                          </div>

                          <div className="form-group">
                            <label>Time</label>
                            <input
                              required
                              type="time"
                              className="form-control"
                              name="time"
                              onChange={this.onChange}
                            />
                          </div>

                          <button type="submit" className="btn btn-primary btn-block">
                            Submit
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </Spring>
          );
        }}
      </Consumer>
    );
  }
}
