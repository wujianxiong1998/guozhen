import React, { Component } from 'react';
import { connect } from 'dva';
import { VtxModalList, VtxUpload } from 'vtx-ui';
const { VtxUpload2 } = VtxUpload
import {Button,Select,Collapse,Input,message} from 'antd'
const Option = Select.Option
const Panel = Collapse.Panel
import styles from './index.less'

class LiteratureUpload extends React.Component{
    constructor(props) {
        super(props);

        this.state = {};
    }
    modalListRef = ref => this.modalList = ref;
    updateItem = (item) => {
        this.props.dispatch({
            type: 'literatureUpload/updateState',
            payload: {
                newItem:{
                    ...item
                }
            }
        })
    }
    save = () => {
        this.props.dispatch({
            type: 'literatureUpload/saveData'
        })
    }
    render(){
        const t = this
        const { newItem, businessSelect, knowledgeTypeSelect, uploader, occupation, uploadUnit, loading} = this.props.literatureUpload
        const { title, businessId, knowledgeTypeId, author, phone, attachment, fileListVersion} = newItem
        return (
            <div className={styles.normal}>
                <Collapse defaultActiveKey={['1']}>
                    <Panel header='文献信息' key='1'>
                        <VtxModalList
                            isRequired
                            visible={true}
                            ref={t.modalListRef}
                        >
                            <Input
                                value={title}
                                onChange={e=>{
                                    t.updateItem({
                                        title:e.target.value
                                    })
                                }}
                                data-modallist={{
                                    layout: {
                                        comType: 'input',
                                        require: true,
                                        name: '文献标题',
                                        width: '50',
                                        key: 'title'
                                    },
                                    regexp: {
                                        value: title
                                    }
                                }}
                            />
                            <div
                                data-modallist={{
                                    layout: {
                                        type: 'text',
                                        width: '50',
                                        key: 'blank1'
                                    },
                                }} />
                            <Select
                                value={businessId}
                                onChange={(value)=>{
                                    t.updateItem({
                                        businessId:value
                                    })
                                }}
                                data-modallist={{
                                    layout: {
                                        comType: 'input',
                                        require: true,
                                        name: '业务范围',
                                        width: '25',
                                        key: 'businessId'
                                    },
                                    regexp: {
                                        value: businessId
                                    }
                                }}
                            >
                                {businessSelect.map(item => {
                                    return <Option key={item.id}>{item.name}</Option>
                                })}
                            </Select>
                            <Select
                                value={knowledgeTypeId}
                                onChange={(value) => {
                                    t.updateItem({
                                        knowledgeTypeId: value
                                    })
                                }}
                                data-modallist={{
                                    layout: {
                                        comType: 'input',
                                        require: true,
                                        name: '知识类型',
                                        width: '25',
                                        key: 'knowledgeTypeId'
                                    },
                                    regexp: {
                                        value: knowledgeTypeId
                                    }
                                }}
                            >
                                {knowledgeTypeSelect.map(item => {
                                    return <Option key={item.id}>{item.name}</Option>
                                })}
                            </Select>
                            <div
                                data-modallist={{
                                    layout: {
                                        type: 'text',
                                        width: '50',
                                        key: 'blank2'
                                    },
                                }} />
                            <Input
                                value={author}
                                onChange={e => {
                                    t.updateItem({
                                        author: e.target.value
                                    })
                                }}
                                data-modallist={{
                                    layout: {
                                        comType: 'input',
                                        require: true,
                                        name: '作者',
                                        width: '25',
                                        key: 'author'
                                    },
                                    regexp: {
                                        value: author
                                    }
                                }}
                            />
                            <div
                                data-modallist={{
                                    layout: {
                                        type: 'text',
                                        width: '75',
                                        key: 'blank3'
                                    },
                                }} />
                            <div
                                data-modallist={{
                                    layout: {
                                        type: 'text',
                                        name: '上传人',
                                        width: '25',
                                        key: 'uploader'
                                    },
                                }}
                            >
                            {uploader}
                            </div>
                            <div
                                data-modallist={{
                                    layout: {
                                        type: 'text',
                                        name: '职务',
                                        width: '25',
                                        key: 'occupation'
                                    },
                                }}
                            >
                                {occupation}
                            </div>
                            <div
                                data-modallist={{
                                    layout: {
                                        type: 'text',
                                        width: '50',
                                        key: 'blank4'
                                    },
                                }} />
                            <Input
                                value={phone}
                                onChange={e => {
                                    t.updateItem({
                                        phone: e.target.value
                                    })
                                }}
                                data-modallist={{
                                    layout: {
                                        comType: 'input',
                                        require: true,
                                        name: '联系方式',
                                        width: '25',
                                        key: 'phone'
                                    },
                                    regexp: {
                                        value: phone
                                    }
                                }}
                            />
                            <div
                                data-modallist={{
                                    layout: {
                                        type: 'text',
                                        name: '上传单位',
                                        width: '25',
                                        key: 'uploadUnit'
                                    },
                                }}
                            >
                                {uploadUnit}
                            </div>
                            <div
                                data-modallist={{
                                    layout: {
                                        type: 'text',
                                        width: '50',
                                        key: 'blank5'
                                    },
                                }} />
                            <VtxUpload2
                                fileList={attachment}
                                fileListVersion={fileListVersion}
                                mode='multiple'
                                action='/cloudFile/common/uploadFile'
                                downLoadURL='/cloudFile/common/downloadFile?id='
                                disabled={false}
                                multiple={true}
                                showUploadList
                                onSuccess={(file) => {
                                    message.info(`${file.name} 上传成功.`);
                                    t.updateItem({
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
                                    t.updateItem({ attachment: files });
                                }}
                                data-modallist={{
                                    layout: {
                                        comType: 'input',
                                        name: '上传文件',
                                        width: '50',
                                        key: 'attachment'
                                    },
                                }}
                            />
                        </VtxModalList>
                    </Panel>
                </Collapse>
                <div className={styles.btnContainer}>
                    <Button key='submit' type='primary' size='large'
                        loading={loading}
                        onClick={() => {
                            t.modalList.submit().then((state) => {
                                state && t.save(); // 保存事件
                            })
                        }
                        }>提交</Button>
                </div>
            </div>
        )
    }
}
export default connect(
    ({ literatureUpload }) => ({ literatureUpload })
)(LiteratureUpload);