import React from 'react';

import { VtxModal, VtxModalList } from 'vtx-ui';
import { Button, Select,Checkbox,Table,Tag,Icon,Tooltip,Input } from 'antd';
import _filter from 'lodash/filter';
import _find from 'lodash/find';
import { DraggableArea } from 'react-draggable-tags';
import _findIndex from 'lodash/findIndex';
import {VtxUtil} from '../../utils/util'
import styles from './index.less';
const Option = Select.Option;
const CheckboxGroup = Checkbox.Group;
const CheckableTag = Tag.CheckableTag;

class ADD extends React.Component {

	constructor(props) {
		super(props);
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
        const { selectedTargets, checkedTargets, updateItem } = this.props.contentProps
        const newSelectedTargets = _filter(selectedTargets, function (o) { return o.id !== id })
        const newCheckedTargets = _filter(checkedTargets, function (o) {  return o !== id })
        updateItem({
            selectedTargets: newSelectedTargets,
            checkedTargets: newCheckedTargets
        })
    }
    changeCheckTemplate = (checkedValues)=>{
        const { updateItem, queryTargetsByTemplateId,typeCode} = this.props.contentProps
        updateItem({
            checkedTemplates:checkedValues
        })
        queryTargetsByTemplateId(checkedValues.join(), typeCode)
    }
    handleSort=(index)=>{
        const { selectedTag, selectedIndex} = this.state;
        const { selectedTargets, updateItem} = this.props.contentProps;
        //先将选中的元素提取出来
        const toSortTag = _find(selectedTargets,{id:selectedTag});
        let editableTargets = _filter(selectedTargets, function (o) { return o.id!==selectedTag; });
        editableTargets.splice(selectedIndex>index?index:index-1,0,toSortTag)
        updateItem({
            selectedTargets: editableTargets
        })
    }
    render() {
        const t = this;
        const { dispatch, modalProps, contentProps } = this.props;
        const { id, waterFactoryId, selectedTargets, checkedTargets, checkedTemplates, waterFactorySelect, templateSelect,
            targetList, targetListLoading, typeCode} = contentProps
        const { updateItem } = contentProps;
        const typeCodeName = {
            'JHZB': '计划指标',
            'SCZB': '生产指标',
            'HYZB': '化验指标',
            'DHZB': '单耗指标'
        }
        const columns = [{
            dataIndex: 'name',
            key: 'name',
            title: '指标名称',
            width:100
        }, {
            dataIndex: 'code',
            key: 'code',
            title: '指标编码',
            width:100
        },{
            dataIndex: 'typeName',
            key: 'typeName',
            title: '指标大类',
            width:100
        },{
            dataIndex: 'smallTypeName',
            key: 'smallTypeName',
            title: '指标小类',
            width:100
        },{
            dataIndex: 'categoryValue',
            key: 'categoryValue',
            title: '计算指标',
            width:100
        },{
            dataIndex: 'formula',
            key: 'formula',
            title: '计算公式',
            width:150
        },{
            dataIndex:'rationalRange',
            key:'rationalRange',
            title:'合理范围',
            render:(text,record,index)=>{
                return (
                    <Input value={text} onChange={(e)=>{
                        updateItem({
                            targetList:{
                                [index]:{
                                    rationalRange:e.target.value
                                }
                            }
                        })
                        let findIndex = _findIndex(selectedTargets, { id: record.id })
                        if (findIndex>-1){
                            updateItem({
                                selectedTargets: {
                                    [findIndex]: {
                                        rationalRange: e.target.value
                                    }
                                }
                            })
                        }
                    }}/>
                )
            }
        }];
        // let showTags = [];//展示的指标
        // selectedTargets.map((item,index) => {
        //     const nextItem = selectedTargets[index+1]
        //     if (!isSort){
        //         showTags.push(
        //             <Tag key={item.id} onClose={() => { t.handleDelTag(item.id) }} closable>{item.name}</Tag>
        //         )
        //     }else{
        //         //在第一个标签前面放排序位
        //         if (selectedTag && index === 0 && selectedTag !== item.id){
        //             showTags.push(
        //                 <Tooltip key={0} title='放在这里'>
        //                     <Icon onClick={()=>t.handleSort(0)} className={styles.check} type="arrow-down" />
        //                 </Tooltip>
        //             )
        //         }
        //         showTags.push(
        //             <CheckableTag key={item.id} style={{ border: '1px dashed #c3c3c3' }} onChange={checked => t.setState({ selectedTag: checked ? item.id : '', selectedIndex:index})} checked={selectedTag===item.id}>{item.name}</CheckableTag>
        //         )
        //         if(selectedTag){
        //             //最后一个标签
        //             if (index + 1 === selectedTargets.length && selectedTag !== item.id) {
        //                 showTags.push(
        //                     <Tooltip key={index+1} title='放在这里'>
        //                         <Icon onClick={() => t.handleSort(index+1)} className={styles.check} type="arrow-down" />
        //                     </Tooltip>
        //                 )
        //             } else if (selectedTag !== item.id && selectedTag !== nextItem.id) {
        //                 showTags.push(
        //                     <Tooltip key={index+1}  title='放在这里'>
        //                         <Icon onClick={() => t.handleSort(index+1)} className={styles.check} type="arrow-down" />
        //                     </Tooltip>
        //                 )
        //             }
        //         }
                
                
        //     }
        // })
        return (
            <VtxModal
                {...modalProps}
                footer={this.footerRender()}
                className={styles.modalList}

            >
                <VtxModalList
                    isRequired
                    visible={modalProps.visible}
                    ref={this.modalListRef}
                >
                    <div data-modallist={{
                        layout: {
                            comType: 'input',
                            require: true,
                            name: '选择水厂',
                            width: '100',
                            key: 'waterFactoryId'
                        },
                        regexp: {
                            value: waterFactoryId,
                            repete: {
                                url: '/cloud/gzzhsw/api/cp/target/config/check.smvc',
                                key: {
                                    tenantId: VtxUtil.getUrlParam('tenantId'),
                                    id,
                                    paramCode: 'waterFactoryId,typeCode',
                                    paramValue: waterFactoryId + ',' + typeCode
                                }
                            }
                        }
                    }}>
                    
                    <Select
                        value={waterFactoryId}
                        onChange={(value) => {
                            updateItem({
                                waterFactoryId : value
                            })
                        }}
                        placeholder="请选择选择水厂（必选项）"
                        allowClear
                        showSearch
                        optionFilterProp='children'
                       style={{width:'50%'}}
                    >
                        {waterFactorySelect.map(item => {
                            return <Option key={item.id}>{item.name}</Option>
                        }) }
                    </Select>
                    </div>
                    <div className={styles.AddAndDelete} data-modallist={{ layout: { width: '100', name: typeCodeName[typeCode], key: 'selectedTargets' } }}>
                        {/*showTags*/}
                        <DraggableArea
                            tags={selectedTargets}
                            render={({ tag, index }) => (
                                <div className={styles.tag}>
                                    <img
                                        className={styles.delete}
                                        src='./resources/images/delete.png'
                                        onClick={() => t.handleDelTag(tag.id)}
                                    />
                                    {tag.name}
                                </div>
                            )}
                            onChange={tags => {
                                updateItem({
                                    selectedTargets: tags
                                })}}
                        />
                    </div>
                    <div data-modallist={{ layout: { width: '100' } }} className={styles.splitLine} />
                    <div data-modallist={{ layout: { width: '100', name: '模版选择', key: 'templateSelect' } }}>
                        <CheckboxGroup options={templateSelect} value={checkedTemplates} onChange={t.changeCheckTemplate}/>
                    </div>
                </VtxModalList>
                <div className={styles.tableBox}>
                    <Table
                        className={styles.table}
                        columns={columns}
                        dataSource={targetList}
                        pagination={false}
                        loading={targetListLoading}
                        size='small'
                        scroll={{ y: 300 }}
                        rowKey={record => record.id}
                        rowSelection={{
                            type: 'checkbox',
                            selectedRowKeys: checkedTargets,
                            onChange(selectedRowKeys,selectedRows) {
                                //原来有数据新增勾选单个选项
                                if(selectedRowKeys.length-checkedTargets.length===1&&checkedTargets.length!==0){
                                    //找出新增的单个选项
                                    const addItem = _find(selectedRows,function(o){return checkedTargets.indexOf(o.id)===-1});                                    
                                    updateItem({
                                        selectedTargets:selectedTargets.concat(addItem)
                                    })
                                } else if (selectedRowKeys.length>checkedTargets.length){ //新增勾选多条数据
                                    updateItem({
                                        selectedTargets: selectedRows,
                                    });

                                } else if (selectedRowKeys.length < checkedTargets.length && selectedRowKeys.length!==0){ //取消勾选单个选项
                                    const newSelectedTargets = _filter(selectedTargets,function(o){return selectedRowKeys.indexOf(o.id)!==-1});
                                    updateItem({
                                        selectedTargets: newSelectedTargets,
                                    });
                                }else{//全部取消勾选
                                    updateItem({
                                        selectedTargets: [],
                                    });
                                }
                                updateItem({
                                    checkedTargets: selectedRowKeys,
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