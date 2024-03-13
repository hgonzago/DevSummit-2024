import LabelClass from "@arcgis/core/layers/support/LabelClass";
import PopupTemplate from "@arcgis/core/PopupTemplate";
import * as typeRendererCreator from "@arcgis/core/smartMapping/renderers/type";


// update the ogcLayer's renderer
export async function updateLayer(layer, view) {
  const renderer = await createRenderer(layer, view);
  layer.renderer = renderer;

  // create template for the overall ogc layer
  const template = await createPopupTemplate(layer, view);
  layer.popupTemplate = template;
}

// create the unique types renderer from the cities point layer
async function createRenderer(layer, view) {
  const { renderer } = await typeRendererCreator.createRenderer({
    layer: layer,
    view: view,
    field: "STATE",
    basemapTheme: "light",
    sortBy: "count",
    sizeOptimizationEnabled: true,
  });
  return renderer;
}

// create a clustered feature reduction from the points
export async function createFeatureReductionCluster() {
  const featureReduction = {
    type: "cluster",
    clusterRadius: "100px",
    clusterMinSize: "19px",
    clusterMaxSize: "60px",
    popupEnabled: true,
    popupTemplate: await createClusterPopupTemplate(),
    labelingInfo: await createLabelingInfo(),
  };
  return featureReduction;
}

// create labelingInfo to pass into the cluster

async function createLabelingInfo() {
  var labelInfos = [];

  const labelClass = new LabelClass({
    deconflictionStrategy: "none",
    labelExpressionInfo: {
      expression: `$feature["cluster_count"]
      var value = $feature["cluster_count"];
      var num = Count(Text(Round(value)));
      var label = When(num < 4, Text(value, "#.#"),
      num == 4, Text(value / Pow(10, 3), "#.0k"),
      num <= 6, Text(value / Pow(10, 3), "#k"),
      num == 7, Text(value / Pow(10, 6), "#.0m"),
      num > 7, Text(value / Pow(10, 6), "#m"),
      Text(value, "#,###")  );
      return label;`,
    },
    labelPlacement: "center-center",
    repeatLabel: true,
    symbol: {
      type: "text",
      color: [240, 240, 240, 255],
      font: {
        family: "Noto Sans",
        size: 13,
        weight: "bold",
      },
      horizontalAlignment: "center",
      kerning: true,
      haloColor: [55, 56, 55, 255],
      haloSize: 1.3,
      rotated: false,
      verticalAlignment: "baseline",
    },
  });
  labelInfos.push(labelClass);

  return labelInfos;
}


// Create cluster popup template

async function createClusterPopupTemplate() {
  const clusterPopupTemplate = new PopupTemplate({
    content: [
      {
        type: "text",
        text: "<p>This cluster represents <b>{cluster_count}</b> cities that fall within the eclipse's totality path. The following lists the amount of clustered cities within each state. </p>",
      },
      {
        type: "expression",
        expressionInfo: {
        expression: `Expects($aggregatedFeatures, "STATE")
    var statsFS = GroupBy($aggregatedFeatures,
      [{ 
        name: 'StateName',
        expression: 'STATE'
      }], 
      // Statistics to return for each state and how many cities are in each state cluster
      [{
        name: 'num_features',
        expression: '1',
        statistic: 'COUNT' 
      }]
    );
    
    var ordered = OrderBy(statsFs, 'num_features DESC');
    var list = "<ul>";
    
    for (var group in ordered){
      list += \`<li>\${group.StateName} (\${Text(group.num_features, "#,###")})</li>\`
    }
    list += "</ul>";
    
    return {
      type: "text",
      text: list
    }`,
    title: "States with city count"
      }
    }
    ],
    description:
      "This cluster represents <b>{cluster_count}</b> cities within the eclipse's totality path.",
    expressionInfos: [
      {
        // ExpressionInfo to label individual state clusters with count
        name: "cluster_type_STATE",
        title: "Predominant State",
        expression: `var uvInfos = [{
          "value": "OH",
          "label": "OH"
        },{
          "value": "TX",
          "label": "TX"
        },{
          "value": "IN",
          "label": "IN"
        },{
          "value": "NY",
          "label": "NY"
        },{
          "value": "AR",
          "label": "AR"
        },{
          "value": "IL",
          "label": "IL"
        },{
          "value": "MO",
          "label": "MO"
        },{
          "value": "VT",
          "label": "VT"
        },{
          "value": "PA",
          "label": "PA"
        },{
          "value": "OK",
          "label": "OK"
        },{
          "value": "KY",
          "label": "KY"
        },{
          "value": "ME",
          "label": "ME"
        },{
          "value": "NH",
          "label": "NH"
        }];
        
        var predominantType = Text($feature["cluster_type_STATE"]);
        var label = "None";
        
        for (var i = 0; i < Count(uvInfos); i++) {
          if (uvInfos[i].value == predominantType) {
            label = uvInfos[i].label;
            break;
          }
        }
        return label;`,
        returnType: "string",
      },
    ],
    fieldInfos: [
      {
        fieldName: "cluster_count",
        format: {
          digitSeparator: true,
          places: 0,
        },
        label: "Number of features",
        visible: true,
      },
      {
        fieldName: "expression/cluster_type_STATE",
        visible: false,
      },
    ],
    title: "Cluster summary",
  });
  return clusterPopupTemplate;
}

async function createPopupTemplate(layer, view){
  const popupTemplate = new PopupTemplate({
    outFields: ["*"],
    content: [
      {
        type: "text",
        text: "<p>The city of <i>{NAME} </i>will begin 100% totality at</b/> {expression/expr0}</b> and will last for <b>{expression/expr1} </b>.</p>",
      },
      {
        type: "expression",
        expressionInfo: {
          expression: `var cssGray = "style='background-color:lightgray'";
var cssRight = "style='text-align: right;'";
var cssCenter = "style='text-align: center;'";

var table = "<table style='width: 100%;'>";
table +=
  \`<tr>
          <td><b>City</b></td>
          <td><b>First Contact</b></td>
          <td><b>Second Contact</b></td>
          <td><b>Totality</b></td>
          <td><b>Third Contact</b></td>
          <td><b>Fourth Contact</b></td>
        </tr>\`;

var beginTime = Date($feature["UTC_Time_0_01____start"]);
var beginMidTime = Date($feature["UTC_Time_50____start"]);
var totalityTime = Date($feature["UTC_Time_100__totality"]);
var midEndTime = Date($feature["UTC_Time_50____end"]);
var endTime = Date($feature["UTC_Time_0_01____end"]);

var format = "hh:mm:ss A";

var beginFormattedTime = Text(beginTime, format);
var beginMidFormattedTime = Text(beginMidTime, format);
var totalityFormattedTime = Text(totalityTime, format);
var midEndFormattedTime = Text(midEndTime, format);
var endFormattedTime = Text(endTime, format);

// Build the HTML table
table +=
  \`<tr>
        <td>\${$feature.NAME}</td>
        <td>\${beginFormattedTime}</td>
        <td>\${beginMidFormattedTime}</td>
        <td>\${totalityFormattedTime}</td>
        <td>\${midEndFormattedTime}</td>
        <td>\${endFormattedTime}</td>
      </tr>\`;

table += "</table>";

return { type: "text", text: table };`,
          title: "City with times for the five stages of the eclipse.",
        },
      },
    ],
    description:
      "<p>This popup describes the times per city with a table showing them individually</p>",
    expressionInfos: [
      {
        name: "expr0",
        title: "Get totality time",
        expression: `var inputDate = $feature.UTC_Time_100__totality;

        var inputDateInMillis = inputDate * 1000;
        
        var dateObject = Date(inputDateInMillis);

        var hours = Hour(dateObject);
        var minutes = Minute(dateObject);
        var seconds = Second(dateObject);

        var amPm = "AM";
        
        if (hours >= 12) {
          amPm = "PM";
          
          if (hours > 12) {
            hours = hours - 12
          }
        }
        var formattedTime = Text(hours, '00') + ':' + Text(minutes, '00') + ':' + Text(seconds, '00') + ' ' + amPm;
        
        return formattedTime;`,
        returnType: "string",
      },
      {
        name: "expr1",
        title: "durationInMinutes",
        expression: `var durationInSeconds = $feature.Duration;
          var minutes = (durationInSeconds / 60);
          var seconds = durationInSeconds % 60;
          var formattedMinutes = Text(minutes, '00') + " minutes ";
          var formattedSeconds = Text(seconds, '00') + " minutes";
          var combineFormat = formattedMinutes + formattedSeconds
          
          return combineFormat;`,
      },
    ],
    fieldInfos: [
      {
        fieldName: "OBJECTID",
        label: "OBJECTID",
        visible: false,
      },
      {
        fieldName: "NAME",
        label: "NAME",
        visible: true,
      },
      {
        fieldName: "Duration",
        format: {
          digitSeparator: true,
          places: 0,
        },
        label: "Duration",
        visible: false,
      },
      {
        fieldName: "STATE",
        label: "State",
        visible: true,
      },
      {
        fieldName: "UTC_Time_0_01____end",
        label: "UTC Time 0.01% - end",
        visible: false,
      },
      {
        fieldName: "UTC_Time_0_01____start",
        label: "UTC Time 0.01% - start",
        visible: false,
      },
      {
        fieldName: "UTC_Time_100__totality",
        format: {
          dateFormat: "short-date-short-time",
          digitSeparator: false,
        },
        label: "UTC Time 100% totality",
        visible: true,
      },
      {
        fieldName: "UTC_Time_50____end",
        label: "UTC Time 50% - end",
        visible: true,
      },
      {
        fieldName: "UTC_Time_50____start",
        label: "UTC Time 50% - start",
        visible: true,
      },
      {
        fieldName: "expression/expr0",
        visible: false,
      },
      {
        fieldName: "expression/expr1",
        visible: false,
      },
    ],
    title: "City: {NAME}",
  });

    return popupTemplate;
}


// The event contains the feature/graphic
async function doTimeSlider(view) {
let beginTime, beginMidTime, totalityTime, midEndTime, endTime;




}
