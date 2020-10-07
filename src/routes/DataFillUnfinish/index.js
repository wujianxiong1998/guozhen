/**
 * 数据填报未完成任务
 * author : vtx xxy
 * createTime : 2019-08-07 11:52
 */
import React from 'react';
import { connect } from 'dva';

import { VtxDatagrid, VtxGrid, VtxDate } from 'vtx-ui';
const { VtxRangePicker } = VtxDate;
import {  Button, Select } from 'antd';
const Option = Select.Option;
import styles from './index.less'
import { handleColumns, VtxTimeUtil } from '../../utils/tools';

function DataFillUnfinish({ dispatch, dataFillUnfinish }) {
	const {
		searchParams,
        waterFactorySelect,
		currentPage, pageSize, loading, dataSource, total,
	} = dataFillUnfinish;

	const updateState = (obj) => {
		dispatch({
			type : 'dataFillUnfinish/updateState',
			payload : {
				...obj
			}
		})
	}

    // 更新表格数据
    const getList = () => {
    	dispatch({type : 'dataFillUnfinish/updateQueryParams'});
    	dispatch({type : 'dataFillUnfinish/getList'});
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
    
    
    	query() {
    		getList();
    	},
    
    	clear() {
    		dispatch({type : 'dataFillUnfinish/initQueryParams'});
    		dispatch({type : 'dataFillUnfinish/getList'});
    	}
    };
    
    // 列表
    const columns =[{
        title: '',
        children:[{
            title:'水厂名称',
            dataIndex:'waterFactoryName',
            key:'waterFactoryName'
        }]
    },{
        title:'生产数据',
        children:[{
            title:'未完成日期',
            dataIndex:'produce',
            key:'produce'
        }]
    },{
        title:'生产数据',
        children:[{
            title:'状态',
            dataIndex:'produceStatus',
            key:'produceStatus'
        }]
    },{
        title: '化验数据',
        children: [{
            title: '未完成日期',
            dataIndex: 'assay',
            key: 'assay'
        }]
    },{
        title:'化验数据',
        children:[{
            title:'状态',
            dataIndex:'assayStatus',
            key:'assayStatus'
        }]
    },{
        title: '单耗数据',
        children: [{
            title: '未完成日期',
            dataIndex: 'consum',
            key: 'consum'
        }]
    },{
        title: '单耗数据',
        children: [{
            title: '状态',
            dataIndex: 'consumStatus',
            key: 'consumStatus'
        }]
    }]
    let vtxDatagridProps = {
    	columns,
        dataSource,
        bordered:true,
    	indexColumn : true,
        startIndex : ( currentPage - 1 )*pageSize+1,
        autoFit:true,
        // headFootHeight : 150,
        loading,
        onChange(pagination, filters, sorter){
            dispatch({
            	type:'dataFillUnfinish/getList',
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
                titles={['水厂名称', '时间']}
                gridweight={[1, 2]}
                confirm={vtxGridParams.query}
                clear={vtxGridParams.clear}
            >
                <Select {...vtxGridParams.waterFactoryIdProps}>
                    {waterFactorySelect.map(item => {
                        return <Option key={item.id}>{item.name}</Option>
                    })}
                </Select>
                <VtxRangePicker {...vtxGridParams.startTimeProps} />
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
	({dataFillUnfinish}) => ({dataFillUnfinish})
)(DataFillUnfinish);