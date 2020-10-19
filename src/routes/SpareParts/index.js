import React from 'react';
import {connect} from 'dva';
import moment from 'moment';
import 'moment/locale/zh-cn';
import {VtxDatagrid, VtxGrid} from "vtx-ui";
import {Input, Button, Modal, message, Icon} from "antd";
import Detail from './Detail';
import {delPopconfirm} from "../../utils/util";

moment.locale('zh-cn');

class SpareParts extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    };
    
    componentDidMount() {
    
    }
    
    render() {
        const {dispatch, sparePartsM, accessControlM, loading, submitLoading} = this.props;
        const {userInfo, userList, gridParams, searchParams, dataList, dataTotal, delIds, modalParams} = sparePartsM;
        const {name} = gridParams;
        const {page, size} = searchParams;
        const {type, visible, title, detail} = modalParams;
        
        let buttonLimit = {};
        if (accessControlM['spareParts'.toLowerCase()]) {
            buttonLimit = accessControlM['spareParts'.toLowerCase()]
        }
        //更改搜索条件
        const changeGridParams = (target, value) => {
            dispatch({
                type: 'sparePartsM/updateGridParams',
                payload: {
                    [target]: value
                }
            })
        };
        const changeSearchParams = (target, value) => {
            dispatch({
                type: 'sparePartsM/updateSearchParams',
                payload: {
                    [target]: value
                }
            })
        };
        //列表配置
        const tableProps = {
            loading,
            columns: [{
                title: '名称',
                dataIndex: 'name',
                key: 'name',
                nowrap: true
            }, {
                title: '规格型号',
                dataIndex: 'modelNum',
                key: 'modelNum',
                nowrap: true
            }, {
                title: '用途',
                dataIndex: 'usedBy',
                key: 'usedBy',
                nowrap: true
            }, {
                title: '品牌',
                dataIndex: 'manufacturer',
                key: 'manufacturer',
                nowrap: true
            }, {
                title: '联系方式',
                dataIndex: 'contact',
                key: 'contact',
                nowrap: true
            }, {
                title: '备注',
                dataIndex: 'memo',
                key: 'memo',
                nowrap: true
            }, {
                title: '操作',
                dataIndex: 'edit',
                key: 'edit',
                render: (text, rowData) => (
                    <span>
                        {buttonLimit['VIEW'] && <Icon type='view'
                                                      title='查看'
                                                      onClick={() => {
                                                          updateModalParams('type', 'view');
                                                          updateModalParams('visible', true);
                                                          updateModalParams('title', '备品备件管理>查看');
                                                          updateModalParams('detail', rowData);
                                                      }}/>}
                        {buttonLimit['EDIT'] && <span>
                                <span className="ant-divider"/>
                                <Icon type='file-edit'
                                      title='编辑'
                                      onClick={() => {
                                          updateModalParams('type', 'edit');
                                          updateModalParams('visible', true);
                                          updateModalParams('title', '备品备件管理>编辑');
                                          updateModalParams('detail', rowData);
                                      }}/>
                                    </span>}
                        {buttonLimit['DELETE'] && <span>
                            <span className="ant-divider"/>
                            {
                                delPopconfirm(() => dispatch({
                                    type: 'sparePartsM/deleteEntity',
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
                        type: 'sparePartsM/updateState',
                        payload: {gridParams: {...gridParams, ...searchParams}}
                    });
                    dispatch({type: 'sparePartsM/pageList'})
                },
                // size 变化的回调
                onShowSizeChange(current, size) {
                    changeSearchParams('page', current - 1);
                    changeSearchParams('size', size);
                    dispatch({
                        type: 'sparePartsM/updateState',
                        payload: {gridParams: {...gridParams, ...searchParams}}
                    });
                    dispatch({type: 'sparePartsM/pageList'})
                },
                showTotal: total => `合计 ${total} 条`
            },
            rowSelection: {
                type: 'checkbox',
                selectedRowKeys: delIds,
                onChange: (selectedRowKeys, selectedRows) => dispatch({
                    type: 'sparePartsM/updateState',
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
                const method = type === 'add' && 'sparePartsM/addSave' || type === 'edit' && 'sparePartsM/addUpdate';
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
            dispatch({type: 'sparePartsM/clearModalParams'});
            this.modalForm.getForm().resetFields();
        };
        //更改模态框相关配置
        const updateModalParams = (target, value) => {
            dispatch({
                type: 'sparePartsM/updateModalParams',
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
            width: 800,
            onCancel: () => closeModal()
        };
        //模态框内容配置
        const detailProps = {
            userInfo,
            userList,
            detail,
            type,
            checkName: (value, callback) => {
                if (value === detail.name || !value) {
                    callback();
                    return;
                }
                dispatch({
                    type: 'sparePartsM/nameExist',
                    payload: {
                        id: detail.id,
                        key: 'name',
                        value
                    }
                }).then((data) => {
                    if (!!data) {
                        callback()
                    } else {
                        callback('名称不能重复')
                    }
                });
            },
            wrappedComponentRef: dom => this.modalForm = dom
        };
        
        return (
            <div className="main_page">
                <VtxGrid titles={['名称']}
                         gridweight={[1]}
                         confirm={() => {
                             dispatch({
                                 type: 'sparePartsM/updateState',
                                 payload: {searchParams: {...searchParams, ...gridParams}}
                             });
                             dispatch({type: 'sparePartsM/pageList'})
                         }}
                         clear={() => {
                             dispatch({type: 'sparePartsM/clearGridParams'});
                             dispatch({type: 'sparePartsM/clearSearchParams'});
                             dispatch({type: 'sparePartsM/pageList'})
                         }}>
                    <Input value={name}
                           onChange={(e) => changeGridParams('name', e.target.value)}
                           onPressEnter={() => {
                               dispatch({
                                   type: 'sparePartsM/updateState',
                                   payload: {searchParams: {...searchParams, ...gridParams}}
                               });
                               dispatch({type: 'sparePartsM/pageList'})
                           }}
                    />
                </VtxGrid>
                <div className="table-wrapper">
                    <div className="handle_box">
                        {buttonLimit['ADD'] && <Button icon="file-add"
                                                       onClick={() => {
                                                           updateModalParams('type', 'add');
                                                           updateModalParams('visible', true);
                                                           updateModalParams('title', '备品备件管理>新增');
                                                       }}>新增</Button>}
                        {buttonLimit['DELETE'] && <Button icon="delete"
                                                          disabled={delIds.length === 0}
                                                          onClick={() => {
                                                              Modal.confirm({
                                                                  title: null,
                                                                  content: `确定删除此${delIds.length}条数据？`,
                                                                  onOk: () => dispatch({
                                                                      type: 'sparePartsM/deleteEntity',
                                                                      payload: {ids: delIds.join(',')}
                                                                  })
                                                              })
                                                          }}>删除</Button>}
                    </div>
                    <div className='table-content'>
                        <VtxDatagrid {...tableProps} />
                    </div>
                </div>
                {!!visible && <Modal {...modalProps}
                                     footer={type !== 'view' ? [
                                         <Button key='submit'
                                                 type='primary'
                                                 loading={submitLoading}
                                                 onClick={() => handle(type)}>保存</Button>
                                     ] : null}
                >
                    <Detail {...detailProps}/>
                </Modal>}
            </div>
        );
    };
}

const sparePartsProps = (state) => {
    return {
        sparePartsM: state.sparePartsM,
        accessControlM: state.accessControlM,
        loading: state.loading.effects['sparePartsM/pageList'],
        submitLoading: state.loading.effects['sparePartsM/addSave'] || state.loading.effects['sparePartsM/addUpdate']
    };
};

export default connect(sparePartsProps)(SpareParts);
