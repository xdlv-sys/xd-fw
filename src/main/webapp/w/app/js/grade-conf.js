services.service('gradeConf', function(){
	var me = this;
	me.status = function(v){
		if (v.genre === 1){
			switch (v.status){
				case 0: return '未提交或审批未通过';
				case 1: return '分管领导审批';
				case 2: return '分管审批未通过';
				case 3: return '分管审批通过';
				case 4: return '总经理审批未通过';
				case 5: return '总经理审批通过';
			}
		} else if (v.genre === 2){
			switch (v.status){
				case 0: return '未审批或审批未通过';
				case 1: return '审批通过';
				case 2: return '审批未通过';
			}
		} else {
			switch (v.status){
				case 0: return '草稿';
				case 1: return '己提交';
				case 2: return '部门经理审核未通过';
				case 3: return '部门经理审核通过';
				case 4: return '部门经理审核通过';
			}
		}
	}
});