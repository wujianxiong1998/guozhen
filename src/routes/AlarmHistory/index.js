/**
 * 报警历史
 * author : vtx sjb
 * createTime : 2019-6-13
 */
import React from 'react';
import {connect} from 'dva';
import moment from 'moment';

import {VtxDatagrid, VtxGrid, VtxDate} from 'vtx-ui';
import {Input, Tooltip, Select, Icon} from 'antd';

const {VtxRangePicker} = VtxDate;
const Option = Select.Option;
import {handleColumns} from '../../utils/tools';
import ViewItem from './view';

function AlarmHistory({dispatch, alarmHistory, accessControlM}) {
    
    const {
        queryParams, viewItem,
        currentPage, pageSize, loading, dataSource, total
    } = alarmHistory;
    let buttonLimit = {};
    if (accessControlM['alarmHistory'.toLowerCase()]) {
        buttonLimit = accessControlM['alarmHistory'.toLowerCase()];
    }
    const ParamsUpdateState = (obj) => {
        dispatch({
            type: 'alarmHistory/updateState',
            payload: {
                queryParams: {
                    ...queryParams,
                    ...obj
                }
            }
        })
    };
    
    const updateState = (obj) => {
        dispatch({
            type: 'alarmHistory/updateState',
            payload: {
                ...obj
            }
        })
    };
    
    // 更新表格数据
    const getList = () => {
        dispatch({type: 'alarmHistory/getList'});
    };
    
    // 查询
    const vtxGridParams = {
        // 报警时间
        timeProps: {
            value: [queryParams.startDay, queryParams.endDay],
            onChange(date, dateString) {
                ParamsUpdateState({
                    startDay: dateString[0],
                    endDay: dateString[1]
                });
                getList();
            },
            showTime: false,
            style: {
                width: '100%'
            },
            // disabledDate(current) {
            // 	return current && moment(moment(current).format('YYYY-MM-DD')).isAfter(moment().format('YYYY-MM-DD'));
            // }
        },
        // 报警类型
        typeProps: {
            value: queryParams.code,
            onChange(value) {
                ParamsUpdateState({
                    code: value,
                });
                getList();
            },
            dropdownMatchSelectWidth: false,
            style: {
                width: '100%'
            },
            allowClear: true,
        },
        // 报警指标
        indexProps: {
            value: queryParams.code,
            onChange(value) {
                ParamsUpdateState({
                    code: value,
                });
                getList();
            },
            dropdownMatchSelectWidth: false,
            style: {
                width: '100%'
            },
            allowClear: true,
        },
        // 报警级别
        rankProps: {
            value: queryParams.code,
            onChange(value) {
                ParamsUpdateState({
                    code: value,
                });
                getList();
            },
            dropdownMatchSelectWidth: false,
            style: {
                width: '100%'
            },
            allowClear: true,
        },
        // 关键词
        keyWordProps: {
            value: queryParams.name,
            onChange(e) {
                ParamsUpdateState({name: e.target.value});
            },
            onPressEnter() {
                getList();
            },
        },
        
        query() {
            getList();
        },
        
        clear() {
            dispatch({type: 'alarmHistory/initQueryParams'});
            dispatch({type: 'alarmHistory/getList'});
        }
    };
    
    // 列表
    const columns = [
        ['运营单位', 'waterFactoryName'],
        ['报警时间', 'alarmTimeStr'],
        ['报警指标', 'libCode'],
        ['指标大类', 'bigTypeName'],
        ['指标小类', 'smallTypeName'],
        ['指标单位', 'libUnitName'],
        ['报警值/限值', 'alarmValue', {render: (text, record) => (<span>{record.alarmValue}/{record.upValue}</span>)}],
        ['通知人员', 'sendPeopleName'],
        // ['操作', 'action', { renderButtons : (text, record) => {
        //     let btns = [];
        // 	btns.push({
        // 		name:'查看',
        // 		onClick(rowData) {
        //             dispatch({
        //                 type : 'alarmHistory/updateState',
        //                 payload : {
        //                     viewItem: {
        // 						...rowData,
        // 						visible: true,
        // 						picIds: rowData.picIds?JSON.parse(rowData.picIds):[],
        //                     }
        //                 }
        //             })
        // 		}
        // 	});
        // 	return btns;
        // }, width : '120px'}]
    ];
    let vtxDatagridProps = {
        columns: handleColumns(columns),
        dataSource,
        indexColumn: true,
        indexTitle: '序号',
        startIndex: (currentPage - 1) * pageSize + 1,
        autoFit: true,
        loading,
        onChange(pagination, filters, sorter) {
            dispatch({
                type: 'alarmHistory/getList',
                payload: {
                    currentPage: pagination.current,
                    pageSize: pagination.pageSize
                }
            }).then((status) => {
                if (status) {
                    updateState({
                        currentPage: pagination.current,
                        pageSize: pagination.pageSize
                    })
                }
            });
        },
        pagination: {
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '30', '40', '50'],
            showQuickJumper: true,
            current: currentPage,  //后端分页数据配置参数1
            total: total, //后端分页数据配置参数2
            pageSize, //后端分页数据配置参数3
            showTotal: total => `合计 ${total} 条`
        },
    };
    
    //--------------查看-----------------
    const updateViewWindow = (status = true) => {
        dispatch({
            type: 'alarmHistory/updateViewItem',
            payload: {
                visible: status
            }
        })
    };
    const viewItemProps = {
        updateWindow: updateViewWindow,
        modalPropsItem: {
            title: `报警历史 > 查看`,
            visible: viewItem.visible,
            onCancel: () => updateViewWindow(false),
            width: 900
        },
        contentProps: {
            ...viewItem,
            btnType: 'view'
        }
    };
    
    return (
        <div className="main_page">
            <VtxGrid
                titles={['报警时间', '报警类型', '报警指标', '报警级别', '关键词']}
                gridweight={[2, 0, 0, 0, 0]}
                confirm={vtxGridParams.query}
                clear={vtxGridParams.clear}
            >
                {/*报警时间*/}
                <VtxRangePicker {...vtxGridParams.timeProps}/>
                {/*报警类型*/}
                <Select {...vtxGridParams.typeProps}>
                    {
                        [{id: '1', name: '11'}, {id: '2', name: '22'}].map(item => {
                            return <Option key={item.id}>{item.name}</Option>
                        })
                    }
                </Select>
                {/*报警指标*/}
                <Select {...vtxGridParams.indexProps}>
                    {
                        [{id: '1', name: '11'}, {id: '2', name: '22'}].map(item => {
                            return <Option key={item.id}>{item.name}</Option>
                        })
                    }
                </Select>
                {/*报警级别*/}
                <Select {...vtxGridParams.rankProps}>
                    {
                        [{id: '1', name: '11'}, {id: '2', name: '22'}].map(item => {
                            return <Option key={item.id}>{item.name}</Option>
                        })
                    }
                </Select>
                {/*关键词*/}
                <Input {...vtxGridParams.keyWordProps}/>
            </VtxGrid>
            <div className="table-wrapper">
                <VtxDatagrid {...vtxDatagridProps} />
            </div>
            {/*查看*/}
            {viewItem.visible && <ViewItem {...viewItemProps}/>}
        </div>
    );
    
}

export default connect(({alarmHistory, accessControlM}) => ({alarmHistory, accessControlM}))(AlarmHistory);
