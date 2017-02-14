controllers.controller('RoleCtrl', ['$scope', 'common', 'modal', 'module', '$filter', 'menu', function($scope, common, modal, module, $filter, menu) {

    $scope.loadRoles = function(page, limit) {
        common.loadPage('/role/obtainRoles.cmd', {
            page: page,
            limit: limit
        }, {
            success: function(data) {
                $scope.roleGrid.data = data.data;
                $scope.roleGrid.totalItems = data.total;
            }
        });
    };

    $scope.roleGrid = module.createRoleGrid($scope, $scope.loadRoles);
    $scope.loadRoles(1, $scope.roleGrid.paginationPageSize);

    $scope.openRoleInfo = function(conf) {
        var roleForUpdate = conf.data;
        //obtain all dept in advance
        common.loadAllPage('/dept/obtainDepts.cmd', {
            success: function(data) {
                var depts = data.data;
                var mods = [];
                angular.forEach(depts, function(dept) {
                    angular.forEach(dept.roles, function(role) {
                        if (roleForUpdate && roleForUpdate.id === role.id){
                            roleForUpdate.dept = dept;
                        }
                        angular.forEach(role.mods, function(mod) {
                            if (!mods.contains(function(m) {
                                    return m.id === mod.id;
                                })) {
                                mods.push(mod);
                                //selected the mod for update
                                mod.selected = roleForUpdate && roleForUpdate.mods.containsId(mod);
                            }
                        });
                    });
                });
                mods = menu.parseMenu(mods, false, 'children');

                var selectedMods;
                modal.open(angular.extend({
                    url: 'js/tpl/role-info.html',
                    width: 500,
                    depts: depts,
                    mods: mods,
                    treeCallback: function(item, selectedItems) {
                        selectedMods = selectedItems;
                        return true;
                    },
                    ok: function(role) {
                        role.deptId = role.dept.id;
                        delete role.dept;
                        delete role.mods;
                        angular.forEach(selectedMods, function(v, i) {
                            role['mods[' + i + '].id'] = v.id;
                        });

                        common.post('/role/saveRole.cmd', role, {
                            success: function() {
                                $scope.roleGrid.refresh();
                            }
                        });
                    }
                }, conf), $scope);
            }
        });
    };

    $scope.addRole = function() {
        $scope.openRoleInfo({
            title: '新增角色'
        }, $scope);
    };

    $scope.delRole = function() {
        var roles = $scope.roleGrid.selection.getSelectedRows();
        var params = { roleIds: [] };
        angular.forEach(roles, function(v) {
            params.roleIds.push(v.id);
        });
        common.post('/role/deleteRole.cmd', params, {
            success: function() {
                $scope.roleGrid.refresh();
            }
        });
    };

    $scope.modRole = function() {
        var role = $scope.roleGrid.selection.getSelectedRows()[0];
        role = angular.copy(role);

        $scope.openRoleInfo({
            title: '修改角色',
            data: role
        }, $scope);
    };
}]);
