/**
 * 数据上报审核及时率
 * author : vtx xxy
 * createTime : 2019-08-07 11:52
 */
import React from 'react';
import { connect } from 'dva';

import { VtxDatagrid, VtxGrid, VtxDate } from 'vtx-ui';
const { VtxMonthPicker } = VtxDate;
import moment from 'moment'
import {  Button, Select,message } from 'antd';
const Option = Select.Option;
import styles from './index.less'
import { VtxTimeUtil } from '../../utils/tools';

function DataReportIntime({ dispatch, dataReportIntime }) {
	const {
		searchParams,
        waterFactorySelect,
		currentPage, pageSize, loading, dataSource, total,
	} = dataReportIntime;

	const updateState = (obj) => {
		dispatch({
			type : 'dataReportIntime/updateState',
			payload : {
				...obj
			}
		})
	}

    // 更新表格数据
    const getList = () => {
            dispatch({ type: 'dataReportIntime/updateQueryParams' });
            dispatch({ type: 'dataReportIntime/getList' });
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
        startTimeProps: {
            value: searchParams.startTime,
            onChange(date, dateString) {
                updateState({
                    searchParams: {
                        startTime: dateString,
                    }
                })
                // if (moment(dateString).isSameOrBefore(moment(searchParams.endTime))) {
                    getList()
                // }

            },
            style: {
                width: '45%'
            },
            disabledDate(current) {
                return current && (VtxTimeUtil.isAfterDate(current) || moment(current).isAfter(moment(searchParams.endTime)));
            }
        },
        endTimeProps: {
            value: searchParams.endTime,
            onChange(date, dateString) {
                updateState({
                    searchParams: {
                        endTime: dateString
                    }
                })
                // if (moment(dateString).isSameOrAfter(moment(searchParams.startTime))) {
                    getList()
                // }

            },
            style: {
                width: '45%'
            },
            disabledDate(current) {
                return current && (VtxTimeUtil.isAfterDate(current) || moment(current).isBefore(moment(searchParams.startTime)));
            }
        },
    
    	query() {
    		getList();
    	},
    
    	clear() {
    		dispatch({type : 'dataReportIntime/initQueryParams'});
    		dispatch({type : 'dataReportIntime/getList'});
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
            title:'上报及时率',
            dataIndex:'produceApply',
            key:'produceApply'
        }]
    },{
        title:'生产数据',
        children:[{
            title:'审核及时率',
            dataIndex:'produceAudit',
            key:'produceAudit'
        }]
    },{
        title: '化验数据',
        children: [{
            title: '上报及时率',
            dataIndex: 'assayApply',
            key: 'assayApply'
        }]
    },{
        title:'化验数据',
        children:[{
            title:'审核及时率',
            dataIndex:'assayAudit',
            key:'assayAudit'
        }]
    },{
        title: '单耗数据',
        children: [{
            title: '上报及时率',
            dataIndex: 'consumApply',
            key: 'consumApply'
        }]
    },{
        title: '单耗数据',
        children: [{
            title: '审核及时率',
            dataIndex: 'consumAudit',
            key: 'consumAudit'
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
            	type:'dataReportIntime/getList',
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
                <span>
                    <VtxMonthPicker {...vtxGridParams.startTimeProps} />
                    ~
                        <VtxMonthPicker {...vtxGridParams.endTimeProps} />
                </span>
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
	({dataReportIntime}) => ({dataReportIntime})
)(DataReportIntime);