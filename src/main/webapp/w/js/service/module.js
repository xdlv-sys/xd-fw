services.service('module', ['common', 'configuration', function(common, configuration) {
    this.createUserGrid = function(scope, loadData) {
        return common.createGridOption([{
            name: '用户名',
            field: 'name'
        }, {
            name: '生日',
            field: 'birthday'
        }, {
            name: '性别',
            field: 'sex',
            cellTemplate: '<div class="ui-grid-cell-contents" >{{grid.getCellValue(row, col)===0?\'女\':\'男\'}}</div>'
        }, {
            name: '入职时间',
            field: 'entryTime'
        }, {
            name: '手机号码',
            field: 'mobile'
        }, {
            name: '固定电话',
            field: 'phone'
        }, {
            name: '身份证号',
            field: 'idCard'
        }, {
            name: '邮箱',
            field: 'mail'
        }, {
            name: '部门',
            field: 'dept.name'
        }], scope, loadData);
    };

    this.createDeptGrid = function(scope, loadData) {
        return common.createGridOption([{
            name: '部门名',
            field: 'name'
        }, {
            name: '角色',
            field: 'roleNames'
        }], scope, loadData);
    };

    this.createRoleGrid = function(scope, loadData) {
        return common.createGridOption([{
            name: '角色名',
            field: 'name'
        }], scope, loadData);
    };

    this.createConfGrid = function(scope, loadData) {
        return common.createGridOption([{
            name: '组编号',
            field: 'groupNo'
        }, {
            name: '配置名',
            field: 'confName'
        }, {
            name: '配置值',
            field: 'confValue'
        }, {
            name: '描述',
            field: 'confDesc'
        }], scope, loadData);
    };
    

}]);
