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

import axios from "axios";

class Login extends Component {
  constructor(props) {
    super(props);
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
      formMessage: ""
    };
  }

  handleFormChange = (e) => {
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
      .post(process.env.REACT_APP_API_PATH + "/api/users/login", {
        username: this.state.username.value,
        password: this.state.password.value
      })
      .then((res) => {
        const token = res.data.token;
        this.props.login(token);
        this.setState({
          formMessage: "Success: logged in"
        });
      })
      .catch((error) => {
        this.setState({
          formMessage: "Error: " + error.response.data.error
        });
      });
  };

  render() {
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
            <Button className="mt-5">Submit</Button>{" "}
          </Form>
        </Container>
      </>
    );
  }
}

export default Login;
