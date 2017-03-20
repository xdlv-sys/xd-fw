controllers.controller('GradeItemCtrl', function($scope, $rootScope, $stateParams, common, modal, configuration, $filter, gradeConf, dialogConf) {
    $scope.grade = $stateParams.params;
    angular.extend($scope, dialogConf);

    $scope.load = function() {
        var fill = $rootScope.fillGrid($scope.grid);
        if ($scope.grade) {
            fill($scope.grade.items, $scope.grade.items.length);
        } else {
            common.loadAllPage('/gradeUser/obtainUsers.cmd', function(data) {
                var grades = [];
                angular.forEach(data.data, function(u) {
                    grades.push({
                        user: u
                    });
                });
                fill(grades, grades.length);
            }, {
                leader: $rootScope.user.id
            });
        }
    };
    $scope.grid = common.createGridOption([{
        name: '姓名',
        field: 'user.fullName',
        enableCellEdit: false
    }, {
        name: '员工编号',
        enableCellEdit: false,
        field: 'user.code'
    }, {
        name: '自评分',
        field: 'selfScore'
    }, {
        name: '分值',
        field: 'score'
    }], $scope, $scope.load, gradeConf);

    $scope.modal.answer = function(){
        var params = {
            belong: $scope.modal.data.belong,
            'user.id': $rootScope.user.id
        };
        if ($scope.modal.data.importFile.length > 0){
            params.file = $scope.modal.data.importFile[0].lfFile;
        }
        angular.forEach($scope.grid.data, function(d, i){
            params['items[' + i + '].id'] = d.id;
            params['items[' + i + '].selfScore'] = d.selfScore;
            params['items[' + i + '].score'] = d.score;
            params['items[' + i + '].user.id'] = d.user.id;
        });

        common.uploadFile('/grade/save.cmd',params, {
            success: function(){
                $scope.modal.cancel();
            }
        });
    }

/*    $scope.grid.onRegisterApi = function(gridApi) {
        gridApi.edit.on.afterCellEdit($scope, function(rowEntity, colDef, newValue, oldValue) {
            $scope.$apply();
            common.post('/gradeItem/save.cmd', {
                id: rowEntity.id,
                selfScore: rowEntity.selfScore,
                score: rowEntity.score
            });
        });
    };*/

    $scope.grid.refresh(true);
});
