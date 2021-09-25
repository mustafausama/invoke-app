import axios from "axios";
import { Component } from "react";
import { withRouter } from "react-router";
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

class Voke extends Component {
  constructor(props) {
    super(props);
    this.state = {
      voke: null,
      invokes: [],
      formMessage: "",
      location: {
        lat: 0,
        lng: 0
      },
      locationReady: false,
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
      }
    };
  }
  getVoke = () => {
    const { vokeId } = this.props.match.params;
    axios
      .get(process.env.REACT_APP_API_PATH + "/api/invokes/voke/" + vokeId)
      .then((res) => {
        this.setState({ voke: res.data.voke });
        axios
          .get(
            process.env.REACT_APP_API_PATH +
              "/api/invokes/invoke/all/" +
              this.state.voke._id
          )
          .then((res) => this.setState({ invokes: res.data.invokes }))
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  };

  componentDidMount() {
    this.getVoke();
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

  removeInvoke = (id) => {
    axios
      .delete(process.env.REACT_APP_API_PATH + "/api/invokes/invoke/" + id)
      .then((res) => {
        this.setState({
          invokes: this.state.invokes.filter((invoke) => invoke._id !== id)
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
      error = "Invalid invoke";
      valid = false;
    }
    this.setState({ [name]: { value, error, touched, valid } });
  };

  handleFormSubmit = (e) => {
    e.preventDefault();
    console.log(this.state);
    if (this.state.locationReady)
      axios
        .post(
          process.env.REACT_APP_API_PATH +
            "/api/invokes/invoke/" +
            this.state.voke._id,
          {
            title: this.state.title.value,
            body: this.state.body.value,
            location: {
              latitude: this.state.location.lat,
              longitude: this.state.location.lng
            }
          }
        )
        .then((res) => {
          const invoke = res.data.invoke;
          this.setState({
            formMessage: "Success: invoke posted",
            invokes: [...this.state.invokes, invoke],
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
    const invokesView =
      this.state.invokes.length > 0 ? (
        <ListGroup>
          {this.state.invokes.map((invoke) => (
            <ListGroupItem>
              <Row>
                <Col xs="11">
                  <ListGroupItemHeading>{invoke.title}</ListGroupItemHeading>
                </Col>
                <Col>
                  {this.props.auth.role.includes("author") && (
                    <Button
                      onClick={() => this.removeInvoke(invoke._id)}
                      className="pull-right btn-sm float-right"
                    >
                      Remove
                    </Button>
                  )}
                </Col>
              </Row>
              <ListGroupItemText>
                {invoke.author.username && "by: " + invoke.author.username}
              </ListGroupItemText>

              {invoke.body && (
                <ListGroupItemText>{invoke.body}</ListGroupItemText>
              )}
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
    return this.state.voke ? (
      <>
        <Jumbotron>
          <Container>
            <h1 className="display-3 text-center">{this.state.voke.title}</h1>
            <p className="lead text-center">{this.state.voke.body}</p>
          </Container>
        </Jumbotron>
        <Container>
          {this.props.auth.role.includes("author") && (
            <>
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

              <Form onSubmit={this.handleFormSubmit} className="mb-5">
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
                    <Button type="submit" color="secondary">
                      Invoke
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
                  <FormText>Invoke between 3 and 5000 character</FormText>
                  {this.state.body.touched && !this.state.body.valid && (
                    <FormFeedback>{this.state.body.error}</FormFeedback>
                  )}
                </FormGroup>
              </Form>
            </>
          )}
          {invokesView}
        </Container>
      </>
    ) : (
      <Jumbotron>
        <Container>
          <h1 className="display-3 text-center">Loading ...</h1>
        </Container>
      </Jumbotron>
    );
  }
}

export default withRouter(Voke);
