import React from 'react';
import { VtxModal,VtxModalList,VtxUpload } from 'vtx-ui';
import {  Collapse, Table } from 'antd';
const { Panel } = Collapse;
const {VtxUpload2} = VtxUpload;

class ViewItem extends React.Component {
    constructor(props){
        super(props);
    }

    render() {
        let { modalPropsItem, contentProps, fileListVersion, getData } = this.props;
        let { title, visible, onCancel, width } = modalPropsItem;
        let { 
            id, gdCode, structuresName, name, code, planDateStr, chargeManName, planMoney,
            actMoney, picIds, actStartDay, actEndDay, actManName, details, sparePart, countTotal, afterPicIds
         } = getData;
        let modalProps = {
            title: title,
            visible: visible,
            footer: null,
            onCancel: onCancel,
            width: width,
        }
        let modallistProps = {
            visible: visible,
            isRequired: false,
        }

        //选择内列表配置
        const partTableColumns = [{
            title: '名称',
            dataIndex: 'name',
            key: 'name',
            width: 100
        }, {
            title: '规格型号',
            dataIndex: 'modelNum',
            key: 'modelNum',
            width: 100
        }, {
            title: '用途',
            dataIndex: 'usedBy',
            key: 'usedBy',
            width: 100
        }, {
            title: '厂家',
            dataIndex: 'manufacturer',
            key: 'manufacturer',
            width: 100
        }, {
            title: '数量',
            dataIndex: 'num',
            key: 'num',
            width: 100,
        }, {
            title: '价格',
            dataIndex: 'price',
            key: 'price',
            width: 100,
        }, {
            title: '小计',
            dataIndex: 'total',
            key: 'total',
            width: 100
        }];

        let uploadProps = (name,fieldCode,photoIds,require = true)=>{
            return {
                action:"/cloudFile/common/uploadFile",
                downLoadURL:'/cloudFile/common/downloadFile?id=',
                "data-modallist":{
                    layout:{
                        width:100,
                        name,
                    },
                },
                listType:"text",
                viewMode:true,
                fileList:photoIds?photoIds:[],
                accept:'image/png, image/jpeg, image/jpg',
                fileListVersion,
            }
        }

        const contentTableProps = {
            columns: partTableColumns,
            dataSource: sparePart,
            rowKey: record => record.id
        };

        return (
            <VtxModal {...modalProps}>
                <Collapse bordered={false} defaultActiveKey={['1', '2', '3']}>
                    <Panel header="基本信息" key="1">
                        <VtxModalList {...modallistProps}>
                            <div data-modallist={{layout:{width:50,name:'工单编号',type:'text'}}}>{gdCode}</div>
                            <div data-modallist={{layout:{width:50,name:'安装位置',type:'text'}}}>{structuresName}</div>
                            <div data-modallist={{layout:{width:50,name:'设备名称',type:'text'}}}>{name}</div>
                            <div data-modallist={{layout:{width:50,name:'设备编码',type:'text'}}}>{code}</div>
                            <div data-modallist={{layout:{width:50,name:'计划执行时间',type:'text'}}}>{planDateStr}</div>
                            <div data-modallist={{layout:{width:50,name:'负责人',type:'text'}}}>{chargeManName}</div>
                            <div data-modallist={{layout:{width:50,name:'预算总价（万元）',type:'text'}}}>{planMoney}</div>

                            <div data-modallist={{layout:{width:50,name:'实际费用（万元）',type:'text'}}}>{actMoney}</div>
                            <div data-modallist={{layout:{width:50,name:'开始时间',type:'text'}}}>{actStartDay}</div>
                            <div data-modallist={{layout:{width:50,name:'完成时间',type:'text'}}}>{actEndDay}</div>
                            <div data-modallist={{layout:{width:50,name:'执行人',type:'text'}}}>{actManName}</div>
                            <div data-modallist={{layout:{width:100,name:'大修改进明细',type:'text'}}}>{details}</div>
                            <VtxUpload2
                                {...uploadProps('附件','picIds', picIds)}
                            />
                        </VtxModalList> 
                    </Panel>
                    <Panel header="配件详情" key="2">
                        <Table {...contentTableProps} />
                        <div style={{float: 'right'}}>总计:{countTotal}</div>
                    </Panel>
                    <Panel header="后评估" key="3">
                        <VtxModalList {...modallistProps}>
                            <div></div>
                            <VtxUpload2
                                {...uploadProps('附件','afterPicIds', afterPicIds)}
                            />
                        </VtxModalList> 
                    </Panel>
                </Collapse>
            </VtxModal>
        )
    }

}

export default ViewItem;