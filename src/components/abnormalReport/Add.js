import React from 'react';

import { VtxModal, VtxModalList, VtxUpload } from 'vtx-ui';
const { VtxUpload2 } = VtxUpload
import { Button, Input, Select, Table,Radio,message } from 'antd';
const Option = Select.Option;
const RadioGroup = Radio.Group;
import {handleColumns} from '../../utils/tools'
import styles from './index.less'

class ADD extends React.Component {

	constructor(props) {
		super(props);

		this.state = {};
	}

    modalListRef = ref => this.modalList = ref;

    footerRender() {
        const { contentProps, updateWindow } = this.props;
        const { loading, save } = contentProps;
        const _t = this;
        return [
           
            <Button key='submit' type='primary' size='large'
                loading={loading}
                onClick={()=>{
                    _t.modalList.submit().then((state) => {
                        state && save(); // 保存事件
                    })
                }
            }>保存</Button>
        ]
    }

    render() {
        const { dispatch, modalProps, contentProps } = this.props;
        const {
            id, waterFactoryId, waterFactorySelect, exceptionTypeId, exceptionTypeSelect, exceptionSmallTypeId, exceptionSmallTypeSelect,
            description, attachment, exceptionTypeList
        } = contentProps;
        const { updateItem, loadExceptionSmallTypeSelect} = contentProps;
        // const exceptionTypeList = [{key:'颜色',value:'黄色，酱油色，黑色',checkValue:''},{key:'浑浊度',value:'大，中，小'}]
        const columns = [['项目', 'key', { width: '50' }], ['描述','options',{width:'150'}]]
        let tableData = []
        exceptionTypeList && exceptionTypeList.length&&exceptionTypeList.map((item,index)=>{
            const optionGroup = item.value.replace(/,/g,'，').split('，')
            tableData.push({
                key:item.key,
                options: <RadioGroup onChange={(e)=>{
                    updateItem({
                        exceptionTypeList:{
                            [index]:{
                                checkValue:e.target.value
                            }
                        }
                    })
                    let descriptionArr =[]
                    exceptionTypeList.map((childItem,childIndex)=>{
                        if (childIndex == index) {
                            descriptionArr.push(childItem.key + '：' + e.target.value)
                        }else{
                            if (childItem.checkValue) {
                                descriptionArr.push(childItem.key + '：' + childItem.checkValue)
                            }
                        }
                        
                    })
                    updateItem({
                        description:descriptionArr.join('，')
                    })
                }} value={item.checkValue} options={optionGroup.map(optionItem => ({ label: optionItem, value: optionItem }))} />
            })
        })
        return (
            <VtxModal
                {...modalProps}
                footer={this.footerRender()}
            >
                <VtxModalList
                    isRequired
                    visible={modalProps.visible}
                    ref={this.modalListRef}
                >
                    <Select
                        value={waterFactoryId}
                        onChange={(value) => {
                            updateItem({
                                waterFactoryId : value
                            })
                        }}
                        placeholder="请选择运营厂（必选项）"
                        showSearch
                        optionFilterProp='children'
                        allowClear
                        data-modallist={{
                            layout:{
                                comType: 'input',
                                require: true,
                                name: '运营厂',
                                width: '50',
                                key: 'waterFactoryId'
                            },
                            regexp : {
                                value : waterFactoryId
                            }
                        }}
                    >
                        {waterFactorySelect.map(item => {
                            return <Option key={item.id}>{item.name}</Option>
                        }) }
                    </Select>
                    <Select
                        value={exceptionTypeId}
                        onChange={(value) => {
                            updateItem({
                                exceptionTypeId : value,
                                exceptionSmallTypeId:undefined,
                                exceptionTypeList:[],
                                description:''
                            })
                            loadExceptionSmallTypeSelect(value)
                        }}
                        placeholder="请选择异常大类（必选项）"
                        data-modallist={{
                            layout:{
                                comType: 'input',
                                require: true,
                                name: '异常大类',
                                width: '50',
                                key: 'exceptionTypeId'
                            },
                            regexp : {
                                value : exceptionTypeId
                            }
                        }}
                    >
                        {exceptionTypeSelect.map(item => {
                            return <Option key={item.id}>{item.name}</Option>
                        }) }
                    </Select>
                    <Select
                        value={exceptionSmallTypeId}
                        onSelect={(value,option) => {
                            updateItem({
                                exceptionSmallTypeId : value,
                                exceptionTypeList: JSON.parse(option.props.exceptionTypeJson||'[]'),
                                description: ''
                            })
                        }}
                        placeholder={exceptionTypeId ? "请选择异常小类（必选项）":"请先选择异常大类"}
                        data-modallist={{
                            layout:{
                                comType: 'input',
                                require: true,
                                name: '异常小类',
                                width: '50',
                                key: 'exceptionSmallTypeId'
                            },
                            regexp : {
                                value : exceptionSmallTypeId
                            }
                        }}
                    >
                        {exceptionSmallTypeSelect.map(item => {
                            return <Option exceptionTypeJson={item.exceptionTypeJson} key={item.id}>{item.name}</Option>
                        }) }
                    </Select>
                    <div data-modallist={{ layout: { type: 'title', require: false, } }}>异常描述模版</div>
                    <Table
                        bordered
                        size='middle'
                        // showHeader={false}
                        className={styles.table}
                        columns={handleColumns(columns)}
                        dataSource={tableData}
                        pagination={false}
                        data-modallist={{
                            layout: { comType: 'input', width: 100, key: 'table' }
                        }}
                        // rowKey={record => record.id}
                    />
                    <Input
                        value={description}
                        rows={3}
                        type='textarea'
                        onChange={(e) => {
                            updateItem({
                                description : e.target.value
                            })
                        }}
                        placeholder="请输入异常描述（必填项）"
                        data-modallist={{
                            layout:{
                                comType: 'input',
                                require: true,
                                name: '异常描述',
                                width: '100',
                                key: 'description'
                            },
                            regexp : {
                                value : description
                            }
                        }}
                    />
                    

                    <VtxUpload2
                        fileList={attachment}
                        mode='multiple'
                        action='/cloudFile/common/uploadFile'
                        downLoadURL='/cloudFile/common/downloadFile?id='
                        disabled={false}
                        multiple={true}
                        showUploadList
                        onSuccess={(file) => {
                            message.info(`${file.name} 上传成功.`);
                            updateItem({
                                attachment: attachment.concat({
                                    id: file.id,
                                    name: file.name
                                })
                            });
                        }}
                        onError={(file) => {
                            message.info(`${file.name} 上传失败.`);
                        }}
                        onRemove={(file) => {
                            let files = attachment.filter(item => item.id != file.id);
                            updateItem({attachment : files});
                        }}
                        data-modallist={{
                            layout:{
                                comType: 'input',
                                name: '附件',
                                width: '50',
                                key: 'attachment'
                            },
                        }}
                    />
                </VtxModalList>
            </VtxModal>
        )
    }
}

export default ADD;