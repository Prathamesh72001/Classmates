import React, { useState } from "react";
import { useLocation } from "react-router-dom";

  
function PDFViewer() {
  const location = useLocation();
  const data = location.state;

  return (
    <div><iframe
      src={data}
      width="100%"
      height="600px"
      style={{ border: "none" }}
    /></div>
  );
}
export default PDFViewer;
