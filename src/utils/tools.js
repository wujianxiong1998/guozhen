// import _ from 'updeep'
/**
 * 表格columns的数据处理
 * 传入[title, key, {...other}]
 * title必须，key必须
 */
import moment from 'moment';
import _ from 'lodash'
export const handleColumns = (cols) => {
	let columns = cols.map(item => {
		let other = {};
		if(!!item[2] && _.isObject(item[2])) {
			other = _.cloneDeep(item[2]);
		}
		if('visable' in other) {
			if(!other.visable) {
				return '';
			}
		}
		delete other.visable;
		return {
			title : item[0],
			dataIndex : item[1],
			key : item[1],
			colSpan: item[3],
			...other
		}
	}).filter(item => item);
	return columns
}

/**
 * 为导出提供导出参数
 * 返回对象{columnNames, columnFields}
 */
export const renderColumnParam = (cols) => {
	let columnNamesArr = [], columnFieldsArr = [],
		columnNames = '', columnFields = '';
	cols.map(item => {
		let other = {};
		if(!!item[2] && _.isObject(item[2])) {
			other = _.cloneDeep(item[2]);
		}
		if('visable' in other) {
			if(!other.visable) {
				return;
			}
		}
		if(item[1] === 'action') {
			return;
		}
		columnNamesArr.push(item[0]);
		columnFieldsArr.push(item[1]);
	});
	return {
		columnNames : columnNamesArr.join(','),
		columnFields : columnFieldsArr.join(','),
	}
}
export class VtxTimeUtil {

    /**
     * 时间戳
     */
	static timeStamp(dateTime) {
		return moment(dateTime).valueOf();
	}

    /**
     * 时间比较
     * 场景：计算时间段相差的天数
     */
	static diff(startTime, endTime, fotmat = 'days') {
		return moment(endTime).diff(moment(startTime), fotmat);
	}

    /**
     * 判断时间跨度不能大于多少天/月/年
     * condition : gt大于  lt 小于 默认gt
     */
	static timeSpan(startTime, endTime, num, format = 'YYYY-MM-DD',
		condition = 'gt', conditionType = "month") {

		let result = false;
		// 大于
		if (condition === 'gt') {
			result = !moment(moment(startTime).add(num, conditionType).format(format))
				.isBefore(moment(endTime).format(format));
		}
		if (condition === 'lt') {
			result = !moment(moment(startTime).add(num, conditionType).format(format))
				.isAfter(moment(endTime).format(format));
		}
		return result;
	}

    /**
     * type : { days, weeks, months, years...}
     */
	static subtractTime(value, type, format) {
		return moment().subtract(value, type).format(format);
	}

    /**
     * 检测是否年/月/日
     * date : 日期
     */
	static isDateType(date, format = 'YYYY-MM-DD') {
		return moment(date, format, true).isValid();
	}

    /**
     * 判断是否当前时间之后
     * disabledDate 场景使用
     */
	static isAfterDate(date, format = 'YYYY-MM-DD') {
		return moment(moment(date).format(format)).isAfter(moment().format(format));
	}

    /**
     * 判断是否当前时间之前
     * disabledDate 场景使用
     */
	static isBeforeDate(date, format = 'YYYY-MM-DD') {
		return moment(moment(date).format(format)).isBefore(moment().format(format));
	}

	static isAfter(startDate, endDate) {
		return moment(startDate).isAfter(endDate);
	}

	static isSame(date1, date2 = moment().format('YYYY-MM-DD'), dateType = 'day') {
		return moment(date1).isSame(date2, dateType);
	}

    /**
     * 获取指定日期所在星期的第一天和最后一天
     * date : String/moment
     */
	static getWeekStartAndEnd(date) {
		let startEnd = [];
		let currentWeekDay = moment(date).weekday();
		let startDate = moment(date).subtract(currentWeekDay, 'days').format('YYYY-MM-DD');
		let endDate = moment(date).add((6 - currentWeekDay), 'days').format('YYYY-MM-DD');
		startEnd = [startDate, endDate];
		return startEnd;
	}

    /**
     * 获取当月最后一天
     * return 默认“YYYY-MM-DD”
     */
	static getMonthLastDay(date, format = "YYYY-MM-DD") {
		let yearNum = moment(date).year();
		// 获取当月是第几月， 从0开始
		let monthNum = moment(date).month();
		return moment([yearNum, 0, 31]).month(monthNum).format(format);
	}

	static dateFormat(date, format = undefined) {
		if (!!format) {
			return moment(date).format(format);
		}
		return moment(date).format('ll');
	}
}