services.service('gradeConf', function(){
	var me = this;
	me.status = function(v){
		if (v.genre === 1){
			return v.status === 0 ? '未下发' : '己下发';
		} else if (v.genre === 2){
			switch (v.status){
				case 0: return '未审批';
				case 1: return '审批通过';
				case 2: return '审批未通过';
			}
		}
		return '未定义';
	}
});