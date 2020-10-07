/**
 * 知识检索
 * author :  xxy
 * createTime : 2019-08-13 15:48
 */
import React from 'react';
import { connect } from 'dva';

import { Button, message, Input,Icon,Tag,Pagination,Spin } from 'antd';
const CheckableTag = Tag.CheckableTag;
const InputGroup = Input.Group;
import moment from 'moment'
import styles from './index.less';
import {VtxUtil} from '../../utils/util'
class KnowledgeRetrieval extends React.Component{
    constructor(props){
        super(props)
        this.state={
            contentHeight:0
        }
    }
    componentDidMount() {
        this.setState({
            contentHeight: $('#header') && $('#header')[0] ? $('body').height() - $('#header')[0].clientHeight - 125:0
        })
        window.addEventListener('resize', this.onWindowResize)
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.onWindowResize);
        this.setState = () => {
            return;
        };
    }
    onWindowResize = () => {
        this.setState({
            contentHeight: $('#header') && $('#header')[0] ? $('body').height() - $('#header')[0].clientHeight - 125 : 0
        })
    }
    updateState = (item) => {
        this.props.dispatch({
            type: 'knowledgeRetrieval/updateState',
            payload: {
                    ...item
            }
        })
    }
    handleChangeBusinessScope=(id, checked)=>{
        const { businessIds } = this.props.knowledgeRetrieval.searchParams;
        const nextSelectedTags = checked ?
            [...businessIds, id] :
            businessIds.filter(t => t !== id);
        this.updateState({
            searchParams:{
                businessIds: nextSelectedTags
            }});
        this.clearPage()
        this.getList()
    }
    handleChangeKnowledgeType = (id, checked) => {
        const { knowledgeTypeIds } = this.props.knowledgeRetrieval.searchParams;
        const nextSelectedTags = checked ?
            [...knowledgeTypeIds, id] :
            knowledgeTypeIds.filter(t => t !== id);
        this.updateState({
            searchParams: {
                knowledgeTypeIds: nextSelectedTags
            }
        });
        this.clearPage()
        this.getList()
    }
    clearPage=()=>{
        this.props.dispatch({
            type: 'knowledgeRetrieval/updateState',
            payload:{
                currentPage: 1, // 页码
            }
        })
    }
    getList=()=>{
        this.props.dispatch({
            type:'knowledgeRetrieval/getList'
        })
    }
    render(){
        const t = this;
        const { contentHeight} = t.state
        const { searchParams, businessScopeList, knowledgeTypeSelect, currentPage, pageSize, loading, dataSource,total} = this.props.knowledgeRetrieval
        const { keyword, knowledgeTypeIds, businessIds} = searchParams        
        return (
            <div className={styles.normal}>
                <div id='header' className={styles.header}>
                    <div className={styles.tagContainer}>
                        <div className={styles.singleLine}>
                            <div className={styles.text}>
                                业务范围：
                            </div>
                            <div className={styles.tags}>
                                <CheckableTag
                                    key='all'
                                    checked={businessIds.length == 0}
                                    onChange={checked => {
                                        if (checked) {
                                            t.updateState({
                                                searchParams: {
                                                    businessIds: []
                                                }
                                            })
                                            this.clearPage()
                                            this.getList()
                                        }
                                    }}
                                >
                                    全部
                                </CheckableTag>
                                <div className={styles.split} />
                                {businessScopeList.map((tag,index) => [
                                    <CheckableTag
                                        key={tag.id}
                                        checked={businessIds.indexOf(tag.id) > -1}
                                        onChange={checked => this.handleChangeBusinessScope(tag.id, checked)}
                                    >
                                        {tag.name}
                                    </CheckableTag>,
                                    index === businessScopeList.length - 1 ?'': <div className={styles.split} />
                                ])}
                            </div>

                        </div>
                        <div className={styles.singleLine}>
                            <div className={styles.text}>
                                知识类型：
                            </div>
                            <div className={styles.tags}>
                                <CheckableTag
                                    key='all'
                                    checked={knowledgeTypeIds.length == 0}
                                    onChange={checked => {
                                        if (checked) {
                                            t.updateState({
                                                searchParams: {
                                                    knowledgeTypeIds: []
                                                }
                                            })
                                            this.clearPage()
                                            this.getList()
                                        }
                                    }}
                                >
                                    全部
                                </CheckableTag>
                                <div className={styles.split} />
                                {knowledgeTypeSelect.map((tag,index) => [
                                    <CheckableTag
                                        key={tag.id}
                                        checked={knowledgeTypeIds.indexOf(tag.id) > -1}
                                        onChange={checked => this.handleChangeKnowledgeType(tag.id, checked)}
                                    >
                                        {tag.name}
                                    </CheckableTag>,
                                    index === knowledgeTypeSelect.length - 1 ? '' : <div className={styles.split} />
                                ])}
                            </div>
                        </div>
                    </div>
                    <div className={styles.inputContainer}>
                        <InputGroup style={{width:'430px',display:'inline-block',marginRight:'20px'}} compact>
                            <Input
                                placeholder='请输入技术关键词'
                                style={{ width: '400px' }}
                                value={keyword}
                                onChange={(e)=>{
                                    t.updateState({
                                        searchParams: {
                                            keyword: e.target.value
                                        }
                                    })
                                }}
                                onPressEnter={()=>{
                                    t.clearPage()
                                    t.getList()
                                }}
                            />
                            <Button onClick={()=>{
                                t.updateState({
                                    searchParams: {
                                        keyword: ''
                                    }
                                })
                            }} style={{ width: '30px',textAlign:'center',padding:'0' }} >
                                <Icon style={{color:'#c3c3c3'}} type="close" />
                            </Button>
                           
                        </InputGroup>
                        <Button onClick={() => {
                            t.clearPage()
                            t.getList()}} style={{ background: '#5c8eff', border:'#5c8eff'}}  type='primary'>查询</Button>
                    </div>

                    
                </div>
                <div style={{ height: contentHeight}} className={styles.content}>
                   
                   
                    <Spin spinning={loading}>
                        <div className={styles.listContainer}>
                            {
                                dataSource.length?
                                dataSource.map((item,index)=>{
                                    return (
                                        <div key={item.id} className={styles.listItem}>
                                            <div onClick={()=>{
                                                //跳转详情页
                                            }} className={styles.text}>
                                                <div className={styles.index}>{(currentPage - 1) * pageSize + index + 1}</div>
                                                <div className={styles.type}>【{item.knowledgeTypeName}】</div>
                                                <div className={styles.greyDot} />
                                                <div onClick={()=>{
                                                    this.props.history.push(`/knowledgeDetail?id=${item.id}&documentType=${item.documentType}&tenantId=${VtxUtil.getUrlParam('tenantId')}&userId=${VtxUtil.getUrlParam('userId')}&token=${VtxUtil.getUrlParam('token')||''}`);
                                                }} className={styles.title}>
                                                    
                                                    {item.title}
                                                
                                                </div>
                                                {moment(item.uploadDate).isAfter(moment().subtract(7,'days'))? <div className={styles.sup}>新</div> : ''}
                                            </div>
                                            <div className={styles.operation}>
                                                <a className={styles.rightBorder} onClick={() => {
                                                    this.props.history.push(`/knowledgeDetail?id=${item.id}&documentType=${item.documentType}& tenantId=${VtxUtil.getUrlParam('tenantId')}&userId=${VtxUtil.getUrlParam('userId')}&token=${VtxUtil.getUrlParam('token')}`);
                                                    //跳转详情页
                                                }}>浏览</a>
                                                {item.documentType === 'document' ? <div className={styles.split} /> : ''}
                                                {item.documentType==='document' ? <a>下载</a>:''}
                                            </div>
                                        </div>
                                    )
                                }) : <span><Icon type="frown-o" /> 暂无数据</span>
                            }
                        </div>
                    </Spin>
                   
                </div>
                <div className={styles.pagination}>
                    {
                        total > 0 ?
                            <Pagination showQuickJumper showTotal={(total, range) => `合计${total}条`} current={currentPage} pageSize={pageSize} total={total} onChange={(page, pageSize) => {
                                t.updateState({
                                    currentPage: page,
                                    pageSize
                                })
                                t.getList()
                            }} />
                            :''
                            
                    }

                </div>
            </div>
        )
    }
}
export default connect(
    ({ knowledgeRetrieval }) => ({ knowledgeRetrieval })
)(KnowledgeRetrieval);