controllers.controller('ConfCtrl', ['$scope', 'common', 'modal', 'module', '$filter', 'menu', function($scope, common, modal, module, $filter, menu) {
    $scope.loadConfs = function(page, limit) {
        common.loadPage('/conf/obtainConfigs.cmd', {
            page: page,
            limit: limit
        }, {
            success: function(data) {
                $scope.confGrid.data = data.data;
                $scope.confGrid.totalItems = data.total;
            }
        });
    };

    $scope.confGrid = module.createConfGrid($scope, $scope.loadConfs);
    $scope.loadConfs(1, $scope.confGrid.paginationPageSize);

    $scope.openConfInfo = function(conf){
        modal.open(angular.extend({
                    url: 'js/tpl/conf-info.html',
                    canGo: function(data) {
                        return data.groupNo > -1 && data.confValue && data.confName;
                    },
                    ok: function(conf) {
                        common.post('/conf/saveConfig.cmd', conf, {
                            success: function() {
                                $scope.confGrid.refresh();
                            }
                        });
                    }
                }, conf), $scope);
    };

    $scope.addConf = function() {
        $scope.openConfInfo({
            title: '新增配置'
        }, $scope);
    };
    $scope.modConf = function() {
        var conf = $scope.confGrid.selection.getSelectedRows()[0];
        $scope.openConfInfo({
            title: '修改配置',
            data: conf
        }, $scope);
    };


    $scope.delConf = function() {
        var confs = $scope.confGrid.selection.getSelectedRows();
        var params = { confIds: [] };
        angular.forEach(confs, function(v) {
            params.confIds.push(v.id);
        });
        common.delete('/conf/deleteConfig.cmd', params, {
            success: function() {
                $scope.confGrid.refresh();
            }
        });
    };
}]);
