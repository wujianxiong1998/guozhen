import moment from 'moment';
import 'moment/locale/zh-cn';

moment.locale('zh-cn');
import _mergeWith from 'lodash/mergeWith';
import _isEqual from 'lodash/isEqual';
import _groupBy from 'lodash/groupBy';
import {Icon, Modal, notification, Popconfirm} from 'antd';
/*
    时间util类
 */
export const VtxTime = {
    /*
        获取时间
        time: 指定时间,  可以是任何类型的时间
            默认:当前时间
        format: YYYY/MM/DD/HH/mm/ss
            类型: String
            默认: YYYY-MM-DD
        return: 返回匹配的时间字符串
     */
    getFormatTime: ({time = new Date(), format = 'YYYY-MM-DD'} = {}) => {
        return moment(time).format(format);
    },
    /*
        时间加减
        time: 指定时间,  可以是任何类型的时间
            默认:当前时间
        format: YYYY/MM/DD/HH/mm/ss
            默认: YYYY-MM-DD
            类型: String
        type: 加/减
            默认: add
            类型: String
            参数: add/subtract
        num: 正整数
            默认: 0
            类型: Number
        dateType: 加减的类型,如y代表加减几年, 参数: y/M/w/d/h/m/s/ms  默认d (String)
        return: 返回匹配的时间字符串
     */
    operationTime: ({time = new Date(), format = 'YYYY-MM-DD', type = 'add', num = 0, dateType = 'd'} = {}) => {
        num = VtxNum.replaceInt(num);
        return moment(time, format)[type](num, dateType).format(format);
    },
    /*
        获取毫秒时间
        time: 需要转换的时间
            默认: 0
        return: 返回对应类型的时间
     */
    getMsTime: (time) => {
        if (time) {
            return new Date(time).getTime();
        } else {
            return new Date().getTime();
        }
    }
}
/*
    正则匹配
 */
export const VtxRegex = {
    /*
        验证是几位浮点数 数字
        num 需要验证的数字
        n 是数字几位 例如2
     */
    checkFloatNumber(num, n) {
        let regex = new RegExp(`^-?(0|[1-9][0-9]*)(\.([0-9]?){${n}})?$`);
        return regex.test(num);
    },
    /*
        验证是否是数字
     */
    checkNumber(num) {
        let regex = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/;
        return regex.test(num);
    },
    /*
        验证是否是正数
     */
    checkPositiveNumber(num) {
        let regex = /^(0|[1-9][0-9]*)(\.[0-9]*)?$/;
        return regex.test(num);
    },
    /*
        验证是否是正整数
     */
    checkPositiveInteger(num) {
        let regex = /^(0|[1-9][0-9]*)$/;
        return regex.test(num);
    },
    /*
        验证是否是正几位小数
     */
    checkIntegerFloatNumber(num, n) {
        let regex = new RegExp(`^(0|[1-9][0-9]*)(\.([0-9]?){${n}})?$`);
        return regex.test(num);
    },
    /*
        验证是否是负数
     */
    checkNegativeNumber(num) {
        let regex = /^-(0|[1-9][0-9]*)(\.[0-9]*)?$/;
        return regex.test(num);
    },
    /*
        验证是否是负整数
     */
    checkNegativeInteger(num) {
        let regex = /^-(0|[1-9][0-9]*)$/;
        return regex.test(num);
    },
    /*
        验证是否是负几位小数
     */
    checkNegativeIntegerFloatNumber(num, n) {
        let regex = new RegExp(`^-(0|[1-9][0-9]*)(\.([0-9]?){${n}})?$`);
        return regex.test(num);
    },
    /*
        验证手机号码
        phone 需要验证的手机号码
     */
    checkCellphone(phone) {
        let regex = /^1\d{10}$/;
        return regex.test(phone);
    },
    /*
        验证号码
        tel 需要验证的号码
     */
    checkTelphone(tel) {
        let regex = /(^(\d{3,4}-)?\d*)$/;
        return regex.test(tel);
    },
    /*
        验证数组
        phone 需要验证的手机号码
     */
    checkArray(ary) {
        return ary instanceof Array;
    }
}
export const VtxNum = {
    /*
        字符串转成 float类型的字符串
        str: 需要处理的字符串 (String)
        return: 返回一个float类型的字符串
     */
    replaceFloat: (str) => {
        let b = str.toString().split('.');
        if (!b[1]) {
            if (str.indexOf('.') > -1) {
                return (b[0].replace(/[^0-9]/g, '') || 0) + '.';
            } else {
                return b[0].replace(/[^0-9]/g, '') || 0;
            }
        } else {
            if (!parseInt(b[1].replace(/[^0-9]/g, ''))) {
                if (parseInt(b[1].replace(/[^0-9]/g, '')) == 0) {
                    return (b[0].replace(/[^0-9]/g, '') || 0) + '.' + b[1].replace(/[^0-9]/g, '');
                } else {
                    return b[0].replace(/[^0-9]/g, '') || 0;
                }
            } else {
                if (b[0].length > 1) {
                    return (b[0].replace(/[^0-9]/g, '').replace(/^0*/g, '') || 0) + '.' + b[1].replace(/[^0-9]/g, '');
                } else {
                    return (b[0].replace(/[^0-9]/g, '') || 0) + '.' + b[1].replace(/[^0-9]/g, '');
                }
            }
        }
    },
    /*
        字符串转成 Int类型的字符串
        str: 需要处理的字符串  支持number类型
        return: 返回一个Int类型的字符串
     */
    replaceInt: (str) => {
        return str.toString().split('.')[0].replace(/[^0-9]/g, '').replace(/^0*/g, '') || '0';
    },
    /*
        取小数后几位
        num: 需要处理的 数字  支持String类型
        count: 需要保留的位数 Number
        return: 返回对应的float类型字符串
     */
    decimals: (num, count) => {
        let nary = VtxNum.replaceFloat(num).toString().split('.'), n = '';
        count = parseInt(count);
        if (count > 0) {
            if (!!nary[1]) {
                n = nary[0] + '.' + nary[1].substr(0, count);
                for (let i = 0; i < (count - nary[1].length); i++) {
                    n = n + '0';
                }
            } else {
                n = nary[0];
                for (let j = 0; j < count; j++) {
                    if (j == 0) n = n + '.0';
                    else n = n + '0';
                }
            }
        } else {
            n = nary[0];
        }
        return n;
    }
}
/*
    其他公共方法
 */
export const VtxUtil = {
    // mackTree(tree) {
    //     console.log(tree)
    //     const newTree = JSON.parse(JSON.stringify(tree));
    //     // for(let i in newTree) {
    //     //     // console.log(11)
    //     //     for(let j in newTree) {
    //     //         // console.log(22)
    //     //         if(i !== j) {
    //     //             // console.log(33)
    //     //             // console.log(newTree[i])
    //     //             // console.log(newTree[j])
    //     //             if(newTree[i].id === newTree[j].parentId) {
    //     //                 if (!newTree[i].children) {
    //     //                     newTree[i].children = [];
    //     //                 }
    //     //                 newTree[i].children.push(newTree[j]);
    //     //             }
    //     //         }
    //     //     }
    //     // }
    //     for (let item of newTree) {
    //         for (let item1 of newTree) {
    //             if (item.id !== item1.id) {
    //                 if (item.id === item1.parentId) {
    //                     if (!item.children) {
    //                         item.children = [];
    //                     }
    //                     item.children.push(item1);
    //                 }
    //             }
    //         }
    //     }
    //     console.log(newTree)
    //     let pTree = [];
    //     for(let item of newTree) {
    //         if (item.parentId === 0) {
    //             pTree.push(item);
    //         }
    //     }
    //     return pTree;
    // },
    
    /**
     * 判断对象是否为空
     */
    isEmptyObject(obj) {
        if (obj.constructor === Object) {
            for (let key in obj) {
                return false; // 返回false，不为空对象
            }
            return true; // 返回true，为空对象
        } else {
            return false;
        }
    },
    /*
        获取url中 参数的值
        key: 参数前面的key
        return: 对应key的value
     */
    getUrlParam(key) {
        let paramObj = {};
        let matchList = window.location.href.match(/([^\?&]+)=([^&]+)/g) || [];
        for (let i = 0, len = matchList.length; i < len; i++) {
            let r = matchList[i].match(/([^\?&]+)=([^&]+)/);
            paramObj[r[1]] = r[2];
        }
        if (key) {
            return paramObj[key];
        } else {
            return paramObj;
        }
    },
    /*
        获取hash字符串
     */
    getHash() {
        let h = location.hash,
            xI = h.indexOf('/'),
            wI = h.indexOf('?');
        return h.substring(xI + 1, wI);
    },
    /*
        延迟时间
        time是延迟的时间  单位ms
     */
    delay: (time) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve();
            }, time)
        })
    },
    /*
     设置抬头
     title 设置的title名
     */
    setTitle: (title) => {
        document.title = title;
    },
    /*
        处理提交参数的前后空格
     */
    submitTrim(obj) {
        if (typeof (obj) == 'object') {
            let postData = {};
            for (let k in obj) {
                postData[k] = typeof (obj[k]) == "string" ? obj[k].trim() : obj[k];
            }
            return postData;
        } else {
            return obj;
        }
    },
    /*
        数组去除重复
        只限 数组中值是字符串或number的
     */
    ArraywipeOffRepetition(ary = []) {
        let na = [];
        for (let i = 0; i < ary.length; i++) {
            if (na.indexOf(ary[i]) > -1) {
                continue;
            } else {
                na.push(ary[i])
            }
        }
        return na;
    }
}


/*
    前后端数据转换处理工具
    -----demo-----
    const carDataMapProcessor = new DataMapProcessor(DataMap);
    const new_data = carDataMapProcessor.getMappingData(yourData);
 */
export class DataMapProcessor {
    constructor(mapping) {
        this.mapping = mapping;
        this.reverseMap = this.getReverseMap(mapping);
    }
    
    getReverseMap(mapping) {
        let new_map = {};
        for (let k in mapping) {
            new_map[mapping[k]] = k;
        }
        return new_map;
    }
    
    getMappingData(data, reverse = false) {
        let new_date = {};
        let mapping = reverse ? this.reverseMap : this.mapping;
        for (let k in data) {
            if (k in mapping) {
                new_date[mapping[k]] = data[k];
            }
            else {
                new_date[k] = data[k];
            }
        }
        return new_date;
    }
}

import React from 'react';

export class RouterComponent extends React.Component {
    constructor(props) {
        super(props);
        this.namespace = '';
    }
    
    // 更新state
    updateState = (obj, namespace) => {
        this.props.dispatch({
            type: `${namespace || this.namespace}/updateState`,
            payload: obj
        });
    }
    // 调用指定namespace内部函数
    act = (functionName, obj = {}, namespace) => {
        return this.props.dispatch({
            type: `${namespace || this.namespace}/${functionName}`,
            payload: obj
        });
    }
}

export function delay(time) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve()
        }, time);
    })
}

// 合并对象
export function merge(a, b) {
    _mergeWith(a, b, (objValue, srcValue) => {
        if (Array.isArray(objValue)) {
            return objValue.concat(srcValue);
        }
    })
}


export function strToColor(str) {
    const valArr = str.split('').map(c => c.charCodeAt());
    const sum = valArr.reduce((total, currentValue) => {
        return total + currentValue;
    }, 0);
    let colorStr = sum.toString(16).substr(0, 6);
    if (colorStr.length < 6) {
        colorStr += '000000'.substr(0, 6 - colorStr.length);
    }
    return `#${colorStr}`;
    
}

export function deepEqual(a, b) {
    return _isEqual(a, b);
}

export function deleteMessage(data) {
    const relatedData = data ? data.data : [];
    const groupData = _groupBy(relatedData, 'usedModelTypeName')
    
    let warnText = [];
    for (let key in groupData) {
        const singleData = groupData[key]
        const usedNames = singleData.map(item => item.usedName)
        
        warnText.push(<div key={key}>{singleData.length}条{key}数据：{usedNames.join('、')}</div>)
    }
    Modal.warning({
        title: data ? data.msg : '删除失败',
        content: (
            <div>
                {warnText.length ? '关联的数据有：' : ''}
                {warnText}
            </div>
        )
    })
}

export function delPopconfirm(callback) {
    return (
        <Popconfirm title="确认删除此数据？" onConfirm={() => callback()} okText="是" cancelText="否">
            <Icon type='delete' title='删除'/>
        </Popconfirm>
    )
}


/*
    生成uuid
*/
export function uuid() {
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";
    
    var uuid = s.join("");
    return uuid;
}

//导入信息查看
export function openImportView(operateMessage) {
    var descriptionNode = [];
    if (operateMessage && operateMessage.length) {
        operateMessage.map((item, index) => {
            if (item.messages.length) {
                descriptionNode.push(
                    <div>{item.lineNum === 0 ? '' : `第${item.lineNum}行：`}{item.messages.join('；')}</div>)
            }
        })
    }
    notification.config({
        placement: 'bottomRight',
    });
    notification.open({
        message: <div style={{color: "#0000FF", cursor: 'pointer'}}>导入结果</div>,
        description: <div>{descriptionNode}</div>,
    })
}


/*列表样式配置*/
export const formStyle_8 = {
    labelCol: {span: 8},
    wrapperCol: {span: 16}
};
export const formStyle_4 = {
    labelCol: {span: 4},
    wrapperCol: {span: 20}
};
export const formStyle_6 = {
    labelCol: {span: 6},
    wrapperCol: {span: 18}
};
export const formStyle_1 = {
    labelCol: {span: 1},
    wrapperCol: {span: 23}
};
export const formStyle_2 = {
    labelCol: {span: 2},
    wrapperCol: {span: 22}
};
export const formStyle_9 = {
    labelCol: {span: 9},
    wrapperCol: {span: 15}
};
export const formStyle_3 = {
    labelCol: {span: 3},
    wrapperCol: {span: 21}
};

//匹配正数（包括浮点数）
export const PositiveNumber = /^(?:[1-9][0-9]*(?:\.[0-9]+)?|0\.(?!0+$)[0-9]+)$/;

//匹配正整数
export const PositiveInteger = /^[1-9]\d*$/;

//匹配空字符串
export const emptyInput = /^$/;

//树结构数据
export const getTreeData = (data, type) => {
    if (typeof (data) === 'undefined') {
        data = [];
        return;
    }
    return data.map((item) => {
        const disabled = !!type ? item.nodeType !== type : item.nodeType === 'Root';
        if (!!item.children) {
            if (item.children.length === 0) {
                return {
                    key: item.id,
                    value: item.name,
                    title: item.name,
                    name: item.id,
                    nodeType: item.nodeType,
                    disabled
                };
            } else {
                return {
                    key: item.id,
                    value: item.name,
                    title: item.name,
                    name: item.id,
                    nodeType: item.nodeType,
                    disabled,
                    children: getTreeData(item.children, type)
                };
            }
        } else {
            return {
                key: item.id,
                value: item.name,
                title: item.name,
                name: item.id,
                nodeType: item.nodeType,
                disabled
            };
        }
    });
};

export function generateUserTreeData(data, leafType) {
    return data.map(val => {
        if (val.children.length > 0) {
            if (leafType.indexOf(val.nodeType) < 0) {
                return {
                    label: val.name,
                    title: val.name,
                    value: val.id,
                    name: val.name,
                    key: val.id,
                    isLeaf: false,
                    disabled: true,
                    attributes: val.attributes,
                    children: generateUserTreeData(val.children, leafType)
                };
            } else {
                return {
                    label: val.name,
                    title: val.name,
                    value: val.id,
                    name: val.name,
                    key: val.id,
                    isLeaf: true,
                    attributes: val.attributes,
                    children: generateUserTreeData(val.children, leafType)
                };
            }
        } else {
            if (leafType.indexOf(val.nodeType) < 0) {
                return {
                    label: val.name,
                    title: val.name,
                    value: val.id,
                    name: val.name,
                    key: val.id,
                    isLeaf: true,
                    disabled: true,
                    attributes: val.attributes,
                };
            } else {
                return {
                    label: val.name,
                    title: val.name,
                    value: val.id,
                    name: val.name,
                    key: val.id,
                    isLeaf: true,
                    attributes: val.attributes,
                };
            }
        }
    });
}

export function generateTreeNameData(data, leafType) {
    return data.map(val => {
        if (val.children.length > 0) {
            if (leafType.indexOf(val.nodeType) < 0) {
                return {
                    label: val.name,
                    title: val.name,
                    value: val.name,
                    name: val.name,
                    key: val.id,
                    isLeaf: false,
                    disabled: true,
                    attributes: val.attributes,
                    children: generateTreeNameData(val.children, leafType)
                };
            } else {
                return {
                    label: val.name,
                    title: val.name,
                    value: val.name,
                    name: val.name,
                    key: val.id,
                    isLeaf: true,
                    attributes: val.attributes,
                    children: generateTreeNameData(val.children, leafType)
                };
            }
        } else {
            if (leafType.indexOf(val.nodeType) < 0) {
                return {
                    label: val.name,
                    title: val.name,
                    value: val.name,
                    name: val.name,
                    key: val.id,
                    isLeaf: true,
                    disabled: true,
                    attributes: val.attributes,
                };
            } else {
                return {
                    label: val.name,
                    title: val.name,
                    value: val.name,
                    name: val.name,
                    key: val.id,
                    isLeaf: true,
                    attributes: val.attributes,
                };
            }
        }
    });
}

export function generateTreeNameDataMul(data, leafType) {
    return data.map(val => {
        if (val.children.length > 0) {
            if (leafType.indexOf(val.nodeType) < 0) {
                return {
                    label: val.name,
                    title: val.name,
                    value: val.attributes.userId || val.id,
                    name: val.name,
                    key: val.attributes.userId || val.id,
                    isLeaf: false,
                    disabled: true,
                    attributes: val.attributes,
                    children: generateTreeNameDataMul(val.children, leafType)
                };
            } else {
                return {
                    label: val.name,
                    title: val.name,
                    value: val.attributes.userId || val.id,
                    name: val.name,
                    key: val.attributes.userId || val.id,
                    isLeaf: true,
                    attributes: val.attributes,
                    children: generateTreeNameDataMul(val.children, leafType)
                };
            }
        } else {
            if (leafType.indexOf(val.nodeType) < 0) {
                return {
                    label: val.name,
                    title: val.name,
                    value: val.attributes.userId || val.id,
                    name: val.name,
                    key: val.attributes.userId || val.id,
                    isLeaf: true,
                    disabled: true,
                    attributes: val.attributes,
                };
            } else {
                return {
                    label: val.name,
                    title: val.name,
                    value: val.attributes.userId || val.id,
                    name: val.name,
                    key: val.attributes.userId || val.id,
                    isLeaf: true,
                    attributes: val.attributes,
                };
            }
        }
    });
}

export function generateTreeOrg(data) {
    return data.map(val => {
        if (val.children.length > 0) {
            return {
                label: val.name,
                title: val.name,
                value: val.name,
                name: val.name,
                key: val.id,
                isLeaf: false,
                disabled: true,
                attributes: val.attributes,
                children: generateTreeOrg(val.children)
            };
        } else {
            return {
                label: val.name,
                title: val.name,
                value: val.name,
                name: val.name,
                key: val.id,
                isLeaf: true,
                attributes: val.attributes,
            };
        }
    });
}

export const changArr = (arrData, param) => {
    let arrIds = [];
    return arrData.map(item => {
        if (arrIds.indexOf(item[param]) === -1) {
            arrIds.push(item[param]);
            return item;
        }
    }).filter(item => !!item);
};

export const setCookie = (name, value, expires, path, domain, secure) => {
    let today = new Date();
    today.setTime(today.getTime());
    if (expires) {
        expires = expires * 1000 * 60 * 60 * 24;
    }
    let expires_date = new Date(today.getTime() + (expires));
    document.cookie = name + '=' + escape(value) + ((expires) ? ';expires=' + expires_date.toGMTString() : '') + ((path) ? ';path=' + path : '') + ((domain) ? ';domain=' + domain : '') + ((secure) ? ';secure' : '');
};
