import React from 'react';
import {connect} from 'dva';
import moment from 'moment';
import 'moment/locale/zh-cn';
import {VtxDatagrid, VtxGrid} from "vtx-ui";
import {Input, Button, Modal, message, DatePicker, Select, Icon} from "antd";
import Detail from './Detail';
import {delPopconfirm} from "../../utils/util";

moment.locale('zh-cn');
const {RangePicker} = DatePicker;
const Option = Select.Option;

class FaultType extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    };
    
    componentDidMount() {
    
    }
    
    render() {
        const {dispatch, faultTypeM, accessControlM, loading, submitLoading} = this.props;
        const {equipmentTypes, gridParams, searchParams, dataList, dataTotal, delIds, modalParams} = faultTypeM;
        const {code, name} = gridParams;
        const {page, size} = searchParams;
        const {type, visible, title, detail} = modalParams;
        
        let buttonLimit = {};
        if (accessControlM['faultType'.toLowerCase()]) {
            buttonLimit = accessControlM['faultType'.toLowerCase()]
        }
        //更改搜索条件
        const changeGridParams = (target, value) => {
            dispatch({
                type: 'faultTypeM/updateGridParams',
                payload: {
                    [target]: value
                }
            })
        };
        const changeSearchParams = (target, value) => {
            dispatch({
                type: 'faultTypeM/updateSearchParams',
                payload: {
                    [target]: value
                }
            })
        };
        //设备类型选择
        const typeSelect = {
            style: {width: '100%'},
            value: code,
            onChange: (value) => {
                changeGridParams('code', value);
                changeSearchParams('code', value);
                dispatch({type: 'faultTypeM/pageList'})
            }
        };
        //列表配置
        const tableProps = {
            loading,
            columns: [{
                title: '设备类型',
                dataIndex: 'codeStr',
                key: 'codeStr',
                nowrap: true
            }, {
                title: '故障类型',
                dataIndex: 'name',
                key: 'name',
                nowrap: true
            }, {
                title: '操作',
                dataIndex: 'edit',
                key: 'edit',
                render: (text, rowData) => (
                    <span>
                        {buttonLimit['EDIT'] && <Icon type='file-edit'
                                                      title='编辑'
                                                      onClick={() => {
                                                          updateModalParams('type', 'edit');
                                                          updateModalParams('visible', true);
                                                          updateModalParams('title', '故障类型管理>编辑');
                                                          updateModalParams('detail', rowData);
                                                      }}/>}
                        {buttonLimit['EDIT'] && <span>
                            <span className="ant-divider"/>
                            {
                                delPopconfirm(() => dispatch({
                                    type: 'faultTypeM/deleteEntity',
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
                        type: 'faultTypeM/updateState',
                        payload: {gridParams: {...gridParams, ...searchParams}}
                    });
                    dispatch({type: 'faultTypeM/pageList'})
                },
                // size 变化的回调
                onShowSizeChange(current, size) {
                    changeSearchParams('page', current - 1);
                    changeSearchParams('size', size);
                    dispatch({
                        type: 'faultTypeM/updateState',
                        payload: {gridParams: {...gridParams, ...searchParams}}
                    });
                    dispatch({type: 'faultTypeM/pageList'})
                },
                showTotal: total => `合计 ${total} 条`
            },
            rowSelection: {
                type: 'checkbox',
                selectedRowKeys: delIds,
                onChange: (selectedRowKeys, selectedRows) => dispatch({
                    type: 'faultTypeM/updateState',
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
                const method = type === 'add' && 'faultTypeM/addSave' || type === 'edit' && 'faultTypeM/addUpdate';
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
            dispatch({type: 'faultTypeM/clearModalParams'});
            this.modalForm.getForm().resetFields();
        };
        //更改模态框相关配置
        const updateModalParams = (target, value) => {
            dispatch({
                type: 'faultTypeM/updateModalParams',
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
            detail,
            type,
            equipmentTypes,
            checkName: (codeValue, value, callback) => {
                if (value === detail.name || !value) {
                    callback();
                    return;
                }
                dispatch({
                    type: 'faultTypeM/nameExist',
                    payload: {
                        id: detail.id,
                        type: 'faultType',
                        paramCode: 'code',
                        paramValue: codeValue,
                        paramCode2: 'name',
                        paramValue2: value
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
                <VtxGrid titles={['设备类型', '故障类型']}
                         gridweight={[1, 1]}
                         confirm={() => {
                             dispatch({
                                 type: 'faultTypeM/updateState',
                                 payload: {searchParams: {...searchParams, ...gridParams}}
                             });
                             dispatch({type: 'faultTypeM/pageList'})
                         }}
                         clear={() => {
                             dispatch({type: 'faultTypeM/clearGridParams'});
                             dispatch({type: 'faultTypeM/clearSearchParams'});
                             dispatch({type: 'faultTypeM/pageList'})
                         }}>
                    <Select {...typeSelect}>
                        {equipmentTypes.map(item => (
                            <Option value={item.id} key={item.id}>{item.name}</Option>
                        ))}
                    </Select>
                    <Input value={name}
                           onChange={(e) => changeGridParams('name', e.target.value)}
                           onPressEnter={() => {
                               dispatch({
                                   type: 'faultTypeM/updateState',
                                   payload: {searchParams: {...searchParams, ...gridParams}}
                               });
                               dispatch({type: 'faultTypeM/pageList'})
                           }}
                    />
                </VtxGrid>
                <div className="table-wrapper">
                    <div className="handle_box">
                        {buttonLimit['ADD'] && <Button icon="file-add"
                                                       onClick={() => {
                                                           updateModalParams('type', 'add');
                                                           updateModalParams('visible', true);
                                                           updateModalParams('title', '故障类型管理>新增');
                                                       }}>新增</Button>}
                        {buttonLimit['DELETE'] && <Button icon="delete"
                                                          disabled={delIds.length === 0}
                                                          onClick={() => {
                                                              Modal.confirm({
                                                                  title: null,
                                                                  content: `确定删除此${delIds.length}条数据？`,
                                                                  onOk: () => dispatch({
                                                                      type: 'faultTypeM/deleteEntity',
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

const faultTypeProps = (state) => {
    return {
        faultTypeM: state.faultTypeM,
        accessControlM: state.accessControlM,
        loading: state.loading.effects['faultTypeM/pageList'],
        submitLoading: state.loading.effects['faultTypeM/addSave'] || state.loading.effects['faultTypeM/addUpdate']
    };
};

export default connect(faultTypeProps)(FaultType);
