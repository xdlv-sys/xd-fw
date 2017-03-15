controllers.controller('UploadTemplateCtrl', function($scope, common, modal, configuration, $state, $filter,gradeConf) {

    $scope.loadTemplates = function(page, limit) {
        $scope.loadRecord(page, limit, 1,$scope.grid);
    };

    $scope.grid = common.createGridOption([{
        name: '所属年月',
        field: 'belong',
        cellTemplate: '<div class="ui-grid-cell-contents">{{grid.appScope.onlyYearAndMonth(row.entity.belong)}}</div>'
  
    }, {
        name: '完成',
        cellTemplate: '<div class="ui-grid-cell-contents" >{{row.entity.templates.length + "/17"}}</div>'
    }, {
        name: '备注',
        field: 'comments'
    }, {
        name: '状态',
        field: 'status',
        cellTemplate: '<div class="ui-grid-cell-contents" >{{grid.options.configuration.status(row.entity)}}</div>'
    }], $scope, $scope.loadTemplates, gradeConf);

    $scope.grid.refresh(true);

    $scope.addRecord = function() {
        $state.go('add-template-item');
    };

    $scope.modRecord = function() {
        $state.go('add-template-item', { params: $scope.firstSelectedRow() });
    };

    $scope.disabledPush = function(){
        var rows = $scope.allSelectedRow();
        return rows.length < 1 || angular.each(rows, function(v){
            return v.templates.length < 17 || v.status !== 0;
        });
    };
    
});
