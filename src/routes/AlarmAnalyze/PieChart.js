/**
 * 饼chart
 */
import React from 'react';
import ReactEcharts from 'echarts-for-react';

function PieChart(props) {
	const { data, title, xAxis } = props;
	let option = {
	    title : {
	        text: title,
	        x:'center'
	    },
	    tooltip : {
	        trigger: 'item',
	        formatter: "{a} <br/>{b} : {c} ({d}%)"
	    },
	    legend: {
	        type: 'scroll',
	        orient: 'vertical',
	        right: 10,
	        top: 20,
	        bottom: 20,
	        data: xAxis,
	    },
	    series : [
	        {
	            // name: title,
	            type: 'pie',
	            radius : '55%',
	            center: ['50%', '50%'],
				data: data,
				// data: data1,
	            itemStyle: {
	                emphasis: {
	                    shadowBlur: 200,   // 阴影的大小
	                    shadowOffsetX: 0,  // 阴影水平方向上的偏移
	                    shadowColor: 'rgba(0, 0, 0, 0.5)' // 阴影颜色
	                },
	                normal: {
		                label:{ 
	                        show: true, 
	                        // formatter: '{b} : {c}吨 ({d}%)' 
	                    }
		            },
		            labelLine :{show:true}
	            },
	            label: {
		            normal: {
		                textStyle: {
		                    fontSize: 18,
		                    // color: '#235894'
		                }
		            }
		        },
	            // color: ['#c23531', '#2f4554']   // 设置颜色
	   //          labelLine: {              // 视觉引导线的颜色设为浅色
				//     lineStyle: {
				//         color: 'rgba(255, 255, 255, 0.3)'
				//     }
				// }
	        }
	    ]
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

export default PieChart;