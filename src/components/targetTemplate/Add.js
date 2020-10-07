import React from 'react';

import { VtxModal, VtxModalList } from 'vtx-ui';
import { Button, Select,Input,Table,Tag } from 'antd';
import _filter from 'lodash/filter';
import { VtxUtil } from '../../utils/util';
import styles from './index.less';
const Option = Select.Option;
const Search = Input.Search;
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
            <Button key='submit' type='primary' size='large'
                loading={loading}
                onClick={()=>{
                    _t.modalList.submit().then((state) => {
                        state && save(); // 保存事件
                    })
                }
            }>保存</Button>
        ]
    }
    handleDelTag = (id) => {
        const { selectedTargets, checkedTargets,updateItem} = this.props.contentProps
        const newselectedTargets = _filter(selectedTargets, function (o) { return o.id !== id })
        const newCheckedTargets = _filter(checkedTargets,function(o){ return o!==id})
        updateItem({
            selectedTargets:newselectedTargets,
            checkedTargets:newCheckedTargets
        })
    }
    render() {
        const t = this;
        const { dispatch, modalProps, contentProps } = this.props;
        const { id, name, businessId, businessSelect, processTypeId, processTypeSelect, smallTypeSelect,smallTypeId,selectedTargets, searchName,
            targetList, targetListLoading, checkedTargets, handleSearch, clearTargets } = contentProps
        const { updateItem } = contentProps;
        const columns = [{
            dataIndex:'name',
            key:'name',
            title:'指标名称',
            width:300
        },{
            dataIndex:'code',
            key:'code',
            title:'指标编码',
            width:300
        }]
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
                    <Input
                        value={name}
                        onChange={(e) => {
                            updateItem({
                                name: e.target.value
                            })
                        }}
                        placeholder="请输入模版名称（必填项）"
                        maxLength="32"
                        data-modallist={{
                            layout: {
                                comType: 'input',
                                require: true,
                                name: '模版名称',
                                width: '50',
                                key: 'name'
                            },
                            regexp: {
                                value: name,
                                repete: {
                                    url: '/cloud/gzzhsw/api/cp/target/template/check.smvc',
                                    key: {
                                        tenantId: VtxUtil.getUrlParam('tenantId'),
                                        id,
                                        paramCode: 'name',
                                        paramValue: name
                                    }
                                }
                            }
                        }}
                    />
                    <Select
                        value={businessId}
                        onChange={(value) => {
                            clearTargets()
                            updateItem({
                                businessId : value,
                                smallTypeId:'',
                                searchName:''
                            });
                            handleSearch('')
                            
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
                        value={processTypeId}
                        onChange={(value) => {
                            updateItem({
                                processTypeId : value
                            })
                        }}
                        placeholder="请选择工艺名称（必选项）"
                        allowClear
                        data-modallist={{
                            layout:{
                                comType: 'input',
                                require: true,
                                name: '工艺名称',
                                width: '50',
                                key: 'processTypeId'
                            },
                            regexp : {
                                value : processTypeId
                            }
                        }}
                    >
                        {processTypeSelect.map(item => {
                            return <Option key={item.id}>{item.name}</Option>
                        }) }
                    </Select>
                    <div data-modallist={{ layout: { width: '100' } }} className={styles.splitLine}/>
                    <div data-modallist={{ layout: { width: '100',name:'已选指标',key:'selectedTargets' } }}>
                        {
                            selectedTargets.map((item)=>{
                                return (
                                    <Tag key={item.id} onClose={() => { t.handleDelTag(item.id)}} closable>{item.name}</Tag>
                                )
                            })
                        }
                    </div>
                    <div data-modallist={{ layout: { width: '100', name: '选择指标',style:{fontSize:'15px'}}}}/>
                </VtxModalList>
                <div className={styles.box}>
                        指标小类：
                        <Select
                        className={styles.inputContainer}
                            value={smallTypeId}
                            onChange={(value)=>{
                                updateItem({
                                    smallTypeId: value
                                })
                                handleSearch(searchName, value)
                            }}
                        >
                        <Option value=''>全部</Option>
                        {smallTypeSelect.map(item => {
                            return <Option key={item.id}>{item.name}</Option>
                        })}
                        </Select>
                        指标名称：
                        <Search
                            className={styles.inputContainer}
                            value={searchName}
                            onChange={(e)=>{
                                updateItem({
                                    searchName: e.target.value
                                })
                            }}
                            onSearch={(value) => { handleSearch(value, smallTypeId)}}
                        />
                        <Table
                            className={styles.table}
                            columns={columns}
                            dataSource={targetList}
                            pagination={false}
                            loading={targetListLoading}
                            size='small'
                            scroll={{y:300}}
                            rowKey={record=>record.id}
                            rowSelection={{
                                type: 'checkbox',
                                selectedRowKeys: checkedTargets,
                                onChange(selectedRowKeys, selectedRows) {
                                    updateItem({
                                        checkedTargets:selectedRowKeys,
                                        selectedTargets: selectedRows
                                    });
                                }
                            }}
                                />
                </div>
            </VtxModal>
        )
    }
}

export default ADD;