import axios from "axios";
import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import jwt_decode from "jwt-decode";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import Voke from "./components/Voke";
import { Notifications } from "react-push-notification";

function App() {
  const [auth, setAuth] = useState({ auth: false, username: "", role: [] });
  const [vokes, setVokes] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const logout = () => {
    setAuth({ auth: false, username: "", role: [] });
    axios.defaults.headers.authorization = null;
    if (localStorage.getItem("token")) localStorage.removeItem("token");
  };
  const login = (token) => {
    if (token) {
      localStorage.setItem("token", token);
      axios.defaults.headers.authorization = "Bearer " + token;
    }
    var decoded = jwt_decode(token);
    setAuth({ auth: true, username: decoded.username, role: decoded.role });
    axios
      .get(process.env.REACT_APP_API_PATH + "/api/invokes/invoke/notifications")
      .then((res) => {
        console.log(res);
        setNotifications(res.data.notifications);
      })
      .catch((error) => console.log(error));
  };
  useEffect(() => {
    if (localStorage.getItem("token")) {
      login(localStorage.getItem("token"));
    } else logout();

    axios
      .get(process.env.REACT_APP_API_PATH + "/api/invokes/voke/all")
      .then((res) => {
        setVokes(res.data.vokes);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  return (
    <>
      <Router>
        <Notifications />
        <Header
          auth={auth}
          logout={logout}
          vokes={vokes}
          notifications={notifications}
        />
        {process.env.REACT_APP_API_PATH}
        <Switch>
          <Route exact path="/">
            <Home auth={auth} />
          </Route>
          {!auth.auth && (
            <>
              <Route exact path="/register">
                <Register login={login} />
              </Route>
              <Route exact path="/login">
                <Login login={login} />
              </Route>
            </>
          )}
          <Route
            exact
            path="/voke/:vokeId"
            render={(props) => (
              <Voke key={props.match.params.vokeId} {...props} auth={auth} />
            )}
          />
          <Redirect from="/" to="/" />
        </Switch>
        <Footer />
      </Router>
    </>
  );
}

export default App;
