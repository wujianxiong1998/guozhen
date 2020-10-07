/**
 * 问题诊断--首页
 * author :xxy
 * createTime : 2019-08-14
 */
import React from 'react';
import { connect } from 'dva';
import {Button,Modal} from 'antd'
import _find from 'lodash/find'
import styles from './index.less'
class ProblemDiagnose extends React.Component {
    constructor(props) {
        super(props)
    }
    updateState=(item)=>{
        this.props.dispatch({
            type:'problemDiagnose/updateState',
            payload:{
                ...item
            }
        })
    }
    
  //遍历查询所有下属节点
    eachArrayToChild = (id, flagCode)=>{
        var result = new Array();
        const {  allRules } = this.props.problemDiagnose
        if(flagCode){
            let parentId
            //先找出code对应节点的id
            allRules.forEach(element => {
                if (flagCode == element.flagCode) {
                    parentId = element.id;
                }
            });
            //再找出它的子节点
            allRules.forEach(element => {
                if (parentId == element.parentNode) {
                    result.push(element);
                }
            });
        }else{
            allRules.forEach(element => {
                if (id == element.parentNode) {
                    result.push(element);
                }
            });
        }
        return result;
    }
    handleClickCommonBox=(item)=>{
        const t =this
        const { id, ruleName, flagCode} = item
        const { allRules } = this.props.problemDiagnose
        let parentId
        allRules.forEach(element => {
            if (flagCode == element.flagCode) {
                parentId = element.id;
            }
        });
        const result = t.eachArrayToChild(id, flagCode)
        //切换显示页面
        t.updateState({
            showPanel: 'detail'
        })
        //获取查询首页内容添加到查询详情页
        t.updateState({
            navigationContent: [{ id: parentId, rule: ruleName, flagCode}],
            causeContent: result,
            causeContentHead:ruleName,
            showCauseContentHead:false
        })
    }
    handleClickHistoryBox=()=>{

    }
    handleClickCauseContent=(item)=>{
        const t = this;
        const { navigationContent} = t.props.problemDiagnose
        const results = t.eachArrayToChild(item.id)
        let countflag = 0
        if (0 != results.length && undefined != results){
            t.updateState({//追加到左侧;
                navigationContent: navigationContent.concat(item),
                causeContent: results,
            })
            results.forEach(m=>{
                var childResult = t.eachArrayToChild(m.id);
                if (0 == childResult.length || undefined == childResult) {
                    countflag++;
                }
            })
        }
        if (countflag == results.length) {
            if (results.length > 2) {
                var height = (results.length - 2) * 55 + 210;
                $("#cause").animate({ height: height + "px" })
            }
            t.updateState({//追加到左侧;
                showCauseContentHead: true,
            })
        }
    }
    handleClickNavigationItem=(item,index)=>{
        const t = this
        const {id,flagCode} = item
        const { navigationContent} = t.props.problemDiagnose
        //移除后面的节点
        t.updateState({
            navigationContent: navigationContent.slice(0,index+1),
        })
        //右侧节点刷新
        const results = t.eachArrayToChild(id, flagCode)
        let countbackflag = 0
        if (0 != results.length && undefined != results) {
            //切换背景色
            t.updateState({
                showCauseContentHead: false,
                causeContent:results
            })
            results.forEach(m=>{
                const result = t.eachArrayToChild(m.id);
                if (0 == result.length || undefined == result) {
                    countbackflag++;
                }
            })
        }
        if (countbackflag == results.length) {
            if (results.length > 2) {
                var height = (results.length - 2) * 55 + 210;
                $("#cause").animate({ height: height + "px" })
            }
            //切换背景色
            t.updateState({
                showCauseContentHead: true,
            })
        }

    }
    //点击返回按钮
    handleClickReturn=()=>{
        const t = this;
        const { navigationContent } = t.props.problemDiagnose
        if(navigationContent.length==1){
            t.updateState({
                showPanel: 'homepage'
            })
        }else{
            const results = t.eachArrayToChild(navigationContent[navigationContent.length - 2].id, navigationContent[navigationContent.length - 2].flagCode)
            //移除左侧最后一个节点
            t.updateState({
                navigationContent: navigationContent.slice(0, navigationContent.length-1),
            })
            //右侧节点刷新
            if (0 != results.length && undefined != results) {
                //切换背景色
                t.updateState({
                    showCauseContentHead: false,
                    causeContent:results
                })
                
            }
        }

    }
    render(){
        const t = this
        const { ruleList, showPanel, navigationContent, causeContent, showCauseContentHead, causeContentHead, historyList, loading} = this.props.problemDiagnose
        
        return (
            <div className={styles.normal}>
                <div style={{display:showPanel==='homepage'?'block':'none'}}>
                    <h3 className={styles.textCenter}>
                        水质超标诊断系统
                    </h3>
                    {
                        ruleList.map((item,index) => {
                            return (
                                <div key={item.id} onClick={()=>{
                                   t.handleClickCommonBox(item,index)
                                }} className={styles.boxs}>
                                    <h4>{item.targetName}</h4>
                                    <hr />
                                    <div>
                                        <p>{item.ruleName}</p>
                                        <span>大于{item.standard}{item.unit}</span>
                                    </div>
                                </div>
                            )
                        })
                    }
                    <div onClick={() => {
                        t.updateState({
                            showPanel: 'history'
                        })
                        t.props.dispatch({
                            type:'problemDiagnose/getHistoryList'
                        })
                    }} className={styles.boxs}>
                        <h4 style={{ lineHeight: '130px' }}>历史记录</h4>
                    </div>
                </div>
                <div style={{ display: showPanel === 'detail' ? 'block' : 'none' }}>
                        <div className={styles.navigation}>
                            {
                            navigationContent.map((item,index)=>{
                                return (
                                    <div key={item.id} onClick={()=>t.handleClickNavigationItem(item,index)} id={item.id}>
                                        <p>{item.rule}</p>
                                    </div>
                                )
                            })
                            }
                        </div>
                    <div className={styles.rightContent}>
                        <div className={styles.content}>
                            <h3>水质超标诊断系统</h3>
                            <div id='cause' style={{ background: showCauseContentHead ? '#d9edf7' : 'rgb(249, 249, 249)', borderRadius: showCauseContentHead?'0':'10px'}} className={styles.cause}>
                                <h4 style={{display:showCauseContentHead?'block':'none'}}>{causeContentHead}</h4>
                                <div className={styles.causeContent}>
                                {
                                    causeContent.map(item=>
                                        <div onClick={()=>t.handleClickCauseContent(item)} key={item.id}>
                                            <p>{item.rule}</p>
                                        </div>
                                    )
                                }
                                </div>
                            </div>
                            <div className={styles.btns}>
                                <Button onClick={()=>{
                                    Modal.confirm({
                                        title:'系统提示',
                                        content:'是否保存操作记录',
                                        okText: '是',
                                        cancelText:'否',
                                        onOk(){
                                            t.props.dispatch({
                                                type:'problemDiagnose/saveUserOperation'
                                            })
                                            t.updateState({
                                                showPanel:'homepage'
                                            })
                                        },
                                        onCancel(){
                                            t.updateState({
                                                showPanel: 'homepage'
                                            })
                                        }
                                    })
                                }} type='primary'>退出</Button>
                                <Button onClick={()=>{
                                    t.handleClickReturn()
                                }} type='primary'>返回</Button>
                                <Button onClick={()=>{
                                    t.props.dispatch({
                                        type: 'problemDiagnose/saveUserOperation'
                                    })
                                }} type='primary' loading={loading}>保存</Button>
                            </div>
                        </div>
                    </div>
                </div>
                <div style={{ display: showPanel === 'history' ? 'block' : 'none' }} className={styles.history}>
                    <h2>历史查询记录</h2>
                    <ul>
                    {
                        historyList.map(item=>
                            <li key={item.id} onClick={()=>{
                                const itemList = item.list
                                const results = t.eachArrayToChild(itemList[itemList.length - 1].id, itemList[itemList.length - 1].flagCode)
                                
                                let countflag = 0
                                t.updateState({
                                    showPanel: 'detail',
                                    navigationContent:itemList
                                })
                                if (0 != results.length && undefined != results) {
                                    t.updateState({
                                        showCauseContentHead: false,
                                        causeContent: results,
                                       
                                    })
                                    results.forEach(m => {
                                        var childResult = t.eachArrayToChild(m.id,m.flagCode);
                                        if (0 == childResult.length || undefined == childResult) {
                                            countflag++;
                                        }
                                    })
                                }
                                if (countflag == results.length) {
                                    if (results.length > 2) {
                                        var height = (results.length - 2) * 55 + 210;
                                        $("#cause").animate({ height: height + "px" })
                                    }
                                    t.updateState({//追加到左侧;
                                        showCauseContentHead: true,
                                    })
                                }
                            }}>{item.list[0]?item.list[0].rule:''}</li>
                        )
                    }
                    </ul>
                    <div className={styles.btns}>
                        <Button onClick={() => {
                            t.updateState({
                                showPanel:'homepage'
                            })
                        }} type='primary'>返回</Button>
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(
    ({ problemDiagnose }) => ({ problemDiagnose })
)(ProblemDiagnose);
