import { Component } from "react";

import {
  Container,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  FormText,
  FormFeedback,
  Alert
} from "reactstrap";

import LocationPicker from "react-location-picker";
import Select from "react-select";

import { getCodes, getName } from "country-list";
import axios from "axios";

class Register extends Component {
  constructor() {
    super();
    this.state = {
      username: {
        value: "",
        touched: false,
        valid: false,
        error: ""
      },
      password: {
        value: "",
        touched: false,
        valid: false,
        error: ""
      },
      location: {
        lat: 0,
        lng: 0
      },
      locationReady: false,
      country: "EG",
      formMessage: ""
    };
  }

  componentDidMount() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.setState({
          location: {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          },
          locationReady: true
        });
      });
    }
  }

  handleLocationChange = ({ position, address, places }) => {
    this.setState({ location: position });
  };

  handleFormChange = (e) => {
    if (!e.target) {
      return this.setState({ country: e.value });
    }
    var [name, value] = [e.target.name, e.target.value];
    var [error, touched, valid] = ["", true, true];
    if (name === "username" && (value.length < 3 || value.length > 25)) {
      error = "Invalid username";
      valid = false;
    }
    if (name === "password" && (value.length < 6 || value.length > 25)) {
      error = "Invalid password";
      valid = false;
    }
    this.setState({ [name]: { value, error, touched, valid } });
  };

  handleFormSubmit = (e) => {
    e.preventDefault();
    axios
      .post(process.env.REACT_APP_API_PATH + "/api/users/register", {
        username: this.state.username.value,
        password: this.state.password.value,
        location: {
          latitude: this.state.location.lat,
          longitude: this.state.location.lng
        },
        country: this.state.country
      })
      .then((res) => {
        const token = res.data.token;
        this.props.login(token);
        this.setState({
          formMessage: "Success: user created and is logged in now"
        });
      })
      .catch((error) => {
        this.setState({
          formMessage: "Error: " + error.response.data.error
        });
      });
  };

  render() {
    var countryOptions = [
      getCodes().map((code) => ({ value: code, label: getName(code) }))
    ];
    return (
      <>
        <Container>
          <Alert
            color={
              this.state.formMessage.startsWith("Error") ? "danger" : "success"
            }
            isOpen={this.state.formMessage !== ""}
            toggle={() =>
              this.state.formMessage !== ""
                ? this.setState({ formMessage: "" })
                : null
            }
          >
            {this.state.formMessage}
          </Alert>
          <Form onSubmit={this.handleFormSubmit}>
            <FormGroup>
              <Label for="username">Username</Label>
              <Input
                type="text"
                name="username"
                id="username"
                placeholder="Username here ..."
                invalid={
                  this.state.username.touched && !this.state.username.valid
                }
                value={this.state.username.value}
                onChange={this.handleFormChange}
              />
              <FormText>Username between 3 and 25 character</FormText>
              {this.state.username.touched && !this.state.username.valid && (
                <FormFeedback>{this.state.username.error}</FormFeedback>
              )}
            </FormGroup>
            <FormGroup>
              <Label for="password">Password</Label>
              <Input
                type="password"
                name="password"
                id="password"
                placeholder="Password here ..."
                invalid={
                  this.state.password.touched && !this.state.password.valid
                }
                value={this.state.password.value}
                onChange={this.handleFormChange}
              />
              <FormText>Password between 6 and 25 character</FormText>
              {this.state.password.touched && !this.state.password.valid && (
                <FormFeedback>{this.state.password.error}</FormFeedback>
              )}
            </FormGroup>
            <FormGroup>
              <Select
                options={countryOptions[0]}
                onChange={this.handleFormChange}
              />
            </FormGroup>
            <FormGroup>
              <div className="mt-2">
                {this.state.locationReady && (
                  <LocationPicker
                    containerElement={
                      <div className="row" style={{ height: "100%" }} />
                    }
                    mapElement={
                      <div
                        className="col-xs-12 col-md-6 offset-md-6"
                        style={{ height: "300px" }}
                      />
                    }
                    defaultPosition={this.state.location}
                    onChange={this.handleLocationChange}
                  />
                )}
              </div>
            </FormGroup>
            <Button className="mt-5">Submit</Button>{" "}
          </Form>
        </Container>
      </>
    );
  }
}

export default Register;
