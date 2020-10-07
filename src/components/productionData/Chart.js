import React from 'react';
import ReactEcharts from 'echarts-for-react';
import { VtxModal, } from 'vtx-ui';
import { Button } from 'antd';

function Chart(props) {

    const { updateWindow, modalProps, contentProps} = props;
    const { xList, data,name,unit } = contentProps
    let series = [];
    for(let key in data){
        let keyValues = data[key]
        let childData = []
        for(let key2 in keyValues){
            childData.push([key2,keyValues[key2]])
        }
        series.push({
            type:'line',
            name:key,
            data: childData
        })
    }
    const options = {
        legend:{
            show:true
        },
        tooltip: {
            trigger: 'axis',
            confine: true,
        },
        xAxis:{
            name:'日期',
            type:'category',
            data: xList,
        },
        yAxis:[{
            type:'value',
            name:unit,
        }],
        series,
    }
    return (
        <VtxModal
            {...modalProps}
            footer={[
            ]}
        >
            <ReactEcharts
                option={options}
                notMerge={true}
                lazyUpdate={false}
                style={{ width: '100%',}}
            />
        </VtxModal>
    )
}

export default Chart;