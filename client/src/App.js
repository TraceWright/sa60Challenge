import React, { Component } from 'react';
import * as randomNumber from 'random-number-in-range';
import { ScatterChart } from 'react-d3';
import './App.css'

function numberGenerator(nPoints, iterationCount, gridSize, diameter) {
  let cartesianArray = [];
  for (let i = 0; i < iterationCount; i++) { 
    cartesianArray.push([
        { name: 'series' +  i + '_a', 
          values: [] },
        {  name: 'series' +  i + '_b',
          values: [] }
    ]);
    for (let j = 0; j < nPoints; j++) {
        let nPair = { x: randomNumber(0, gridSize), y: randomNumber(0, gridSize) }
        let inCrc = inCircle(nPair, diameter, gridSize);
        if (inCrc) {
          cartesianArray[i][0].values.push(nPair);
        } else if (!inCrc) {
          cartesianArray[i][1].values.push(nPair);
        }
      }
    }
  return cartesianArray;
}

function inCircle(nPair, diameter, gridSize) {
  let radius = diameter / 2;
  let center_x = gridSize / 2;
  let center_y = gridSize / 2;
  let dx = nPair.x - center_x;
  let dy = nPair.y - center_y;
  let inCrc = ((dx * dx) + (dy * dy)) < (radius * radius);
  return inCrc;
}

function countPointsInsideCircle(iterationCount, cartesianArray) {
  let resTrueTot = 0;
  let tfArr = [];
  for (let i = 0; i < iterationCount; i++) {
    let resTrue = cartesianArray[i][0].values.length;
    let resFalse = cartesianArray[i][1].values.length;
    tfArr.push({resTrue, resFalse});
    resTrueTot += resTrue; 
  }
  return { tfArr, resTrueTot }    
}  

function estimateAreaOfCircle(tfArray, gridSize, iterationCount, nPoints) {
  let areaOfSquare = gridSize * gridSize;
  let pic;
  let acEstArray = [];
  for (let i = 0; i < iterationCount; i++) {
    pic = tfArray[i].resTrue / nPoints;
    acEstArray.push(pic * areaOfSquare);
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

function totalEstimatePi(resTrueTot, iterationCount, gridSize, diameter, nPoints) {
  let radius = diameter / 2;
  let radiusSquared = radius * radius;
  let areaOfSquare = gridSize * gridSize;  
  let totalEstPi = resTrueTot / nPoints * areaOfSquare / iterationCount / radiusSquared;
  return totalEstPi;
}
 
function ScatterGraph(props) { 
  let vt = props.data;
  return(
      <ScatterChart
        data={ vt }
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
      <div className="scat" key={ item[1].name + '_sp'}>
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
      this.state.diameter
    );
    this.setState({ plotPointsArray: cartesianArray });
    let obj = countPointsInsideCircle(this.state.iterationCount, cartesianArray);
    let acEstArr = estimateAreaOfCircle(obj.tfArr, this.state.gridSize, this.state.iterationCount, this.state.nPoints);
    let estPIArr = estimatePI(acEstArr, this.state.diameter, this.state.iterationCount);
    let totalEstPi = totalEstimatePi(obj.resTrueTot, this.state.iterationCount, this.state.gridSize, this.state.diameter, this.state.nPoints);
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
                  <input type="text" name="nPoints" value={ this.state.nPoints } onChange={ this.handleChange } />
              </div>
              <br/>
              <div>
              <label>Grid Size: </label>
              <br/>
                  <input type="text" name="gridSize" value={ this.state.gridSize } onChange={ this.handleChange } />
              </div>
              <br/>
              <div>
              <label>Circle Diameter: </label>
              <br/>
                  <input type="text" name="diameter" value={ this.state.diameter } onChange={ this.handleChange } />
              </div>
              <br/>
              <div>
              <label>Number of Iterations: </label>
              <br/>
                  <input type="text" name="iterationCount" value={ this.state.iterationCount } onChange={ this.handleChange } />
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
