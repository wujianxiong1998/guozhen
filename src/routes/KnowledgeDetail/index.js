/**
 * 知识检索详情页
 * author :  xxy
 * createTime : 2019-08-19 10:25
 */
import React from 'react';
import { connect } from 'dva';

import { Button, message, Input, Icon, Spin, Select, BackTop, Col,Tooltip  } from 'antd';
const TextArea = Input.TextArea;
const {Option} = Select
import {VtxModalList,VtxUpload} from 'vtx-ui'
const {VtxUpload2} = VtxUpload
import moment from 'moment'
import styles from './index.less';
import {VtxUtil} from '../../utils/util'
class KnowledgeDetail extends React.Component {
    constructor(props) {
        super(props)
    }
    updateState=(item)=>{
        this.props.dispatch({
            type:'knowledgeDetail/updateState',
            payload:{...item}
        })
    }
    render(){
        const t = this
        const {dispatch,knowledgeDetail} = t.props
        const { commentLoading,documentType, searchParams, knowledgeTypeSelect, detailInfo, newComment, supportInfo, comments, detailLoading} = knowledgeDetail
        const { annx } = detailInfo
        const ip = window.location.href.split("#")[0]
        const fileId = annx && annx.length ? annx[0].id : ''
        const fileSuffix = annx && annx.length && annx[0].name ? annx[0].name.split('.')[1] : ''
        return(
            <div className={styles.normal}>
                
                <div className={styles.normal_body}>
                    
                    <div className={styles.backLine}>
                        <div onClick={() => { window.history.back()}} className={styles.left}>
                            <Icon type="rollback" />
                            返回上层
                        </div>
                       {/* <div onClick={() => { }} className={styles.close}>
                            <Icon type='close' className={styles.anticon} />
        </div>*/}
                    </div>
                    <div className={styles.splitLine} />
                    <div className={styles.content}>
                        <BackTop visibilityHeight={5} />
                        <div className={styles.query}>
                            <div className={styles.item}>
                                <Col span={8}> <div className={styles.text}>关键词：</div> </Col>
                                <Col span={16}>
                                    <div className={styles.gridlists}>
                                        <Input
                                            value={searchParams.keyword}
                                            onChange={(e) => {
                                                t.updateState({
                                                    searchParams: {
                                                        keyword: e.target.value
                                                    }
                                                })
                                            }}
                                        />
                                    </div>
                                </Col>
                                
                            </div>
                            <div className={styles.btn}>
                                <Button onClick={()=>{
                                    this.props.history.push(`/knowledgeRetrieval?title=${searchParams.keyword}&tenantId=${VtxUtil.getUrlParam('tenantId')}&userId=${VtxUtil.getUrlParam('userId')}&token=${VtxUtil.getUrlParam('token') || ''}`)
                                }} type='primary'>查询</Button>
                            </div>
                            
                        </div>
                        
                            {
                                documentType==='support'?
                                <div className={styles.contentBox}>
                                    <Spin spinning={detailLoading}>
                                    <VtxModalList>
                                        <div
                                            data-modallist={{
                                                layout: { type: 'text', name: '标题', width: 100, key: 'title' }
                                            }}
                                        >{supportInfo.title}</div>
                                        <div
                                            data-modallist={{
                                                layout: { type: 'text', name: '问题描述', width: 100, key: 'problemContent' }
                                            }}
                                        >{supportInfo.problemContent}</div>
                                        {
                                            supportInfo.annx&&JSON.parse(supportInfo.annx) && JSON.parse(supportInfo.annx).length?
                                                <div
                                                    data-modallist={{
                                                        layout: { type: 'text', name: '附件', width: 100, key: 'annx' }
                                                    }}
                                                >
                                                    <VtxUpload2
                                                        showUploadList={true}
                                                        fileList={JSON.parse(supportInfo.annx || '[]')}
                                                        mode="multiple"
                                                        action="/cloudFile/common/uploadFile"
                                                        downLoadURL="/cloudFile/common/downloadFile?id="
                                                        viewMode={true}
                                                    />
                                                </div>
                                                :''
                                        }
                                        
                                        {
                                            supportInfo.answers && supportInfo.answers.rows.length ? supportInfo.answers.rows.map(item => {
                                                return (
                                                    <div data-modallist={{
                                                        layout: { type: 'text', width: 100, key: 'answers' + item.id }
                                                    }} key={item.id} className={styles.answerItem}>
                                                        <div className={styles.avatar}>
                                                            <img src={item.userPhoto ? '/cloudFile/common/downloadFile?id=' + item.userPhoto : './resources/images/default_user_photo.png'} />
                                                        </div>
                                                        <div className={styles.text}>
                                                            <div className={styles.infoLine}>
                                                                <div className={styles.left}>
                                                                    <div className={styles.name}>{item.userName}</div>
                                                                    <div className={styles.date}>{item.createTime}</div>
                                                                </div>
                                                                <div className={styles.right}>
                                                                    {
                                                                        supportInfo.acceptId === item.id ?
                                                                            <span className={styles.acceptContent}><Icon type="like" />已采纳</span> : ''
                                                                    }
                                                                </div>
                                                            </div>
                                                            <div className={styles.content}>
                                                                {item.answerContent}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            }) : ''
                                        }
                                    </VtxModalList>
                                    </Spin>
                                    </div>
                                :
                                <div className={styles.contentBox}>
                                    <Spin spinning={detailLoading}>
                                    <div className={styles.title}>
                                        {detailInfo.title}
                                    </div>
                                    <div className={styles.infoLine}>
                                        <div className={styles.item}><Tooltip title={detailInfo.waterFactoryNaauthorme}>{detailInfo.author}</Tooltip></div>
                                        <div className={styles.item}><Tooltip title={detailInfo.waterFactoryName}>{detailInfo.uploadUnitName}</Tooltip></div>
                                        <div className={styles.item}><Tooltip title={detailInfo.knowledgeTypeName}>{detailInfo.knowledgeTypeName}</Tooltip></div>
                                        <div className={styles.item}><Tooltip title={detailInfo.dateValue}>{moment(detailInfo.uploadDate).format('YYYY-MM-DD')}</Tooltip></div>
                                    </div>
                                        <iframe frameBorder={0} src={`${ip}wjyl/onlinePreview?url=${ip}cloudFile/common/download/${fileId}.${fileSuffix}`} className={styles.article} />
                                    <div className={styles.btnContainer}>
                                        <Button onClick={() => { window.open(`/cloudFile/common/download/${fileId}.${fileSuffix}`)}} icon='xiazai'><span style={{ color: '#3996FF' }}>下载</span></Button>
                                    </div>
                                    </Spin>
                                </div>
                            }
                        <div className={styles.inputContainer}>
                            <div className={styles.title}>
                                评论
                            </div>
                            <TextArea
                                value={newComment}
                                rows={4}
                                onChange={e=>{
                                    t.updateState({
                                        newComment:e.target.value
                                    })
                                }}
                            />
                            <div className={styles.btn}>
                                <Button onClick={()=>{
                                    t.props.dispatch({
                                        type:"knowledgeDetail/addComment"
                                    })
                                }} loading={commentLoading} size='large'>发表评论</Button>
                            </div>
                        </div>
                        <div className={styles.comments}>
                            {
                                comments.map(item=>{
                                    return (
                                        <div className={styles.commentItem}>
                                            <div className={styles.icon}>
                                                <img src={item.userPhoto ? '/cloudFile/common/downloadFile?id=' + item.userPhoto : './resources/images/default_user_photo.png'} />
                                            </div>
                                            <div className={styles.centerPart}>
                                                <div className={styles.name}>{item.userName}</div>
                                                <div className={styles.occupation}></div>
                                                <div className={styles.time}>{item.createTime.slice(2)}</div>
                                            </div>
                                            <div className={styles.content}>
                                                {item.commentContent}
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
                
            </div>
        )
    }
}

export default connect(
    ({ knowledgeDetail }) => ({ knowledgeDetail })
)(KnowledgeDetail);