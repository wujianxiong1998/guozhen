import React from 'react';

import { VtxModalList, VtxModal, VtxUpload } from 'vtx-ui';
const { VtxUpload2 } = VtxUpload
import { Button, Input, Icon } from 'antd';
const {TextArea} = Input
import {VtxUtil} from '../../utils/util'
import styles from './index.less'
class View extends React.Component{
    constructor(props) {
		super(props);
		this.state = {};
	}
    modalListRef = ref => this.modalList = ref;
    render(){
        const t = this
        const { updateWindow, modalProps, contentProps } = this.props;
        const { id, applyManId, acceptId, title, problemContent, annx, answers, newAnswer, technicalStatus, updateItem, loading, save, acceptAnswer,
            cannotAnswer} = contentProps
        const userId = VtxUtil.getUrlParam('userId')
        return (
            <VtxModal
                {...modalProps}
                footer={[
                    userId !== applyManId && technicalStatus !== 'ycn' && !cannotAnswer?
                        <Button key='save' size='large'
                            type='primary'
                            loading={loading}
                            onClick={() => {
                                t.modalList.submit().then((state) => {
                                    state && save(); // 保存事件
                                })
                            }
                            }>保存</Button>:
                    <Button key="cancel" size="large" onClick={() => {
                        updateWindow(false);
                    }}>关闭</Button>
                ]}
            >
                <div className={styles.viewContainer}>
                <VtxModalList
                    isRequired
                    visible={modalProps.visible}
                    ref={this.modalListRef}
                >
                    <div
                        data-modallist={{
                            layout: { type: 'text', name: '标题', width: 100, key: 'title' }
                        }}
                    >{title}</div>
                    <div
                        data-modallist={{
                            layout: { type: 'text', name: '问题描述', width: 100, key: 'problemContent' }
                        }}
                    >{problemContent}</div>
                    {
                        annx&&annx.length?
                            <div
                                data-modallist={{
                                    layout: { type: 'text', name: '附件', width: 100, key: 'annx' }
                                }}
                            >
                                <VtxUpload2
                                    showUploadList={true}
                                    fileList={annx || []}
                                    mode="multiple"
                                    action="/cloudFile/common/uploadFile"
                                    downLoadURL="/cloudFile/common/downloadFile?id="
                                    viewMode={true}
                                />
                            </div>
                            :''
                    }
                    
                    {
                        answers && answers.length ? answers.map(item=>{
                            return (
                                <div data-modallist={{
                                    layout: { type: 'text',width: 100, key: 'answers'+item.id }
                                }} key={item.id} className={styles.answerItem}>
                                    <div className={styles.avatar}>
                                        <img src={item.userPhoto ? '/cloudFile/common/downloadFile?id=' + item.userPhoto :'./resources/images/default_user_photo.png'} />
                                    </div>
                                    <div className={styles.text}>
                                        <div className={styles.infoLine}>
                                            <div className={styles.left}>
                                                <div className={styles.name}>{item.userName}</div>
                                                <div className={styles.date}>{item.createTime}</div>
                                            </div>
                                            <div className={styles.right}>
                                                {
                                                    userId === applyManId && technicalStatus !== 'ycn' ?
                                                        <Button onClick={()=>{
                                                            acceptAnswer(id,item.id)
                                                        }} type='primary'>采纳</Button>
                                                    :
                                                        technicalStatus === 'ycn'&&acceptId===item.id?
                                                            <span className={styles.acceptContent}><Icon type="like" />已采纳</span>:
                                                            item.userId===userId&&acceptId!==item.id?
                                                                <span className={styles.unAcceptContent}>未采纳</span>:''
                                                }
                                            </div>
                                        </div>
                                        <div className={styles.content}>
                                        {item.answerContent}
                                        </div>
                                    </div>
                                </div>
                            )
                        }):''
                    }
                    {
                        userId !== applyManId && technicalStatus !== 'ycn' && !cannotAnswer?
                        <TextArea
                            rows={4}
                            value={newAnswer}
                                onChange={(e) => {
                                    updateItem({
                                        newAnswer: e.target.value
                                    })
                                }}
                            placeholder='请输入回答'
                                data-modallist={{
                                    layout: {
                                        comType: 'input',
                                        require: true,
                                        name: '回答',
                                        width: '100',
                                        key: 'newAnswer'
                                    },
                                    regexp: {
                                        value: newAnswer
                                    }
                                }}
                        />
                        :''
                    }
                </VtxModalList>
                </div>
            </VtxModal>
        )
    }
    
}

export default View;