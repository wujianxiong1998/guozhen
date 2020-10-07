/**
 * 养护记录
 * author : vtx sjb
 * createTime : 2019-6-13
 */
import React from 'react';
import { connect } from 'dva';
import moment from 'moment';

import { VtxDatagrid, VtxGrid, VtxDate } from 'vtx-ui';
import { Input, Tooltip,Icon } from 'antd';
const { VtxRangePicker } = VtxDate;

import { handleColumns } from '../../utils/tools';
import ViewItem from './view';

function MaintainLog({ dispatch, maintainLog, accessControlM  }) {

    const { queryParams, viewItem, fileListVersion,
        currentPage, pageSize, loading, dataSource, total
    } = maintainLog;
    let buttonLimit = {};
    if (accessControlM['maintainLog'.toLowerCase()]) {
        buttonLimit = accessControlM['maintainLog'.toLowerCase()];
    }
    const ParamsUpdateState = (obj) => {
        dispatch({
            type : 'maintainLog/updateState',
            payload : {
                queryParams: {
                    ...queryParams,
                    ...obj
                }
            }
        })
    };

    const updateState = (obj) => {
        dispatch({
            type : 'maintainLog/updateState',
            payload : {
                ...obj
            }
        })
    };

    // 更新表格数据
	const getList = () => {
		dispatch({type : 'maintainLog/getList'});
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
			disabledDate(current) {
				return current && moment(moment(current).format('YYYY-MM-DD')).isAfter(moment().format('YYYY-MM-DD'));
			}
        },
        
        query() {
			getList();
		},

		clear() {
			dispatch({type : 'maintainLog/initQueryParams'});
			dispatch({type : 'maintainLog/getList'});
		}
    };

    // 列表
	const columns = [
        ['设备编号', 'code'],
        ['设备名称', 'deviceName'],
        ['责任人', 'repareMan'],
        ['实际养护人', 'actRepareMan'],
        ['计划完成时间', 'maintainPeriodStr'],
        ['实际完成时间', 'completeTimeStr'],
        ['养护类容', 'content'],
        ['状态', 'dataStatusStr', {render: (text, rowData) => {
            return (
                <div>
                    {rowData.dataStatus === -1 ? <span>
                        <Tooltip title={rowData.approveContent} trigger='click'>
                            <a>{text}</a>
                        </Tooltip>
                    </span> : <span>{text}</span>}
                </div>
            
            )
        }}],
        ['操作', 'action', { renderButtons : (text, record) => {
            let btns = [];
            if (buttonLimit['VIEW']) {
        	btns.push({
                name: <Icon type='view'
                    title='查看' />,
        		onClick(rowData) {
                    dispatch({
                        type : 'maintainLog/updateState',
                        payload : {
                            viewItem: {
								...rowData,
								visible: true,
								picIds: rowData.picIds?JSON.parse(rowData.picIds):[],
                            }
                        }
                    })
        		}
            });
        }
        	return btns;
		}, width : '120px'}]
	];
	let vtxDatagridProps = {
		columns : handleColumns(columns),
    	dataSource,
        indexColumn : true,
        indexTitle: '序号',
        startIndex : ( currentPage - 1 )*pageSize+1,
        autoFit:true,
        loading,
        onChange(pagination, filters, sorter){
            dispatch({
            	type:'maintainLog/getList',
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
            type : 'maintainLog/updateViewItem',
            payload : {
                visible : status
            }
        })
    }
    const viewItemProps = {
        updateWindow : updateViewWindow,
        fileListVersion,
        modalPropsItem:{
            title:`养护记录 > 查看`,
            visible: viewItem.visible,
            onCancel:() => updateViewWindow(false),
            width:900
        },
        contentProps:{
            ...viewItem,
            btnType : 'view'
        }
    }


    return (
        <div className="main_page">
            <VtxGrid
                titles={['设备编号', '设备名称', '起始日期']}
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
export default connect(({ maintainLog, accessControlM }) => ({ maintainLog, accessControlM}))(MaintainLog);
