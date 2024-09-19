import { useState } from "react";
import { NavLink } from "react-router-dom";
// import "../styles/NavBar.css";
import { CodeIcon, HamburgerMenuClose, HamburgerMenuOpen } from "./Icons";

function NavBar({ loggedIn, setLoggedIn }) {
  const [click, setClick] = useState(false);

  //logs user out
  const handleLogout = () => {
    localStorage.removeItem("token");
    //update state to reflect logged out status
    setLoggedIn(false);
    //redirects them to the home page
    window.location.href = "/";
  };

  const handleClick = () => setClick(!click);
  return (
    <>
      <nav className="navbar">
        <div className="nav-container">
          <NavLink exact to="/" className="nav-logo">
            <span>Tripy</span>
            {/* <i className="fas fa-code"></i> */}
            <span className="icon">
              <CodeIcon />
            </span>
          </NavLink>

          <ul className={click ? "nav-menu active" : "nav-menu"}>
            <li className="nav-item">
              <NavLink
                exact
                to="/"
                activeClassName="active"
                className="nav-links"
                onClick={handleClick}
              >
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                exact
                to="/about"
                activeClassName="active"
                className="nav-links"
                onClick={handleClick}
              >
                About US
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                exact
                to="/gallery"
                activeClassName="active"
                className="nav-links"
                onClick={handleClick}
              >
                Gallery
              </NavLink>
            </li>
            {/* <-------- v conditionally render if user is logged in v --------> */}
            {loggedIn ? (
              <>
                <li className="nav-item">
                  <NavLink
                    exact
                    to="/account"
                    activeClassName="active"
                    className="nav-links"
                    onClick={handleClick}
                  >
                    Account
                  </NavLink>
                </li>
                <li
                  exact
                  activeClassName="active"
                  className="nav-links"
                  onClick={(handleClick, handleLogout)}
                >
                  Logout
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <NavLink
                    exact
                    to="/register"
                    activeClassName="active"
                    className="nav-links"
                    onClick={handleClick}
                  >
                    Register
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    exact
                    to="/login"
                    activeClassName="active"
                    className="nav-links"
                    onClick={handleClick}
                  >
                    Log In
                  </NavLink>
                </li>
              </>
            )}
            {/* <-------- ^ conditionally render if user is logged in ^ --------> */}
          </ul>
          {/* <------- v Not sure whats happeing here v --------> */}
          <div className="nav-icon" onClick={handleClick}>
            {/* <i className={click ? "fas fa-times" : "fas fa-bars"}></i> */}

            {click ? (
              <span className="icon">
                <HamburgerMenuOpen />{" "}
              </span>
            ) : (
              <span className="icon">
                <HamburgerMenuClose />
              </span>
            )}
          </div>
          {/* <------- ^ Not sure whats happeing here ^ --------> */}
        </div>
      </nav>
    </>
  );
}

export default NavBar;
