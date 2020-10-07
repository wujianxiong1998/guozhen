import React from 'react';
import ReactEcharts from 'echarts-for-react';
import { VtxModal, } from 'vtx-ui';
import { Button } from 'antd';

function Chart(props) {

    const { updateWindow, modalProps, contentProps} = props;
    const { xList, data,name,unit } = contentProps
    const options = {
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
            name:name+'/'+unit,
        }],
        series:[{
            type:'line',
            data,
        }]
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