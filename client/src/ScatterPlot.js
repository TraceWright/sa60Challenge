import React, { Component } from 'react';
import { ScatterChart } from 'react-d3';

export class ScatterPlot extends Component {
    constructor(props){
        super(props);
        this.state = { plotPointsArray: [] };
    }
    
    render() {
        return(
    
            <ScatterChart
            data={ this.state.plotPointsArray }
            width={500}
            height={400}
            yHideOrigin={true}
            title="Dynamic Grid with n Points"
            />
        )
    }
};

            {/* data={ [ { name: "series1",values: [ { x: 0, y: 20 }, { x: 24, y: 10 } ] } ] } */}
