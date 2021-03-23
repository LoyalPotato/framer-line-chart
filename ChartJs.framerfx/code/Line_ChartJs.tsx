import * as React from "react"
import { PropertyControls, ControlType, Color } from "framer"
import { Line } from "react-chartjs-2"
import { ChartTooltipModel, Chart } from "chart.js"
import * as ChartAnnotation from "chartjs-plugin-annotation"

Chart.pluginService.register(ChartAnnotation)

// Define type of property
interface Props {
    width: number
    height: number

    // options: Object;
    stepSize: number
    smooth: boolean
    showTitle: boolean
    // chartTitle: string;
    annotations: ChartAnnotation.AnnotationOptions[]
    // tooltipFontSize: string;
    dataSet: Array<object>
    labels: Array<string>
    mySplit(): any[]
    getRgbFromVar(): string
}

export class LineGraph extends React.Component<Props> {
    annotations = []

    constructor(props) {
        super(props)

        this.annotations = props.annotations.reduce((acc, annotation) => {
            if (annotation.hasOwnProperty("borderColor")) {
                annotation["borderColor"] = this.getRgbFromVar(
                    annotation["borderColor"]
                )
            }
            acc.push({
                type: "line",
                mode: "horizontal",
                scaleID: "y-axis-0",
                value: parseInt(annotation.value),
                borderColor: annotation.borderColor,
                borderWidth: 2,
                borderDash: [4, 5],
            })

            return acc
        }, [])

        props.dataSet.forEach((element) => {
            if (element["fill"] === "false") {
                element["fill"] = false
                // element["backgroundColor"] = "white";
            }

            if (
                element.hasOwnProperty("data") &&
                typeof element["data"] === "string"
            ) {
                element["data"] = element["data"].split(",")
            }

            if (element["backgroundColor"].includes("var")) {
                element["backgroundColor"] = this.getRgbFromVar(
                    element["backgroundColor"]
                )
            }
            if (element["borderColor"].includes("var")) {
                element["borderColor"] = this.getRgbFromVar(
                    element["borderColor"]
                )
            }

            element.lineTension = props.smooth
            element.borderWidth = 4
            element.pointRadius = 5
            element.pointBorderWidth = 4
            element.pointHoverBackgroundColor = "white"
            element.pointHoverBorderWidth = 4
            element.pointHoverRadius = 8
        })
    }

    // Set default properties
    static defaultProps = {
        dataSet: [
            {
                label: "Dataset",
                data: "44,570,311,358,463,687,225,673,559,367,524,325",
                fill: "false",
                backgroundColor: "rgba(115, 121, 137, 0.3)",
                borderColor: "#737989",
                pointBackgroundColor: "white",
            },
            {
                label: "Dataset2",
                data: "725,826,825,1,744,107,386,969,553,641,805,380",
                fill: "0",
                backgroundColor: "rgba(244, 178, 65, 0.3)",
                borderColor: "rgb(244, 178, 65)",
                pointBackgroundColor: "white",
            },
        ],
        annotations: [
            {
                value: "100",
                borderColor: "rgb(255, 0, 0)",
            },
            {
                value: "500",
                borderColor: "rgb(0, 184, 104)",
            },
        ],
        stepSize: 100,
        labels:
            "January,February,March,April,May,June,July,August,September,October,November,December",
        showTitle: false,
    }

    // Items shown in property panel
    static propertyControls: PropertyControls = {
        dataSet: {
            title: "Dataset",
            type: ControlType.Array,
            control: {
                type: ControlType.Object,
                controls: {
                    label: {
                        type: ControlType.String,
                        defaultValue: "Dataset",
                        title: "Label",
                    },
                    data: {
                        type: ControlType.String,
                        placeholder: "Separate with commas",
                        title: "Data",
                    },
                    fill: {
                        type: ControlType.String,
                        title: "Fill",
                        defaultValue: "false",
                    },
                    backgroundColor: {
                        type: ControlType.Color,
                        title: "Fill Color",
                        defaultValue: "rgba(115, 121, 137, 0.3)",
                    },
                    borderColor: {
                        type: ControlType.Color,
                        title: "Border Color",
                        defaultValue: "#737989",
                    },
                    pointBackgroundColor: {
                        type: ControlType.Color,
                        title: "Points Background Color",
                        defaultValue: "white",
                    },
                },
            },
            maxCount: 5,
        },
        annotations: {
            title: "Annotations",
            type: ControlType.Array,
            control: {
                type: ControlType.Object,
                controls: {
                    value: {
                        type: ControlType.String,
                        title: "Value",
                        defaultValue: "50",
                    },
                    borderColor: {
                        type: ControlType.Color,
                        title: "Border Color",
                        defaultValue: "rgb(0, 184, 104)",
                    },
                },
            },
            maxCount: 5,
        },
        stepSize: {
            type: ControlType.Number,
            step: 1,
            min: 1,
            title: "Scaling for Y Axis",
        },
        labels: {
            type: ControlType.String,
            title: "Labels for X Axis (Separate with Commas)",
        },
        smooth: {
            type: ControlType.Number,
            step: 0.1,
            max: 1,
            min: 0,
            defaultValue: 0,
            title: "Line Smoothing",
        },
        showTitle: {
            type: ControlType.Boolean,
            title: "Show dataset titles",
        },
        // chartTitle: {
        //   type: ControlType.String,
        //   placeholder: "Title for Chart",
        //   title: "Chart Title",
        // },
        // tooltipFontSize: {
        //   type: ControlType.String,
        //   placeholder: "Font Size for Tooltip",
        //   title: "Font Size",
        // },
        // TODO: Make options more customizable
        // options: {
        //     title: "Options",
        //     type: ControlType.Object,
        //     controls: {
        //         borderDash: {
        //             type: ControlType.Boolean,
        //             defaultValue: true,
        //         }
        //     }
        // }
    }

    mySplit = (str) => str.split(",")

    getRgbFromVar = (str) => {
        let regex = /rgb\((\d{1,3}), (\d{1,3}), (\d{1,3})\)/g
        if (str.includes("var")) {
            str = str.match(regex)[0]
        }
        return str
    }

    render() {
        return (
            <Line
                data={{
                    labels: this.mySplit(this.props.labels),
                    datasets: this.props.dataSet,
                }}
                width={this.props.width}
                height={this.props.height}
                options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    legend: {
                        display: this.props.showTitle,
                        align: "start",
                        labels: {
                            padding: 50,
                            fontFamily: "Lato",
                            usePointStyle: true,
                        },
                    },
                    scales: {
                        xAxes: [
                            {
                                gridLines: {
                                    display: false,
                                },
                                ticks: {
                                    beginAtZero: true,
                                },
                            },
                        ],
                        yAxes: [
                            {
                                gridLines: {
                                    borderDash: [4, 5],
                                    drawBorder: false,
                                },
                                ticks: {
                                    padding: 20,
                                    stepSize: this.props.stepSize,
                                    precision: 0,
                                    beginAtZero: true,
                                    // callback: function (value, index) {
                                    //   return `£${value}k`;
                                    // }
                                },
                            },
                        ],
                    },
                    tooltips: {
                        enabled: false,
                        mode: "index",
                        intersect: true,
                        position: "nearest",
                        custom: function (tooltip: ChartTooltipModel) {
                            // Tooltip Element
                            var tooltipEl = document.getElementById(
                                "chartjs-tooltip"
                            )

                            if (!tooltipEl) {
                                tooltipEl = document.createElement("div")
                                tooltipEl.removeAttribute("style")
                                tooltipEl.id = "chartjs-tooltip"
                                tooltipEl.innerHTML = "<table></table>"
                                document.body.appendChild(tooltipEl)
                            }

                            // Hide if no tooltip
                            if (tooltip.opacity === 0) {
                                tooltipEl.style.opacity = "0"
                                return
                            }

                            function getBody(bodyItem) {
                                return bodyItem.lines
                            }

                            // Set Text
                            if (tooltip.body) {
                                var bodyLines = tooltip.body.map(getBody)

                                var innerHtml = "<tbody>"

                                var pillStyle = ` font-family: Lato;
                                  font-weight: bold;
                                  font-size: 15px;
                                  line-height: 15px;
                                  background: white;
                                  height: 15px;
                                  color: rgb(46, 55, 78);
                                  border-radius: 8px;
                                  padding: 0 5px 0 5px;`

                                var textStyle = `font-family: Lato;
                                  font-weight: normal;
                                  font-size: 15px;
                                  line-height: 15px;
                                  color: white;
                                  margin-left: 5px;`

                                bodyLines.forEach(function (body, i) {
                                    // var colors = tooltip.labelColors[i];
                                    var datasetTitle = body[0].split(":")[0]
                                    var datasetValue = body[0].split(":")[1]

                                    var spanPill =
                                        '<span style="' +
                                        pillStyle +
                                        '">' +
                                        datasetValue +
                                        "</span>"
                                    var textPill =
                                        '<span style="' +
                                        textStyle +
                                        '">' +
                                        datasetTitle +
                                        "</span>"
                                    innerHtml +=
                                        "<tr><td style='padding: 5px;'>" +
                                        spanPill +
                                        textPill +
                                        "</td></tr>"
                                })

                                innerHtml += "</tbody>"

                                var tableRoot = tooltipEl.querySelector("table")
                                tableRoot.style.backgroundColor =
                                    "rgba(46, 55, 78, 0.9)"
                                tableRoot.style.borderRadius = "8px"
                                tableRoot.style.padding = "5px 10px 5px 5px"

                                tableRoot.innerHTML = innerHtml
                            }

                            // `this` will be the overall tooltip
                            var position = this._chart.canvas.getBoundingClientRect()

                            // Display, position, and set styles for font
                            tooltipEl.style.opacity = "1"
                            tooltipEl.style.position = "absolute"
                            tooltipEl.style.left =
                                position.left +
                                window.pageXOffset +
                                tooltip.caretX +
                                20 +
                                "px"
                            tooltipEl.style.top =
                                position.top +
                                window.pageYOffset +
                                tooltip.caretY -
                                20 +
                                "px"
                            tooltipEl.style.pointerEvents = "none"
                        },
                    },
                    annotation: {
                        annotations: this.annotations,
                    },
                }}
            />
        )
    }
}
