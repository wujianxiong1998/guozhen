/**
 * 养护记录
 * author : vtx sjb
 * createTime : 2019-6-13
 */
import React from 'react';
import { connect } from 'dva';
import moment from 'moment';

import { VtxDatagrid, VtxGrid, VtxDate, VtxExport } from 'vtx-ui';
import { Input, Button, Select, message, Modal } from 'antd';
const { VtxRangePicker } = VtxDate;
const {VtxExport2} = VtxExport;

import { handleColumns } from '../../utils/tools';
import { VtxUtil } from '../../utils/util';

function YearMaintainPlay({ dispatch, yearMaintainPlay }) {

    const { queryParams,
        currentPage, pageSize, loading, dataSource, total, selectedRowKeys,
	} = yearMaintainPlay;

    const ParamsUpdateState = (obj) => {
        dispatch({
            type : 'yearMaintainPlay/updateState',
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
            type : 'yearMaintainPlay/updateState',
            payload : {
                ...obj
            }
        })
    };

    // 更新表格数据
	const getList = () => {
		// dispatch({type : 'abnormalReportLog/updateQueryParams'});
		dispatch({type : 'yearMaintainPlay/getList'});
	}

    // 查询
	const vtxGridParams = {
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
		// 设备名称
        // nameProps: {
		// 	value: queryParams.name,
        //     onChange(e) {
		// 		ParamsUpdateState({name : e.target.value});
        //     },
        //     onPressEnter() {
		// 		getList();
		// 	},
        // },
        
        query() {
			getList();
		},

		clear() {
			dispatch({type : 'yearMaintainPlay/initQueryParams'});
			dispatch({type : 'yearMaintainPlay/getList'});
		}
    };

    // 列表
	const columns = [
        ['设备编号', 'code'],
        ['设备名称', 'name'],
        ['养护类型', 'typeStr'],
        ['养护期限', 'maintainDateStr'],
        ['养护部位', 'part'],
		['养护内容', 'content'],
		['责任人', 'chargeMan'],
	];
	let vtxDatagridProps = {
		columns : handleColumns(columns),
    	dataSource,
        indexColumn : true,
        indexTitle: '序号',
        startIndex : ( currentPage - 1 )*pageSize+1,
        autoFit:true,
        loading,
        rowSelection: {
            type: 'checkbox',
            selectedRowKeys: selectedRowKeys,
            onChange(selectedRowKeys) {
            	dispatch({
            		type: 'yearMaintainPlay/updateState',
            		payload: {
                		selectedRowKeys: selectedRowKeys,
            		}
        		})
            }
        },
        onChange(pagination, filters, sorter){
            dispatch({
            	type:'yearMaintainPlay/getList',
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

    // 导出配置____new
	const exportProps = {
		downloadURL:'/cloud/gzzhsw/api/cp/maintainYearPlan/exportExcel',
		getExportParams(exportType){
			let str =  [{'title':'设备编号','field': 'code'},
						{'title':'设备名称','field': 'name'},
						{'title':'养护类型','field': 'type'},
						{'title':'养护期限','field': 'maintainDateStr'},
						{'title':'养护部位','field': 'part'},
						{'title':'养护内容','field': 'content'},
						{'title':'责任人','field': 'chargeMan'},]
			const common = {
				tenantId : VtxUtil.getUrlParam('tenantId'),
				userId : VtxUtil.getUrlParam('userId'),
				columnJson : JSON.stringify(str),
				page: currentPage-1,
				size: pageSize,
				name: queryParams.name?queryParams.name:'',
				startTime: queryParams.startTime?queryParams.startTime:'',
				endTime: queryParams.endTime?queryParams.endTime:'',
				
			}
			switch (exportType){
				case 'rows':
					if(selectedRowKeys.length==0){
						message.warn('当前没有选中行');
						return null;
					}
					return {
						...common,
						ids: selectedRowKeys.join(',')
					};
				case 'page':
					return {
						...common,
						ids: dataSource.map((item)=>item.key).join(',')
					};
				case 'all':
					return {
						ids: '',
						...common,
					};
			}
		}
	}


    return (
        <div className="main_page">
            <VtxGrid
                titles={['养护期限']}
                gridweight={[2]}
                confirm={vtxGridParams.query}
                clear={vtxGridParams.clear}
            >
                {/*养护期限*/}
                <VtxRangePicker {...vtxGridParams.timeProps}/>
            </VtxGrid>
            <div className="table-wrapper">
                <div className="handle_box">
                    <VtxExport2 {...exportProps}/>
                </div>
                <div className="table-content">
                    <VtxDatagrid {...vtxDatagridProps} />
                </div>
            </div>
        </div>
    );

}
export default connect(({ yearMaintainPlay }) => ({ yearMaintainPlay }))(YearMaintainPlay);
