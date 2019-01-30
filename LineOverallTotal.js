import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { roundToTwo } from "utilities";

// content
import LangContext from "langProvider/LangContext";
import content from "./content/contentLineOverallTotal";

export class LineOverallTotal extends PureComponent {
  render() {
    const { type, amount } = this.props;

    console.log("amount", amount);
    return (
      <div className="LineOverallTotal">
        <div className="LineOverallTotal__inner">
          <div className="LineOverallTotal__amount">
            <div className="LineOverallTotal__amount__text">
              <LangContext content={content.HEADER[type]} />
            </div>
            <div className="LineOverallTotal__amount__amount">
              {type === "money" && `€${roundToTwo(amount)}`}
              {type === "co2" && `${roundToTwo(amount / 1000)} KG.`}
              {type === "cars" && `${amount} vehicles`}
            </div>
          </div>
          <div className={`LineOverallTotal__icon LineOverallTotal__icon--${type}`} />
        </div>
      </div>
    );
  }
}

LineOverallTotal.propTypes = {
  type: PropTypes.string.isRequired,
  amount: PropTypes.string.isRequired,
};

export default LineOverallTotal;
