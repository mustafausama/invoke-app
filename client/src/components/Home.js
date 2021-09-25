import axios from "axios";
import { Component } from "react";
import { withRouter } from "react-router";
import { NavLink } from "react-router-dom";
import {
  Alert,
  Button,
  Col,
  Container,
  Form,
  FormFeedback,
  FormGroup,
  FormText,
  Input,
  InputGroup,
  InputGroupAddon,
  Jumbotron,
  Label,
  ListGroup,
  ListGroupItem,
  ListGroupItemHeading,
  ListGroupItemText,
  Row
} from "reactstrap";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      vokes: [],
      formMessage: "",
      title: {
        value: "",
        valid: false,
        touched: false,
        error: ""
      },
      body: {
        value: "",
        valid: false,
        touched: false,
        error: ""
      },
      radius: {
        value: 0,
        valid: false,
        touched: false,
        error: ""
      }
    };
  }
  getVokes = () => {
    axios
      .get(process.env.REACT_APP_API_PATH + "/api/invokes/voke/all/")
      .then((res) => {
        console.log(res);
        this.setState({ vokes: res.data.vokes });
      })
      .catch((err) => console.log(err));
  };

  componentDidMount() {
    this.getVokes();
  }

  removeVoke = (id) => {
    axios
      .delete(process.env.REACT_APP_API_PATH + "/api/invokes/voke/" + id)
      .then((res) => {
        this.setState({
          vokes: this.state.vokes.filter((voke) => voke._id !== id)
        });
      })
      .catch((error) => {
        this.setState({
          formMessage: "Error: " + error.response.data.error
        });
      });
  };

  handleFormChange = (e) => {
    var [name, value] = [e.target.name, e.target.value];
    var [error, touched, valid] = ["", true, true];
    if (name === "title" && (value.length < 3 || value.length > 100)) {
      error = "Invalid title";
      valid = false;
    }
    if (
      name === "body" &&
      value.length > 0 &&
      (value.length < 3 || value.length > 5000)
    ) {
      error = "Invalid voke body";
      valid = false;
    }
    this.setState({ [name]: { value, error, touched, valid } });
  };

  handleFormSubmit = (e) => {
    e.preventDefault();
    axios
      .post(process.env.REACT_APP_API_PATH + "/api/invokes/voke/", {
        title: this.state.title.value,
        body: this.state.body.value,
        radius: this.state.radius.value
      })
      .then((res) => {
        const voke = res.data.voke;
        this.setState({
          formMessage: "Success: voke created",
          vokes: [...this.state.vokes, voke],
          title: {
            value: "",
            valid: false,
            touched: false,
            error: ""
          },
          body: {
            value: "",
            valid: false,
            touched: false,
            error: ""
          },
          radius: {
            value: 0,
            valid: false,
            touched: false,
            error: ""
          }
        });
      })
      .catch((error) => {
        this.setState({
          formMessage: "Error: " + error.response.data.error
        });
      });
  };

  render() {
    const vokesView =
      this.state.vokes && this.state.vokes.length > 0 ? (
        <ListGroup>
          {this.state.vokes.map((voke) => (
            <ListGroupItem>
              <Row>
                <Col xs="11">
                  <ListGroupItemHeading>
                    <NavLink
                      to={"/voke/" + voke._id}
                      className="nav-link"
                      activeClassName="active"
                    >
                      {voke.title}
                    </NavLink>
                  </ListGroupItemHeading>
                </Col>
                <Col>
                  {this.props.auth.role.includes("author") && (
                    <Button
                      onClick={() => this.removeVoke(voke._id)}
                      className="pull-right btn-sm float-right"
                    >
                      Remove
                    </Button>
                  )}
                </Col>
              </Row>
              {voke.body && <ListGroupItemText>{voke.body}</ListGroupItemText>}
            </ListGroupItem>
          ))}
        </ListGroup>
      ) : (
        <Jumbotron>
          <Container>
            <h1 className="display-3 text-center">Loading ...</h1>
          </Container>
        </Jumbotron>
      );
    return (
      <>
        <Container>
          {this.props.auth.role.includes("author") && (
            <>
              <h2 className="text-center mt-5">Add new voke</h2>
              <Alert
                color={
                  this.state.formMessage.startsWith("Error")
                    ? "danger"
                    : "success"
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
                <InputGroup>
                  <Input
                    type="text"
                    name="title"
                    id="title"
                    placeholder="Title here ..."
                    invalid={
                      this.state.title.touched && !this.state.title.valid
                    }
                    value={this.state.title.value}
                    onChange={this.handleFormChange}
                  />
                  <InputGroupAddon addonType="append">
                    <Input
                      type="number"
                      name="radius"
                      id="radius"
                      placeholder="Radius (meters)"
                      invalid={
                        this.state.radius.touched && !this.state.radius.valid
                      }
                      value={this.state.radius.value}
                      onChange={this.handleFormChange}
                    />
                  </InputGroupAddon>
                  <InputGroupAddon addonType="append">
                    <Button type="submit" color="secondary">
                      Voke
                    </Button>
                  </InputGroupAddon>
                </InputGroup>
                <FormGroup>
                  <Label for="body">Text</Label>
                  <Input
                    type="text"
                    name="body"
                    id="body"
                    placeholder="Text here ..."
                    invalid={this.state.body.touched && !this.state.body.valid}
                    value={this.state.body.value}
                    onChange={this.handleFormChange}
                  />
                  <FormText>Voke between 3 and 5000 character</FormText>
                  {this.state.body.touched && !this.state.body.valid && (
                    <FormFeedback>{this.state.body.error}</FormFeedback>
                  )}
                </FormGroup>
              </Form>
            </>
          )}

          <h2 className="text-center mt-5">All vokes</h2>

          {vokesView}
        </Container>
      </>
    );
  }
}

export default withRouter(Home);
