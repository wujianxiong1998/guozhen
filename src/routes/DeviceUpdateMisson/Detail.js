import React from 'react';
import moment from 'moment';
import {Form, Collapse, message, Tabs} from 'antd';
import 'moment/locale/zh-cn';
import BaseInfo from './detailComponents/BaseInfo';
import SpareParts from './detailComponents/SpareParts';
import TechnicalParameter from './detailComponents/TechnicalParameter';
import Edit from './detailComponents/Edit';
import {VtxDatagrid, VtxUpload} from "vtx-ui";

moment.locale('zh-cn');
const Panel = Collapse.Panel;
const TabPane = Tabs.TabPane;

class Detail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    };
    
    getForm = () => {
        return this.props.form;
    };
    
    componentDidMount() {
    
    }
    
    render() {
        let { 
            modalPropsItem, contentProps, fileListVersion, userList,
            waterFactoryList, detail, type, checkName, equipmentStatus, equipmentTypes, structureList, getStructuresList, equipmentGrades,
            manufacturerList, equipmentSelectList, equipmentSelectTotal, getEquipmentList, clearEquipmentList, getManufacturerList, changeDetail,
            sparePartsParams, updateSparePartsParams, getSparePartsList, sparePartsLoading, technicalParameterParams, updateTechnicalParameterParams,
            changeParams, changeTab, detailRepair, repairListLoading, maintainRepair, maintainListLoading, changeDetailNew
        } = this.props;
        let { id, gdCode, structuresId, structuresName, deviceId, name, code, planDateStr, planMoney, reason, specificThing, chargeManName, chargeManId, 
            actMoney, actStartDay, actEndDay, actManId, actManName, details, picIds,
            modelLonding, updateItem, onSave, onUpdate, } = contentProps;
        // const {waterFactoryList, detail, type, checkName, equipmentStatus, equipmentTypes, structureList, getStructuresList, equipmentGrades, manufacturerList, equipmentSelectList, equipmentSelectTotal, getEquipmentList, clearEquipmentList, getManufacturerList, changeDetail, sparePartsParams, updateSparePartsParams, getSparePartsList, sparePartsLoading, technicalParameterParams, updateTechnicalParameterParams, changeParams, changeTab, detailRepair, repairListLoading, maintainRepair, maintainListLoading} = this.props;
        const {getFieldDecorator, setFieldsValue, getFieldValue, setFields} = this.props.form;
        // 编辑
        const editProps = {
            contentProps,
            userList,
            type,
            getFieldDecorator,
            setFieldsValue,
            changeDetail,
            changeDetailNew
        };
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
        const fileProps = {
            action: "/cloudFile/common/uploadFile",
            downLoadURL: '/cloudFile/common/downloadFile?id=',
            multiple: false,
            listType: "text",
            viewMode: type === 'view',
            fileList: !!detail.fileIds ? JSON.parse(detail.fileIds) : [],
            onSuccess: (file) => {
                let result = !!detail.fileIds ? JSON.parse(detail.fileIds) : [];
                result.push({id: file.id, name: file.name});
                changeDetail('fileIds', JSON.stringify(result))
            },
            onRemove: (file) => {
                let result = !!detail.fileIds ? JSON.parse(detail.fileIds) : [];
                changeDetail('fileIds', JSON.stringify(result.map(item => {
                    if (item.id !== file.id) {
                        return item
                    }
                }).filter(item => !!item)))
            },
        };
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
        
        return (
            <Form className="main_page">
                {type === 'view' ?
                    <div className="baseInfo">
                        <Tabs defaultActiveKey="1">
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
                                        {type === 'view' && !detail.fileIds ?
                                            <span style={{marginLeft: '20px'}}>暂无</span> :
                                            <VtxUpload {...fileProps}/>}
                                    </Panel>
                                </Collapse>
                            </TabPane>
                            <TabPane tab="回单填写" key="2">
                                <Edit {...editProps}/>
                            </TabPane>
                        </Tabs>
                    </div>
                    :
                    <Tabs defaultActiveKey="1">
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
                                    {type === 'view' && !detail.fileIds ?
                                        <span style={{marginLeft: '20px'}}>暂无</span> :
                                        <VtxUpload {...fileProps}/>}
                                </Panel>
                            </Collapse>
                        </TabPane>
                        <TabPane tab="回单填写" key="2">
                            <Edit {...editProps}/>
                        </TabPane>
                    </Tabs>
                }
            </Form>
        );
    };
}

export default Form.create()(Detail);
