require([
    "esri/Map",
    "esri/views/MapView",
    "esri/Color",
    "esri/layers/CSVLayer",
    "esri/layers/GeoJSONLayer",
    "esri/renderers/SimpleRenderer",
    "esri/symbols/SimpleFillSymbol",
    "esri/symbols/SimpleLineSymbol",
    "esri/widgets/LayerList",
    "./js/utilityFunctions.js"

], (Map, 
    MapView, 
    Color,
    CSVLayer,
    GeoJSONLayer,
    SimpleRenderer,
    SimpleFillSymbol,
    SimpleLineSymbol,
    LayerList,
    utils
)=> {

    // References to the user interface elements

    // Set up the user interface
    setUp();

    // Step 1: Create a map and view
    // Create a map
    const map = new Map({
        basemap: "topo-vector",
    });

    // Create a map view
    const view = new MapView({
        container: "viewDiv",
        map,
        zoom: 4,
        center: [-85, 35],
    });

    // When the view is ready
    view.when(async () => {
        // Create a GeoJSON layers for the eclipse
        // Step 2: Create center layer
        const centerLayer = new GeoJSONLayer({
            outFields: ["*"],
            renderer: new SimpleRenderer({
                symbol: new SimpleLineSymbol({
                    color: "red",
                    width: 2,
                }),
            }),
            title: "Center",
            url: "./data/center.geojson",
        });

        const totalityLayer = new GeoJSONLayer({
            blendMode: "multiply",
            outFields: ["*"],
            portalItem: {
                id: "ce751a1140f741ae91fd5947ff2f28d9",
            },
            renderer: new SimpleRenderer({
                symbol: new SimpleFillSymbol({
                    color: new Color({
                        r: 200,
                        g: 200,
                        b: 200,
                    }),
                    outline: {
                        color: new Color({
                            r: 100,
                            g: 100,
                            b: 100,
                        }),
                        width: 1,
                    },
                }),
            }),
            title: "Totality",
        });
        map.addMany([totalityLayer, centerLayer]);

        // Heather - Create a GeoJSON layer for the cities and their times by ref
        const cityTimesLayer = await createCityTimesLayer();

        // set renderer
        // const cityTimesRenderer = await createClusterCitiesRenderer();
        // cityTimesLayer.renderer = cityTimesRenderer;

        // const cityPopupTemplate = await createCityPopupTemplate();
        // cityTimesLayer.popupTemplate = cityPopupTemplate;

        const cityTimesFeatureReduction = await createClusterConfig();

        cityTimesLayer.featureReduction = cityTimesFeatureReduction;

        map.addMany([totalityLayer, centerLayer, cityTimesLayer]);

        // Wait for all layers to load
        await Promise.all(map.allLayers.map((layer) => layer.load()));
        // Create popup templates for each layer
        map.layers.forEach((layer) => {
            if (layer instanceof GeoJSONLayer || layer instanceof CSVLayer) {
                layer.popupTemplate = layer.createPopupTemplate();
            }
        });

        // Create a LayerList widget
        new LayerList({
            container: "layer-list-panel",
            view,
            visibilityAppearance: "checkbox",
        });
    });

    async function createCityTimesLayer() {
        const citiesWithinTotalityLayer =
            "https://hzgonz.esri.com/sites/demos/DS2024/DataFromAnywhere/workdata/Cities_within_path.geojson";

        const cityTimesGeoJSONLayer = new GeoJSONLayer({
            portalItem: {
                id: "9d8fc8b67322474aa72114177cccb0da",
            },
            copyright: "NASA",
            title: "Cities within totality path",
        });

        return cityTimesGeoJSONLayer;
    }


    /**
     * Set up the user interface
     */
    function setUp() {
        const toggleModalEl = document.getElementById("toggle-modal");
        const navigationEl = document.getElementById("nav");
        const panelEl = document.getElementById("sheet-panel");
        const modalEl = document.getElementById("modal");
        const sheetEl = document.getElementById("sheet");
        toggleModalEl?.addEventListener("click", () => handleModalChange());
        navigationEl?.addEventListener("calciteNavigationActionSelect", () =>
            handleSheetOpen(),
        );
        panelEl?.addEventListener("calcitePanelClose", () =>
            handlePanelClose(),
        );
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
    }
});