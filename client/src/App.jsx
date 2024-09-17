import { Routes, Route } from "react-router-dom";

import NavBar from "./Components/NavBar";
// import Home from "./Pages/Home";
// import Home from "./Pages/Home";
import About from "./Pages/About";
import Gallery from "./Pages/Gallery";
import "./App.css";
import Post from "./Components/Post";
import Overview from "./Components/Overview";

function App() {
  return (
    <div>
      <NavBar />

      <Routes>
        <Route path="/" element={<Overview />} />

        <Route path="/about" element={<About />} />

        <Route path="/gallery" element={<Gallery />} />
        <Route path="/user" element={<Post />} />
      </Routes>
    </div>
  );
}

export default App;
