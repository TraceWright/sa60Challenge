import React, { Component } from 'react';
import * as randomNumber from 'random-number-in-range';
import { ScatterChart } from 'react-d3';

function numberGenerator(nPoints, gridSize) {
  let count = 0;
  let cartesianArray = [];
  while (count < nPoints) {
      let numberPairArray = [];
      let randomInt1 = randomNumber(0, gridSize);
      let randomInt2 = randomNumber(0, gridSize);
      numberPairArray.push(randomInt1, randomInt2);
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
  return { averagePI, resultsArray, iterationCount, nPoints };
}

function prepareDataForScatterPlot(resArray, itCount, nPoints) {
    let count1 = 0;
    let count2 = 0;
    let preparedArray = [];
    let formattedArray = [];
    formattedArray.push({
      name: "series1",
      values: []})
    while(count1 < itCount) {
      preparedArray = preparedArray.concat(resArray[count1].cArray);
        count1++
    }
    let counter = itCount * nPoints;
    while (count2 < counter) {
      formattedArray[0].values.push({ x: preparedArray[count2][0], y: preparedArray[count2][1] }) 
      count2++
    }
    return formattedArray;
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
    let results = challengeMain(
        this.state.nPointsBox,
        this.state.gridSizeBox,
        this.state.diameterBox,
        this.state.iterationCountBox);
    this.setState({ averagePI: results.averagePI });
    this.setState({ nPoints: results.nPoints });
    let formattedArray = prepareDataForScatterPlot(results.resultsArray, results.iterationCount, results.nPoints);
    this.setState({ plotPointsArray: formattedArray });
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
              <br/>
              <ScatterChart
                data={ [
{
    
name: "series1",

values: [ { x: 0, y: 20 }, { x: 24, y: 10 } ]
,
name2: "series2",
values2: [ { x: 5, y: 20 }, { x: 25, y: 19 } ]
  
}] }
                width={500}
                height={400}
                yHideOrigin={true}
                title="Scatter Chart"
              />
      </div>
  );
  }
}

export default App;
