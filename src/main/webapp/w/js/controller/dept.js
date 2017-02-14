controllers.controller('DeptCtrl', ['$scope', 'common', 'modal', 'module', '$filter', function($scope, common, modal, module, $filter) {

    $scope.loadDepts = function(page, limit) {
        common.loadPage('/dept/obtainDepts.cmd', {
            page: page,
            limit: limit
        }, {
            success: function(data) {
                $scope.deptGrid.data = data.data;
                // convert roleNames to display
                angular.forEach($scope.deptGrid.data, function(v){
                    v.roleNames = '';
                    angular.forEach(v.roles, function(r){
                        v.roleNames += (r.name + ' ') 
                    });
                });
                $scope.deptGrid.totalItems = data.total;
            }
        });
    };

    $scope.deptGrid = module.createDeptGrid($scope, $scope.loadDepts);
    $scope.loadDepts(1, $scope.deptGrid.paginationPageSize);
}]);
