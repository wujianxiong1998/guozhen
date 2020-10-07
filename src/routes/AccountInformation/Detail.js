import React from 'react';
import moment from 'moment';
import {Form, Collapse, message, Tabs, Icon} from 'antd';
import 'moment/locale/zh-cn';
import BaseInfo from './detailComponents/BaseInfo';
import SpareParts from './detailComponents/SpareParts';
import TechnicalParameter from './detailComponents/TechnicalParameter';
import {VtxDatagrid, VtxUpload} from "vtx-ui";

moment.locale('zh-cn');
const Panel = Collapse.Panel;
const TabPane = Tabs.TabPane;
const {VtxUpload2} = VtxUpload;

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
        const {waterFactoryList, detail, type, checkName, equipmentStatus, equipmentTypes, structureList, getStructuresList, equipmentGrades, manufacturerList, equipmentSelectList, equipmentSelectTotal, getEquipmentList, clearEquipmentList, getManufacturerList, changeDetail, sparePartsParams, updateSparePartsParams, getSparePartsList, sparePartsLoading, technicalParameterParams, updateTechnicalParameterParams, changeParams, changeTab, detailRepair, repairListLoading, maintainRepair, maintainListLoading} = this.props;
        const {getFieldDecorator, setFieldsValue, getFieldValue, setFields} = this.props.form;
        
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
                key: 'deviceCode',
                nowrap: true
            }, {
                title: '设备名称',
                dataIndex: 'deviceName',
                key: 'deviceName',
                nowrap: true
            }, {
                title: '上报人',
                dataIndex: 'reportMan',
                key: 'reportMan',
                nowrap: true
            }, {
                title: '故障类型',
                dataIndex: 'faultTypeName',
                key: 'faultTypeName',
                nowrap: true
            }, {
                title: '故障详情',
                dataIndex: 'details',
                key: 'details',
                nowrap: true
            }, {
                title: '上报时间',
                dataIndex: 'breakdownTimeStr',
                key: 'breakdownTimeStr',
                nowrap: true
            }, {
                title: '维修人员',
                dataIndex: 'repareMan',
                key: 'repareMan',
                nowrap: true
            }, {
                title: '完成时间',
                dataIndex: 'completeTimeStr',
                key: 'completeTimeStr',
                nowrap: true
            }, {
                title: '维修费用',
                dataIndex: 'reparePrice',
                key: 'reparePrice',
                nowrap: true
            }, {
                title: '状态',
                dataIndex: 'dealStatusStr',
                key: 'dealStatusStr',
                nowrap: true
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
                key: 'deviceCode',
                nowrap: true
            }, {
                title: '设备名称',
                dataIndex: 'deviceName',
                key: 'deviceName',
                nowrap: true
            }, {
                title: '责任人',
                dataIndex: 'typeStr',
                key: 'typeStr',
                nowrap: true
            }, {
                title: '养护人',
                dataIndex: 'repareMan',
                key: 'repareMan',
                nowrap: true
            }, {
                title: '实际养护人',
                dataIndex: 'actRepareMan',
                key: 'actRepareMan',
                nowrap: true
            }, {
                title: '计划完成时间',
                dataIndex: 'maintainPeriodStr',
                key: 'maintainPeriodStr',
                nowrap: true
            }, {
                title: '实际完成时间',
                dataIndex: 'completeTimeStr',
                key: 'completeTimeStr',
                nowrap: true
            }, {
                title: '养护内容',
                dataIndex: 'content',
                key: 'content',
                nowrap: true
            }, {
                title: '状态',
                dataIndex: 'maintainStatusStr',
                key: 'maintainStatusStr',
                nowrap: true
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
                        <Tabs defaultActiveKey="1" onChange={(key) => changeTab(key, detail.id)}>
                            <TabPane tab="基本数据" key="1">
                                <Collapse defaultActiveKey={['1', '2', '3', '4']}>
                                    <Panel header="基本信息" key="1" disabled>
                                        <BaseInfo {...baseInfoProps}/>
                                    </Panel>
                                    <Panel header="备品备件" key="2" disabled>
                                        <SpareParts {...sparePartsProps}/>
                                    </Panel>
                                    <Panel header="技术参数" key="3" disabled>
                                        <TechnicalParameter {...technicalParameterProps}/>
                                    </Panel>
                                    <Panel header="技术文档" key="4" disabled>
                                        {type === 'view' && !detail.fileIds ?
                                            <span style={{marginLeft: '20px'}}>暂无</span> :
                                            <VtxUpload2 {...fileProps}/>}
                                    </Panel>
                                </Collapse>
                            </TabPane>
                            <TabPane tab="维修信息" key="repair" className='repair'>
                                <div style={{height: '400px'}}>
                                    <VtxDatagrid {...repairTableProps} />
                                </div>
                            </TabPane>
                            <TabPane tab="养护信息" key="maintain">
                                <div style={{height: '400px'}}>
                                    <VtxDatagrid {...maintainTableProps} />
                                </div>
                            </TabPane>
                        </Tabs>
                    </div>
                    :
                    <div className="baseInfo">
                        <Collapse defaultActiveKey={['1', '2', '3', '4']}>
                            <Panel header="基本信息" key="1" disabled>
                                <BaseInfo {...baseInfoProps}/>
                            </Panel>
                            <Panel header="备品备件" key="2" disabled>
                                <SpareParts {...sparePartsProps}/>
                            </Panel>
                            <Panel header="技术参数" key="3" disabled>
                                <TechnicalParameter {...technicalParameterProps}/>
                            </Panel>
                            <Panel header="技术文档" key="4" disabled>
                                {type === 'view' && !detail.fileIds ?
                                    <span style={{marginLeft: '20px'}}>暂无</span> :
                                    <VtxUpload2 {...fileProps}/>}
                            </Panel>
                        </Collapse>
                    </div>
                }
            </Form>
        );
    };
}

export default Form.create()(Detail);
