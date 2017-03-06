controllers.controller('GradeUserCtrl', function ($scope, common, modal, configuration, $filter) {

    $scope.loadUsers = function (page, limit) {
        common.loadPage('/gradeUser/obtainUsers.cmd', {
            page: page,
            limit: limit
        }, function (data) {
            $scope.userGrid.data = data.data;
            $scope.userGrid.totalItems = data.total;
        });
    };

    $scope.userGrid = common.createGridOption([{
        name: '姓名',
        field: 'fullName'
    }, {
        name: '所属机构',
        field: 'organization',
        cellTemplate: '<div class="ui-grid-cell-contents" >{{grid.options.configuration.i18n(1,"organization",row.entity.organization)}}</div>'
    }, {
        name: '员工编号',
        field: 'code'
    }, {
        name: '就职地点',
        field: 'location'
    }, {
        name: '部门',
        field: 'user.dept.name'
    }, {
        name: '岗位名称',
        field: 'jobName'
    }, {
        name: '用工性质',
        field: 'contractType',
        cellTemplate: '<div class="ui-grid-cell-contents" >{{grid.getCellValue(row, col)===0?\'业务代办\':"其它"}}</div>'
    }, {
        name: '在职状态',
        field: 'inService',
        cellTemplate: '<div class="ui-grid-cell-contents" >{{grid.getCellValue(row, col)===0?\'离职\':"在职"}}</div>'
    }], $scope, $scope.loadUsers,configuration);

    $scope.userGrid.refresh(true);

    $scope.openUserInfo = function (conf) {
        //obtain all dept in advance
        common.loadAllPage('/dept/obtainDepts.cmd', {
            success: function (data) {
                var depts = data.data;
                //replace user dept
                if (conf.data && conf.data.dept) {
                    var index = -1;
                    depts.each(function (v, i) {
                        if (conf.data.dept.id === v.id) {
                            index = i;
                        }
                    });
                    if (index > -1) {
                        depts[index] = conf.data.dept;
                    }
                    //TODO simply process
                    angular.forEach(conf.data.roles, function (r, i) {
                        angular.each(conf.data.dept.roles, function (r1, j) {
                            if (r.id === r1.id) {
                                conf.data.roles[i] = r1;
                                return true;
                            }
                        });
                    });
                    if (conf.data.roles
                        && conf.data.dept.roles.length === conf.data.roles.length) {
                        conf.data.roles = conf.data.dept.roles;
                    }
                }
                modal.open(angular.extend({
                    url: 'app/js/tpl/user-info.html',
                    width: 500,
                    depts: depts,
                    organizations: configuration.group(1,'organization'),
                    canGo: function (data) {
                        data = data || {};
                        return conf.mod || data.password === data.password2;
                    },
                    ok: function (user) {
                        //TODO simply process
                        //var roles = user.roles.length > 0 ? user.dept.roles : [];

                        angular.forEach(user.roles, function (v, i) {
                            user['roles[' + i + '].id'] = v.id;
                        });
                        delete user.roles;

                        user['dept.id'] = user.dept.id;
                        delete user.dept;

                        common.post('/gradeUser/saveUser.cmd', user, {
                            success: function () {
                                $scope.userGrid.refresh();
                            }
                        });
                    }
                }, conf), $scope);
            }
        });
    };

    $scope.addUser = function () {
        $scope.openUserInfo({
            title: '新增用户'
        }, $scope);
    };

    $scope.delUser = function () {
        var users = $scope.userGrid.selection.getSelectedRows();
        var params = {userIds: []};
        angular.forEach(users, function (v) {
            params.userIds.push(v.id);
        });
        common.delete('/user/deleteUser.cmd', params, {
            success: function () {
                $scope.userGrid.refresh();
            }
        });
    };

    $scope.modUser = function () {
        var user = $scope.userGrid.selection.getSelectedRows()[0];
        $scope.openUserInfo({
            title: '修改用户',
            data: user,
            mod: true
        }, $scope);
    };
});
