import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import HelloWorldPage from './pages/basic-examples/hello-world';
import SolidMaterialsPage from './pages/basic-examples/solid-materials';
import ColorExplorerPage from './pages/basic-examples/color-explorer';
import WireframePage from './pages/basic-examples/wireframe';
import HelpersPage from './pages/basic-examples/helpers';
import OutlinePage from './pages/basic-examples/outline';
import VertexColorsPage from './pages/basic-examples/vertex-colors';
import ShapesPage from './pages/basic-examples/shapes';
import DashedLinesPage from "./pages/basic-examples/dashed-lines";
import ExtrusionPage from "./pages/basic-examples/extrusion";

import Text3DPage from "./pages/basic-examples/text-3d";
import TexturesPage from "./pages/textures/textures";
import TexturesRepeatPage from "./pages/textures/textures-repeat";
import TextureText3DPage from "./pages/textures/texture-text-3d";
import TranslucencePage from "./pages/textures/translucence";
import ShadowPage from "./pages/textures/shadow";
import './App.css';
import SkyboxPage from "./pages/textures/skybox";
import ReflectionPage from "./pages/textures/reflection";
import RefractionPage from "./pages/textures/refraction";
import BubblePage from "./pages/textures/bubble";
import TextureFromCanvasPage from "./pages/textures/texture-from-canvas";
import TextureAnimationPage from "./pages/textures/texture-animation";

import SpritesPage from './pages/sprites-examples/sprites';
import SpriteTextLabels from "./pages/sprites-examples/sprite-text-labels";
import LabeledGeometryPage from "./pages/sprites-examples/labeled-geometry";
import MouseSpritePage from "./pages/mouse-and-keyboard-examples/mouse-sprite";
import MouseClickPage from "./pages/mouse-and-keyboard-examples/mouse-click";
import MouseHoverPage from "./pages/mouse-and-keyboard-examples/mouse-hover";
import MouseTooltipPage from "./pages/mouse-and-keyboard-examples/mouse-tooltip";
import KeyboardEventsPage from "./pages/mouse-and-keyboard-examples/keyboard-events";
import MeshMovementPage from "./pages/camera-renderer-examples/mesh-movement";
import ChaseCameraPage from "./pages/camera-renderer-examples/chase-camera";

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
            <ColorExplorerPage />
          </Route>
          <Route path="/wireframe">
            <WireframePage />
          </Route>
          <Route path='/dashed-lines'>
            <DashedLinesPage />
          </Route>
          <Route path='/helpers'>
            <HelpersPage />
          </Route>
          <Route path='/outline'>
            <OutlinePage />
          </Route>
          <Route path="/vertex-colors">
            <VertexColorsPage />
          </Route>
          <Route path="/shapes">
            <ShapesPage />
          </Route>
          <Route path="/extrusion">
            <ExtrusionPage />
          </Route>
          <Route path="/text-3d">
            <Text3DPage />
          </Route>


          <Route path="/textures">
            <TexturesPage />
          </Route>
          <Route path="/textures-repeat">
            <TexturesRepeatPage />
          </Route>
          <Route path="/texture-text-3d">
            <TextureText3DPage />
          </Route>
          <Route path="/translucence">
            <TranslucencePage />
          </Route>
          <Route path="/shadow">
            <ShadowPage />
          </Route>
          <Route path="/skybox">
            <SkyboxPage />
          </Route>
          <Route path="/reflection">
            <ReflectionPage />
          </Route>
          <Route path="/refraction">
            <RefractionPage />
          </Route>
          <Route path="/bubble">
            <BubblePage />
          </Route>
          <Route path="/texture-from-canvas">
            <TextureFromCanvasPage />
          </Route>
          <Route path="/texture-animation">
            <TextureAnimationPage />
          </Route>


          <Route path="/sprites">
            <SpritesPage></SpritesPage>
          </Route>
          <Route path="/sprite-text-labels">
            <SpriteTextLabels></SpriteTextLabels>
          </Route>
          <Route path="/labeled-geometry">
            <LabeledGeometryPage></LabeledGeometryPage>
          </Route>

          <Route path="/mouse-sprite">
            <MouseSpritePage></MouseSpritePage>
            </Route>
          <Route path="/mouse-click">
            <MouseClickPage></MouseClickPage>
          </Route>
          <Route path="/mouse-hover">
            <MouseHoverPage></MouseHoverPage>
          </Route>
          <Route path="/mouse-tooltip">
            <MouseTooltipPage></MouseTooltipPage>
          </Route>
          <Route path="/keyboard-events">
            <KeyboardEventsPage></KeyboardEventsPage>
          </Route>

          <Route path="/mesh-movement">
            <MeshMovementPage></MeshMovementPage>
          </Route>
          <Route path="/chase-camera">
            <ChaseCameraPage></ChaseCameraPage>
          </Route>
        </Switch>
      </div>
    </Router>
  );
}