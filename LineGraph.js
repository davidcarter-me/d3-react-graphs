import React, { Component } from "react";
import PropTypes from "prop-types";
import { scaleOrdinal, scaleLinear, scaleTime } from "d3-scale";
import { timeFormat } from "d3-time-format";
import { line as d3Line, curveCatmullRom, curveStep } from "d3-shape";
import { min, max, extent } from "d3-array";
import { axisBottom, axisLeft } from "d3-axis";
import { select } from "d3-selection";
import { normaliserDate } from "utilities";

export class LineGraph extends Component {
  constructor(props) {
    super(props);

    this.state = {
      svgWidth: 960,
      svgHeight: 500,
      margin: {
        top: 45,
        right: 20,
        bottom: 30,
        left: 50,
      },
      circleId: 0,
      rangeValue: 0,
    };
  }

  render() {
    const { dataset, yAxis } = this.props;
    const { svgWidth, svgHeight, margin, circleId, rangeValue } = this.state;

    const width = svgWidth - margin.left - margin.right;
    const height = svgHeight - margin.top - margin.bottom;

    const x = scaleTime().range([0, width]);
    const y = scaleLinear().range([height, 0]);
    const z = scaleOrdinal();

    let line;

    if (yAxis !== "activities") {
      line = d3Line()
        .curve(curveCatmullRom.alpha(0.5))
        .x(d => x(d.date))
        .y(d => y(d.amount));
    }
    if (yAxis === "activities") {
      line = d3Line()
        .curve(curveStep)
        .x(d => x(d.date))
        .y(d => y(d.amount));
    }
    x.domain(extent(dataset[0].values, d => d.date));

    y.domain([min(dataset, c => min(c.values, d => d.amount)), max(dataset, c => max(c.values, d => d.amount))]);

    z.domain(dataset.map(c => c.id));

    const maxLengthRange = dataset[0].values.length - 1;
    return (
      <div className="svgContainer">
        <svg className="LineGraph" viewBox={`0 0 ${svgWidth} ${svgHeight}`} preserveAspectRatio="xMidYMid meet">
          <g transform={`translate(${margin.left}, ${margin.top})`}>
            {yAxis !== "activities" && (
              <g
                className="LineGraph__axis LineGraph__axis--x"
                transform={`translate(30, ${height})`}
                ref={node =>
                  select(node).call(
                    axisBottom(x)
                      .ticks(3)
                      .tickFormat(date => {
                        return timeFormat("%B %Y")(date);
                      })
                  )
                }
              />
            )}
            {yAxis === "activities" && (
              <g
                className="LineGraph__axis LineGraph__axis--x"
                transform={`translate(30, ${height})`}
                ref={node => select(node).call(axisBottom(x).ticks(24))}
              />
            )}
            <g
              className="LineGraph__axis LineGraph__axis--y"
              ref={node =>
                select(node).call(
                  axisLeft(y)
                    .tickSizeInner(-width)
                    .tickFormat(amount => {
                      if (yAxis === "money") return `€${amount}`;
                      if (yAxis === "cars") return `${amount} ${yAxis}`;
                      if (yAxis === "co2") return `${amount}kg.`;
                      if (yAxis === "activities") return `${amount}`;
                    })
                )
              }
            />
            {dataset.map(fleet => {
              return (
                <g key={fleet.id}>
                  <path className="LineGraph__line" d={line(fleet.values)} />
                </g>
              );
            })}

            <g key={`tool-${dataset[0].values[circleId].date}`}>
              <g>
                <text
                  x={x(dataset[0].values[circleId].date) - 35}
                  y={y(dataset[0].values[circleId].amount) - 35}
                  className={`LineGraph__vehicles LineGraph__vehicles--${yAxis}`}
                >
                  {yAxis === "money" ? `€${Math.round(dataset[0].values[circleId].amount * 100) / 100}` : null}
                  {yAxis === "cars" ? `${dataset[0].values[circleId].amount} vehicles` : null}
                  {yAxis === "activities" ? `${dataset[0].values[circleId].amount}` : null}
                  {yAxis === "co2" ? `${Math.round(dataset[0].values[circleId].amount * 100) / 100} kg.` : null}
                </text>
              </g>
              <g>
                <text
                  x={x(dataset[0].values[circleId].date) - 30}
                  y={y(dataset[0].values[circleId].amount) - 20}
                  className="LineGraph__date"
                >
                  {yAxis !== "activities" && normaliserDate(dataset[0].values[circleId].date)}
                  {yAxis === "activities" &&
                    `${dataset[0].values[circleId].date - 1}${
                      dataset[0].values[circleId].date > 12 ? ":00 PM" : ":00AM"
                    }`}
                </text>
              </g>
            </g>
            <g key={dataset[0].values[circleId].id}>
              <g className="LineGraph__circle">
                <circle
                  className={`LineGraph__circle__innerCircle LineGraph__circle__innerCircle--${yAxis}`}
                  r="10"
                  cx={x(dataset[0].values[circleId].date)}
                  cy={y(dataset[0].values[circleId].amount)}
                />
              </g>
              <g>
                <circle
                  className="LineGraph__circle__outerCircle"
                  r="5"
                  cx={x(dataset[0].values[circleId].date)}
                  cy={y(dataset[0].values[circleId].amount)}
                />
              </g>
            </g>
          </g>
        </svg>
        <input
          type="range"
          id="start"
          name="volume"
          min="0"
          max={maxLengthRange}
          value={rangeValue}
          onChange={e => this.handleRangeOnChange(e)}
          step="1"
        />
      </div>
    );
  }

  handleRangeOnChange(e) {
    this.setState({
      rangeValue: e.target.value,
      circleId: e.target.value,
    });
  }
}

LineGraph.propTypes = {
  dataset: PropTypes.array.isRequired,
  yAxis: PropTypes.string.isRequired,
};

export default LineGraph;
