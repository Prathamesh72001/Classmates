import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import About from "./pages/About";
import ViewAll from "./pages/ViewAll";
import PDFViewer from "./pages/PDFViewer";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/viewall" element={<ViewAll/>}/>
          <Route path="/pdfviewer" element={<PDFViewer/>}/>
          <Route path="*" element={<NotFound />} />
        </Routes>
    </div>
  );
}

export default App;
