import React from 'react';
import {connect} from 'dva';
import moment from 'moment';
import 'moment/locale/zh-cn';
import {VtxDatagrid, VtxGrid} from "vtx-ui";
import {Input, Button, Modal, message, Select, DatePicker, Icon} from "antd";
import Detail from './Detail';
import {delPopconfirm, VtxUtil} from "../../utils/util";

moment.locale('zh-cn');
const Option = Select.Option;
const {MonthPicker} = DatePicker;

class MonthlyReport extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    };
    
    componentDidMount() {
    
    }
    
    render() {
        const {dispatch, monthlyReportM, accessControlM, loading, submitLoading} = this.props;
        const {
            waterFactoryList, currentWaterFactoryId, currentDateValue, canSubmit,
            searchParams, gridParams, dataList, dataTotal,
            modalParams, initialIndicators, reasonList, regionalCompanyList,
            searchWaterList, isAdministrator
        } = monthlyReportM;
        const {regionalCompanyId, waterFactoryId, dateValue} = gridParams;
        const {page, size} = searchParams;
        const {type, visible, title, detail} = modalParams;
        const {workDayAndStopAnalysis, dealWaterAnalysis, waterInOutAnalysis, powerConsumeAnalysis, drugConsumeAndAnalysis, mudCakeAnalysis, processChange} = initialIndicators;
        
        let buttonLimit = {};
        if (accessControlM['monthlyReport'.toLowerCase()]) {
            buttonLimit = accessControlM['monthlyReport'.toLowerCase()]
        }
        //更改搜索条件
        const changeGridParams = (target, value) => {
            dispatch({
                type: 'monthlyReportM/updateGridParams',
                payload: {
                    [target]: value
                }
            })
        };
        const changeSearchParams = (target, value) => {
            dispatch({
                type: 'monthlyReportM/updateSearchParams',
                payload: {
                    [target]: value
                }
            })
        };
        //时间选择
        const DateProps = {
            style: {width: '400px'},
            allowClear: false,
            value: dateValue,
            disabledDate: (value) => {
                if (!value) {
                    return;
                }
                return value.valueOf() > moment().valueOf()
            },
            onChange: (date, dateString) => {
                changeGridParams('dateValue', date);
                changeSearchParams('dateValue', date);
                dispatch({type: 'monthlyReportM/pageList'})
            }
        };
        //更改参数
        const changeParams = (target, value) => {
            dispatch({
                type: 'monthlyReportM/updateState',
                payload: {
                    [target]: value
                }
            })
        };
        //列表配置
        const tableProps = {
            loading,
            columns: [{
                title: '水厂',
                dataIndex: 'waterFactoryName',
                key: 'waterFactoryName',
                nowrap: true
            }, {
                title: '时间',
                dataIndex: 'dateValue',
                key: 'dateValue',
                nowrap: true
            }, {
                title: '运营情况点评',
                dataIndex: 'workAssess',
                key: 'workAssess',
                nowrap: true
            }, {
                title: '操作',
                dataIndex: 'edit',
                key: 'edit',
                render: (text, rowData) => (
                    <span>
                        {(buttonLimit['VIEW'] || !!isAdministrator) && <Icon type='view'
                                                                             title='查看'
                                                                             onClick={() => {
                                                                                 updateModalParams('type', 'view');
                                                                                 dispatch({
                                                                                     type: 'monthlyReportM/getOne',
                                                                                     payload: {id: rowData.id}
                                                                                 })
                                                                             }}/>}
                        {
                            (rowData.fillStatus === 'audit_xj' || rowData.fillStatus === 'audit_unpass') &&
                            (buttonLimit['EDIT'] || !!isAdministrator) && <span>
                                <span className="ant-divider"/>
                                <Icon type='file-edit'
                                      title='编辑'
                                      onClick={() => {
                                          updateModalParams('type', 'edit');
                                          dispatch({type: 'monthlyReportM/getOne', payload: {id: rowData.id}})
                                      }}/>
                            </span>
                        }
                        {
                            rowData.fillStatus === 'audit_dsh' && (buttonLimit['EXAMINE'] || !!isAdministrator) &&
                            <span>
                                <span className="ant-divider"/>
                                <Icon type='examine'
                                      title='审核'
                                      onClick={() => {
                                          updateModalParams('type', 'examine');
                                          dispatch({type: 'monthlyReportM/getOne', payload: {id: rowData.id}})
                                      }}/>
                            </span>
                        }
                        {
                            (rowData.fillStatus === 'audit_xj' || rowData.fillStatus === 'audit_unpass') &&
                            (buttonLimit['DELETE'] || !!isAdministrator) && <span>
                                <span className="ant-divider"/>
                                {
                                    delPopconfirm(() => dispatch({
                                        type: 'monthlyReportM/deleteEntity',
                                        payload: {ids: rowData.id}
                                    }))
                                }
                            </span>
                        }
                    </span>
                )
            }],
            dataSource: dataList,
            rowKey: record => record.id,
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
                total: dataTotal,
                pageSize: size,
                // 当前页码改变的回调
                onChange(page, pageSize) {
                    changeSearchParams('page', page - 1);
                    changeSearchParams('size', pageSize);
                    dispatch({
                        type: 'monthlyReportM/updateState',
                        payload: {gridParams: {...gridParams, ...searchParams}}
                    });
                    dispatch({type: 'monthlyReportM/pageList'})
                },
                // size 变化的回调
                onShowSizeChange(current, size) {
                    changeSearchParams('page', current - 1);
                    changeSearchParams('size', size);
                    dispatch({
                        type: 'monthlyReportM/updateState',
                        payload: {gridParams: {...gridParams, ...searchParams}}
                    });
                    dispatch({type: 'monthlyReportM/pageList'})
                },
                showTotal: total => `合计 ${total} 条`
            },
            // rowSelection: {
            //     type: 'checkbox',
            //     selectedRowKeys: delIds,
            //     onChange: (selectedRowKeys, selectedRows) => dispatch({
            //         type: 'monthlyReportM/updateState',
            //         payload: {delIds: selectedRowKeys}
            //     })
            // }
        };
        //新增或编辑
        const handle = (type) => {
            if (!canSubmit) {
                return;
            }
            const childForm = this.modalForm.getForm();
            const values = childForm.getFieldsValue();
            let params = {
                waterFactoryId: values.waterFactoryId,
                dateValue: values.dateValue.format('YYYY-MM'),
                tenantId: VtxUtil.getUrlParam('tenantId'),
                workDayAndStopAnalysis: {
                    normalDays: values.normalDays || workDayAndStopAnalysis.normalDays,
                    problemReason: values.problemReason || workDayAndStopAnalysis.problemReason,
                    produceProblem: values.produceProblem || workDayAndStopAnalysis.produceProblem,
                    stopHour: values.stopHour || workDayAndStopAnalysis.stopHour,
                    stopReason: values.stopReason || workDayAndStopAnalysis.stopReason,
                    workDayTotal: values.workDayTotal || workDayAndStopAnalysis.workDayTotal,
                },
                dealWaterAnalysis: {
                    dealWater: values.dealWater || dealWaterAnalysis.dealWater,
                    planDealWater: values.planDealWater || dealWaterAnalysis.planDealWater,
                    avgDealWater: values.avgDealWater || dealWaterAnalysis.avgDealWater,
                    avgPlanDealWater: values.avgPlanDealWater || dealWaterAnalysis.avgPlanDealWater,
                    reason: values.reason || dealWaterAnalysis.reason,
                },
                waterInOutAnalysis: {
                    inWaterOverDays: values.inWaterOverDays || waterInOutAnalysis.inWaterOverDays,
                    inWaterOverReason: values.inWaterOverReason || waterInOutAnalysis.inWaterOverReason,
                    inWaterPer: values.inWaterPer || waterInOutAnalysis.inWaterPer,
                    outWaterOverDays: values.outWaterOverDays || waterInOutAnalysis.outWaterOverDays,
                    outWaterOverReason: values.outWaterOverReason || waterInOutAnalysis.outWaterOverReason,
                    outWaterPer: values.outWaterPer || waterInOutAnalysis.outWaterPer,
                },
                powerConsumeAnalysis: {
                    powerBias: values.powerBias || powerConsumeAnalysis.powerBias,
                    powerConsume: values.powerConsume || powerConsumeAnalysis.powerConsume,
                    powerPlanConsume: values.powerPlanConsume || powerConsumeAnalysis.powerPlanConsume,
                    powerRealConsume: values.powerRealConsume || powerConsumeAnalysis.powerRealConsume,
                    powerBiasReason: values.powerBiasReason || powerConsumeAnalysis.powerBiasReason,
                },
                drugConsumeAndAnalysis: JSON.stringify(JSON.parse(initialIndicators.drugConsumeAndAnalysis).map(item => {
                    return {
                        id: item.id,
                        reason: values[item.id] || item.reason,
                        name: JSON.stringify(JSON.parse(item.name).map(each => {
                            return {
                                id: each.id,
                                name: each.name,
                                value: values[each.id] || each.value
                            }
                        }))
                    }
                })),
                mudCakeAnalysis: {
                    mudCakeBias: values.mudCakeBias || mudCakeAnalysis.mudCakeBias,
                    planProducePer: values.planProducePer || mudCakeAnalysis.planProducePer,
                    produceAvg: values.produceAvg || mudCakeAnalysis.produceAvg,
                    produceMudCake: values.produceMudCake || mudCakeAnalysis.produceMudCake,
                    producePer: values.producePer || mudCakeAnalysis.producePer,
                    workTime: values.workTime || mudCakeAnalysis.workTime,
                    mudCakeBiasAnalysis: values.mudCakeBiasAnalysis || mudCakeAnalysis.mudCakeBiasAnalysis,
                },
                processChange: {
                    data: [
                        {totalContent: values.totalContent || processChange.data[0].totalContent},
                        {
                            mudTarget: JSON.stringify(JSON.parse(initialIndicators.processChange.data[1].mudTarget).map(item => {
                                return {
                                    id: item.id,
                                    name: item.name,
                                    max: values[`${item.id}max`] || item.max,
                                    min: values[`${item.id}min`] || item.min,
                                    avg: values[`${item.id}avg`] || item.avg,
                                }
                            })),
                            mudReason: values.mudTargetReason || processChange.data[1].mudReason
                        },
                        {
                            doTarget: JSON.stringify(JSON.parse(initialIndicators.processChange.data[2].doTarget).map(item => {
                                return {
                                    id: item.id,
                                    name: item.name,
                                    max: values[`${item.id}max`] || item.max,
                                    min: values[`${item.id}min`] || item.min,
                                    avg: values[`${item.id}avg`] || item.avg,
                                }
                            })),
                            doReason: values.doTargetReason || processChange.data[2].doReason
                        },
                        {gzwContent: values.gzwContent || processChange.data[3].gzwContent},
                        {wnjjContent: values.wnjjContent || processChange.data[4].wnjjContent}
                    ]
                }
            };
            if (type === 'submit') {
                childForm.validateFieldsAndScroll((err, values) => {
                    if (err) {
                        message.warn("存在未填写或错误字段，无法提交");
                        return;
                    }
                    params.fillStatus = 'audit_dsh';
                    dispatch({
                        type: 'monthlyReportM/saveOredit',
                        payload: {
                            values: {...params},
                            onComplete: () => {
                                message.success('提交成功');
                                dispatch({type: 'monthlyReportM/pageList'});
                                closeModal()
                            }
                        }
                    })
                });
            } else {
                if (!childForm.getFieldValue('waterFactoryId')) {
                    childForm.setFields({'waterFactoryId': {errors: ['必填项']}});
                    return;
                }
                if (!childForm.getFieldValue('dateValue')) {
                    childForm.setFields({'dateValue': {errors: ['必填项']}});
                    return;
                }
                params.fillStatus = 'audit_xj';
                dispatch({
                    type: 'monthlyReportM/saveOredit',
                    payload: {
                        values: {...params},
                        onComplete: () => {
                            message.success('保存成功');
                            dispatch({type: 'monthlyReportM/pageList'});
                            closeModal()
                        }
                    }
                })
            }
        };
        //审核
        const audit = (type) => {
            const childForm = this.modalForm.getForm();
            if (!childForm.getFieldValue('workAssess')) {
                childForm.setFields({'workAssess': {errors: ['必填项']}});
                return;
            }
            const params = {
                userId: VtxUtil.getUrlParam('userId'),
                id: initialIndicators.id,
                fillStatus: type,
                workAssess: childForm.getFieldValue('workAssess')
            };
            dispatch({
                type: 'monthlyReportM/audit',
                payload: {
                    values: {...params},
                    onComplete: () => {
                        message.success('审核成功');
                        dispatch({type: 'monthlyReportM/pageList'});
                        closeModal()
                    }
                }
            })
        };
        //关闭模态框
        const closeModal = () => {
            const childForm = this.modalForm.getForm();
            dispatch({type: 'monthlyReportM/clearModalParams'});
            childForm.setFields({'waterFactoryId': {errors: null}});
            childForm.setFields({'dateValue': {errors: null}});
            changeParams('currentWaterFactoryId', waterFactoryList[0].id);
            changeParams('currentDateValue', moment());
            changeParams('workAssess', '');
            changeParams('canSubmit', false);
            childForm.resetFields();
        };
        //更改模态框相关配置
        const updateModalParams = (target, value) => {
            dispatch({
                type: 'monthlyReportM/updateModalParams',
                payload: {
                    [target]: value
                }
            })
        };
        //模态框配置
        const modalProps = {
            visible,
            title,
            maskClosable: false,
            width: '100%',
            footer: null,
            onCancel: () => closeModal()
        };
        //模态框内容配置
        const detailProps = {
            type,
            detail,
            waterFactoryList,
            currentWaterFactoryId,
            currentDateValue,
            canSubmit,
            initialIndicators,
            reasonList,
            submitLoading,
            handle,
            audit,
            wheatherExit: () => dispatch({type: 'monthlyReportM/wheatherExit'}),
            getOne: () => dispatch({type: 'monthlyReportM/getOne'}),
            changeWaterFactory: (value) => {
                changeParams('currentWaterFactoryId', value);
                if (!!currentDateValue) {
                    dispatch({type: 'monthlyReportM/wheatherExit'})
                }
            },
            changeDate: (value) => {
                changeParams('currentDateValue', value);
                if (!!currentWaterFactoryId) {
                    dispatch({type: 'monthlyReportM/wheatherExit'})
                }
            },
            wrappedComponentRef: dom => this.modalForm = dom
        };
        
        return (
            <div className="main_page">
                <VtxGrid titles={['区域公司', '水厂', '日期']}
                         gridweight={[1, 1, 1]}
                         confirm={() => dispatch({type: 'monthlyReportM/pageList'})}
                         clear={() => {
                             dispatch({type: 'monthlyReportM/clearGridParams'});
                             dispatch({type: 'monthlyReportM/clearSearchParams'});
                             dispatch({type: 'monthlyReportM/pageList'})
                         }}>
                    <Select style={{width: '100%'}}
                            value={regionalCompanyId}
                            onChange={(value) => {
                                changeGridParams('regionalCompanyId', value);
                                changeSearchParams('regionalCompanyId', value);
                                dispatch({
                                    type: 'monthlyReportM/getFactoryListWithRegional',
                                    payload: {regionalCompanyId: value}
                                });
                            }}>
                        {regionalCompanyList.map(item => (
                            <Option key={item.id} value={item.id}>{item.name}</Option>
                        ))}
                    </Select>
                    <Select style={{width: '100%'}}
                            value={waterFactoryId}
                            onChange={(value) => {
                                changeGridParams('waterFactoryId', value);
                                changeSearchParams('waterFactoryId', value);
                                dispatch({type: 'monthlyReportM/pageList'})
                            }}>
                        {searchWaterList.map(item => (
                            <Option key={item.id} value={item.id}>{item.name}</Option>
                        ))}
                    </Select>
                    <MonthPicker {...DateProps}/>
                </VtxGrid>
                <div className="table-wrapper">
                    <div className="handle_box">
                        {(buttonLimit['ADD'] || !!isAdministrator) && <Button icon="file-add"
                                                                              onClick={() => {
                                                                                  updateModalParams('type', 'add');
                                                                                  updateModalParams('visible', true);
                                                                                  updateModalParams('title', '月报填报>新增');
                                                                              }}>新增</Button>}
                    </div>
                    <div className='table-content'>
                        <VtxDatagrid {...tableProps} />
                    </div>
                </div>
                {!!visible && <Modal className="monthly_report bigModal" {...modalProps}>
                    <Detail {...detailProps}/>
                </Modal>}
            </div>
        );
    };
}

const monthlyReportProps = (state) => {
    return {
        monthlyReportM: state.monthlyReportM,
        accessControlM: state.accessControlM,
        loading: state.loading.effects['monthlyReportM/pageList'] || state.loading.effects['monthlyReportM/loadWaterFactorySelect'] || state.loading.effects['monthlyReportM/getDetail'],
        submitLoading: state.loading.effects['monthlyReportM/saveOredit']
    };
};

export default connect(monthlyReportProps)(MonthlyReport);
