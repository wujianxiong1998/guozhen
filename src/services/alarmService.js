import request, {requestJson} from '../utils/request';

/**
 * 删除
 */
export const deleteService = (function (url) {
	return {
		
		// 删除
		delete: (params) => {
			return request(`${url}/delete.smvc`, {
                method: 'post',
				body: params
			});
		},

	};
}(`/cloud/gzzhsw/api/cp/data/verify`));

/**
 * 报警设置--单一报警
 */
export const alarmSetService = (function (url) {
	return {
		
		// 表格查询
		getList: (params) => {
			return request(`${url}/page`, {
                method: 'post',
				body: params
			});
        },

        // 保存
		save: (params) => {
			return requestJson(`${url}/save`, {
                method: 'post',
				body: params
			});
        },

        // 编辑
		update: (params) => {
			return requestJson(`${url}/update`, {
                method: 'post',
				body: params
			});
        },

        // 删除
		delete: (params) => {
			return request(`${url}/delete`, {
                method: 'post',
				body: params
			});
        },  
		
		// 详情
		detail: (params) => {
			return request(`${url}/get`, {
                method: 'post',
				body: params
			});
		},

	};
}(`/cloud/gzzhsw/api/cp/deviceBigReparePlan`));

/**
 * 报警管理--单一报警
 */
export const alarmManangeService = (function (url) {
	return {
		
		// 表格查询
		getList: (params) => {
			return request(`${url}/page`, {
                method: 'post',
				body: params
			});
        },

        // 保存
		save: (params) => {
			return requestJson(`${url}/save`, {
                method: 'post',
				body: params
			});
        },

        // 编辑
		update: (params) => {
			return requestJson(`${url}/update`, {
                method: 'post',
				body: params
			});
        },

        // 删除
		delete: (params) => {
			return request(`${url}/delete`, {
                method: 'post',
				body: params
			});
        },  
		
		// 详情
		detail: (params) => {
			return request(`${url}/get`, {
                method: 'post',
				body: params
			});
		},

	};
}(`/cloud/gzzhsw/api/cp/deviceBigReparePlan`));

/**
 * 报警设置--综合报警
 */
export const alarmSetMulService = (function (url) {
	return {
		
		// 表格查询
		getList: (params) => {
			return request(`${url}/page`, {
                method: 'post',
				body: params
			});
        },

        // 保存
		save: (params) => {
			return requestJson(`${url}/save`, {
                method: 'post',
				body: params
			});
        },

        // 编辑
		update: (params) => {
			return requestJson(`${url}/update`, {
                method: 'post',
				body: params
			});
        },

        // 删除
		delete: (params) => {
			return request(`${url}/delete`, {
                method: 'post',
				body: params
			});
        },  
		
		// 详情
		detail: (params) => {
			return request(`${url}/get`, {
                method: 'post',
				body: params
			});
		},

	};
}(`/cloud/gzzhsw/api/cp/deviceBigReparePlan`));

/**
 * 通知设置--综合报警
 */
export const alarmNoticeMulService = (function (url) {
	return {
		
		// 表格查询
		getList: (params) => {
			return request(`${url}/page`, {
                method: 'post',
				body: params
			});
        },

        // 保存
		save: (params) => {
			return requestJson(`${url}/save`, {
                method: 'post',
				body: params
			});
        },

        // 编辑
		update: (params) => {
			return requestJson(`${url}/update`, {
                method: 'post',
				body: params
			});
        },

        // 删除
		delete: (params) => {
			return request(`${url}/delete`, {
                method: 'post',
				body: params
			});
        },  
		
		// 详情
		detail: (params) => {
			return request(`${url}/get`, {
                method: 'post',
				body: params
			});
		},

	};
}(`/cloud/gzzhsw/api/cp/deviceBigReparePlan`));

/**
 * 报警管理--综合报警
 */
export const alarmManangeMulService = (function (url) {
	return {
		
		// 表格查询
		getList: (params) => {
			return request(`${url}/page`, {
                method: 'post',
				body: params
			});
        },

        // 保存
		save: (params) => {
			return requestJson(`${url}/save`, {
                method: 'post',
				body: params
			});
        },

        // 编辑
		update: (params) => {
			return requestJson(`${url}/update`, {
                method: 'post',
				body: params
			});
        },

        // 删除
		delete: (params) => {
			return request(`${url}/delete`, {
                method: 'post',
				body: params
			});
        },  
		
		// 详情
		detail: (params) => {
			return request(`${url}/get`, {
                method: 'post',
				body: params
			});
		},

	};
}(`/cloud/gzzhsw/api/cp/deviceBigReparePlan`));

/**
 * 报警分析
 */
export const alarmAnalyzeService = (function (url) {
	return {
		
		// 表格查询
		getList: (params) => {
			return request(`${url}/page`, {
                method: 'post',
				body: params
			});
        },
		
		// 详情
		detail: (params) => {
			return request(`${url}/get`, {
                method: 'post',
				body: params
			});
		},

	};
}(`/cloud/gzzhsw/api/cp/deviceBigReparePlan`));

/**
 * 报警历史
 */
export const alarmHistoryService = (function (url) {
	return {
		
		// 表格查询
		getList: (params) => {
			return request(`${url}/page`, {
                method: 'post',
				body: params
			});
        },

	};
}(`/cloud/gzzhsw/api/cp/dataFill/alarmRecord`));

/**
 * 填报数据报警
 */
export const alarmDataFillService = (function (url) {
	return {
		
		// 表格查询
		getList: (params) => {
			return request(`${url}/page`, {
                method: 'post',
				body: params
			});
        },

        // 保存
		save: (params) => {
			return requestJson(`${url}/add`, {
                method: 'post',
				body: params
			});
        },

        // 编辑
		update: (params) => {
			return requestJson(`${url}/update`, {
                method: 'post',
				body: params
			});
        },

        // 删除
		delete: (params) => {
			return request(`${url}/delete`, {
                method: 'post',
				body: params
			});
        },  
		
		// 详情
		detail: (params) => {
			return request(`${url}/get`, {
                method: 'post',
				body: params
			});
		},

	};
}(`/cloud/gzzhsw/api/cp/dataFill/alarm`));

/**
 * 填报数据报警-get
 */
export const alarmDataFillGetService = (function (url) {
	return {
		
		// 详情
		detail: (params) => {
			return request(`${url}/get.smvc`, {
                method: 'post',
				body: params
			});
		},

	};
}(`/cloud/gzzhsw/api/cp/data/fill`));

/**
 * 档案检索
 */
export const filesSearchingService = (function (url) {
	return {
		
		// 表格查询
		getList: (params) => {
			return request(`${url}/page`, {
                method: 'post',
				body: params
			});
        },

	};
}(`/cloud/gzzhsw/api/cp/deviceBigReparePlan`));

/**
 * 档案归档
 */
export const filesBackService = (function (url) {
	return {
		
		// 表格查询
		getList: (params) => {
			return request(`${url}/page.smvc`, {
                method: 'post',
				body: params
			});
        },

        // 保存
		save: (params) => {
			return requestJson(`${url}/saveOrUpdate.smvc`, {
                method: 'post',
				body: params
			});
        },

        // // 编辑
		// update: (params) => {
		// 	return requestJson(`${url}/update`, {
        //         method: 'post',
		// 		body: params
		// 	});
        // },

        // 删除
		delete: (params) => {
			return request(`${url}/delete.smvc`, {
                method: 'post',
				body: params
			});
        },  
		
		// // 详情
		// detail: (params) => {
		// 	return request(`${url}/get`, {
        //         method: 'post',
		// 		body: params
		// 	});
		// },

	};
}(`/cloud/gzzhsw/api/cp/file/record`));

/**
 * 档案类型
 */
export const filesTypeService = (function (url) {
	return {
		
		// 表格查询
		getList: (params) => {
			return request(`${url}/page.smvc`, {
                method: 'post',
				body: params
			});
		},
		
		// list
		list: (params) => {
			return request(`${url}/list.smvc`, {
                method: 'post',
				body: params
			});
        },

        // 保存&编辑
		save: (params) => {
			return requestJson(`${url}/saveOrUpdate.smvc`, {
                method: 'post',
				body: params
			});
        },

        // 删除
		delete: (params) => {
			return request(`${url}/delete.smvc`, {
                method: 'post',
				body: params
			});
        },  
		
		// 判断能不能删除 可以删除返回true
		wheatherDelete: (params) => {
			return request(`${url}/wheatherDelete.smvc`, {
                method: 'post',
				body: params
			});
		},

	};
}(`/cloud/gzzhsw/api/cp/file/type`));