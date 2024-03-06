import PopupTemplate from "esri/PopupTemplate";
import FeatureReductionCluster from "esri/layers/support/FeatureReductionCluster";
import LabelClass from "esri/layers/support/LabelClass";
import UniqueValueRenderer from "esri/renderers/UniqueValueRenderer";


async function createClusterConfig() {
    const clusterPopupTemplate = await createClusterPopupTemplate();
    const clusterRenderer = await createClusterCitiesRenderer();
    const clusterLabelingInfo = await createLabelingInfo();

    const featureReduction = new FeatureReductionCluster({
        clusterRadius: 71,
        clusterMinSize: 19,
        clusterMaxSize: 36,
        popupEnabled: true,
        popupTemplate: clusterPopupTemplate,
        renderer: clusterRenderer,
        labelingInfo: clusterLabelingInfo,
        fields: [{
            name: "cluster_count",
            statisticType: "count"
        },
        {
            name: "cluster_type_STATE",
            onStatisticField: "STATE",
            statisticType: "mode"
        }
    ]
});

return featureReduction;
}

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
        labelPlacement: "esriServerPointLabelPlacementCenterCenter",
        repeatLabel: true,
        symbol: {
            type: "esriTS",
            color: [240, 240, 240, 255],
            font: {
                family: "Noto Sans",
                size: 9,
                weight: "bold",
            },
            horizontalAlignment: "center",
            kerning: true,
            haloColor: [55, 56, 55, 255],
            haloSize: 0.75,
            rotated: false,
            verticalAlignment: "baseline",
            xoffset: 0,
            yoffset: 0,
            angle: 0,
        },
    });
    labelInfos.push(labelClass);
    return labelInfos;
}

async function createCityPopupTemplate() {
    const cityPopupTemplate = new PopupTemplate({
        content: [
            {
                type: "fields",
                fieldInfos: [
                    {
                        fieldName: "NAME",
                        label: "NAME",
                        visible: true,
                    },
                    {
                        fieldName: "STATE",
                        label: "STATE",
                        visible: true,
                    },
                    {
                        fieldName: "UTC_Time_0_01____start",
                        label: "UTC Time 0.01% - start",
                        visible: true,
                    },
                    {
                        fieldName: "UTC_Time_50____start",
                        label: "UTC Time 50% - start",
                        visible: true,
                    },
                    {
                        fieldName: "UTC_Time_100__totality",
                        format: {
                            dateFormat: "shortDateShortTime",
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
                        fieldName: "UTC_Time_0_01____end",
                        label: "UTC Time 0.01% - end",
                        visible: true,
                    },
                ],
                title: "City eclipse times",
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
                    places: 2,
                },
                label: "Duration",
                visible: false,
            },
            {
                fieldName: "Join_Count",
                format: {
                    digitSeparator: true,
                    places: 0,
                },
                label: Join_Count,
                visible: false,
            },
            {
                fieldName: "LAT",
                format: {
                    digitSeparator: true,
                    places: 2,
                },
                label: "LAT",
                visible: false,
            },
            {
                fieldName: "LON",
                format: {
                    digitSeparator: true,
                    places: 2,
                },
                label: "LON",
                visible: false,
            },
            {
                fieldName: "STATE",

                label: "STATE",
                visible: true,
            },
            {
                fieldName: "TARGET_FID",
                format: {
                    digitSeparator: true,
                    places: 0,
                },
                label: "TARGET_FID",
                visible: false,
            },
            {
                fieldName: "UTC_Time_0_01____end",
                label: "UTC Time 0.01% - end",
                visible: true,
            },
            {
                fieldName: "UTC_Time_0_01____start",
                label: "UTC Time 0.01% - start",
                visible: true,
            },
            {
                fieldName: "UTC_Time_100__totality",
                format: {
                    dateFormat: "shortDateShortTime",
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
        ],
        title: "Cities within path: {NAME}",
    });
    return cityPopupTemplate;
}

async function createClusterCitiesRenderer() {
    const UVRenderer = new UniqueValueRenderer({
        field1: "cluster_type_STATE",
        uniqueValueGroups: [
            {
                classes: [
                    {
                        label: "OH",
                        symbol: {
                            type: "esriSMS",
                            color: [2, 78, 118, 255],
                            angle: 0,
                            xoffset: 0,
                            yoffset: 0,
                            size: 2.362,
                            style: "esriSMSCircle",
                            outline: {
                                type: "esriSLS",
                                color: [153, 153, 153, 64],
                                width: 0.75,
                                style: "esriSLSSolid",
                            },
                        },
                        values: [["OH"]],
                    },
                    {
                        label: "TX",
                        symbol: {
                            type: "esriSMS",
                            color: [234, 49, 31, 255],
                            angle: 0,
                            xoffset: 0,
                            yoffset: 0,
                            size: 2.362,
                            style: "esriSMSCircle",
                            outline: {
                                type: "esriSLS",
                                color: [153, 153, 153, 64],
                                width: 0.75,
                                style: "esriSLSSolid",
                            },
                        },
                        values: [["TX"]],
                    },
                    {
                        label: "IN",
                        symbol: {
                            type: "esriSMS",
                            color: [0, 115, 76, 255],
                            angle: 0,
                            xoffset: 0,
                            yoffset: 0,
                            size: 2.362,
                            style: "esriSMSCircle",
                            outline: {
                                type: "esriSLS",
                                color: [153, 153, 153, 64],
                                width: 0.75,
                                style: "esriSLSSolid",
                            },
                        },
                        values: [["IN"]],
                    },
                    {
                        label: "NY",
                        symbol: {
                            type: "esriSMS",
                            color: [112, 68, 137, 255],
                            angle: 0,
                            xoffset: 0,
                            yoffset: 0,
                            size: 2.362,
                            style: "esriSMSCircle",
                            outline: {
                                type: "esriSLS",
                                color: [153, 153, 153, 64],
                                width: 0.75,
                                style: "esriSLSSolid",
                            },
                        },
                        values: [["NY"]],
                    },
                    {
                        label: "AR",
                        symbol: {
                            type: "esriSMS",
                            color: [240, 145, 0, 255],
                            angle: 0,
                            xoffset: 0,
                            yoffset: 0,
                            size: 2.362,
                            style: "esriSMSCircle",
                            outline: {
                                type: "esriSLS",
                                color: [153, 153, 153, 64],
                                width: 0.75,
                                style: "esriSLSSolid",
                            },
                        },
                        values: [["AR"]],
                    },
                    {
                        label: "IL",
                        symbol: {
                            type: "esriSMS",
                            color: [96, 113, 0, 255],
                            angle: 0,
                            xoffset: 0,
                            yoffset: 0,
                            size: 2.362,
                            style: "esriSMSCircle",
                            outline: {
                                type: "esriSLS",
                                color: [153, 153, 153, 64],
                                width: 0.75,
                                style: "esriSLSSolid",
                            },
                        },
                        values: [["IL"]],
                    },
                    {
                        label: "MO",
                        symbol: {
                            type: "esriSMS",
                            color: [117, 112, 179, 255],
                            angle: 0,
                            xoffset: 0,
                            yoffset: 0,
                            size: 2.362,
                            style: "esriSMSCircle",
                            outline: {
                                type: "esriSLS",
                                color: [153, 153, 153, 64],
                                width: 0.75,
                                style: "esriSLSSolid",
                            },
                        },
                        values: [["MO"]],
                    },
                    {
                        label: "VT",
                        symbol: {
                            type: "esriSMS",
                            color: [198, 0, 75, 255],
                            angle: 0,
                            xoffset: 0,
                            yoffset: 0,
                            size: 2.362,
                            style: "esriSMSCircle",
                            outline: {
                                type: "esriSLS",
                                color: [153, 153, 153, 64],
                                width: 0.75,
                                style: "esriSLSSolid",
                            },
                        },
                        values: [["VT"]],
                    },
                    {
                        label: "PA",
                        symbol: {
                            type: "esriSMS",
                            color: [102, 102, 102, 255],
                            angle: 0,
                            xoffset: 0,
                            yoffset: 0,
                            size: 2.362,
                            style: "esriSMSCircle",
                            outline: {
                                type: "esriSLS",
                                color: [153, 153, 153, 64],
                                width: 0.75,
                                style: "esriSLSSolid",
                            },
                        },
                        values: [["PA"]],
                    },
                    {
                        label: "OK",
                        symbol: {
                            type: "esriSMS",
                            color: [255, 255, 255, 255],
                            angle: 0,
                            xoffset: 0,
                            yoffset: 0,
                            size: 2.362,
                            style: "esriSMSCircle",
                            outline: {
                                type: "esriSLS",
                                color: [153, 153, 153, 64],
                                width: 0.75,
                                style: "esriSLSSolid",
                            },
                        },
                        values: [["OK"]],
                    },
                    {
                        label: "KY",
                        symbol: {
                            type: "esriSMS",
                            color: [191, 151, 39, 255],
                            angle: 0,
                            xoffset: 0,
                            yoffset: 0,
                            size: 6,
                            style: "esriSMSCircle",
                            outline: {
                                type: "esriSLS",
                                color: [153, 153, 153, 64],
                                width: 0.75,
                                style: "esriSLSSolid",
                            },
                        },
                        values: [["KY"]],
                    },
                    {
                        label: "ME",
                        symbol: {
                            type: "esriSMS",
                            color: [51, 51, 51, 255],
                            angle: 0,
                            xoffset: 0,
                            yoffset: 0,
                            size: 6,
                            style: "esriSMSCircle",
                            outline: {
                                type: "esriSLS",
                                color: [153, 153, 153, 64],
                                width: 0.75,
                                style: "esriSLSSolid",
                            },
                        },
                        values: [["ME"]],
                    },
                    {
                        label: "NH",
                        symbol: {
                            type: "esriSMS",
                            color: [2, 78, 118, 255],
                            angle: 0,
                            xoffset: 0,
                            yoffset: 0,
                            size: 6,
                            style: "esriSMSCircle",
                            outline: {
                                type: "esriSLS",
                                color: [153, 153, 153, 64],
                                width: 0.75,
                                style: "esriSLSSolid",
                            },
                        },
                        values: [["NH"]],
                    },
                ],
            },
        ],
        uniqueValueInfos: [
            {
                label: "OH",
                symbol: {
                    type: "esriSMS",
                    color: [2, 78, 118, 255],
                    angle: 0,
                    xoffset: 0,
                    yoffset: 0,
                    size: 2.362,
                    style: "esriSMSCircle",
                    outline: {
                        type: "esriSLS",
                        color: [153, 153, 153, 64],
                        width: 0.75,
                        style: "esriSLSSolid",
                    },
                },
                value: "OH",
            },
            {
                label: "TX",
                symbol: {
                    type: "esriSMS",
                    color: [234, 49, 31, 255],
                    angle: 0,
                    xoffset: 0,
                    yoffset: 0,
                    size: 2.362,
                    style: "esriSMSCircle",
                    outline: {
                        type: "esriSLS",
                        color: [153, 153, 153, 64],
                        width: 0.75,
                        style: "esriSLSSolid",
                    },
                },
                value: "TX",
            },
            {
                label: "IN",
                symbol: {
                    type: "esriSMS",
                    color: [0, 115, 76, 255],
                    angle: 0,
                    xoffset: 0,
                    yoffset: 0,
                    size: 2.362,
                    style: "esriSMSCircle",
                    outline: {
                        type: "esriSLS",
                        color: [153, 153, 153, 64],
                        width: 0.75,
                        style: "esriSLSSolid",
                    },
                },
                value: "IN",
            },
            {
                label: "NY",
                symbol: {
                    type: "esriSMS",
                    color: [112, 68, 137, 255],
                    angle: 0,
                    xoffset: 0,
                    yoffset: 0,
                    size: 2.362,
                    style: "esriSMSCircle",
                    outline: {
                        type: "esriSLS",
                        color: [153, 153, 153, 64],
                        width: 0.75,
                        style: "esriSLSSolid",
                    },
                },
                value: "NY",
            },
            {
                label: "AR",
                symbol: {
                    type: "esriSMS",
                    color: [240, 145, 0, 255],
                    angle: 0,
                    xoffset: 0,
                    yoffset: 0,
                    size: 2.362,
                    style: "esriSMSCircle",
                    outline: {
                        type: "esriSLS",
                        color: [153, 153, 153, 64],
                        width: 0.75,
                        style: "esriSLSSolid",
                    },
                },
                value: "AR",
            },
            {
                label: "IL",
                symbol: {
                    type: "esriSMS",
                    color: [96, 113, 0, 255],
                    angle: 0,
                    xoffset: 0,
                    yoffset: 0,
                    size: 2.362,
                    style: "esriSMSCircle",
                    outline: {
                        type: "esriSLS",
                        color: [153, 153, 153, 64],
                        width: 0.75,
                        style: "esriSLSSolid",
                    },
                },
                value: "IL",
            },
            {
                label: "MO",
                symbol: {
                    type: "esriSMS",
                    color: [117, 112, 179, 255],
                    angle: 0,
                    xoffset: 0,
                    yoffset: 0,
                    size: 2.362,
                    style: "esriSMSCircle",
                    outline: {
                        type: "esriSLS",
                        color: [153, 153, 153, 64],
                        width: 0.75,
                        style: "esriSLSSolid",
                    },
                },
                value: "MO",
            },
            {
                label: "VT",
                symbol: {
                    type: "esriSMS",
                    color: [198, 0, 75, 255],
                    angle: 0,
                    xoffset: 0,
                    yoffset: 0,
                    size: 2.362,
                    style: "esriSMSCircle",
                    outline: {
                        type: "esriSLS",
                        color: [153, 153, 153, 64],
                        width: 0.75,
                        style: "esriSLSSolid",
                    },
                },
                value: "VT",
            },
            {
                label: "PA",
                symbol: {
                    type: "esriSMS",
                    color: [102, 102, 102, 255],
                    angle: 0,
                    xoffset: 0,
                    yoffset: 0,
                    size: 2.362,
                    style: "esriSMSCircle",
                    outline: {
                        type: "esriSLS",
                        color: [153, 153, 153, 64],
                        width: 0.75,
                        style: "esriSLSSolid",
                    },
                },
                value: "PA",
            },
            {
                label: "OK",
                symbol: {
                    type: "esriSMS",
                    color: [255, 255, 255, 255],
                    angle: 0,
                    xoffset: 0,
                    yoffset: 0,
                    size: 2.362,
                    style: "esriSMSCircle",
                    outline: {
                        type: "esriSLS",
                        color: [153, 153, 153, 64],
                        width: 0.75,
                        style: "esriSLSSolid",
                    },
                },
                value: "OK",
            },
            {
                label: "KY",
                symbol: {
                    type: "esriSMS",
                    color: [191, 151, 39, 255],
                    angle: 0,
                    xoffset: 0,
                    yoffset: 0,
                    size: 6,
                    style: "esriSMSCircle",
                    outline: {
                        type: "esriSLS",
                        color: [153, 153, 153, 64],
                        width: 0.75,
                        style: "esriSLSSolid",
                    },
                },
                value: "KY",
            },
            {
                label: "ME",
                symbol: {
                    type: "esriSMS",
                    color: [51, 51, 51, 255],
                    angle: 0,
                    xoffset: 0,
                    yoffset: 0,
                    size: 6,
                    style: "esriSMSCircle",
                    outline: {
                        type: "esriSLS",
                        color: [153, 153, 153, 64],
                        width: 0.75,
                        style: "esriSLSSolid",
                    },
                },
                value: "ME",
            },
            {
                label: "NH",
                symbol: {
                    type: "esriSMS",
                    color: [2, 78, 118, 255],
                    angle: 0,
                    xoffset: 0,
                    yoffset: 0,
                    size: 6,
                    style: "esriSMSCircle",
                    outline: {
                        type: "esriSLS",
                        color: [153, 153, 153, 64],
                        width: 0.75,
                        style: "esriSLSSolid",
                    },
                },
                value: "NH",
            },
        ],
    });
}

async function createClusterPopupTemplate() {
    const clusterPopupTemplate = new PopupTemplate({
        title: "Cluster summary",
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

                visible: true,
            },
            {
                fieldName: "cluster_type_STATE",
                label: "",
                visible: true,
            },
        ],
        content: [
            {
                type: "text",
                text: "This cluster represents <b>{cluster_count}</b> features.",
            },
            {
                type: "text",
                text: "The predominant value of <b>STATE</b> within this cluster is <b>{expression/cluster_type_STATE}</b>.",
            },
        ],
        description: "This cluster represents {cluster_count} features.",
        expressionInfos: [
            {
                name: "cluster_type_STATE",
                title: "Predominant STATE",
                expression: `var uvInfos = [
    {value: "OH", label: "OH"}, 
    {value: TX, label: TX}, 
    {value: IN, label: IN}, 
    {value: NY, label: NY}, 
    {value: AR, label: AR}, 
    {value: IL, label: IL}, 
    {value: MO, label: MO}, 
    {value: VT, label: VT}, 
    {value: PA, label: PA}, 
    {value: OK, label: OK}, 
    {value: KY, label: KY}, 
    {value: ME, label: ME}, 
    {value: NH, label: NH}]; 
    
    var predominantType = Text($feature[cluster_type_STATE]); 
    
    for (var i = 0; i < Count(uvInfos); i++) 
    { 
        if (uvInfos[i].value == predominantType) { 
        label = uvInfos[i].label;
        break;
        }
    }
    return label;`,
            },
        ],
    });

    return clusterPopupTemplate;
}