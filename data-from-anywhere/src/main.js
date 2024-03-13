import MapView from "@arcgis/core/views/MapView";
import WebMap from "@arcgis/core/WebMap";
import WFSLayer from "@arcgis/core/layers/WFSLayer";
import OGCFeatureLayer from "@arcgis/core/layers/OGCFeatureLayer";
import Legend from "@arcgis/core/widgets/Legend";
import FeatureEffect from "@arcgis/core/layers/support/FeatureEffect";
import FeatureFilter from "@arcgis/core/layers/support/FeatureFilter";
import * as reactiveUtils from "@arcgis/core/core/reactiveUtils.js";
import * as renderUtilities from "./helpers/renderFunctions.js";
import { defineCustomElements } from "@esri/calcite-components/dist/loader";

import "./style.css";

// Load the Calcite custom elements
defineCustomElements(window, {
  resourcesUrl: "https://js.arcgis.com/calcite-components/2.6.0/assets",
});

// Call function to define UI
setUp();

// This loads the base map and center and eclipse totality path
const map = new WebMap({
  portalItem: {
    id: "1ae947834c464227b09ef330bf10eb94"
  },
});

const view = new MapView({
  container: "viewDiv",
  map,
  popup: {
    defaultPopupTemplateEnabled: true, // default popup will be enabled on layers
  },
});

// 1 - Create the WFSLayer and set initial properties
const wfsLayer = new WFSLayer({
  // portalItem: {
  //   id: "c2a1ec86c6874b7595bbe0bbc26d8e5f", // can also be referenced as a portal item
  // }
  url: "https://dservices.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/services/US_states_wfs/WFSServer", // url to your WFS endpoint
  name: "US_states_polygons", // name of the FeatureType
  copyright: "Esri"
});

// 4 - Create the OGCFeature layer and reference the URL
// Create the OGCFeatureLayer and set initial properties
const ogcLayer = new OGCFeatureLayer({
  url: "https://services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/Cities_within_path/OGCFeatureServer", // url to the OGC landing page
  collectionId: "0", // unique id of the collection (OverlayedFeatures)
  legendEnabled: true
});

// Once the view is ready, get the layer view from the OGC layer and update
view.when(async () => {
  map.when(() => {
    let activeWidget;

    const handleActionBarClick = ({ target }) => {
      if (target.tagName !== "CALCITE-ACTION") {
        return;
      }

      if (activeWidget) {
        document.querySelector(`[data-action-id=${activeWidget}]`).active =
          false;
        document.querySelector(`[data-panel-id=${activeWidget}]`).hidden = true;
      }

      const nextWidget = target.dataset.actionId;
      if (nextWidget !== activeWidget) {
        document.querySelector(`[data-action-id=${nextWidget}]`).active = true;
        document.querySelector(`[data-panel-id=${nextWidget}]`).hidden = false;
        activeWidget = nextWidget;
      } else {
        activeWidget = null;
      }
    };

    document
      .querySelector("calcite-action-bar")
      .addEventListener("click", handleActionBarClick);

    let actionBarExpanded = false;

    document.addEventListener("calciteActionBarToggle", (event) => {
      actionBarExpanded = !actionBarExpanded;
      view.padding = {
        left: actionBarExpanded ? 157 : 45,
      };
    });

    document.querySelector("calcite-loader").hidden = true;
  });

  // Create the legend and set the view to it
  const legend = new Legend({
    container: "legend-panel",
    view,
  });
});

// Set up the user interface

function setUp() {
  const toggleModalEl = document.getElementById("toggle-modal");
  const navigationEl = document.getElementById("nav");
  const panelEl = document.getElementById("sheet-panel");
  const modalEl = document.getElementById("modal");
  const sheetEl = document.getElementById("sheet");
  const addWfs = document.getElementById("add-wfs-layer");
  const effectWfs = document.getElementById("add-wfs-effect");
  const addOgc = document.getElementById("add-ogc-layer");
  const renderOgc = document.getElementById("add-ogc-renderer");
  const clusterOgc = document.getElementById("ogc-cluster");
  const addTime = document.getElementById("timeslider-widget");

  toggleModalEl?.addEventListener("click", () => handleModalChange());
  navigationEl?.addEventListener("calciteNavigationActionSelect", () =>
    handleSheetOpen()
  );

  panelEl?.addEventListener("calcitePanelClose", () => handlePanelClose());

  addWfs?.addEventListener("click", () => handleAddWfsLayer());
  effectWfs?.addEventListener("click", () => handleEffectWFS(wfsLayer));
  
  addOgc?.addEventListener("click", () => handleAddOgcLayer());
  renderOgc?.addEventListener("click", () => handleRendererOgc(ogcLayer));
  clusterOgc?.addEventListener("click", () => handleOgcCluster());
  addTime?.addEventListener("click", () => handleAddTimeSlider());


  //----------------------
  // BEGIN DEMO STEPS
  //----------------------

  // Step 2 - Add the WFS Layer to the map and render

  async function handleAddWfsLayer() {
    const statesRenderer = {
      type: "simple",
      symbol: {
        type: "simple-fill",
        color: [0, 0, 0, 0],
        outline: {
          color: [191,180,158, 1],
          width: "1",
        },
        style: "solid",
      },
    };

    wfsLayer.renderer = statesRenderer;
    map.add(wfsLayer, 0);
  }

  // Step 3 - Add feature effect to WFS layer
  async function handleEffectWFS(wfsLayer) {
    const featureFilter = new FeatureFilter({
      where:
        "(state_name = 'Kentucky') OR (state_name = 'Arkansas') OR (state_name = 'Pennsylvania') OR (state_name = 'Illinois') OR (state_name = 'Ohio') OR (state_name = 'Indiana') OR (state_name = 'New York') OR (state_name = 'Oklahoma') OR (state_name = 'Texas') OR (state_name = 'Missouri') OR (state_name = 'Vermont') OR (state_name = 'New Hampshire') OR (state_name = 'Maine')",
    });

    const includedEffect =
      "drop-shadow(1.5px, 1.5px, 2.25px, black) brightness(65%)";
    const excludedEffect = "opacity(65%) grayscale(100%)";

    const featureEffect = new FeatureEffect({
      filter: featureFilter,
      excludedEffect: excludedEffect,
      includedEffect: includedEffect,
    });

    const wfsLayerView = await view.whenLayerView(wfsLayer);
    wfsLayerView.featureEffect = featureEffect;
  }

  // Step 4 - add OGC Layer to the map
  function handleAddOgcLayer() {
    map.add(ogcLayer);
  }

  //Step 5 - Render the OGC layer by unique value and cluster
  async function handleRendererOgc(layer) {
    // once the view is ready, get the layer view from the ogc layer and update
    const ogcLayerView = await view.whenLayerView(layer);
    await reactiveUtils.whenOnce(
      () => !ogcLayerView.updating,
      renderUtilities.updateLayer(layer, view)
    );
  }

  // Step 8 - Set a feature reduction cluster on OGC layer

  async function handleOgcCluster() {

    const featureReduction = await renderUtilities.createFeatureReductionCluster();
    ogcLayer.featureReduction = featureReduction;

  }

  // Step 6 - Add a time slider widget

    async function handleAddTimeSlider() {



    }

  // ----------------------
  // END DEMO STEPS
  // ----------------------


  function handleModalChange() {
    if (modalEl) {
      modalEl.open = !modalEl.open;
    }
  }

  function handleSheetOpen() {
    sheetEl.open = true;
    panelEl.closed = false;
  }

  function handlePanelClose() {
    sheetEl.open = false;
  }

  document.querySelector("calcite-shell").hidden = false;
  document.querySelector("calcite-loader").hidden = true;
}
