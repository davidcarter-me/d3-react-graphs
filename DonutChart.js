import React, { Component } from "react";
import PropTypes from "prop-types";
import { clientPoint } from "d3-selection";
import { scaleOrdinal } from "d3-scale";
import { arc as d3Arc, pie as d3Pie } from "d3-shape";
import Icons from "data/Icons";

export class DonutChart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      click: true,
      arcId: false,
      width: 698,
      height: 260,
      widthPie: 260,
      heightPie: 260,
      totalAmount: null,
      percentage: null,
      fillColor: null,
      side: null,
      coOrds: null,
      center: [],
    };
  }

  componentDidMount() {
    const dataPieLength = this.props.dataset.length;
    const largestArc = this.props.dataset[dataPieLength - 1];
    this.setState({
      arcId: largestArc.type,
      percentage: (largestArc.amount / largestArc.totalAmount) * 100,
      totalAmount: largestArc.totalAmount,
      side: "left",
      fillColor: "#ffcd0d",
    });
  }

  render() {
    const { click, arcId, totalAmount, fillColor, percentage, width, height, widthPie, heightPie, side } = this.state;
    const { dataset } = this.props;

    const colorArr = ["#ceab24", "#997f1a", "#f6eece", "#f1dc8d", "#735f12", "#ffcd0d"];

    const color = scaleOrdinal().range(colorArr);

    const radius = Math.min(widthPie, heightPie) / 2;

    const arc = d3Arc()
      .outerRadius(radius - 20)
      .innerRadius(radius - 60);

    const arcLarge = d3Arc()
      .outerRadius(radius)
      .innerRadius(radius - 70);

    const pie = d3Pie()
      .sort(null)
      .value(function(d) {
        return d.amount;
      });

    const dataPie = pie(dataset, d => {
      d.amount = +d.amount;
      return d;
    });

    return (
      <svg
        className="DonutChart"
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMid meet"
      >
        <g transform={`translate(${width / 2}, ${height / 2})`}>
          {dataPie.map(d => (
            <g
              className="DonutChart__arc"
              key={`a${d.data.type}`}
              onClick={e =>
                this.handleArcOnClick(
                  e,
                  d.data.type,
                  d.data.totalAmount,
                  color(d.data.type),
                  d.data.amount,
                  arc.centroid(d)
                )
              }
            >
              {arcId !== d.data.type && (
                <path d={arc(d)} fill={color(d.data.type)} ref={node => (this[d.data.type] = node)} />
              )}
              {click && arcId === d.data.type && <path d={arcLarge(d)} fill={color(d.data.type)} />}
            </g>
          ))}
        </g>
        {click &&
          side === "left" && (
            <g transform={`translate(0, ${height / 5})`}>
              <g>
                <text x="0" y="43" fill={fillColor} className="DonutChart__percentage">
                  {Math.round(percentage)}
                </text>
                <text x="73" y="43" fill={fillColor} className="DonutChart__percentageSign">
                  %
                </text>
              </g>
              <g>
                <line x1="102" y1="42" x2="158" y2="42" stroke={fillColor} strokeWidth="2" />
                {/* <line x1="157" y1="42" x2="157" y2="0" stroke={fillColor} strokeWidth="2" /> */}
              </g>
              <g transform="translate(0, 68)">
                <path fill={fillColor} d={Icons[arcId.toUpperCase()]} />
              </g>
              <g>
                <text x="0" y="105" fill={fillColor} className="DonutChart__type">
                  {arcId}
                </text>
              </g>
              <g>
                <text x="0" y="135" className="DonutChart__vehicles">
                  {totalAmount} vehicles
                </text>
              </g>
              <g>
                <text x="0" y="150" className="DonutChart__fleet">
                  of your fleet
                </text>
              </g>
            </g>
          )}
        {click &&
          side === "right" && (
            <g transform={`translate(540, ${height / 5})`}>
              <g>
                <text x="80" y="43" fill={fillColor} className="DonutChart__percentage">
                  {percentage}
                </text>
                <text x="135" y="43" fill={fillColor} className="DonutChart__percentageSign">
                  %
                </text>
              </g>
              <g>
                <line x1="10" y1="42" x2="66" y2="42" stroke={fillColor} strokeWidth="2" />
                {/* <line x1="10" y1="42" x2={center[0]} y2={center[1]} stroke={fillColor} strokeWidth="2" /> */}
              </g>
              <g transform="translate(118, 68)">
                <path fill={fillColor} d={Icons[arcId.toUpperCase()]} />
              </g>
              <g>
                <text x="120" y="105" fill={fillColor} className="DonutChart__type">
                  {arcId}
                </text>
              </g>
              <g>
                <text x="96" y="135" className="DonutChart__vehicles">
                  {totalAmount} vehicles
                </text>
              </g>
              <g>
                <text x="92" y="150" className="DonutChart__fleet">
                  of your fleet
                </text>
              </g>
            </g>
          )}
      </svg>
    );
  }

  handleArcOnClick = (e, arcId, totalAmount, fillColor, amount, center) => {
    const coOrds = clientPoint(e.target, e);
    const side = coOrds[0] < 0 ? "left" : "right";

    const percentage = Math.round((amount / totalAmount) * 100);

    if (arcId !== this.state.arcId && this.state.arcId !== false) {
      this.setState(prevState => ({
        click: prevState.click,
        arcId: arcId,
        totalAmount: totalAmount,
        fillColor: fillColor,
        percentage: percentage,
        side: side,
        coOrds: coOrds,
        center: center,
      }));
    } else {
      this.setState(prevState => ({
        click: !prevState.click,
        arcId: prevState.arcId === arcId ? false : arcId,
        totalAmount: totalAmount,
        fillColor: fillColor,
        percentage: percentage,
        side: side,
        coOrds: coOrds,
        center: center,
      }));
    }
  };
}

DonutChart.propTypes = {
  dataset: PropTypes.object.isRequired,
};

export default DonutChart;
