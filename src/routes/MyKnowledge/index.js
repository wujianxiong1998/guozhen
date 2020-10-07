/**
 * 我的知识
 * author :  xxy
 * createTime : 2019-08-19 17:08
 */
import React from 'react';
import { connect } from 'dva';

import { Button, message, Icon,Tooltip } from 'antd';
import {VtxDatagrid} from 'vtx-ui'
import styles from './index.less';
import { handleColumns } from '../../utils/tools';
import ViewUploadItem from '../../components/literatureAudit/View'
import ViewAskItem from '../../components/technicalSupport/View'
import ViewAnswerItem from '../../components/technicalSupport/View'
class MyKnowledge extends React.Component {
    constructor(props) {
        super(props)
    }
    updateState = (item) => {
        this.props.dispatch({
            type: 'myKnowledge/updateState',
            payload: { ...item }
        })
    }
    handleDeleteUpload=(id)=>{
        const t = this
        this.props.dispatch({
            type:'myKnowledge/deleteMyUpload',
            payload:{
                id,
                onSuccess: function (ids) {
                    t.dispatch({
                        type: 'myKnowledge/getUploadList',
                    })
                    t.updateState({
                        myUploadViewItem: {
                            visible: false
                        }
                    })
                    message.success('删除成功');
                },
                onError: function (msg) {
                    message.error(msg);
                }
            }
        })
    }
    render() {
        const t = this
        const { dispatch, myKnowledge } = t.props
        const { userInfo, selectedKey, myAskViewItem, myUploadViewItem, myAnswerViewItem, dataSource,
            currentPage,pageSize,total,loading} = myKnowledge
        const columnsObj = {
            'myUpload':[
                ['类别','knowledgeTypeName'],
                ['标题','title'],
                ['状态','auditStatusStr'],
                ['操作', 'operation', {
                    renderButtons: (text, record) => {
                        let btns = [];
                            btns.push({
                                name: <Icon type='view'
                                    title='查看' />,
                                onClick(rowData) {
                                    t.updateState({
                                        myUploadViewItem: {
                                            ...rowData,
                                            auditReason: record.auditStatus === 'ysh' ? '' : record.auditReason,
                                            annx: JSON.parse(rowData.annx || '[]'),
                                            visible:true
                                        }
                                    })
                                }
                            })
                            return btns
                    }}]
            ],
            'myAsk':[
                ['类别', 'knowledgeTypeName'],
                ['标题', 'title'],
                ['操作', 'operation', {
                    renderButtons: (text, record) => {
                        let btns = [];
                        btns.push({
                            name: <Icon type='view'
                                title='查看' />,
                            onClick(rowData) {
                                dispatch({
                                    type: 'myKnowledge/getAskItemDetail',
                                    payload: {
                                        id: rowData.id,
                                        itemName: 'myAskViewItem'
                                    }
                                })
                                t.updateState({
                                    myAskViewItem: {
                                        ...rowData,
                                        annx: JSON.parse(rowData.annx || '[]'),
                                        inviteIds: rowData.inviteIds ? rowData.inviteIds.split(',') : [],
                                        newAnswer: ''
                                    }
                                })
                                updateAskViewWindow();
                            }
                        })
                        return btns
                    }
                }]
            ],
            'myAnswer': [
                ['类别', 'knowledgeTypeName'],
                ['标题', 'title'],
                ['操作', 'operation', {
                    renderButtons: (text, record) => {
                        let btns = [];
                        btns.push({
                            name: <Icon type='view'
                                title='查看' />,
                            onClick(rowData) {
                                dispatch({
                                    type: 'myKnowledge/getAskItemDetail',
                                    payload: {
                                        id: rowData.id,
                                        itemName: 'myAnswerViewItem'
                                    }
                                })
                                t.updateState({
                                    myAnswerViewItem: {
                                        ...rowData,
                                        annx: JSON.parse(rowData.annx || '[]'),
                                        inviteIds: rowData.inviteIds ? rowData.inviteIds.split(',') : [],
                                        newAnswer: ''
                                    }
                                })
                                updateAnswerViewWindow();
                            }
                        })
                        return btns
                    }
                }]
            ],
        } 
        let vtxDatagridProps = {
            columns: handleColumns(columnsObj[selectedKey]),
            dataSource,
            indexColumn: true,
            startIndex: (currentPage - 1) * pageSize + 1,
            // autoFit: true,
            // headFootHeight : 150,
            loading,
            onChange(pagination, filters, sorter) {
                t.updateState({
                    currentPage: pagination.current,
                    pageSize: pagination.pageSize
                })
                if (selectedKey=='myAsk'){
                    dispatch({
                        type: 'myKnowledge/getAskList'
                    })
                } else if (selectedKey == 'myUpload'){
                    dispatch({
                        type: 'myKnowledge/getUploadList'
                    })
                } else if (selectedKey == 'myAnswer'){
                    dispatch({
                        type: 'myKnowledge/getAnswerList'
                    })
                }
            },
            pagination: {
                showSizeChanger: true,
                pageSizeOptions: ['10', '20', '30', '40', '50'],
                showQuickJumper: true,
                current: currentPage,
                total: total,
                pageSize,
                showTotal: total => `合计 ${total} 条`
            },
        };

        //--------------查看我的上传-----------------
        const updateUploadViewWindow = (status = true) => {
            t.updateState({
                myUploadViewItem: {
                    visible: status
                }
            })
        }
        const myUploadViewItemProps = {
            updateWindow: updateUploadViewWindow,
            modalProps: {
                title: '我的上传',
                visible: myUploadViewItem.visible,
                onCancel: () => updateUploadViewWindow(false),
                width: 900
            },
            contentProps: {
                ...myUploadViewItem,
                btnType: 'view',
                onDelete: () => {
                    t.handleDeleteUpload(myUploadViewItem.id)
                },
                updateItem(obj) {
                    t.updateState({
                        myUploadViewItem: {
                            ...obj
                        }
                    })
                },
            }
        };
        //--------------我的提问查看-----------------
        const updateAskViewWindow = (status = true) => {
            t.updateState({
                myAskViewItem: {
                    visible: status
                }
            })
        }
        const myAskViewItemProps = {
            updateWindow: updateAskViewWindow,
            modalProps: {
                title: '我的提问',
                visible: myAskViewItem.visible,
                onCancel: () => updateAskViewWindow(false),
                width: 900
            },
            contentProps: {
                ...myAskViewItem,
                uploaderInfo: {
                    applyManId: userInfo.userId,
                    applyManName: userInfo.userName,
                    unitId: userInfo.unitId,
                    unitName: userInfo.unitName,
                    photo: userInfo.photo
                },
                btnType: 'view',
                updateItem(obj) {
                    t.updateState({
                        myAskViewItem: {
                            ...obj
                        }
                    })
                },
                acceptAnswer(id, commentId) {
                    dispatch({
                        type: 'myKnowledge/acceptAnswer', payload: {
                            id, commentId,
                            onSuccess: function () {
                                message.success('采纳成功');
                                dispatch({
                                    type: 'myKnowledge/getAskList'
                                })
                                updateAskViewWindow(false);
                            },
                            onError: function (msg) {
                                message.error(msg);
                            }
                        }
                    })
                }
            }
        };
        //--------------我的回答查看-----------------
        const updateAnswerViewWindow = (status = true) => {
            t.updateState({
                myAnswerViewItem: {
                    visible: status
                }
            })
        }
        const myAnswerViewItemProps = {
            updateWindow: updateAnswerViewWindow,
            modalProps: {
                title: '我的回答',
                visible: myAnswerViewItem.visible,
                onCancel: () => updateAnswerViewWindow(false),
                width: 900
            },
            contentProps: {
                ...myAnswerViewItem,
                uploaderInfo: {
                    applyManId: userInfo.userId,
                    applyManName: userInfo.userName,
                    unitId: userInfo.unitId,
                    unitName: userInfo.unitName,
                    photo: userInfo.photo
                },
                btnType: 'view',
                updateItem(obj) {
                    t.updateState({
                        myAnswerViewItem: {
                            ...obj
                        }
                    })
                },
                acceptAnswer(id, commentId) {
                }
            }
        };
        return(
            <div className={styles.normal}>
                <div className={styles.userInfo}>
                    <div className={styles.left}>
                        <img src={userInfo.photo ? '/cloudFile/common/downloadFile?id=' + userInfo.photo  :
                            './resources/images/default_user_photo.png'
                        }/>
                    </div>
                    <div className={styles.right}>
                        <div className={styles.name}>
                        {userInfo.userName}
                        </div>
                        <div className={styles.detail}>
                            <div className={styles.item}>
                                <div style={{ color:'#FF9600'}} className={styles.icon}>
                                    <Icon type='jifen1'/>
                                </div>
                                <div className={styles.text}>
                                    积分：{userInfo.myScore}
                                    <div className={styles.splitLine} />
                                </div>
                                
                            </div>
                            <div className={styles.item}>
                                <div style={{ color: '#007EFF' }} className={styles.icon}>
                                    <Icon type='wenzhang' />
                                </div>
                                <div className={styles.text}>
                                    已上传：{userInfo.myUploadIdsSize}篇
                                    <div className={styles.splitLine} />
                                </div>

                            </div>
                            <div className={styles.item}>
                                <div style={{ color: '#1BB752' }} className={styles.icon}>
                                    <Icon type='tiwen' />
                                </div>
                                <div className={styles.text}>
                                    提问：{userInfo.myAskIdsSize}次
                                    <div className={styles.splitLine} />
                                </div>

                            </div>
                            <div className={styles.item}>
                                <div style={{ color: '#EF371E' }} className={styles.icon}>
                                    <Icon type='pinglun' />
                                </div>
                                <div className={styles.text}>
                                    评论：{userInfo.myAnasterIdsSize}次
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.listContainer}>
                    <div className={styles.tabContainer}>
                        <div onClick={()=>{
                            if (selectedKey !=='myUpload'){
                                t.updateState({
                                    selectedKey:'myUpload',
                                    currentPage:1
                                })
                                dispatch({
                                    type:'myKnowledge/getUploadList'
                                })
                            }
                            
                        }} className={`${styles.tab} ${selectedKey==='myUpload'?styles.selectedTab:styles.unselectedTab}`}>
                            <Icon type='shangchuan1' />
                            我的上传
                            {
                                selectedKey === 'myUpload'?
                                <div className={styles.arrow}>
                                    <Icon  type='arrowL'/>
                                </div>
                                    :''
                            }
                        </div>
                        <div onClick={() => {
                            if (selectedKey !== 'myAsk') {
                                t.updateState({
                                    selectedKey: 'myAsk',
                                    currentPage: 1
                                })
                                dispatch({
                                    type: 'myKnowledge/getAskList'
                                })
                            }

                        }} className={`${styles.tab} ${selectedKey==='myAsk'?styles.selectedTab:styles.unselectedTab}`}>
                            <Icon type='tiwen1'/>
                            我的提问
                            {
                                selectedKey === 'myAsk' ?
                                    <div className={styles.arrow}>
                                        <Icon type='arrowL' />
                                    </div>
                                    : ''
                            }
                        </div>
                        <div onClick={() => {
                            if (selectedKey !== 'myAnswer') {
                                t.updateState({
                                    selectedKey: 'myAnswer',
                                    currentPage: 1
                                })
                                dispatch({
                                    type: 'myKnowledge/getAnswerList'
                                })
                            }

                        }} className={`${styles.tab} ${selectedKey==='myAnswer'?styles.selectedTab:styles.unselectedTab}`}>
                            <Icon type='huida' />
                            我的回答
                            {
                                selectedKey === 'myAnswer' ?
                                    <div className={styles.arrow}>
                                        <Icon type='arrowL' />
                                    </div>
                                    : ''
                            }
                        </div>
                    </div>
                    <div className={styles.tableContainer}>
                        <VtxDatagrid {...vtxDatagridProps} />
                    </div>
                </div>
                {myUploadViewItem.visible && <ViewUploadItem {...myUploadViewItemProps}/>}
                {myAskViewItem.visible && <ViewAskItem {...myAskViewItemProps} />}
                {myAnswerViewItem.visible && <ViewAskItem {...myAnswerViewItemProps} />}
            </div>
        )
    }
}
export default connect(
    ({ myKnowledge }) => ({ myKnowledge })
)(MyKnowledge);