/**
 * 折线chart
 */
import React from 'react';
import ReactEcharts from 'echarts-for-react';

function LineChart(props) {
	const { data, title, xAxis } = props;
	// let seriesData = data.map((item) => {
	// 	return {
	// 		name: item.name,
	// 		type: 'line',
	// 		data: item.data,
	// 	}
	// })
	let option = {
		title : {
	        text: title,
	        // subtext: '纯属虚构',
	        x:'center'
		},
		legend: {
			data: []
		},
	    xAxis: {
			type: 'category',
			// type: 'value',
	        // boundaryGap: false,
	        data: xAxis,
	        // axisLabel: {
	        //     interval:2,
	        //     rotate:40,
	        // }
	    },
	    yAxis: {
	    	// name: '进厂量',
			type: 'value',
	        // axisLabel: {
	        //     formatter: '{value}',
	        // }
	    },
	    series: seriesData,
	    // tooltip: {
	    //     trigger: 'axis',
		// 	formatter: '{a}' + data.unit,
	    // },
	};

	return (
        <ReactEcharts 
            option={option}
            notMerge={true}
            // lazyUpdate={false}
            style={{height: '300px'}}
        />
    )
}

export default LineChart;