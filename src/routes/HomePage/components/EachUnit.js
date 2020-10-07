import React from 'react';
import moment from 'moment';
import {Table} from 'antd';
import 'moment/locale/zh-cn';
import styles from '../style.less';

moment.locale('zh-cn');

export default class EachUnit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    };
    
    componentDidMount() {
        const {waterFactoryList, changeTab} = this.props;
        this.mySwiper = new Swiper('.swiper-container', {
            slidesPerView: 3,
            centeredSlides: true,
            loop: true,
            autoplay: {delay: 10000},
            slideToClickedSlide: true,
            on: {
                transitionEnd: function () {
                    const currentIndex = this.activeIndex - 3;
                    if (currentIndex === waterFactoryList.length) {
                        changeTab(waterFactoryList[0].id)
                    } else if (currentIndex < 0) {
                        changeTab(waterFactoryList[waterFactoryList.length - 1].id)
                    } else {
                        changeTab(waterFactoryList[currentIndex].id)
                    }
                }
            }
        });
    }
    
    componentWillReceiveProps(nextProps) {
        const {canAuto: oldAuto} = this.props;
        const {canAuto} = nextProps;
        if (oldAuto !== canAuto) {
            if (!oldAuto) {
                this.mySwiper.autoplay.start();
            } else {
                this.mySwiper.autoplay.stop();
            }
        }
    }
    
    render() {
        const {waterFactoryList} = this.props;
        
        return (
            <div className={styles.eachUnit}>
                <div className='swiper-container' style={{height: '100%'}}>
                    <div className='swiper-wrapper'>
                        {waterFactoryList.map((item, index) => (
                            <div key={item.id} className={`swiper-slide ${styles.swipeItem}`}>
                                <div className={styles.itemContent} style={{backgroundColor: colors[index % 5]}}>
                                    <div className='bigShow' style={{width: '100%', height: '100%'}}>
                                        <div className={styles.contentTop}>
                                            <div className='topText'>
                                                <span>{item.name}</span>
                                            </div>
                                        </div>
                                        <div className={styles.contentBottom}>
                                            <div>
                                                <div className='contentBottom'>
                                                    <div>
                                                        <span style={{float: 'left'}}>[设计处理量]</span>
                                                        <span style={{float: 'right'}}>[项目类型]</span>
                                                    </div>
                                                    <div>
                                                        <span style={{float: 'left'}}>{item.processSize}万吨</span>
                                                        <span style={{float: 'right'}}>{item.productTypeName}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='showSmall'>
                                        <div className={styles.showSmall}>{item.name}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    };
}
