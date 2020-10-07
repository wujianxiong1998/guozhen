import request, { requestJson } from '../utils/request';

//------------------------------------文献审核-----------------------------------------
//分页
export async function getLiteratureAuditList(param) {
    return request('/cloud/gzzhsw/api/cp/document/library/page.smvc', {
        method: 'post',
        body: param,
    })
}

//审核
export async function auditLiterature(param) {
    return request('/cloud/gzzhsw/api/cp/document/library/audit.smvc', {
        method: 'post',
        body: param,
    })
}

//删除
export async function deleteLiteratureAudit(param) {
    return request('/cloud/gzzhsw/api/cp/document/library/delete.smvc', {
        method: 'post',
        body: param,
    })
}
//上传文献
export async function addLiterature(param) {
    return requestJson('/cloud/gzzhsw/api/cp/document/library/saveOrUpdate.smvc', {
        method: 'post',
        body: param,
    })
}

//--------------------------------------问题库--------------------------------------
//分页
export async function getQuestionLibraryList(param) {
    return request('/cloud/gzzhsw/api/cp/problem/library/page.smvc', {
        method: 'post',
        body: param,
    })
}

//保存
export async function saveQuestionLibrary(param) {
    return requestJson('/cloud/gzzhsw/api/cp/problem/library/saveOrUpdate.smvc', {
        method: 'post',
        body: param,
    })
}

//删除
export async function deleteQuestionLibrary(param) {
    return request('/cloud/gzzhsw/api/cp/problem/library/delete.smvc', {
        method: 'post',
        body: param,
    })
}

//------------------------------------------名词解释-------------------------------------
//分页
export async function getNounExplainList(param) {
    return request('/cloud/gzzhsw/api/cp/glossary/page.smvc', {
        method: 'post',
        body: param,
    })
}

//保存
export async function saveNounExplain(param) {
    return requestJson('/cloud/gzzhsw/api/cp/glossary/saveOrUpdate.smvc', {
        method: 'post',
        body: param,
    })
}

//删除
export async function deleteNounExplain(param) {
    return request('/cloud/gzzhsw/api/cp/glossary/delete.smvc', {
        method: 'post',
        body: param,
    })
}

//-----------------------------------------知识检索--------------------------------------------
//分页
export async function getKnowledgeRetrievalList(param) {
    return request('/cloud/gzzhsw/', {
        method: 'post',
        body: param,
    })
}

//--------------------------------------问题诊断----------------------------------------------
//获取所有规则
export async function getAllRules(param) {
    return request('/cloud/gzzhsw/api/cp/diagnosis/setting/list.smvc', {
        method: 'post',
        body: param,
    })
}
//保存操作记录
export async function saveUserOperation(param) {
    return requestJson('/cloud/gzzhsw/api/cp/problem/diagnosis/saveOrUpdate.smvc', {
        method: 'post',
        body: param,
    })
}
//获取所有历史记录
export async function getHistoryList(param) {
    return request('/cloud/gzzhsw/api/cp/problem/diagnosis/page.smvc', {
        method: 'post',
        body: param,
    })
}
//查询历史记录
export async function searchHistory(param) {
    return request('/cloud/gzzhsw/', {
        method: 'post',
        body: param,
    })
}

//----------------------------------------诊断配置--------------------------
//分页
export async function getDiagnoseConfigList(param) {
    return request('/cloud/gzzhsw/api/cp/diagnosis/setting/page.smvc', {
        method: 'post',
        body: param,
    })
}
//保存
export async function saveDiagnoseConfig(param) {
    return requestJson('/cloud/gzzhsw/api/cp/diagnosis/setting/saveOrUpdate.smvc', {
        method: 'post',
        body: param,
    })
}

//-----------------------------------技术支持--------------------------------
//分页
export async function getTechnicalSupportList(param) {
    return request('/cloud/gzzhsw/api/cp/technical/support/page.smvc', {
        method: 'post',
        body: param,
    })
}

//保存/申请支持
export async function saveTechnicalSupport(param) {
    return requestJson('/cloud/gzzhsw/api/cp/technical/support/saveOrUpdate.smvc', {
        method: 'post',
        body: param,
    })
}

//获取详情
export async function getTechnicalSupportDetail(param) {
    return request('/cloud/gzzhsw/api/cp/technical/support/getOne.smvc', {
        method: 'post',
        body: param,
    })
}

//添加回答
export async function addAnswer(param) {
    return requestJson('/cloud/gzzhsw/api/cp/answer/comment/saveAnswer.smvc', {
        method: 'post',
        body: param,
    })
}
//采纳回答
export async function acceptAnswer(param) {
    return request('/cloud/gzzhsw/api/cp/technical/support/accept.smvc', {
        method: 'post',
        body: param,
    })
}

//--------------------------------积分汇总及配置
//分页
export async function getScoreConfigList(param) {
    return request('/cloud/gzzhsw/api/cp/score/page.smvc', {
        method: 'post',
        body: param,
    })
}
//修改
export async function saveScoreConfig(param) {
    return requestJson('/cloud/gzzhsw/api/cp/score/saveOrUpdate.smvc', {
        method: 'post',
        body: param,
    })
}
//获取积分设置
export async function getScoreConfig(param) {
    return requestJson('/cloud/gzzhsw/api/cp/score/getScoreSetting.smvc', {
        method: 'post',
        body: param,
    })
}
//--------------------------------我的知识-----------------------------
export async function getMyKnowledge(param) {
    return request('/cloud/gzzhsw/api/cp/owner/knowledge/getOwnerKnowledge.smvc', {
        method: 'post',
        body: param,
    })
}
//我的回答
export async function getMyAnswer(param) {
    return request('/cloud/gzzhsw/api/cp/owner/knowledge/getMyAnswers.smvc', {
        method: 'post',
        body: param,
    })
}
//---------------------知识检索-----------------------------
export async function getKnowledgeDetail(param) {
    return request('/cloud/gzzhsw/api/cp/document/library/findOne.smvc', {
        method: 'post',
        body: param,
    })
}

//添加评论
export async function addComment(param) {
    return requestJson('/cloud/gzzhsw/api/cp/answer/comment/saveComment.smvc', {
        method: 'post',
        body: param,
    })
}
//查询评论
export async function getComment(param) {
    return request('/cloud/gzzhsw/api/cp/answer/comment/getComments.smvc', {
        method: 'post',
        body: param,
    })
}