import React, { Component } from 'react';
import { ScatterChart } from 'react-d3';

export class ScatterPlot extends Component {
    constructor(props){
        super(props);
        // this.state = { plotPointsArray: [] };
        this.plotPointsArray = props.data
    }
    
    render() {
        console.log('child: ' + this.plotPointsArray)
        return(
            <div>
            <ScatterChart
            data={ this.plotPointsArray }
            width={500}
            height={400}
            yHideOrigin={true}
            title="Dynamic Grid with n Points"
            />
            <label>Hi</label>
            </div>
        )
    }
};

          
