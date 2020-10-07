import request, {requestJson} from '../utils/request';

//养护类别
export async function maintainType(params) {
    return request(`/cloud/gzzhsw/api/cp/common/loadEnumValue.smvc`, {
        method: 'post',
        body: params
    });
}

//获取列表
export async function getList(params) {
    return request(`/cloud/gzzhsw/api/cp/maintainPlan/page`, {
        method: 'post',
        body: params
    });
}

//新增
export async function addSave(params) {
    return requestJson(`/cloud/gzzhsw/api/cp/maintainPlan/save`, {
        method: 'post',
        body: params
    });
}

//任务下达
export async function publicS(params) {
    return request(`/cloud/gzzhsw/api/cp/maintainPlan/publish`, {
        method: 'post',
        body: params
    });
}

//编辑
export async function addUpdate(params) {
    return requestJson(`/cloud/gzzhsw/api/cp/maintainPlan/update`, {
        method: 'post',
        body: params
    });
}

//删除
export async function deleteEntity(params) {
    return request(`/cloud/gzzhsw/api/cp/maintainPlan/delete`, {
        method: 'post',
        body: params
    });
}

//get
export async function get(params) {
    return request(`/cloud/gzzhsw/api/cp/maintainPlan/get`, {
        method: 'post',
        body: params
    });
}

/**
 * 全年养护计划
 */
export const yearService = (function (url) {
	return {
		
		// 表格查询
		getList: (params) => {
			return request(`${url}/page`, {
                method: 'post',
				body: params
			});
		},
	};
}(`/cloud/gzzhsw/api/cp/maintainYearPlan`));

/**
 * 养护任务
 */
export const taskService = (function (url) {
	return {
		
		// 表格查询
		getList: (params) => {
			return request(`${url}/page`, {
                method: 'post',
				body: params
			});
        },
        
        // 审核
		aduit: (params) => {
			return request(`${url}/aduit`, {
                method: 'post',
				body: params
			});
        },
        
        // 回单
		publish: (params) => {
			return request(`${url}/publish`, {
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
}(`/cloud/gzzhsw/api/cp/maintainTask`));

/**
 * 养护记录
 */
export const maintainLogService = (function (url) {
	return {
		
		// 表格查询
		getList: (params) => {
			return request(`${url}/page`, {
                method: 'post',
				body: params
			});
        },
	};
}(`/cloud/gzzhsw/api/cp/maintainRecord`));

/**
 * 巡检项目
 */
export const patrolProjectService = (function (url) {
	return {
		
		// 表格查询
		getList: (params) => {
			return request(`${url}/page.smvc`, {
                method: 'post',
				body: params
			});
        },

        // list
		getListSel: (params) => {
			return request(`${url}/list.smvc`, {
                method: 'post',
				body: params
			});
        },

        // 保存
		save: (params) => {
			return requestJson(`${url}/save.smvc`, {
                method: 'post',
				body: params
			});
        },

        // 编辑
		update: (params) => {
			return requestJson(`${url}/update.smvc`, {
                method: 'post',
				body: params
			});
        },

        // 删除
		delete: (params) => {
			return request(`/cloud/gzzhsw/api/cp/data/verify/delete.smvc`, {
                method: 'post',
				body: params
			});
		},
	};
}(`/cloud/gzzhsw/api/cp/common/parameter`));

/**
 * 巡检标准
 */
export const patrolStandardService = (function (url) {
	return {
		
		// 表格查询
		getList: (params) => {
			return request(`${url}/page`, {
                method: 'post',
				body: params
			});
        },

        // list
		getListSel: (params) => {
			return request(`${url}/list`, {
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

        // 获取巡检设备
		getDevice: (params) => {
			return request(`/cloud/gzzhsw/api/cp/device/page`, {
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
}(`/cloud/gzzhsw/api/cp/inspectionStandard`));

/**
 * 巡检异常
 */
export const patrolInspectionService = (function (url) {
	return {
		
		// 表格查询
		getList: (params) => {
			return request(`${url}/page`, {
                method: 'post',
				body: params
			});
        },

        // get
		getView: (params) => {
			return request(`${url}/get`, {
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
        
        // 忽略
		ignore: (params) => {
			return request(`${url}/ignore`, {
                method: 'post',
				body: params
			});
        },
        
        // 生成故障
		createBreakdown: (params) => {
			return request(`${url}/createBreakdown`, {
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
}(`/cloud/gzzhsw/api/cp/inspection`));