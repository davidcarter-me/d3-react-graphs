import React, { Component } from "react";
import PropTypes from "prop-types";
import { scaleBand, scaleLinear } from "d3-scale";
import { axisLeft } from "d3-axis";
import { select } from "d3-selection";
import { normaliserDate } from "utilities";

export class VehiclesAtNightGraph extends Component {
  constructor(props) {
    super(props);

    this.state = {
      svgWidth: 960,
      svgHeight: 500,
      margin: {
        top: 100,
        right: 20,
        bottom: 100,
        left: 20,
      },
      click: false,
      barId: false,
    };
  }
  render() {
    const { dataset } = this.props;
    const { svgWidth, svgHeight, margin, click, barId } = this.state;

    const width = svgWidth - margin.left - margin.right;
    const height = svgHeight - margin.top - margin.bottom;

    const x = scaleBand()
      .rangeRound([0, width])
      .padding(0.1);

    const y = scaleLinear().rangeRound([height, 0]);

    x.domain(dataset.map(d => d.time));
    y.domain([0, 100]);

    const colors = ["#999", "#666", "#f26522", "#ffcd0d"];

    return (
      <div className="svgContainer">
        <svg
          className="VehiclesAtNightGraph"
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          preserveAspectRatio="xMidYMid meet"
        >
          <g transform="translate(20, 0)">
            <g transform={`translate(${margin.left}, ${margin.top})`}>
              <g className="VehiclesAtNightGraph__axis VehiclesAtNightGraph__axis--y">
                <g
                  ref={node =>
                    select(node).call(
                      axisLeft(y)
                        .tickValues([25, 50, 75])
                        .tickSizeInner(-width)
                    )
                  }
                />
              </g>
            </g>
            <g transform="translate(20, -20)">
              {dataset.map(d => (
                <React.Fragment>
                  {click &&
                    barId === d.time && (
                      <g transform="translate(0, 0)" key={`tool-${d.time}`}>
                        <g>
                          <text
                            x={x(d.time) - 25}
                            y={y(d.DriversHouse) - (y(d.DriversHouse) - 80)}
                            className="VehiclesAtNightGraph__date"
                          >
                            {normaliserDate(d.time)}
                          </text>
                        </g>
                        <g>
                          <text
                            x={x(d.time) - 24}
                            y={y(d.DriversHouse) - (y(d.DriversHouse) - 100)}
                            className="VehiclesAtNightGraph__homeport"
                          >
                            {d.HomebaseAtNight}%
                          </text>
                        </g>
                        <g>
                          <text
                            x={x(d.time) + 9}
                            y={y(d.DriversHouse) - (y(d.DriversHouse) - 100)}
                            className="VehiclesAtNightGraph__drivers"
                          >
                            {d.DriversHouse}%
                          </text>
                        </g>
                      </g>
                    )}
                  <g
                    className="VehiclesAtNightGraph__collection"
                    onMouseEnter={() => this.handleBarOnMouseEnter(d.time)}
                    onMouseLeave={() => this.handleBarOnMouseLeave()}
                  >
                    {barId !== d.time && (
                      <React.Fragment>
                        <rect
                          key={`top-${d.time}`}
                          className="VehiclesAtNightGraph__collection__bar VehiclesAtNightGraph__collection__bar--top"
                          x={x(d.time)}
                          y={y(d.DriversHouse) - (y(d.DriversHouse) - 120)}
                          rx="5"
                          ry="5"
                          fill={colors[1]}
                          width="7"
                          height={height - y(d.DriversHouse) + 20}
                        />
                        <rect
                          key={`bottom-${d.time}`}
                          className="VehiclesAtNightGraph__collection__bar
                           VehiclesAtNightGraph__collection__bar--bottom"
                          x={x(d.time)}
                          y={y(d.HomebaseAtNight) + 120}
                          rx="5"
                          ry="5"
                          fill={colors[0]}
                          width="7"
                          height={height - y(d.HomebaseAtNight)}
                        />
                      </React.Fragment>
                    )}
                    {click &&
                      barId === d.time && (
                        <React.Fragment>
                          <rect
                            key={`top-${d.time}`}
                            className="VehiclesAtNightGraph__collection__bar VehiclesAtNightGraph__collection__bar--top"
                            x={x(d.time)}
                            y={y(d.DriversHouse) - (y(d.DriversHouse) - 120)}
                            rx="5"
                            ry="5"
                            fill={colors[3]}
                            width="7"
                            height={height - y(d.DriversHouse) + 20}
                          />
                          <rect
                            key={`bottom-${d.time}`}
                            className="VehiclesAtNightGraph__collection__bar
                          VehiclesAtNightGraph__collection__bar--bottom"
                            x={x(d.time)}
                            y={y(d.HomebaseAtNight) + 120}
                            rx="5"
                            ry="5"
                            fill={colors[2]}
                            width="7"
                            height={height - y(d.HomebaseAtNight)}
                          />
                        </React.Fragment>
                      )}
                  </g>
                </React.Fragment>
              ))}
            </g>
          </g>
        </svg>
      </div>
    );
  }

  handleBarOnMouseLeave() {
    this.setState({
      click: false,
      barId: false,
    });
  }

  handleBarOnMouseEnter(barId) {
    if (barId !== this.state.barId && this.state.barId !== false) {
      this.setState(prevState => ({
        click: prevState.click,
        barId: barId,
      }));
    } else if (barId === this.state.barId) {
      this.setState({
        click: false,
        barId: false,
      });
    } else {
      this.setState(prevState => ({
        click: !prevState.click,
        barId: barId,
      }));
    }
  }
}

VehiclesAtNightGraph.propTypes = {
  dataset: PropTypes.array.isRequired,
};

export default VehiclesAtNightGraph;
