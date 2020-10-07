import React from 'react';
import {connect} from 'dva';
import moment from 'moment';
import 'moment/locale/zh-cn';
import {VtxDatagrid, VtxGrid} from "vtx-ui";
import {Input, Button, Modal, message, Icon} from "antd";
import Detail from './Detail';
import {delPopconfirm} from "../../utils/util";

moment.locale('zh-cn');

class NewsManage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    };
    
    componentDidMount() {
    
    }
    
    render() {
        const {dispatch, newsManageM, loading, submitLoading} = this.props;
        const {gridParams, searchParams, dataList, dataTotal, delIds, modalParams} = newsManageM;
        const {title} = gridParams;
        const {page, rows} = searchParams;
        const {type, visible, title: modalTitle, detail} = modalParams;
        
        //更改搜索条件
        const changeGridParams = (target, value) => {
            dispatch({
                type: 'newsManageM/updateGridParams',
                payload: {
                    [target]: value
                }
            })
        };
        const changeSearchParams = (target, value) => {
            dispatch({
                type: 'newsManageM/updateSearchParams',
                payload: {
                    [target]: value
                }
            })
        };
        //列表配置
        const tableProps = {
            loading,
            columns: [{
                title: '标题',
                dataIndex: 'title',
                key: 'title',
                nowrap: true
            }, {
                title: '上传日期',
                dataIndex: 'newsPublishDateStr',
                key: 'newsPublishDateStr',
                nowrap: true
            }, {
                title: '操作',
                dataIndex: 'edit',
                key: 'edit',
                render: (text, rowData) => (
                    <span>
                        <Icon type='file-edit'
                              title='编辑'
                              onClick={() => {
                                  updateModalParams('type', 'edit');
                                  updateModalParams('visible', true);
                                  updateModalParams('title', '行业动态管理>编辑');
                                  updateModalParams('detail', rowData);
                              }}/>
                        <span className="ant-divider"/>
                        {
                            delPopconfirm(() => dispatch({
                                type: 'newsManageM/deleteEntity',
                                payload: {ids: rowData.id}
                            }))
                        }
                    </span>
                )
            }],
            dataSource: dataList,
            rowKey: record => record.id,
            indexColumn: true,
            autoFit: true,
            scroll: {
                x: 1000,
            },
            startIndex: page * rows + 1, //后端分页
            indexTitle: '序号',
            pagination: {
                showSizeChanger: true,
                showQuickJumper: true,
                current: page + 1,
                total: dataTotal,
                pageSize: rows,
                // 当前页码改变的回调
                onChange(page, pageSize) {
                    changeSearchParams('page', page - 1);
                    changeSearchParams('rows', pageSize);
                    dispatch({
                        type: 'newsManageM/updateState',
                        payload: {gridParams: {...gridParams, ...searchParams}}
                    });
                    dispatch({type: 'newsManageM/pageList'})
                },
                // size 变化的回调
                onShowSizeChange(current, size) {
                    changeSearchParams('page', current - 1);
                    changeSearchParams('rows', size);
                    dispatch({
                        type: 'newsManageM/updateState',
                        payload: {gridParams: {...gridParams, ...searchParams}}
                    });
                    dispatch({type: 'newsManageM/pageList'})
                },
                showTotal: total => `合计 ${total} 条`
            },
            rowSelection: {
                type: 'checkbox',
                selectedRowKeys: delIds,
                onChange: (selectedRowKeys, selectedRows) => dispatch({
                    type: 'newsManageM/updateState',
                    payload: {delIds: selectedRowKeys}
                })
            }
        };
        //新增或编辑
        const handle = (type) => {
            const childForm = this.modalForm.getForm();
            childForm.validateFieldsAndScroll((err, values) => {
                if (err) {
                    message.warn("存在未填写或错误字段，无法提交");
                    return;
                }
                const method = type === 'add' && 'newsManageM/addSave' || type === 'edit' && 'newsManageM/addUpdate';
                dispatch({
                    type: method,
                    payload: {
                        values: {
                            ...values
                        },
                        onComplete: () => closeModal()
                    }
                })
            })
        };
        //关闭模态框
        const closeModal = () => {
            dispatch({type: 'newsManageM/clearModalParams'});
            this.modalForm.getForm().resetFields();
        };
        //更改模态框相关配置
        const updateModalParams = (target, value) => {
            dispatch({
                type: 'newsManageM/updateModalParams',
                payload: {
                    [target]: value
                }
            })
        };
        //模态框配置
        const modalProps = {
            visible,
            title: modalTitle,
            maskClosable: false,
            width: 500,
            onCancel: () => closeModal()
        };
        //模态框内容配置
        const detailProps = {
            detail,
            type,
            wrappedComponentRef: dom => this.modalForm = dom
        };
        
        return (
            <div className="main_page">
                <VtxGrid titles={['标题']}
                         gridweight={[1]}
                         confirm={() => {
                             dispatch({
                                 type: 'newsManageM/updateState',
                                 payload: {searchParams: {...searchParams, ...gridParams}}
                             });
                             dispatch({type: 'newsManageM/pageList'})
                         }}
                         clear={() => {
                             dispatch({type: 'newsManageM/clearGridParams'});
                             dispatch({type: 'newsManageM/clearSearchParams'});
                             dispatch({type: 'newsManageM/pageList'})
                         }}>
                    <Input value={title} onChange={(e) => changeGridParams('title', e.target.value)}
                           onPressEnter={() => {
                               dispatch({
                                   type: 'newsManageM/updateState',
                                   payload: {searchParams: {...searchParams, ...gridParams}}
                               });
                               dispatch({type: 'newsManageM/pageList'})
                           }}
                    />
                </VtxGrid>
                <div className="table-wrapper">
                    <div className="handle_box">
                        <Button icon="file-add"
                                onClick={() => {
                                    updateModalParams('type', 'add');
                                    updateModalParams('visible', true);
                                    updateModalParams('title', '行业动态管理>新增');
                                }}>新增</Button>
                        <Button icon="delete"
                                disabled={delIds.length === 0}
                                onClick={() => {
                                    Modal.confirm({
                                        title: null,
                                        content: `确定删除此${delIds.length}条数据？`,
                                        onOk: () => dispatch({
                                            type: 'newsManageM/deleteEntity',
                                            payload: {ids: delIds.join(',')}
                                        })
                                    })
                                }}>删除</Button>
                    </div>
                    <div className='table-content'>
                        <VtxDatagrid {...tableProps} />
                    </div>
                </div>
                <Modal {...modalProps}
                       footer={type !== 'view' ? [<Button key='submit'
                                                          type='primary'
                                                          loading={submitLoading}
                                                          onClick={() => handle(type)}>保存</Button>
                       ] : null}
                >
                    <Detail {...detailProps}/>
                </Modal>
            </div>
        );
    };
}

const newsManageProps = (state) => {
    return {
        newsManageM: state.newsManageM,
        loading: state.loading.effects['newsManageM/pageList'],
        submitLoading: state.loading.effects['newsManageM/addSave'] || state.loading.effects['newsManageM/addUpdate']
    };
};

export default connect(newsManageProps)(NewsManage);
