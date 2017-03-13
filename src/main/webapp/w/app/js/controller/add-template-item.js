controllers.controller('AddTemplateItemCtrl', function($scope, common, modal, configuration, $state, $stateParams, $filter) {
    $scope.data = $stateParams.params;
    $scope.addTemplateFlag = !$scope.data;

    $scope.data = $scope.data || {};
    $scope.data.templates = $scope.data.templates || [];

    common.loadAllPage('/dept/obtainDepts.cmd', function(data) {
        $scope.depts = data.data.splice(1);
        $scope.depts.each(function(d) {
            if (!$scope.data.templates.contains(function(t) {
                    if (t.deptId === d.id){
                        t.deptName = d.name;
                        return true;
                    }
                })) {
                $scope.data.templates.push({
                    deptId: d.id,
                    deptName: d.name
                });
            }
        });
    });
});
