import React from 'react';
import {connect} from 'dva';
import moment from 'moment';
import 'moment/locale/zh-cn';
import {VtxDatagrid, VtxGrid} from "vtx-ui";
import {Input, Button, Modal, message, Icon} from "antd";
import Detail from './Detail';
import {delPopconfirm} from "../../utils/util";

moment.locale('zh-cn');

class ExceedReason extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    };
    
    componentDidMount() {
    
    }
    
    render() {
        const {dispatch, exceedReasonM, accessControlM, loading, submitLoading} = this.props;
        const {isAdministrator, targetSmallTypes, searchParams, gridParams, dataList, dataTotal, delIds, modalParams} = exceedReasonM;
        const {reason} = gridParams;
        const {page, size} = searchParams;
        const {type, visible, title, detail} = modalParams;
        
        let buttonLimit = {};
        if (accessControlM['EXCEEDREASON'.toLowerCase()]) {
            buttonLimit = accessControlM['EXCEEDREASON'.toLowerCase()]
        }
        //更改搜索条件
        const changeGridParams = (target, value) => {
            dispatch({
                type: 'exceedReasonM/updateGridParams',
                payload: {
                    [target]: value
                }
            })
        };
        const changeSearchParams = (target, value) => {
            dispatch({
                type: 'exceedReasonM/updateSearchParams',
                payload: {
                    [target]: value
                }
            })
        };
        //列表配置
        const tableProps = {
            loading,
            columns: [{
                title: '原因',
                dataIndex: 'reason',
                key: 'reason'
            }, {
                title: '指标小类',
                dataIndex: 'targetSmallTypeName',
                key: 'targetSmallTypeName'
            }, {
                title: '操作',
                dataIndex: 'edit',
                key: 'edit',
                render: (text, rowData) => (
                    <span>
                        {(buttonLimit['EDIT'] || !!isAdministrator) && <Icon type='file-edit'
                                                                             onClick={() => {
                                                                                 updateModalParams('type', 'edit');
                                                                                 updateModalParams('visible', true);
                                                                                 updateModalParams('title', '超标原因管理>编辑');
                                                                                 updateModalParams('detail', rowData);
                                                                             }}/>}
                        {(buttonLimit['DELETE'] || !!isAdministrator) && <span>
                            <span className="ant-divider"/>
                            {
                                delPopconfirm(() => dispatch({
                                    type: 'exceedReasonM/deleteEntity',
                                    payload: {ids: rowData.id}
                                }))
                            }
                        </span>}
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
            startIndex: page * size + 1, //后端分页
            indexTitle: '序号',
            pagination: {
                showSizeChanger: true,
                showQuickJumper: true,
                current: page + 1,
                total: dataTotal,
                pageSize: size,
                // 当前页码改变的回调
                onChange(page, pageSize) {
                    changeSearchParams('page', page - 1);
                    changeSearchParams('size', pageSize);
                    dispatch({
                        type: 'exceedReasonM/updateState',
                        payload: {gridParams: {...gridParams, ...searchParams}}
                    });
                    dispatch({type: 'exceedReasonM/pageList'})
                },
                // size 变化的回调
                onShowSizeChange(current, size) {
                    changeSearchParams('page', current - 1);
                    changeSearchParams('size', size);
                    dispatch({
                        type: 'exceedReasonM/updateState',
                        payload: {gridParams: {...gridParams, ...searchParams}}
                    });
                    dispatch({type: 'exceedReasonM/pageList'})
                },
                showTotal: total => `合计 ${total} 条`
            },
            rowSelection: {
                type: 'checkbox',
                selectedRowKeys: delIds,
                onChange: (selectedRowKeys, selectedRows) => dispatch({
                    type: 'exceedReasonM/updateState',
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
                dispatch({
                    type: 'exceedReasonM/saveOredit',
                    payload: {
                        values: {
                            id: type === 'add' ? null : detail.id,
                            ...values
                        },
                        onComplete: () => closeModal()
                    }
                })
            })
        };
        //关闭模态框
        const closeModal = () => {
            dispatch({type: 'exceedReasonM/clearModalParams'});
            this.modalForm.getForm().resetFields();
        };
        //更改模态框相关配置
        const updateModalParams = (target, value) => {
            dispatch({
                type: 'exceedReasonM/updateModalParams',
                payload: {
                    [target]: value
                }
            })
        };
        //模态框配置
        const modalProps = {
            visible,
            title,
            maskClosable: false,
            width: 500,
            onCancel: () => closeModal()
        };
        //模态框内容配置
        const detailProps = {
            type,
            detail,
            targetSmallTypes,
            wrappedComponentRef: dom => this.modalForm = dom
        };
        
        return (
            <div className="main_page">
                <VtxGrid titles={['原因']}
                         gridweight={[1]}
                         confirm={() => {
                             dispatch({
                                 type: 'exceedReasonM/updateState',
                                 payload: {searchParams: {...searchParams, ...gridParams}}
                             });
                             dispatch({type: 'exceedReasonM/pageList'})
                         }}
                         clear={() => {
                             dispatch({type: 'exceedReasonM/clearGridParams'});
                             dispatch({type: 'exceedReasonM/clearSearchParams'});
                             dispatch({type: 'exceedReasonM/pageList'})
                         }}>
                    <Input value={reason}
                           onChange={(e) => changeGridParams('reason', e.target.value)}
                           onPressEnter={() => {
                               dispatch({
                                   type: 'exceedReasonM/updateState',
                                   payload: {searchParams: {...searchParams, ...gridParams}}
                               });
                               dispatch({type: 'exceedReasonM/pageList'})
                           }}
                    />
                </VtxGrid>
                <div className="table-wrapper">
                    <div className="handle_box">
                        {(buttonLimit['ADD'] || !!isAdministrator) && <Button icon="file-add"
                                                                              onClick={() => {
                                                                                  updateModalParams('type', 'add');
                                                                                  updateModalParams('visible', true);
                                                                                  updateModalParams('title', '超标原因管理>新增');
                                                                              }}>新增</Button>}
                        {(buttonLimit['DELETE'] || !!isAdministrator) && <Button icon="delete"
                                                                                 disabled={delIds.length === 0}
                                                                                 onClick={() => {
                                                                                     Modal.confirm({
                                                                                         title: null,
                                                                                         content: `确定删除此${delIds.length}条数据？`,
                                                                                         onOk: () => dispatch({
                                                                                             type: 'exceedReasonM/deleteEntity',
                                                                                             payload: {ids: delIds.join(',')}
                                                                                         })
                                                                                     })
                                                                                 }}>删除</Button>}
                    </div>
                    <div className='table-content'>
                        <VtxDatagrid {...tableProps} />
                    </div>
                </div>
                <Modal {...modalProps}
                       footer={type !== 'view' ? [
                           <Button key='submit'
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

const exceedReasonProps = (state) => {
    return {
        exceedReasonM: state.exceedReasonM,
        accessControlM: state.accessControlM,
        loading: state.loading.effects['exceedReasonM/pageList'],
        submitLoading: state.loading.effects['exceedReasonM/addSave'] || state.loading.effects['exceedReasonM/addUpdate']
    };
};

export default connect(exceedReasonProps)(ExceedReason);
