import React from 'react';

import { VtxModal, VtxModalList, VtxUpload } from 'vtx-ui';
const {VtxUpload2} = VtxUpload
import { Button, Input, Select,TreeSelect,message } from 'antd';
const {TextArea} = Input
const Option = Select.Option;

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
           
            <Button key='save' size='large'
                loading={loading}
                onClick={()=>{
                    _t.modalList.submit().then((state) => {
                        state && save('bc'); // 保存事件
                    })
                }
            }>保存</Button>,
            <Button key='submit' type='primary' size='large'
                loading={loading}
                onClick={() => {
                    _t.modalList.submit().then((state) => {
                        state && save('djd'); // 保存事件
                    })
                }
                }>保存并提交</Button>
        ]
    }

    render() {
        const { dispatch, modalProps, contentProps } = this.props;
        const {
            id, title, businessId, businessSelect, knowledgeTypeId, knowledgeTypeSelect, problemContent,
            annx, uploaderInfo, userList, inviteIds
        } = contentProps;
        
        const { updateItem } = contentProps;

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
                    <div
                        data-modallist={{
                            layout: { type: 'text', name: '单位', width: 50, key: 'unit' }
                        }}
                    >{uploaderInfo.unitName}</div>
                    <div
                        data-modallist={{
                            layout: { type: 'text', name: '申请人', width: 50, key: 'userName' }
                        }}
                    >{uploaderInfo.applyManName}</div>
                    <Input
                        value={title}
                        onChange={(e) => {
                            updateItem({
                                title : e.target.value
                            })
                        }}
                        placeholder="请输入标题（必填项）"
                        data-modallist={{
                            layout:{
                                comType: 'input',
                                require: true,
                                name: '标题',
                                width: '100',
                                key: 'title'
                            },
                            regexp : {
                                value : title
                            }
                        }}
                    />
                    <Select
                        value={businessId}
                        onChange={(value) => {
                            updateItem({
                                businessId : value
                            })
                        }}
                        placeholder="请选择业务范围（必选项）"
                        allowClear
                        data-modallist={{
                            layout:{
                                comType: 'input',
                                require: true,
                                name: '业务范围',
                                width: '50',
                                key: 'businessId'
                            },
                            regexp : {
                                value : businessId
                            }
                        }}
                    >
                        {businessSelect.map(item => {
                            return <Option key={item.id}>{item.name}</Option>
                        }) }
                    </Select>
                    <Select
                        value={knowledgeTypeId}
                        onChange={(value) => {
                            updateItem({
                                knowledgeTypeId : value
                            })
                        }}
                        placeholder="请选择知识类型（必选项）"
                        allowClear
                        data-modallist={{
                            layout:{
                                comType: 'input',
                                require: true,
                                name: '知识类型',
                                width: '50',
                                key: 'knowledgeTypeId'
                            },
                            regexp : {
                                value : knowledgeTypeId
                            }
                        }}
                    >
                        {knowledgeTypeSelect.map(item => {
                            return <Option key={item.id}>{item.name}</Option>
                        }) }
                    </Select>
                    <TreeSelect
                        data-modallist={{
                            layout: { width: 100, name: '邀请回答', require: true },
                            regexp: {
                                value: inviteIds
                            }
                        }}
                        multiple
                        treeData={userList}
                        treeDefaultExpandAll={true}
                        showSearch={true}
                        dropdownStyle={{
                            maxHeight: 400,
                            overflow: 'auto'
                        }}
                        value={inviteIds}
                        onChange={(value, label, extra) => {
                            // console.log(extra);

                            if (!!value) {
                                // updateItem({ 'inviteIdsId': extra.triggerNode.props.eventKey });
                                updateItem({ 'inviteIds': value });
                            } else {
                                updateItem({ 'inviteIds': [] });
                            }
                        }}
                    />
                    <TextArea
                        value={problemContent}
                        rows={3}
                        onChange={(e) => {
                            updateItem({
                                problemContent : e.target.value
                            })
                        }}
                        placeholder="请输入问题描述（必填项）"
                        data-modallist={{
                            layout:{
                                comType: 'input',
                                require: true,
                                name: '问题描述',
                                width: '100',
                                maxNum: 500,
                                key: 'problemContent'
                            },
                            regexp : {
                                value : problemContent
                            }
                        }}
                    />
                    
                    <VtxUpload2
                        fileList={annx}
                        mode='multiple'
                        action='/cloudFile/common/uploadFile'
                        downLoadURL='/cloudFile/common/downloadFile?id='
                        disabled={false}
                        multiple={true}
                        showUploadList
                        onSuccess={(file) => {
                            message.info(`${file.name} 上传成功.`);
                            updateItem({
                                annx: annx.concat({
                                    id: file.id,
                                    name: file.name
                                })
                            });
                        }}
                        onError={(file) => {
                            message.info(`${file.name} 上传失败.`);
                        }}
                        onRemove={(file) => {
                            let files = annx.filter(item => item.id != file.id);
                            updateItem({annx : files});
                        }}
                        data-modallist={{
                            layout:{
                                comType: 'input',
                                // require: true,
                                name: '上传附件',
                                width: '50',
                                key: 'annx'
                            },
                            // regexp : {
                            //     value : annx.length > 0 ? '1' : ''
                            // }
                        }}
                    />
                </VtxModalList>
            </VtxModal>
        )
    }
}

export default ADD;