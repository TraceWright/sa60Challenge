import React, { Component } from 'react';
import * as randomNumber from 'random-number-in-range';

function numberGenerator(nPoints, gridSize) {
  let count = 0;
  let cartesianArray = [];
  while (count < nPoints) {
      let numberPairArray = [];
      let randomInt1 = randomNumber(0, gridSize);
      let randomInt2 = randomNumber(0, gridSize);
      numberPairArray.push(randomInt1, randomInt2);
      //console.log(numberPairArray);
      cartesianArray.push(numberPairArray);
      count++;
  }
  return cartesianArray;
}

function countPointsInsideCircle(nPoints, cartesianArray, gridSize, diameter) {
  let count = 0;
  let radius = diameter / 2;
  let center_x = gridSize / 2;
  let center_y = gridSize / 2;
  while (count < nPoints) {
      let result;
      let cartesianPair = cartesianArray[count];
      let dx = cartesianPair[0] - center_x;
      let dy = cartesianPair[1] - center_y;

      if (((dx * dx) + (dy * dy)) < (radius * radius)) {
          result = true;
      } else {
          result = false;
      }
      cartesianArray[count].push(result);
      count++
  }
  return cartesianArray;
}

function calculatePercentage(nPoints, cartesianArrayTF) {
  let count = 0;
  let trueCount = 0;
  let falseCount = 0;
  while (count < nPoints) {
      cartesianArrayTF[count][2] ? trueCount++ : falseCount++;
      count ++
  }
  return trueCount;
}

function estimateAreaOfCircle(pointsInCircle, gridSize, nPoints) {
  let areaOfSquare = gridSize * gridSize;
  let pic;
  pic = pointsInCircle / nPoints;
  console.log(pic * areaOfSquare)
  return pic * areaOfSquare;
}

function estimatePI(circleAreaEstimate, diameter) {
  let radius = diameter / 2;
  let radiusSquared = radius * radius;
  let cae = circleAreaEstimate;
  let piEstimate = cae / radiusSquared;
  console.log(piEstimate);
  return piEstimate;
}

function antiClosureFunction(iterationCount) {
  let count = 0;
  let functionArray = [];
  while (count < iterationCount) {
          let acFunc = createFunction();
          functionArray.push(acFunc);
      count++
  }
  //console.log(functionArray);
  return functionArray;
}

function createFunction() {
  return function mainFunction(gridSize, diameter, nPoints) {
      let estimatedPI;
      let cartesianArray = [];
      let cartesianArrayTF = [];
      cartesianArray.length = 0; // reset array
      cartesianArrayTF.length = 0; // reset array
      let percentageOfPointsInCircle;
      let estimatedAreaOfCircle;
      cartesianArray = numberGenerator(nPoints, gridSize);
      cartesianArrayTF = countPointsInsideCircle(nPoints, cartesianArray, gridSize, diameter);
      percentageOfPointsInCircle = calculatePercentage(nPoints, cartesianArrayTF);
      estimatedAreaOfCircle = estimateAreaOfCircle(percentageOfPointsInCircle, gridSize, nPoints);
      estimatedPI = estimatePI(estimatedAreaOfCircle, diameter);
      let cArray = cartesianArrayTF;
      return { estimatedPI, cArray };
  }
}

function averageEstimatedPI(estimatedPIArray, iterationCount) {
  let count = 0;
  let total = 0;
  while (count < iterationCount) {
      let e = estimatedPIArray[count].estimatedPI;
      total += e;
      count ++;
  }
  console.log('average: '+ total / iterationCount);
  return total / iterationCount;
}

function challengeMain(nPoints, gridSize, diameter, iterationCount) {
  let resultsArray = [];
  let MCPIFunctionArray = antiClosureFunction(iterationCount);
  for (var i = 0; i < iterationCount; i++) {
      let results;
      results = MCPIFunctionArray[i](gridSize, diameter, nPoints);

      resultsArray.push(results);
  }
  console.log(resultsArray);
  let averagePI = averageEstimatedPI(resultsArray, iterationCount);
  return { averagePI, resultsArray, iterationCount };
}

function prepareDataForScatterPlot(resArray, itCount) {
    let count = 0;
    //let tempArray = [];
    let preparedArray = [];
    //console.log(preparedArray)
    while(count < itCount) {
      preparedArray = preparedArray.concat(resArray[count].cArray);
        //console.log(resArray[count].cArray);
        //preparedArray = preparedArray.concat(tempArray);
        count++
    }
    console.log(preparedArray);
 }

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
        gridSizeBox: '',
        nPointsBox: '',
        diameterBox: '',
        iterationCountBox: '',
        averagePI: '',
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
    // console.log( this.state.nPointsBox );
    // console.log( this.state.gridSizeBox );
    // console.log( this.state.plotPointsArray );
    let results = challengeMain(
        this.state.nPointsBox,
        this.state.gridSizeBox,
        this.state.diameterBox,
        this.state.iterationCountBox);
    this.setState({ averagePI: results.averagePI });
    this.setState({ plotPointsArray: results.resultsArray });
    // console.log('ppa: ' + this.state.plotPointsArray);
    prepareDataForScatterPlot(results.resultsArray, results.iterationCount);
  }

  render() {
    return (
      <div>
          <br/>
              <label>
                  <input
                      type="text"
                      name="nPointsBox"
                      placeholder="Enter number of points..."
                      value={ this.state.nPointsBox }
                      onChange={ this.handleChange } />
              </label>
              <br/>
              <label>
                  <input
                      type="text"
                      name="gridSizeBox"
                      placeholder="Enter grid size..."
                      value={ this.state.gridSizeBox }
                      onChange={ this.handleChange } />
              </label>
              <br/>
              <label>
                  <input
                      type="text"
                      name="diameterBox"
                      placeholder="Enter circle diameter size..."
                      value={ this.state.diameterBox }
                      onChange={ this.handleChange } />
              </label>
              <br/>
              <label>
                  <input
                      type="text"
                      name="iterationCountBox"
                      placeholder="Enter number of iterations..."
                      value={ this.state.iterationCountBox }
                      onChange={ this.handleChange } />
              </label>
              <br/>
              <button value="Send" onClick={this.runChallenge}>Submit</button>
              <br/>
              <br/>
              <label>Average Pi: </label>
              <label>{this.state.averagePI}</label>
      </div>
  );
  }
}

export default App;
