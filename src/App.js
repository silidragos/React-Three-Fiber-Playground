import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import HelloWorldPage from './pages/hello-world';
import SolidMaterialsPage from './pages/solid-materials';
import ColorExplorerPage from './pages/color-explorer';
import WireframePage from './pages/wireframe';

import './App.css';

export default function App() {
  return (
    <Router>
      <div>
        <Switch>
          <Route path="/hello-world">
            <HelloWorldPage />
          </Route>
          <Route path="/solid-materials">
            <SolidMaterialsPage />
          </Route>
          <Route path="/color-explorer">
            <ColorExplorerPage/>
          </Route>
          <Route path="/wireframe">
            <WireframePage/>
          </Route>
        </Switch>
      </div>
    </Router>
  );
}