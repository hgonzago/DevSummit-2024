  require([
    "esri/WebMap",
    "esri/views/MapView",
    "esri/widgets/Editor",
    "esri/identity/OAuthInfo",
    "esri/identity/IdentityManager"
  ], function (
    WebMap, MapView, Editor, OAuthInfo, esriId
  ) {

    // const oauthInfo = new OAuthInfo({
    //   appId: "t7L2ThUVWpF1mSRE",
    //   flowType: "auto", // default that uses two-step flow
    //   popup: false
    // });

    // esriId.registerOAuthInfos([oauthInfo]);

    const map = new WebMap({
      portalItem: { id: "87ebf621bdfe4cd09435126758c7ee70" }
    });

    const view = new MapView({
      map,
      container: "viewDiv",
      padding: {
        left: 49
      },
      zoom: 19
    });

    // Hide the loading indicator; show the app
    view.when(() => {

      initializeWidgets();
      let activeWidget;

      const handleActionBarClick = ({ target }) => {
        if (target.tagName !== "CALCITE-ACTION") {
          return;
        }

        if (activeWidget) {
          document.querySelector(`[data-action-id=${activeWidget}]`).active = false;
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

      document.querySelector("calcite-action-bar").addEventListener("click", handleActionBarClick);

      let actionBarExpanded = false;

      document.addEventListener("calciteActionBarToggle", event => {
        actionBarExpanded = !actionBarExpanded;
        view.padding = {
          left: actionBarExpanded ? 157 : 45
        };
      });

      function initializeWidgets() {

      const editor = new Editor({
        map,
        view
      }, "editor");

      }

    });
  });