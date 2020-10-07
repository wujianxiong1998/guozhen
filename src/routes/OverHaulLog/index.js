/**
 * 大修记录
 * author : vtx sjb
 * createTime : 2019-7-05
 */
import React from 'react';
import { connect } from 'dva';
import moment from 'moment';

import { VtxDatagrid, VtxGrid, VtxDate } from 'vtx-ui';
import { Input, Select,Icon } from 'antd';
const { VtxRangePicker } = VtxDate;
const Option = Select.Option;

import { VtxUtil } from "../../utils/util";
import { handleColumns } from '../../utils/tools';
import ViewItem from './view';

function OverHaulLog({ dispatch, overHaulLog, accessControlM}) {

    const { queryParams, viewItem, getData, fileListVersion,
        currentPage, pageSize, loading, dataSource, total,
    } = overHaulLog;

    const ParamsUpdateState = (obj) => {
        dispatch({
            type : 'overHaulLog/updateState',
            payload : {
                queryParams: {
                    ...queryParams,
                    ...obj
                }
            }
        })
    };
    let buttonLimit = {};
    if (accessControlM['overHaulLog'.toLowerCase()]) {
        buttonLimit = accessControlM['overHaulLog'.toLowerCase()];
    }
    const updateState = (obj) => {
        dispatch({
            type : 'overHaulLog/updateState',
            payload : {
                ...obj
            }
        })
    };

    // 更新表格数据
	const getList = () => {
        dispatch({type: 'overHaulLog/updateState', payload: { currentPage: 1, pageSize: 10 }})
		dispatch({type : 'overHaulLog/getList'});
	}

    // 查询
	const vtxGridParams = {
        // 设备编号
        numProps: {
			value: queryParams.code,
            onChange(e) {
				ParamsUpdateState({code : e.target.value});
            },
            onPressEnter() {
				getList();
			},
        },
        // 设备名称
        nameProps: {
			value: queryParams.name,
            onChange(e) {
				ParamsUpdateState({name : e.target.value});
            },
            onPressEnter() {
				getList();
			},
        },
        // 起始日期
        timeProps : {
			value : [queryParams.startDay, queryParams.endDay],
			onChange(date, dateString) {
				ParamsUpdateState({
					startDay : dateString[0],
					endDay : dateString[1]
				})
				getList();
			},
			showTime : false,
			style : {
				width : '100%'
			},
			// disabledDate(current) {
			// 	return current && moment(moment(current).format('YYYY-MM-DD')).isAfter(moment().format('YYYY-MM-DD'));
			// }
        },
        
        query() {
			getList();
		},

		clear() {
			dispatch({type : 'overHaulLog/initQueryParams'});
			dispatch({type : 'overHaulLog/getList'});
		}
    };

    // 列表
	const columns = [
        ['设备编号', 'code'],
        ['设备名称', 'name'],
        ['安装位置', 'structuresName'],
        ['责任人', 'chargeManName'],
        ['实际完成时间', 'actEndDay'],
        ['原因', 'reason'],
        ['大修内容', 'details'],
        ['实际费用（万元）', 'actMoney'],
        ['操作', 'action', { renderButtons : (text, record) => {
            let btns = [];
            if (buttonLimit['VIEW']) {
            btns.push({
                name: <Icon type='view'
                    title='查看' />,
        		onClick(rowData) {
					dispatch({
                        type : 'overHaulLog/getD',
                        payload : {
                            id: rowData.id
                        }
                    }).then(() => {
                        dispatch({
                            type : 'overHaulLog/updateState',
                            payload : {
                                viewItem: {
                                    visible: true,
                                }
                            }
                        })
                    });
        		}
            });
        }
        	return btns;
		}, width : '180px'}]
	];
	let vtxDatagridProps = {
		columns : handleColumns(columns),
    	dataSource,
        indexColumn : true,
        indexTitle: '序号',
        startIndex : ( currentPage - 1 )*pageSize+1,
        autoFit:true,
        // headFootHeight : 150,
        loading,
        onChange(pagination, filters, sorter){
            dispatch({
            	type:'overHaulLog/getList',
            	payload : {
            		currentPage : pagination.current,
                	pageSize: pagination.pageSize
            	}
            }).then((status) => {
            	if(status) {
            		updateState({
		        		currentPage : pagination.current,
		                pageSize: pagination.pageSize
		        	})
            	}
            });
        },
        pagination:{
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '30', '40','50'],
            showQuickJumper: true,
            current:currentPage,  //后端分页数据配置参数1
            total:total, //后端分页数据配置参数2
            pageSize, //后端分页数据配置参数3
            showTotal: total => `合计 ${total} 条`
        },
    };

    //--------------查看-----------------
    const updateViewWindow = (status = true) => {
        dispatch({
            type : 'overHaulLog/updateState',
            payload : {
                viewItem: {
                    ...viewItem,
                    visible : status
                }
            }
        })
    }
    const viewItemProps = {
		updateWindow : updateViewWindow,
		getData,
        modalPropsItem:{
            title:`大修记录 > 查看`,
            visible: viewItem.visible,
            onCancel:() => updateViewWindow(false),
            width:800
        },
        contentProps:{
            ...viewItem,
            btnType : 'view'
        }
	}


    return (
        <div className="main_page">
            <VtxGrid
                titles={['设备编号', '设备名称', '起始时间']}
                gridweight={[1, 1, 2]}
                confirm={vtxGridParams.query}
                clear={vtxGridParams.clear}
            >
                {/*设备编号*/}
                <Input {...vtxGridParams.numProps}/>
                {/*设备名称*/}
                <Input {...vtxGridParams.nameProps}/>
                {/*起始日期*/}
                <VtxRangePicker {...vtxGridParams.timeProps}/>
            </VtxGrid>
            <div className="table-wrapper">
                <VtxDatagrid {...vtxDatagridProps} />
            </div>
            {/*查看*/}
            {viewItem.visible && <ViewItem {...viewItemProps}/>}
        </div>
    );

}
export default connect(({ overHaulLog, accessControlM }) => ({ overHaulLog, accessControlM}))(OverHaulLog);
