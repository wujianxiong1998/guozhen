import React from 'react';
import { Form, Input, Button, Select, InputNumber, Table, Collapse, Modal, TreeSelect, message, Tabs } from 'antd';
import { VtxModal, VtxModalList, VtxDate, VtxCombogrid, VtxUpload, VtxDatagrid } from 'vtx-ui';
const Option = Select.Option;
const { Panel } = Collapse;
const {VtxDatePicker} = VtxDate;
import _ from 'lodash';
import moment from 'moment';
import { VtxUtil } from "../../utils/util";

import 'moment/locale/zh-cn';
import BaseInfo from './detailComponents/BaseInfo';
import SpareParts from './detailComponents/SpareParts';
import TechnicalParameter from './detailComponents/TechnicalParameter';
import {formStyle_8, formStyle_4, PositiveInteger, emptyInput} from '../../utils/util';

moment.locale('zh-cn');
const TabPane = Tabs.TabPane;

class AddItem extends React.Component {
    constructor(props){
        super(props);
        this.lis1 = null;
    }

    getForm = () => {
        return this.props.form;
    };

    // componentDidMount() {
    //     const {getFieldDecorator} = this.props;
    //     getFieldDecorator('actManId');
    // }

    render() {
        let { 
            modalPropsItem, contentProps, fileListVersion, userList,
            waterFactoryList, detail, type, checkName, equipmentStatus, equipmentTypes, structureList, getStructuresList, equipmentGrades,
            manufacturerList, equipmentSelectList, equipmentSelectTotal, getEquipmentList, clearEquipmentList, getManufacturerList, changeDetail,
            sparePartsParams, updateSparePartsParams, getSparePartsList, sparePartsLoading, technicalParameterParams, updateTechnicalParameterParams,
            changeParams, changeTab, detailRepair, repairListLoading, maintainRepair, maintainListLoading
        } = this.props;
        let { title, visible, onCancel, width } = modalPropsItem;
        let { id, gdCode, structuresId, structuresName, deviceId, name, code, planDateStr, planMoney, reason, specificThing, chargeManName, chargeManId, 
            actMoney, actStartDay, actEndDay, actManId, actManName, details, picIds,
            modelLonding, updateItem, onSave, onUpdate, } = contentProps;
        
        // const {waterFactoryList, detail, type, checkName, equipmentStatus, equipmentTypes, structureList, getStructuresList, equipmentGrades,
        //     manufacturerList, equipmentSelectList, equipmentSelectTotal, getEquipmentList, clearEquipmentList, getManufacturerList, changeDetail,
        //     sparePartsParams, updateSparePartsParams, getSparePartsList, sparePartsLoading, technicalParameterParams, updateTechnicalParameterParams,
        //     changeParams, changeTab, detailRepair, repairListLoading, maintainRepair, maintainListLoading} = this.props;
        const {getFieldDecorator, setFieldsValue, getFieldValue, setFields} = this.props.form;
        let modalProps = {
            title: id?`${title} > 编辑`:`${title} > 新增`,
            visible: visible,
            footer: <div>
                <Button type='default' onClick={onCancel}>取消</Button>
                <Button type='primary' loading={modelLonding} onClick={() => {
                    Promise.all([
                        this.lis1.submit(),
                    ]).then(data => {
                        if (data.indexOf(false) === -1) {
                            if (id) {
                                onUpdate(0);
                            } else {
                                onSave(0);
                            }
                        }
                    })
                }}>保存</Button>
                <Button type='primary' loading={modelLonding} onClick={() => {
                    Promise.all([
                        this.lis1.submit(),
                    ]).then(data => {
                        if (data.indexOf(false) === -1) {
                            if (id) {
                                onUpdate(1);
                            } else {
                                onSave(1);
                            }
                        }
                    })
                }}>保存并提交</Button>
            </div>,
            onCancel: onCancel,
            width: width
        };

        let modallistProps = {
            visible: visible,
            isRequired: true,
        };


        let uploadProps11 = (name,fieldCode,photoIds,require = true)=>{
            return {
                action:"/cloudFile/common/uploadFile",
                downLoadURL:'/cloudFile/common/downloadFile?id=',
                "data-modallist":{
                    layout:{
                        width:100,
                        name,
                        // require
                    },
                    regexp:{
                        value:photoIds
                    }
                },
                listType:"text",
                mode:'multiple',
                onSuccess(file){
                    photoIds.push({id: file.id, name: file.name});
                    updateItem({[fieldCode]: photoIds})
                },
                onRemove(file){
                    let ph = photoIds.filter(item => item.id !== file.id);
                    updateItem({[fieldCode]: ph})
                },
                fileList:photoIds?photoIds:[],
                // accept:'image/png, image/jpeg, image/jpg',
                fileListVersion,
            }
        }


        //基本信息
        const baseInfoProps = {
            getFieldDecorator,
            setFieldsValue,
            getFieldValue,
            setFields,
            type,
            detail,
            checkName,
            equipmentStatus,
            equipmentTypes,
            waterFactoryList,
            structureList,
            getStructuresList,
            equipmentGrades,
            manufacturerList,
            equipmentSelect: {
                clear: () => clearEquipmentList(),
                search: (form, pagination) => getEquipmentList(form.name, pagination.currentPage - 1, pagination.pageSize),
                selectRow: (rows) => {
                    if (rows.id !== detail.id) {
                        setFieldsValue({'parentId': rows.id});
                        setFieldsValue({'parentName': rows.name})
                    } else {
                        message.info('不能选择当前设备')
                    }
                },
                name: '设备名称',
                tableCfg: {
                    tableData: equipmentSelectList,
                    tableColumns: [{
                        title: '设备编号',
                        dataIndex: 'code',
                        key: 'code'
                    }, {
                        title: '设备名称',
                        dataIndex: 'name',
                        key: 'name'
                    }],
                    total: equipmentSelectTotal,
                    rowKey: record => record.id,
                },
                formCfg: [
                    {name: '设备名称', type: 'input', key: 'name'},
                ]
            },
            getManufacturerList,
            changeDetail
        };
        //备品备件
        const sparePartsProps = {
            type,
            sparePartsLoading,
            ...sparePartsParams,
            updateSparePartsParams,
            getSparePartsList
        };
        //技术参数
        const technicalParameterProps = {
            type,
            ...technicalParameterParams,
            updateTechnicalParameterParams
        };
        //文件上传
        // const fileProps = {
        //     action: "/cloudFile/common/uploadFile",
        //     downLoadURL: '/cloudFile/common/downloadFile?id=',
        //     multiple: false,
        //     listType: "text",
        //     viewMode: type === 'view',
        //     fileList: !!detail.fileIds ? JSON.parse(detail.fileIds) : [],
        //     onSuccess: (file) => {
        //         let result = !!detail.fileIds ? JSON.parse(detail.fileIds) : [];
        //         result.push({id: file.id, name: file.name});
        //         changeDetail('fileIds', JSON.stringify(result))
        //     },
        //     onRemove: (file) => {
        //         let result = !!detail.fileIds ? JSON.parse(detail.fileIds) : [];
        //         changeDetail('fileIds', JSON.stringify(result.map(item => {
        //             if (item.id !== file.id) {
        //                 return item
        //             }
        //         }).filter(item => !!item)))
        //     },
        // };
        //维修信息
        const repairTableProps = {
            loading: repairListLoading,
            columns: [{
                title: '设备编号',
                dataIndex: 'deviceCode',
                key: 'deviceCode'
            }, {
                title: '设备名称',
                dataIndex: 'deviceName',
                key: 'deviceName'
            }, {
                title: '上报人',
                dataIndex: 'reportMan',
                key: 'reportMan'
            }, {
                title: '故障类型',
                dataIndex: 'faultTypeName',
                key: 'faultTypeName'
            }, {
                title: '故障详情',
                dataIndex: 'details',
                key: 'details'
            }, {
                title: '上报时间',
                dataIndex: 'breakdownTimeStr',
                key: 'breakdownTimeStr'
            }, {
                title: '维修人员',
                dataIndex: 'repareMan',
                key: 'repareMan'
            }, {
                title: '完成时间',
                dataIndex: 'completeTimeStr',
                key: 'completeTimeStr'
            }, {
                title: '维修费用',
                dataIndex: 'reparePrice',
                key: 'reparePrice'
            }, {
                title: '状态',
                dataIndex: 'dealStatusStr',
                key: 'dealStatusStr'
            }],
            dataSource: detailRepair.list,
            rowKey: record => record.id,
            indexColumn: true,
            autoFit: true,
            scroll: {
                x: 750,
            },
            startIndex: detailRepair.page * detailRepair.size + 1, //后端分页
            indexTitle: '序号',
            pagination: {
                showSizeChanger: true,
                showQuickJumper: true,
                current: detailRepair.page + 1,
                total: detailRepair.listTotal,
                pageSize: detailRepair.size,
                // 当前页码改变的回调
                onChange(page, pageSize) {
                    changeParams('detailRepair', {
                        page: page - 1,
                        size: pageSize,
                        list: detailRepair.list,
                        listTotal: detailRepair.listTotal
                    });
                    changeTab('repair')
                },
                // size 变化的回调
                onShowSizeChange(current, size) {
                    changeParams('detailRepair', {
                        page: current - 1,
                        size: size,
                        list: detailRepair.list,
                        listTotal: detailRepair.listTotal
                    });
                    changeTab('repair')
                },
                showTotal: total => `合计 ${total} 条`
            }
        };
        //养护信息
        const maintainTableProps = {
            loading: maintainListLoading,
            columns: [{
                title: '设备编号',
                dataIndex: 'deviceCode',
                key: 'deviceCode'
            }, {
                title: '设备名称',
                dataIndex: 'deviceName',
                key: 'deviceName'
            }, {
                title: '责任人',
                dataIndex: 'typeStr',
                key: 'typeStr'
            }, {
                title: '养护人',
                dataIndex: 'repareMan',
                key: 'repareMan'
            }, {
                title: '实际养护人',
                dataIndex: 'actRepareMan',
                key: 'actRepareMan'
            }, {
                title: '计划完成时间',
                dataIndex: 'maintainPeriodStr',
                key: 'maintainPeriodStr'
            }, {
                title: '实际完成时间',
                dataIndex: 'completeTimeStr',
                key: 'completeTimeStr'
            }, {
                title: '养护内容',
                dataIndex: 'content',
                key: 'content'
            }, {
                title: '状态',
                dataIndex: 'maintainStatusStr',
                key: 'maintainStatusStr'
            }],
            dataSource: maintainRepair.list,
            rowKey: record => record.id,
            indexColumn: true,
            autoFit: true,
            scroll: {
                x: 750,
            },
            startIndex: maintainRepair.page * maintainRepair.size + 1, //后端分页
            indexTitle: '序号',
            pagination: {
                showSizeChanger: true,
                showQuickJumper: true,
                current: maintainRepair.page + 1,
                total: maintainRepair.listTotal,
                pageSize: maintainRepair.size,
                // 当前页码改变的回调
                onChange(page, pageSize) {
                    changeParams('maintainRepair', {
                        page: page - 1,
                        size: pageSize,
                        list: maintainRepair.list,
                        listTotal: maintainRepair.listTotal
                    });
                    changeTab('repair')
                },
                // size 变化的回调
                onShowSizeChange(current, size) {
                    changeParams('maintainRepair', {
                        page: current - 1,
                        size: size,
                        list: maintainRepair.list,
                        listTotal: maintainRepair.listTotal
                    });
                    changeTab('repair')
                },
                showTotal: total => `合计 ${total} 条`
            }
        };

        //选择人员
        const peopleSelect = {
            style: {width: '100%'},
            treeData: userList,
            treeDefaultExpandAll: true,
            showSearch: true,
            dropdownStyle: {
                maxHeight: 400,
                overflow: 'auto'
            },
            onChange: (value, label, extra) => {
                if (!!value) {
                    setFieldsValue({'actManId': extra.triggerNode.props.eventKey})
                } else {
                    setFieldsValue({'actManId': ''})
                }
            }
        };

        return (
            <Tabs defaultActiveKey="2">
                <Form className="main_page">
                <TabPane tab="新增台账" key="1">
                    
                    <Collapse defaultActiveKey={['1']}>
                        <Panel header="基本信息" key="1">
                            <BaseInfo {...baseInfoProps}/>
                        </Panel>
                        <Panel header="备品备件" key="2">
                            <SpareParts {...sparePartsProps}/>
                        </Panel>
                        <Panel header="技术参数" key="3">
                            <TechnicalParameter {...technicalParameterProps}/>
                        </Panel>
                        <Panel header="技术文档" key="4">
                            {/* {type === 'view' && !detail.fileIds ?
                                <span style={{marginLeft: '20px'}}>暂无</span> :
                                <VtxUpload {...fileProps}/>} */}
                        </Panel>
                    </Collapse>
                </TabPane>
                
                <TabPane tab="回单填写" key="2">
                    {/* <VtxModal {...modalProps}> */}
                        <Collapse bordered={false} defaultActiveKey={['1', '2']}>
                        <Panel header="基本信息" key="1">
                            <VtxModalList {...modallistProps} ref={(lis) => this.lis1 = lis}>
                                <div data-modallist={{layout:{width:50,name:'工单编号',type:'text'}}}>{gdCode}</div>
                                <div data-modallist={{layout:{width:50,name:'安装位置',type:'text'}}}>{structuresName}</div>
                                <div data-modallist={{layout:{width:50,name:'设备名称',type:'text'}}}>{name}</div>
                                <div data-modallist={{layout:{width:50,name:'设备编码',type:'text'}}}>{code}</div>
                                <div data-modallist={{layout:{width:50,name:'计划执行时间',type:'text'}}}>{planDateStr}</div>
                                <div data-modallist={{layout:{width:50,name:'负责人',type:'text'}}}>{chargeManName}</div>
                                <div data-modallist={{layout:{width:50,name:'预算总价（万元）',type:'text'}}}>{planMoney}</div>
                                <Input
                                    data-modallist={{
                                        layout: {width: 50,name: '实际费用（万元）',require: true},
                                        regexp: {
                                            value: actMoney,
                                            exp:/^[1-9]\d*(\.\d{1,4})?$/,
                                            errorMsg:'必须输入正确金额',
                                        }
                                    }}
                                    value={actMoney}
                                    addonAfter="万元"
                                    onChange={e=>updateItem({actMoney:e.target.value})}
                                />
                                <VtxDatePicker 
                                    data-modallist={{
                                        layout:{width:50,name:'开始时间',require:true},
                                        regexp:{
                                            value:actStartDay
                                        }
                                    }}
                                    value={actStartDay}
                                    showTime={true}
                                    onChange={(date,dateString)=>updateItem({actStartDay: dateString})}
                                    // disabledDate={date=>{
                                    //     if(actStartDay && date){
                                    //         return date.valueOf() > moment(actStartDay).valueOf()
                                    //     }
                                    //     return false
                                    // }}
                                />
                                <VtxDatePicker 
                                    data-modallist={{
                                        layout:{width:50,name:'完成时间',require:true},
                                        regexp:{
                                            value:actEndDay
                                        }
                                    }}
                                    value={actEndDay}
                                    showTime={true}
                                    onChange={(date,dateString)=>updateItem({actEndDay: dateString})}
                                    // disabledDate={date=>{
                                    //     if(actEndDay && date){
                                    //         return date.valueOf() > moment(actEndDay).valueOf()
                                    //     }
                                    //     return false
                                    // }}
                                />
                                <TreeSelect 
                                    data-modallist={{
                                        layout: {width: 50,name: '执行人111',require: true},
                                        regexp: {
                                            value: actManId
                                        }
                                    }}
                                    value={actManId}
                                    treeData={userList}
                                    treeDefaultExpandAll={true}
                                    showSearch={true}
                                    dropdownStyle={{
                                        maxHeight: 400,
                                        overflow: 'auto'
                                    }}
                                    onChange={(value, label, extra) => {
                                        // updateItem({'actManId': extra.triggerNode.props.eventKey, 'actManName': value});
                                        if (!!value) {
                                            updateItem({'actManId': extra.triggerNode.props.eventKey, 'actManName': value});
                                            // updateItem({'actManName': value});
                                            // getFieldDecorator('actManId', {initialValue: extra.triggerNode.props.eventKey});
                                            // setFieldsValue({'actManId': extra.triggerNode.props.eventKey});
                                        } else {
                                            updateItem({'actManId': ''});
                                            updateItem({'actManName': ''});
                                            // setFieldsValue({'actManId': ''})
                                        }
                                    }}
                                />
                                {/* <Row>
                                    <Col span={11}>
                                        <FormItem {...formStyle_8} label="执行人">
                                            {getFieldDecorator('actManName', {
                                                initialValue: actManName,
                                                rules: [
                                                    {required: true, message: '必填项'},
                                                ]
                                            })(
                                                type === 'view' ?
                                                    <span>{actManName}</span>
                                                    :
                                                    <TreeSelect {...peopleSelect}/>
                                            )}
                                        </FormItem>
                                    </Col>
                                </Row> */}
                                <Input.TextArea
                                    data-modallist={{
                                        layout: {width: 100,name: '大修改进明细',require: true},
                                        regexp: {
                                            value: details
                                        }
                                    }}
                                    value={details}
                                    onChange={e=>updateItem({details:e.target.value})}
                                />
                                <VtxUpload
                                    {...uploadProps11('上传文件', 'picIds', picIds)}
                                />
                            </VtxModalList>
                        </Panel>
                        </Collapse>
                    {/* </VtxModal> */}
                </TabPane>
                </Form>
            </Tabs>
        )

    }
}

export default Form.create()(AddItem);