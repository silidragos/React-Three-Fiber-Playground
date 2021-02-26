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
import HelpersPage from './pages/helpers';
import OutlinePage from './pages/outline';
import VertexColorsPage from './pages/vertex-colors';

import './App.css';
import DashedLinesPage from "./pages/dashed-lines";

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
          <Route path='/dashed-lines'>
            <DashedLinesPage/>
          </Route>
          <Route path='/helpers'>
            <HelpersPage/>
          </Route>
          <Route path='/outline'>
            <OutlinePage/>
          </Route>
          <Route path="/vertex-colors">
            <VertexColorsPage/>
          </Route>
        </Switch>
      </div>
    </Router>
  );
}