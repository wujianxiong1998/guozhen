import React from 'react';
import {connect} from 'dva';
import moment from 'moment';
import 'moment/locale/zh-cn';
import {VtxGrid} from "vtx-ui";
import {Select, Tabs, DatePicker} from "antd";
import Report from '../../components/reportForms/Report';

moment.locale('zh-cn');
const Option = Select.Option;
const TabPane = Tabs.TabPane;

class ExceedReason extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    };
    
    componentDidMount() {
    
    }
    
    render() {
        const {dispatch, productionDailyM} = this.props;
        const {businessUnitList, regionalCompanySelect, waterFactoryList, waterFactoryIds, dateValue, iframeSrc} = productionDailyM;
        
        //更改参数
        const changeParams = (target, value) => dispatch({
            type: 'productionDailyM/updateState',
            payload: {
                [target]: value
            }
        });
        //时间配置
        const dateProps = {
            style: {width: '100%'},
            format: 'YYYY-MM-DD',
            allowClear: false,
            value: dateValue,
            onChange: (date, dateString) => {
                changeParams('dateValue', date);
                dispatch({type: 'productionDailyM/changeUrl'})
            }
        };
        //选择水厂
        const waterFactorySelect = {
            style: {width: '100%'},
            mode: 'multiple',
            value: waterFactoryIds,
            onChange: (value) => {
                changeParams('waterFactoryIds', value);
                dispatch({type: 'productionDailyM/changeUrl'})
            }
        };
        
        const changeTab = (key) => {
            switch (key) {
                case 'assay':
                    changeParams('report_code', 'assay');
                    changeParams('dataType', 'assay');
                    dispatch({type: 'productionDailyM/changeUrl'});
                    break;
                case 'produce':
                    changeParams('report_code', 'produce');
                    changeParams('dataType', 'produce');
                    dispatch({type: 'productionDailyM/changeUrl'});
                    break;
                case 'consum':
                    changeParams('report_code', 'produce');
                    changeParams('dataType', 'consum');
                    dispatch({type: 'productionDailyM/changeUrl'});
                    break;
                case 'none':
                    changeParams('report_code', 'assay');
                    changeParams('dataType', '');
                    dispatch({type: 'productionDailyM/changeUrl'});
                    break;
            }
        };
        
        return (
            <div className="main_page">
                <VtxGrid titles={['事业部', '区域公司', '水厂', '日期']}
                         gridweight={[1, 1, 1, 1]}
                         confirm={() => dispatch({type: 'productionDailyM/changeUrl'})}
                         clear={() => {
                             dispatch({type: 'productionDailyM/clearParams'});
                             dispatch({type: 'productionDailyM/changeUrl'})
                         }}>
                    <Select style={{width: '100%'}} onChange={() => dispatch({type: 'productionDailyM/changeUrl'})}>
                        {businessUnitList.map(item => (
                            <Option key={item.id} value={item.id}>{item.name}</Option>
                        ))}
                    </Select>
                    <Select style={{width: '100%'}} onChange={() => dispatch({type: 'productionDailyM/changeUrl'})}>
                        {regionalCompanySelect.map(item => (
                            <Option key={item.id} value={item.id}>{item.name}</Option>
                        ))}
                    </Select>
                    <Select {...waterFactorySelect}>
                        {waterFactoryList.map(item => (
                            <Option key={item.id} value={item.id}>{item.name}</Option>
                        ))}
                    </Select>
                    <DatePicker {...dateProps}/>
                </VtxGrid>
                <Tabs className="table-wrapper"
                      onChange={(key) => changeTab(key)}>
                    <TabPane tab='化验数据' key="assay">
                        {!!iframeSrc && <Report
                            iframeSrc={iframeSrc}
                            rows='1'/>}
                    </TabPane>
                    <TabPane tab='生产数据' key="produce">
                        {!!iframeSrc && <Report
                            iframeSrc={iframeSrc}
                            rows='1'/>}
                    </TabPane>
                    <TabPane tab='单耗数据' key="consum">
                        {!!iframeSrc && <Report
                            iframeSrc={iframeSrc}
                            rows='1'/>}
                    </TabPane>
                    <TabPane tab='全部' key="none">
                        {!!iframeSrc && <Report
                            iframeSrc={iframeSrc}
                            rows='1'/>}
                    </TabPane>
                </Tabs>
            </div>
        );
    };
}

const exceedReasonProps = (state) => {
    return {
        productionDailyM: state.productionDailyM,
    };
};

export default connect(exceedReasonProps)(ExceedReason);
