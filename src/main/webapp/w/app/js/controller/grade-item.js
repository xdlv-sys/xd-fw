controllers.controller('GradeItemCtrl', function($scope, $rootScope, $stateParams,common, modal, configuration, $filter, gradeConf) {
    $scope.grade = $stateParams.params;
    $scope.load = function() {
        var fill = $rootScope.fillGrid($scope.grid);
        if ($scope.grade) {
            fill($scope.grade);
        } else {
            common.loadAllPage('/gradeUser/obtainUsers.cmd', {
                leader: $rootScope.user.id
            }, function(data) {
                var grades = [];
                angular.forEach(data.data, function(u){
                    grades.push({
                        user : u
                    });
                });
                fill(grades);
            });
        }

    };
    $scope.grid = common.createGridOption([{
        name: '姓名',
        field: 'user.fullName'
    }, {
        name: '员工编号',
        field: 'user.code'
    }, {
        name: '自评分',
        field: 'selfScore'
    }, {
        name: '分值',
        field: 'score'
    }], $scope, $scope.load, gradeConf);

    $scope.grid.refresh(true);
});
