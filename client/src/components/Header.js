import { useState } from "react";
import addNotification from "react-push-notification";
import { NavLink } from "react-router-dom";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  NavbarText,
  Container
} from "reactstrap";

const Header = ({ auth: { auth, username }, logout, vokes, notifications }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);
  notifications.map((no) =>
    addNotification({
      title: no.title,
      message: "emergency neer you",
      native: true
    })
  );
  return (
    <Navbar color="light" light expand="md">
      <Container>
        <NavbarBrand>
          <NavLink to="/" className="nav-link" activeClassName="active">
            InVoke
          </NavLink>
        </NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="mr-auto" navbar>
            <NavItem>
              <NavLink to="/" className="nav-link" activeClassName="active">
                Home
              </NavLink>
            </NavItem>

            {!auth && (
              <>
                <NavItem>
                  <NavLink
                    to="/login"
                    className="nav-link"
                    activeClassName="active"
                  >
                    Login
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    to="/register"
                    className="nav-link"
                    activeClassName="active"
                  >
                    Register
                  </NavLink>
                </NavItem>
              </>
            )}
            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav caret>
                Vokes
              </DropdownToggle>
              <DropdownMenu right>
                {vokes.map((voke) => (
                  <DropdownItem key={voke._id}>
                    <NavLink
                      to={"/voke/" + voke._id}
                      className="nav-link"
                      activeClassName="active"
                    >
                      {voke.title}
                    </NavLink>
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </UncontrolledDropdown>
            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav caret>
                Notifications {"[" + notifications.length + "]"}
              </DropdownToggle>
              {notifications.length > 0 && (
                <DropdownMenu right>
                  {notifications.map((no) => (
                    <DropdownItem key={no._id}>
                      <NavLink
                        to={"/voke/" + no.reference}
                        className="nav-link"
                        activeClassName="active"
                      >
                        {no.title}
                      </NavLink>
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              )}
            </UncontrolledDropdown>
          </Nav>
          {auth && (
            <NavbarText className="ms-auto ">
              Welcome back, {username},{" "}
            </NavbarText>
          )}{" "}
          {auth && (
            <a href="#n" onClick={logout}>
              Logout
            </a>
          )}
        </Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
