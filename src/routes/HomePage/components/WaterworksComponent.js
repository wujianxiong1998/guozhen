import React from 'react';
import moment from 'moment';
import {Progress, Row, Col} from 'antd';
import 'moment/locale/zh-cn';
import styles from '../style.less';

moment.locale('zh-cn');

export default class WaterworksComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            width: 0
        };
    };
    
    componentDidMount() {
        this.setState({
            width: $('.waterworksRight').eq(0).width()
        });
        const _this = this;
        window.onresize = () => {
            _this.setState({
                width: $('.waterworksRight').eq(0).width()
            });
        }
    }
    
    render() {
        const {depType, factoryContent, waterFactoryContent, yearDoData} = this.props;
        const {dealWater = '-', yesterdayLoad, totalCODNum = '-', totalNH3NNum = '-', electricCost = '-', dbPercent} = waterFactoryContent;
        const {thisYear = 0, lastYear = 0, frontYear = 0} = yearDoData;
        
        const maxNum = Math.max(thisYear, lastYear, frontYear) * 1.2;
        
        return (
            <div className={styles.waterworksBox}>
                <div className={styles.waterworksLeft}
                     style={{backgroundImage: "url('./resources/images/waterWorksB.png')"}}>
                    {depType === 'factory' ? <div className={styles.leftTitle}>
                        <div style={{
                            paddingLeft: '13%',
                            textAlign: 'left',
                            fontSize: '24px',
                            width: '100%'
                        }}>{factoryContent.factoryName}
                        </div>
                    </div> : <div className={styles.leftTitle}>
                        <div style={{float: 'left', fontSize: '24px', width: '49.5%'}}>{factoryContent.factoryNum}</div>
                        <div style={{
                            float: 'right',
                            fontSize: '18px',
                            width: '49.5%',
                            borderLeft: '1px solid #c1d0e3'
                        }}>水厂(座)
                        </div>
                    </div>}
                    <div className={styles.leftContent}>
                        <div>
                            <div style={{float: 'left'}}>{dealWater}万吨</div>
                            <div style={{float: 'right'}}>{yesterdayLoad !== 'undefined' ? yesterdayLoad * 100 : '-'}%
                            </div>
                        </div>
                        <div>
                            <div style={{float: 'left', fontSize: '12px'}}>[累计处理量]</div>
                            <div style={{float: 'right', fontSize: '12px'}}>[负荷率]</div>
                        </div>
                        <div>
                            <div style={{float: 'left'}}>削减量</div>
                        </div>
                        <div>
                            <div style={{float: 'left'}}>{totalCODNum}kg</div>
                            <div style={{float: 'right'}}>{totalNH3NNum}kg</div>
                        </div>
                        <div>
                            <div style={{float: 'left', fontSize: '12px'}}>[COD]</div>
                            <div style={{float: 'right', fontSize: '12px'}}>[NH3-N]</div>
                        </div>
                        <div>
                            <div style={{float: 'left'}}>{electricCost}度/吨</div>
                            <div style={{float: 'right'}}>{dbPercent !== 'undefined' ? dbPercent * 100 : '-'}%</div>
                        </div>
                        <div>
                            <div style={{float: 'left', fontSize: '12px'}}>[电单耗]</div>
                            <div style={{float: 'right', fontSize: '12px'}}>[达标率]</div>
                        </div>
                    </div>
                </div>
                <div className={`${styles.waterworksRight} waterworksRight`}>
                    <Row gutter={32} className={styles.rightTitle} style={{margin: '-8px 0 0 0', padding: 0}}>
                        <Col span={8} style={{padding: 0}}>
                            <div className={styles.titleTip} style={{backgroundColor: '#06c1c2'}}/>
                            {moment().year() - 2}
                        </Col>
                        <Col span={8} style={{padding: 0}}>
                            <div className={styles.titleTip} style={{backgroundColor: '#df9890'}}/>
                            {moment().year() - 1}
                        </Col>
                        <Col span={8} style={{padding: 0}}>
                            <div className={styles.titleTip} style={{backgroundColor: '#f2d922'}}/>
                            {moment().year()}
                        </Col>
                    </Row>
                    <div className={`${styles.circleBox} bigCircle`}
                         style={{marginTop: -this.state.width * 0.32, marginLeft: -this.state.width * 0.32}}>
                        <Progress type="circle" strokeWidth={6} percent={(thisYear / maxNum) * 100}
                                  width={this.state.width * 0.64}
                                  showInfo={false}/>
                    </div>
                    <div className={`${styles.circleBox} middleCircle`}
                         style={{marginTop: -this.state.width * 0.25, marginLeft: -this.state.width * 0.25}}>
                        <Progress type="circle" strokeWidth={7.7}
                                  percent={(lastYear / maxNum) * 100}
                                  width={this.state.width * 0.5}
                                  showInfo={false}/>
                    </div>
                    <div className={`${styles.circleBox} smallCircle`}
                         style={{marginTop: -this.state.width * 0.18, marginLeft: -this.state.width * 0.18}}>
                        <Progress type="circle" strokeWidth={10.67}
                                  percent={(frontYear / maxNum) * 100}
                                  width={this.state.width * 0.36}
                                  showInfo={false}/>
                    </div>
                    <div style={{width: '100%', textAlign: 'center', position: 'absolute', bottom: '-10px'}}>年度处理量(万吨)
                    </div>
                    <div className={styles.numTip}
                         style={{
                             marginTop: -this.state.width * 0.34,
                             marginLeft: this.state.width * 0.12,
                             color: '#f2d922'
                         }}>{thisYear || 0}
                    </div>
                    <div className={styles.numTip} style={{
                        marginTop: -this.state.width * 0.07,
                        marginLeft: this.state.width * 0.2,
                        color: '#df9890'
                    }}>{lastYear || 0}
                    </div>
                    <div className={styles.numTip} style={{
                        marginTop: this.state.width * 0.05,
                        marginLeft: -this.state.width * 0.12,
                        color: '#06c1c2'
                    }}>{frontYear || 0}
                    </div>
                </div>
            </div>
        );
    };
}
