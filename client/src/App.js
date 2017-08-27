import React, { Component } from 'react';
import * as randomNumber from 'random-number-in-range';
import { ScatterChart } from 'react-d3';
import { ScatterPlot } from './ScatterPlot.js';

function numberGenerator(nPoints, iterationCount, gridSize) {
  let count = 0;
  let cartesianArray = [];
  while (count < iterationCount) {
    cartesianArray.push({
      name: "series",
      values: []
    })
    count++
  }
  count = 0;
  while (count < nPoints * iterationCount) {
      let numberPairArray = [];
      let randomInt1 = randomNumber(0, gridSize);
      let randomInt2 = randomNumber(0, gridSize);
      numberPairArray.push(randomInt1, randomInt2);
      cartesianArray[Math.floor(count / nPoints)].values.push({ x: numberPairArray[0], y: numberPairArray[1] })
      count++;
  }
  return cartesianArray;
}

function countPointsInsideCircle(nPoints, iterationCount, cartesianArray, gridSize, diameter) {
  let radius = diameter / 2;
  let center_x = gridSize / 2;
  let center_y = gridSize / 2;
  let tfArray = [];
  for (let i = 0; i < iterationCount; i++) {
    let count = 0;
    let itRes = cartesianArray[i].values.reduce(function(acc, item) {
      let cartesianPair = cartesianArray[i].values[count];
      let dx = cartesianPair.x - center_x;
      let dy = cartesianPair.y - center_y;
      let inCircle = ((dx * dx) + (dy * dy)) < (radius * radius);
      count ++
      return {
        resultTrue: inCircle ? acc.resultTrue + 1 : acc.resultTrue, 
        resultFalse: inCircle ? acc.resultFalse : acc.resultFalse + 1
      }
    },{ 
      resultTrue: 0, 
      resultFalse: 0
    })
    tfArray.push(itRes);
  }
  return tfArray;
}

function estimateAreaOfCircle(tfArray, gridSize, iterationCount, nPoints) {
  let areaOfSquare = gridSize * gridSize;
  let pic;
  let acEstArray = [];
  for (let i = 0; i < iterationCount; i++) {
    pic = tfArray[i].resultTrue / nPoints;
    acEstArray.push(pic * areaOfSquare)
  }
  return acEstArray;
}

function estimatePI(acEstArray, diameter, iterationCount) {
  let radius = diameter / 2;
  let radiusSquared = radius * radius;
  let estPIArr = [];
  for (let i = 0; i < iterationCount; i++) {    
    let piEstimate = acEstArray[i] / radiusSquared;
    estPIArr.push(piEstimate);
  }
  return estPIArr;
}

function totalEstimatePi(estPIArr, iterationCount) {
  let totalEstPi;
  for (let i = 0; i < iterationCount; i++) {
    totalEstPi =+ estPIArr[i]
  }
  return totalEstPi;
}
 
function ScatterGraph(props) {
  // console.log('child: ' + props.data)
  return(
      <ScatterChart
        data={ props.data }
        width={500}
        height={400}
        yHideOrigin={true}
        title="Dynamic Grid with n Points"
      />
  )
}

class App extends Component {
  constructor(props) {
    super(props);
 
    this.state = {
        gridSize: '',
        nPoints: '',
        diameter: '',
        iterationCount: '',
        estimatedPI: '',
        plotPointsArray: []
      };

    this.renderChildren = this.renderChildren.bind(this)

    this.handleChange = this.handleChange.bind(this);
    this.runChallenge = this.runChallenge.bind(this);
  }  

  handleChange({ target }) {
    this.setState({
        [target.name]: target.value
      });
  }

  runChallenge() {
console.log(this.state.plotPointsArray)
    let cartesianArray = numberGenerator(
      this.state.nPoints,
      this.state.iterationCount,
      this.state.gridSize,
    );
    this.setState({ plotPointsArray: cartesianArray });
    let tfArr = countPointsInsideCircle(this.state.nPoints, this.state.iterationCount, cartesianArray, this.state.gridSize, this.state.diameter)
    let acEstArr = estimateAreaOfCircle(tfArr, this.state.gridSize, this.state.iterationCount, this.state.nPoints);
    let estPIArr = estimatePI(acEstArr, this.state.diameter, this.state.iterationCount);
    let totalEstPi = totalEstimatePi(estPIArr, this.state.iterationCount);
    this.setState({ estimatedPI: totalEstPi })
    }

    renderChildren() {
      // return React.Children.map(this.props.children, child => {
      //   return React.cloneElement(child, {
      //     name: this.state.plotPointsArray
      //   })
    // })
      return this.props.children
    }

  // createGraphs() {
  //   if (this.state.plotPointsArray = []) {
  //     return
  //   } else {
  //     this.createGraph();
  //   }
  // }

  // createGraph(plotPointsArray) {
  //   // console.log(plotPointsArray);
  //   // console.log(plotPointsArray[0]);
  //   return <ScatterChart data={ this.state.plotPointsArray } width={250} height={200} yHideOrigin={true} title="Dynamic Grid with n Points" />
  // }



  render() {
    return (
      <div>
          <br/>
              <label>
                <label>Number of Points: </label>
                <br/>
                  <input
                      type="text"
                      name="nPoints"
                      value={ this.state.nPoints }
                      onChange={ this.handleChange } />
              </label>
              <br/>
              <label>
              <label>Grid Size: </label>
              <br/>
                  <input
                      type="text"
                      name="gridSize"
                      value={ this.state.gridSize }
                      onChange={ this.handleChange } />
              </label>
              <br/>
              <label>
              <label>Circle Diameter: </label>
              <br/>
                  <input
                      type="text"
                      name="diameter"
                      value={ this.state.diameter }
                      onChange={ this.handleChange } />
              </label>
              <br/>
              <label>
              <label>Number of Iterations: </label>
              <br/>
                  <input
                      type="text"
                      name="iterationCount"
                      value={ this.state.iterationCount }
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
              {/* <ScatterChart data={ this.state.plotPointsArray } width={500} height={400} yHideOrigin={true} title="Dynamic Grid with n Points" /> */}
            
              <ScatterGraph data={ this.state.plotPointsArray }/>
          </div>
  );
  }
}

export default App;


