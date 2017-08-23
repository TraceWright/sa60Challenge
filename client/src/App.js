import React, { Component } from 'react';
import * as randomNumber from 'random-number-in-range';
import { ScatterChart } from 'react-d3';

function numberGenerator(nIterations, gridSize) {
  let count = 0;
  let cartesianArray = [];
  cartesianArray.push({
    name: "series",
    values: []})
  while (count < nIterations) {
      let numberPairArray = [];
      let randomInt1 = randomNumber(0, gridSize);
      let randomInt2 = randomNumber(0, gridSize);
      numberPairArray.push(randomInt1, randomInt2);
      cartesianArray[0].values.push({ x: numberPairArray[0], y: numberPairArray[1] })
      count++;
  }
  return cartesianArray;
}

function countPointsInsideCircle(nIterations, cartesianArray, gridSize, diameter) {
  let count = 0;
  let radius = diameter / 2;
  let center_x = gridSize / 2;
  let center_y = gridSize / 2;
  let resultTrue = 0;
  let resultFalse = 0;
  while (count < nIterations) {
      let cartesianPair = cartesianArray[0].values[count];
      let dx = cartesianPair.x - center_x;
      let dy = cartesianPair.y - center_y;
      ((dx * dx) + (dy * dy)) < (radius * radius) ? resultTrue++: resultFalse++;
      count++
  }
  return { resultTrue, resultFalse };
}

function estimateAreaOfCircle(pointsInCircle, gridSize, nIterations) {
  let areaOfSquare = gridSize * gridSize;
  let pic;
  pic = pointsInCircle / nIterations;
  return pic * areaOfSquare;
}

function estimatePI(circleAreaEstimate, diameter) {
  let radius = diameter / 2;
  let radiusSquared = radius * radius;
  let cae = circleAreaEstimate;
  let piEstimate = cae / radiusSquared;
  return piEstimate;
}

class App extends Component {
  constructor(props) {
    super(props);
 
    this.state = {
        gridSizeBox: '',
        nPointsBox: '',
        diameterBox: '',
        iterationCountBox: '',
        estimatedPI: '',
        nPoints: '',
        plotPointsArray: []
      };

    this.handleChange = this.handleChange.bind(this);
    this.runChallenge = this.runChallenge.bind(this);
  }

  handleChange({ target }) {
    this.setState({
        [target.name]: target.value
      });
  }

  runChallenge() {
    let nIterations = this.state.nPointsBox * this.state.iterationCountBox;
    let cartesianArray = numberGenerator(
      nIterations,
      this.state.gridSizeBox,
    );
    this.setState({ plotPointsArray: cartesianArray });
    let picCount = countPointsInsideCircle(nIterations, cartesianArray, this.state.gridSizeBox, this.state.diameterBox)
    let estAreaOfCircle = estimateAreaOfCircle(picCount.resultTrue, this.state.gridSizeBox, nIterations);
    let estPI = estimatePI(estAreaOfCircle, this.state.diameterBox);
    this.setState({ estimatedPI: estPI })
    }

  render() {
    return (
      <div>
          <br/>
              <label>
                <label>Number of Points: </label>
                <br/>
                  <input
                      type="text"
                      name="nPointsBox"
                      value={ this.state.nPointsBox }
                      onChange={ this.handleChange } />
              </label>
              <br/>
              <label>
              <label>Grid Size: </label>
              <br/>
                  <input
                      type="text"
                      name="gridSizeBox"
                      value={ this.state.gridSizeBox }
                      onChange={ this.handleChange } />
              </label>
              <br/>
              <label>
              <label>Circle Diameter: </label>
              <br/>
                  <input
                      type="text"
                      name="diameterBox"
                      value={ this.state.diameterBox }
                      onChange={ this.handleChange } />
              </label>
              <br/>
              <label>
              <label>Number of Iterations: </label>
              <br/>
                  <input
                      type="text"
                      name="iterationCountBox"
                      value={ this.state.iterationCountBox }
                      onChange={ this.handleChange } />
              </label>
              <br/>
              <br/>
              <button value="Send" onClick={this.runChallenge}>Submit</button>
              <br/>
              <br/>
              <label>Average Pi: </label>
              <label>{this.state.estimatedPI}</label>
              <br/>
              <ScatterChart
                data={ this.state.plotPointsArray }
                width={500}
                height={400}
                yHideOrigin={true}
                title="Dynamic Grid with n Points"
              />
      </div>
  );
  }
}

export default App;
