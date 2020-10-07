import React from 'react';
import {connect} from 'dva';
import moment from 'moment';
import 'moment/locale/zh-cn';
import {VtxDatagrid, VtxGrid} from "vtx-ui";
import {DatePicker, Tabs} from "antd";

moment.locale('zh-cn');
const {RangePicker} = DatePicker;
const TabPane = Tabs.TabPane;

class PersonalAgent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    };
    
    componentDidMount() {
    
    }
    
    render() {
        const {dispatch, personalAgentM, loading} = this.props;
        const {gridParams, searchParams, tabKey, undoList, undoListTotal, doneList, doneListTotal} = personalAgentM;
        const {startTime, endTime} = gridParams;
        const {page, size} = searchParams;
        
        //更改搜索条件
        const changeGridParams = (target, value) => {
            dispatch({
                type: 'personalAgentM/updateGridParams',
                payload: {
                    [target]: value
                }
            })
        };
        const changeSearchParams = (target, value) => {
            dispatch({
                type: 'personalAgentM/updateSearchParams',
                payload: {
                    [target]: value
                }
            })
        };
        //时间选择
        const DateProps = {
            style: {width: '100%'},
            value: [startTime, endTime],
            format: 'YYYY-MM-DD',
            allowClear: false,
            onChange: (date, dateString) => {
                changeGridParams('startTime', date[0]);
                changeGridParams('endTime', date[1]);
                changeSearchParams('startTime', date[0]);
                changeSearchParams('endTime', date[1]);
                dispatch({type: 'personalAgentM/pageList'})
            }
        };
        //列表配置
        const tableProps = {
            loading,
            columns: [{
                title: '来自',
                dataIndex: 'from',
                key: 'from'
            }, {
                title: '标题',
                dataIndex: 'title',
                key: 'title'
            }, {
                title: '接收时间',
                dataIndex: tabKey === 'undone' ? 'acceptTime' : 'dealTime',
                key: tabKey === 'undone' ? 'acceptTime' : 'dealTime',
            }],
            dataSource: tabKey === 'undone' ? undoList : doneList,
            rowKey: record => JSON.stringify(record),
            indexColumn: true,
            autoFit: true,
            scroll: {
                x: 1000,
            },
            startIndex: page * size + 1, //后端分页
            indexTitle: '序号',
            pagination: {
                showSizeChanger: true,
                showQuickJumper: true,
                current: page + 1,
                total: tabKey === 'undone' ? undoListTotal : doneListTotal,
                pageSize: size,
                // 当前页码改变的回调
                onChange(page, pageSize) {
                    changeSearchParams('page', page - 1);
                    changeSearchParams('size', pageSize);
                    dispatch({
                        type: 'personalAgentM/updateState',
                        payload: {gridParams: {...gridParams, ...searchParams}}
                    });
                    dispatch({type: 'personalAgentM/pageList'})
                },
                // size 变化的回调
                onShowSizeChange(current, size) {
                    changeSearchParams('page', current - 1);
                    changeSearchParams('size', size);
                    dispatch({
                        type: 'personalAgentM/updateState',
                        payload: {gridParams: {...gridParams, ...searchParams}}
                    });
                    dispatch({type: 'personalAgentM/pageList'})
                },
                showTotal: total => `合计 ${total} 条`
            }
        };
        //切换tab
        const changeTab = (key) => {
            dispatch({type: 'personalAgentM/updateState', payload: {tabKey: key}});
            changeSearchParams('page', 0);
            changeSearchParams('size', 10);
            dispatch({
                type: 'personalAgentM/updateState',
                payload: {gridParams: {...gridParams, ...searchParams}}
            });
            dispatch({type: 'personalAgentM/pageList'})
        };
        
        return (
            <div className="main_page">
                <VtxGrid titles={['日期']}
                         gridweight={[2]}
                         confirm={() => dispatch({type: 'personalAgentM/pageList'})}
                         clear={() => {
                             dispatch({type: 'personalAgentM/clearGridParams'});
                             dispatch({type: 'personalAgentM/clearSearchParams'});
                             dispatch({type: 'personalAgentM/pageList'})
                         }}>
                    <RangePicker {...DateProps}/>
                </VtxGrid>
                <Tabs className="table-wrapper"
                      activeKey={tabKey}
                      onChange={(key) => changeTab(key)}>
                    <TabPane tab='待办事项' key="undone">
                        <VtxDatagrid {...tableProps} />
                    </TabPane>
                    <TabPane tab='办结事项' key="done">
                        <VtxDatagrid {...tableProps} />
                    </TabPane>
                </Tabs>
            </div>
        );
    };
}

const personalAgentProps = (state) => {
    return {
        personalAgentM: state.personalAgentM,
        loading: state.loading.effects['personalAgentM/pageList'],
    };
};

export default connect(personalAgentProps)(PersonalAgent);
