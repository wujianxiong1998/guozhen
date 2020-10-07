import React from 'react';

import { VtxModalList, VtxModal,  } from 'vtx-ui';
import { Button,message,Input } from 'antd';
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
        const { auditStatus, auditReason, onDelete, annx, uploadManName, uploadUnitName, uploadDate, title, updateItem } = contentProps
        const ip = window.location.href.split("#")[0]
        const fileId = annx && annx.length ? annx[0].id:''
        const fileSuffix = annx && annx.length&&annx[0].name ? annx[0].name.split('.')[1] : ''
        const auditStatusStr = {
            'ysh':'审核已通过',
            'ysc':'已删除',
            'btg':'审核不通过'
        }
        return (
            <VtxModal
                {...modalProps}
                footer={[
                    auditStatus==='ysh'?
                    <Button onClick={()=>{
                        if(!auditReason){
                            message.warn('请输入删除原因')
                            
                        }
                        t.modalList.submit().then((state) => {
                            state && onDelete(); // 保存事件
                        })
                    }} key='submit' type='primary' size='large'>删除</Button>:null,
                    <Button onClick={() => { updateWindow(false)}}>关闭</Button>
                ]}
            >
                <center><h2 style={{ fontWeight: 'bold' }}>{title}</h2></center>
                <div className={styles.infoLine}>
                    <div className={styles.item}>{uploadManName}</div>
                    <div className={styles.item}>{uploadUnitName}</div>
                    <div className={styles.item}>上传时间:{uploadDate}</div>
                    <div className={styles.item}><Button onClick={() => { window.open(`/cloudFile/common/download/${fileId}.${fileSuffix}`) }} size='small' type='primary'>下载</Button></div>
                </div>
                <iframe frameBorder={0} src={`${ip}wjyl/onlinePreview?url=${ip}cloudFile/common/download/${fileId}.${fileSuffix}`} className={styles.fileContainer} />
                <center><h1 style={{marginBottom:'20px'}}>{auditStatusStr[auditStatus]}</h1></center>
                <VtxModalList
                    isRequired
                    visible={modalProps.visible}
                    ref={this.modalListRef}
                >
                {
                        auditStatus==='ysh'?
                            <Input
                                value={auditReason}
                                onChange={(e) => {
                                    updateItem({
                                        auditReason: e.target.value
                                    })
                                }}
                                placeholder="请输入原因"
                                maxLength="32"
                                data-modallist={{
                                    layout: {
                                        comType: 'input',
                                        require: true,
                                        name: '原因',
                                        width: '100',
                                        key: 'auditReason'
                                    },
                                    regexp: {
                                        value: auditReason
                                    }
                                }}
                            />
                            :
                            <div
                                data-modallist={{
                                    layout: { type: 'text', name: '原因', width: 100, key: 'auditReason' }
                                }}
                            >{auditReason}</div>
                }
                   
                    <div
                        data-modallist={{
                            layout: {
                                require: false,
                                width: '50',
                                key: 'blank'
                            }
                        }}
                    />
                </VtxModalList>
            </VtxModal>
        )
    }
    
}

export default View;