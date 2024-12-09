import Home from "./assets/pages/home";
import Login from "./assets/pages/login";
import Signup from "./assets/pages/signup";
import ImageTypeConverter from "./assets/components/imgType";
import ImageToPdfConverter from "./assets/components/imgtopdf";
import WordtoPdfConverter from "./assets/components/docxtopdf";
import "./assets/compStyles/common.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/register" element={<Signup/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/imgconverter" element={<ImageTypeConverter/>}/>
          <Route path="/img-to-pdf" element={<ImageToPdfConverter/>}/>
          <Route path="/docx-to-pdf" element={<WordtoPdfConverter/>}/>
        </Routes>
      </Router>
    </>
  )
}

export default App
