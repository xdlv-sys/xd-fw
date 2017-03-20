controllers.controller('GradeItemCtrl', function($scope, $rootScope, $stateParams, common, modal, configuration, $filter, gradeConf, dialogConf) {
    angular.extend($scope, dialogConf);

    $scope.load = function() {
        common.loadAllPage('/gradeUser/obtainUsers.cmd', function(data) {
            var items = $scope.modal.data.items = $scope.modal.data.items || [];
            angular.forEach(data.data, function(u) {
                if (!angular.each(items, function(v) {
                        return u.id === v.user.id;
                    })) {
                    items.push({
                        user: u
                    });
                }
            });
            $rootScope.fillGrid($scope.grid)(items, items.length);
        }, {
            leader: $rootScope.user.id
        });
    };
    var template = '<input type="number" ng-class="\'colt\' + col.uid" ui-grid-editor style="height:30px;line-height:30px;" ng-model="MODEL_COL_FIELD">'
    
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
        field: 'selfScore',
        editableCellTemplate: template
    }, {
        name: '分值',
        field: 'score',
        editableCellTemplate: template
    }], $scope, $scope.load, gradeConf);

    $scope.modal.answer = function() {
        var params = $scope.modal.data;
        if (params.importFile.length > 0) {
            params.file = params.importFile[0].lfFile;
        }
        params['user.id'] = $rootScope.user.id;
        params.status = 0;

        angular.forEach($scope.grid.data, function(d, i) {
            params['items[' + i + '].id'] = d.id;
            params['items[' + i + '].selfScore'] = d.selfScore;
            params['items[' + i + '].score'] = d.score;
            params['items[' + i + '].user.id'] = d.user.id;
        });
        delete params.items;
        delete params.user;

        common.uploadFile('/grade/save.cmd', params, {
            success: function() {
                $scope.modal.cancel();
                dialogConf.modal.from.grid.refresh();
            }
        });
    };

    $scope.grid.refresh(true);
});
