import request, {requestJson} from '../utils/request';

/**
 * 大修计划
 */
export const overHaulPlayService = (function (url) {
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
		
		// 撤销
		ignore: (params) => {
			return request(`${url}/ignore`, {
                method: 'get',
				body: params
			});
		},
		
		// 任务下达
		publish: (params) => {
			return request(`${url}/publish`, {
                method: 'get',
				body: params
			});
        },

	};
}(`/cloud/gzzhsw/api/cp/deviceBigReparePlan`));

/**
 * 大修方案
 */
export const overHaulProgramService = (function (url) {
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
}(`/cloud/gzzhsw/api/cp/deviceBigRepareProgram`));

/**
 * 大修任务
 */
export const overHaulTaskService = (function (url) {
	return {
		
		// 表格查询
		getList: (params) => {
			return request(`${url}/page`, {
                method: 'post',
				body: params
			});
        },

        // 审核
		audit: (params) => {
			return request(`${url}/audit`, {
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
}(`/cloud/gzzhsw/api/cp/deviceBigRepareTask`));

/**
 * 大修记录
 */
export const overHaulRecordService = (function (url) {
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
}(`/cloud/gzzhsw/api/cp/deviceBigRepareRecord`));

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
 * 根据用户id判断是否是管理员
 */
export const wheatherAdminByUserIdService = (function (url) {
	return {
		
		// 删除
		adminByUserId: (params) => {
			return request(`${url}/wheatherAdminByUserId.smvc`, {
                method: 'get',
				body: params
			});
		},

	};
}(`/cloud/gzzhsw/api/cp/common`));


/**
 * 技改计划
 */
export const techniqueChangePlayService = (function (url) {
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
		
		// 撤销
		ignore: (params) => {
			return request(`${url}/ignore`, {
                method: 'get',
				body: params
			});
		},
		
		// 任务下达
		publish: (params) => {
			return request(`${url}/publish`, {
                method: 'get',
				body: params
			});
        },

	};
}(`/cloud/gzzhsw/api/cp/deviceTechniqueChangePlan`));

/**
 * 技改方案
 */
export const techniqueChangeProgramService = (function (url) {
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
}(`/cloud/gzzhsw/api/cp/deviceTechniqueChangeProgram`));

/**
 * 技改任务
 */
export const techniqueChangeTaskService = (function (url) {
	return {
		
		// 表格查询
		getList: (params) => {
			return request(`${url}/page`, {
                method: 'post',
				body: params
			});
        },

        // 审核
		audit: (params) => {
			return request(`${url}/audit`, {
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

		// 后评估编辑
		access: (params) => {
			return request(`${url}/afterAccess`, {
                method: 'post',
				body: params
			});
        },

	};
}(`/cloud/gzzhsw/api/cp/deviceTechniqueChangeTask`));


/**
 * 技改记录
 */
export const techniqueChangeRecordService = (function (url) {
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
}(`/cloud/gzzhsw/api/cp/deviceTechniqueChangeRecord`));

/**
 * 更新计划
 */
export const deviceUpdatePlayService = (function (url) {
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
		
		// 撤销
		ignore: (params) => {
			return request(`${url}/ignore`, {
                method: 'get',
				body: params
			});
		},
		
		// 任务下达
		publish: (params) => {
			return request(`${url}/publish`, {
                method: 'get',
				body: params
			});
        },

	};
}(`/cloud/gzzhsw/api/cp/deviceUpdatePlan`));


/**
 * 更新方案
 */
export const deviceUpdateProgramService = (function (url) {
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
}(`/cloud/gzzhsw/api/cp/deviceUpdateProgram`));


/**
 * 更新任务
 */
export const deviceUpdateTaskService = (function (url) {
	return {
		
		// 表格查询
		getList: (params) => {
			return request(`${url}/page`, {
                method: 'post',
				body: params
			});
        },

        // 审核
		audit: (params) => {
			return request(`${url}/audit`, {
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
}(`/cloud/gzzhsw/api/cp/deviceUpdateTask`));

/**
 * 更新任务///// 台账
 */
export const BdeviceUpdateTaskService = (function (url) {
	return {
		// 保存
		Bsave: (params) => {
			return requestJson(`${url}/save`, {
                method: 'post',
				body: params
			});
		},
		
		// 编辑
		Bupdate: (params) => {
			return requestJson(`${url}/update`, {
                method: 'post',
				body: params
			});
		},
		
		// 验证
		Bvalidate: (params) => {
			return request(`${url}/validate`, {
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
}(`/cloud/gzzhsw/api/cp/deviceTemp`));

/**
 * 设备变更
 */
export const deviceChangeService = (function (url) {
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

        // 审核
		audit: (params) => {
			return request(`${url}/audit`, {
                method: 'post',
				body: params
			});
		},
		
		// 撤销
		ignore: (params) => {
			return request(`${url}/ignore`, {
                method: 'get',
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

		//获取安装位置
		newStructureList: (params) => {
			return request(`${url}/getStructureListV2`, {
				method: 'post',
				body: params
			});
		}

	};
}(`/cloud/gzzhsw/api/cp/deviceChange`));

/**
 * 设备报废
 */
export const deviceScrapService = (function (url) {
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
		
		// 撤销
		ignore: (params) => {
			return request(`${url}/ignore`, {
                method: 'get',
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
}(`/cloud/gzzhsw/api/cp/deviceDrop`));

/**
 * 设备调拨
 */
export const deviceAllocationService = (function (url) {
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
		
		// 撤销
		ignore: (params) => {
			return request(`${url}/ignore`, {
                method: 'get',
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

		//获取安装位置
		getWaterFactoryListV2: (params) => {
			return request(`${url}/getWaterFactoryListV2`, {
				method: 'post',
				body: params
			});
		}

	};
}(`/cloud/gzzhsw/api/cp/deviceAllocation`));

/**
 * 更新记录
 */
export const deviceUpdateService = (function (url) {
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
}(`/cloud/gzzhsw/api/cp/deviceUpdateRecord`));

/**
 * 设备统计报表-模板
 */
export const deviceStatisticReportService = (function (url) {
	return {
		
		// 表格查询
		getList: (params) => {
			return request(`${url}/list`, {
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
}(`/cloud/gzzhsw/api/cp/device/template`));

/**
 * 设备统计报表
 */
export const totalCountService = (function (url) {
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
}(`/cloud/gzzhsw/api/cp/device/totalCount`));

/**
 * 设备自定义报表
 */
export const deviceSelfService = (function (url) {
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
}(`/cloud/gzzhsw/api/cp/device/selfCount`));