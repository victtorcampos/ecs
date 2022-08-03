import React from 'react';

import './App.css';
import { Outlet } from "react-router-dom";
import MenuLink from './components/MenuLink';

function App() {
  return (
    <div className="container-fluid">
      <MenuLink />
      <Outlet />
    </div>
  );
}

export default App;
