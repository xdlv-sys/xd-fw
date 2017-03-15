controllers.controller('DownloadTemplateCtrl', function($scope, common, modal, configuration, $state, $filter,gradeConf) {

    $scope.loadTemplates = function(page, limit){
        $scope.loadItem(page, limit, 5, $scope.grid);
    }

    $scope.grid = common.createGridOption([{
        name: '所属年月',
        field: 'belong',
        cellTemplate: '<div class="ui-grid-cell-contents">{{grid.appScope.onlyYearAndMonth(row.entity.belong)}}</div>'
    }, {
        name: '文件',
        cellTemplate: '<div class="ui-grid-cell-contents"><a href="../mainTemplate/showFile.cmd?id={{row.entity.id}}">{{row.entity.fileName}}</a></div>'
    }, {
        name: '下载次数',
        field: 'downloadTimes'
    }], $scope, $scope.loadTemplates, configuration);

    $scope.grid.refresh(true);
});
