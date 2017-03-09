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

    $scope.save = function() {
        var parmas = {
            files: [],
            creator: $scope.user.name,
            belong: $scope.data.belong,
            status: 0,
            id : $scope.data.id
        };
        var i = 0;
        $scope.data.templates.each(function(d) {
            if (!angular.isBlank(d.importFile)) {
                parmas.files.push(d.importFile[0].lfFile);
                parmas['templates[' + i++ + '].deptId'] = d.deptId;
            }
        });

        common.uploadFile('/mainTemplateRecord/save.cmd', parmas, {
            success: function(result) {
                modal.alert('操作成功');
            },
            fail: function(result) {
                modal.alert('操作失败，请联系管理员');
            }
        });
    };

});
