import React from 'react';
import moment from 'moment';
import {Form, Row, Col, Input, Table, Icon} from 'antd';
import 'moment/locale/zh-cn';
import {formStyle_9, formStyle_3} from '../../utils/util';
import {VtxUpload} from "vtx-ui";

moment.locale('zh-cn');
const FormItem = Form.Item;
const {VtxUpload2} = VtxUpload;

class Detail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    };
    
    render() {
        const {detail} = this.props;
        
        //图片配置
        const picProps = {
            action: "/cloudFile/common/uploadFile",
            downLoadURL: '/cloudFile/common/downloadFile?id=',
            multiple: false,
            listType: "picture-card",
            accept: 'image/png, image/jpeg, image/jpg',
            viewMode: true
        };
        //列表配置
        const tableProps = {
            columns: [{
                title: '规格型号',
                dataIndex: 'modelNum',
                key: 'modelNum'
            }, {
                title: '生产厂家',
                dataIndex: 'manufacturer',
                key: 'manufacturer'
            }, {
                title: '数量',
                dataIndex: 'num',
                key: 'num'
            }, {
                title: '价格',
                dataIndex: 'price',
                key: 'price'
            }, {
                title: '小计',
                dataIndex: 'total',
                key: 'total'
            }],
            dataSource: !!detail.sparePart ? JSON.parse(detail.sparePart) : [],
            rowKey: record => record.id
        };
        
        return (
            <Form className="main_page">
                <Row>
                    <Col span={7}>
                        <FormItem {...formStyle_9} label="设备位置">
                            <Input value={detail.structuresName} disabled/>
                        </FormItem>
                    </Col>
                    <Col span={7}>
                        <FormItem {...formStyle_9} label="故障设备">
                            <Input value={detail.deviceName} disabled/>
                        </FormItem>
                    </Col>
                    <Col span={7}>
                        <FormItem {...formStyle_9} label="设备类型">
                            <Input value={detail.typeName} disabled/>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={7}>
                        <FormItem {...formStyle_9} label="故障类型">
                            <Input value={detail.faultTypeName} disabled/>
                        </FormItem>
                    </Col>
                    <Col span={7}>
                        <FormItem {...formStyle_9} label="故障时间">
                            <Input value={detail.breakdownTimeStr} disabled/>
                        </FormItem>
                    </Col>
                    <Col span={7}>
                        <FormItem {...formStyle_9} label="上报人">
                            <Input value={detail.reportMan} disabled/>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={22}>
                        <FormItem {...formStyle_3} label="故障详情">
                            <Input value={detail.details} disabled/>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={22}>
                        <FormItem {...formStyle_3} label="故障图片">
                            {!detail.picIds ?
                                <img style={{width: '94px', height: '94px', border: '1px solid #dedede'}}
                                     src="./resources/images/no_pic.png"
                                     alt="noPic"/>
                                :
                                <VtxUpload2 {...picProps} fileList={
                                    detail.picIds.split(',').map((item, index) => {
                                        return {
                                            id: item,
                                            name: index
                                        }
                                    })}/>
                            }
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={7}>
                        <FormItem {...formStyle_9} label="维修人">
                            <Input value={detail.repareMan} disabled/>
                        </FormItem>
                    </Col>
                    <Col span={7}>
                        <FormItem {...formStyle_9} label="限定时间">
                            <Input value={detail.limitDate} disabled/>
                        </FormItem>
                    </Col>
                    <Col span={7}>
                        <FormItem {...formStyle_9} label="实际维修人">
                            <Input value={detail.actRepareMan} disabled/>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={7}>
                        <FormItem {...formStyle_9} label="维修类型">
                            <Input value={detail.repareTypeStr} disabled/>
                        </FormItem>
                    </Col>
                    <Col span={7}>
                        <FormItem {...formStyle_9} label="维修费用">
                            <Input value={detail.reparePrice} disabled/>
                        </FormItem>
                    </Col>
                    <Col span={7}>
                        <FormItem {...formStyle_9} label="完成时间">
                            <Input value={detail.completeTimeStr} disabled/>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={21}>
                        <FormItem {...formStyle_3} label="维修详情">
                            <Input value={detail.repareDetail} disabled/>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={21}>
                        <FormItem {...formStyle_3} label="是否为返修">
                            <Input value={detail.isBackRepareStr} disabled/>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={21}>
                        <FormItem {...formStyle_3} label="上报附件">
                            {!detail.fileIds ?
                                <img style={{width: '94px', height: '94px', border: '1px solid #dedede'}}
                                     src="./resources/images/no_pic.png"
                                     alt="noPic"/>
                                :
                                <VtxUpload2 {...picProps}
                                            fileList={
                                                detail.fileIds.split(',').map((item, index) => {
                                                    return {
                                                        id: item,
                                                        name: index
                                                    }
                                                })}
                                />
                            }
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={21}>
                        <FormItem className='modalTable' {...formStyle_3} label="配件信息">
                            <Table {...tableProps}/>
                            <div style={{float: 'right'}}>总计:{detail.countTotal}</div>
                        </FormItem>
                    </Col>
                </Row>
                {detail.dealStatus === -1 && <Row>
                    <Col span={21}>
                        <FormItem {...formStyle_3} label="审核失败原因">
                            <Input value={detail.auditMemo} disabled/>
                        </FormItem>
                    </Col>
                </Row>}
            </Form>
        );
    };
}

export default Form.create()(Detail);
