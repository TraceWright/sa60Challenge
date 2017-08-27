import React, { Component } from 'react';
import * as randomNumber from 'random-number-in-range';
import { ScatterChart } from 'react-d3';
import './App.css'

function numberGenerator(nPoints, iterationCount, gridSize) {
  let count = 0;
  let cartesianArray = [];
  while (count < iterationCount) {
    cartesianArray.push({
      name: "series_" + count,
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
  return(
      <ScatterChart
        data={ [props.data] }
        width={400}
        height={320}
        yHideOrigin={true}
        //xAxisTickInterval={{interval: ?}} wip
      />
  )
}

function ScatterParent(props) {
  return(
    <div className="scatPar">
      {props.data.map((item, i) =>
      <div className="scat" key={ item.name + '_sp'}>
      <b><label>Iteration {i + 1}</label></b>
      <br/>
      <ScatterGraph key={ item.name } data={ item }/>
      <label key={ item.name + '_pi' }> Estimated Pi: { Math.round(props.estPi[i] * 100) / 100 }  </label>
      <p/>
      <br/>
      </div>)
}
      </div>
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
        plotPointsArray: [],
        estPiArray: []
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
    this.setState({ estimatedPI: totalEstPi, estPiArray: estPIArr })
    }

  render() {
    return (
      <div>
        <h3 style={{textAlign: 'center'}}>Monte Carlo Simulation</h3>
          <br/>
            <div className="inputBox">
              <div>
                <label>Number of Points: </label>
                <br/>
                  <input
                      type="text"
                      name="nPoints"
                      value={ this.state.nPoints }
                      onChange={ this.handleChange } />
              </div>
              <br/>
              <div>
              <label>Grid Size: </label>
              <br/>
                  <input
                      type="text"
                      name="gridSize"
                      value={ this.state.gridSize }
                      onChange={ this.handleChange } />
              </div>
              <br/>
              <div>
              <label>Circle Diameter: </label>
              <br/>
                  <input
                      type="text"
                      name="diameter"
                      value={ this.state.diameter }
                      onChange={ this.handleChange } />
              </div>
              <br/>
              <div>
              <label>Number of Iterations: </label>
              <br/>
                  <input
                      type="text"
                      name="iterationCount"
                      value={ this.state.iterationCount }
                      onChange={ this.handleChange } />
              </div>
              <br/>
              <button value="Send" onClick={this.runChallenge}>Submit</button>
              <br/>
              <br/>
              <label>Average Pi for all Iterations: </label>
              <label>{ Math.round(this.state.estimatedPI * 100) / 100}</label>
              </div>
              <br/>
              <br/>
              <ScatterParent data={ this.state.plotPointsArray } estPi={this.state.estPiArray}/>
          </div>
  );
  }
}

export default App;


