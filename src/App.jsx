import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import DefaultLayout from "./layout/DefaultLayout";

function App() {
  return (
    <Router>
      <DefaultLayout />
    </Router>
  );
}

export default App;
