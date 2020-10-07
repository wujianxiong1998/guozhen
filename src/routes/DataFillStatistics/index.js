/**
 * 数据填报统计
 * author : vtx xxy
 * createTime : 2019-07-26 11:02:04
 */
import React from 'react';
import { connect } from 'dva';

import { VtxDatagrid, VtxGrid, VtxDate } from 'vtx-ui';
const { VtxRangePicker } = VtxDate;
import {  Button, Select } from 'antd';
const Option = Select.Option;
import styles from './index.less'
import { handleColumns, VtxTimeUtil } from '../../utils/tools';

function DataFillStatistics({ dispatch, dataFillStatistics }) {
	const {
		searchParams,
        waterFactorySelect, dataTypeSelect,
		currentPage, pageSize, loading, dataSource, total,
	} = dataFillStatistics;

	const updateState = (obj) => {
		dispatch({
			type : 'dataFillStatistics/updateState',
			payload : {
				...obj
			}
		})
	}

    // 更新表格数据
    const getList = () => {
    	dispatch({type : 'dataFillStatistics/updateQueryParams'});
    	dispatch({type : 'dataFillStatistics/getList'});
    }
    
    // 查询
    const vtxGridParams = {
        // 水厂名称
        waterFactoryIdProps : {
        	value : searchParams.waterFactoryId,
            placeholder : "请选择水厂名称",
            showSearch: true,
            optionFilterProp: 'children',
            onChange(value) {
        		updateState({
                    searchParams : {
                        waterFactoryId : value
                    }
                })
                getList();
            },
            allowClear : true,
            style : {
                width : '100%'
            }
        },
    
        // 时间
        startTimeProps : {
        	value : [searchParams.startTime, searchParams.endTime],
            onChange(date, dateString) {
        		updateState({
                    searchParams : {
                        startTime : dateString[0],
                        endTime : dateString[1]
                    }
                })
                getList();
            },
            style : {
                width : '100%'
            },
            disabledDate(current) {
                return current && VtxTimeUtil.isAfterDate(current);
            }
        },
    
        // 数据类型
        dataTypeProps : {
        	value : searchParams.dataType,
            placeholder : "请选择数据类型",
            onChange(value) {
        		updateState({
                    searchParams : {
                        dataType : value
                    }
                })
                getList();
            },
            allowClear : true,
            style : {
                width : '100%'
            }
        },
    
    	query() {
    		getList();
    	},
    
    	clear() {
    		dispatch({type : 'dataFillStatistics/initQueryParams'});
    		dispatch({type : 'dataFillStatistics/getList'});
    	}
    };

    // 列表
    const columns = [
        ['水厂名称', 'waterFactoryName'],
        ['数据类型', 'dataType'],
        ['数据日期', 'dateValue'],
        ['上报状态', 'dataStatus'],
        ['填报人', 'fillManName'],
        ['填报日期', 'fillDate'],
        ['审核人', 'auditManName'],
        ['审核日期', 'auditDate']
    ];
    let vtxDatagridProps = {
    	columns : handleColumns(columns),
    	dataSource,
    	indexColumn : true,
        startIndex : ( currentPage - 1 )*pageSize+1,
        autoFit:true,
        // headFootHeight : 150,
        loading,
        onChange(pagination, filters, sorter){
            dispatch({
            	type:'dataFillStatistics/getList',
            	payload : {
            		currentPage : pagination.current,
                	pageSize: pagination.pageSize
            	}
            })
        },
        pagination:{
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '30', '40','50'],
            showQuickJumper: true,
            current:currentPage,
            total:total,
            pageSize,
            showTotal: total => `合计 ${total} 条`
        },
    };

    
	return (
        <div className={styles.normal}>
            <VtxGrid
                titles={['水厂名称', '时间', '数据类型']}
                gridweight={[1, 2, 1]}
                confirm={vtxGridParams.query}
                clear={vtxGridParams.clear}
            >
                <Select {...vtxGridParams.waterFactoryIdProps}>
                    {waterFactorySelect.map(item => {
                        return <Option key={item.id}>{item.name}</Option>
                    })}
                </Select>
                <VtxRangePicker {...vtxGridParams.startTimeProps} />
                <Select {...vtxGridParams.dataTypeProps}>
                    {dataTypeSelect.map(item => {
                        return <Option key={item.value}>{item.text}</Option>
                    })}
                </Select>
            </VtxGrid>
            <div className={styles.normal_body}>
               
                <div className={styles.tableContainer}>
					<VtxDatagrid {...vtxDatagridProps}/>
				</div>
			</div>
        </div>
	)
}

export default connect(
	({dataFillStatistics}) => ({dataFillStatistics})
)(DataFillStatistics);