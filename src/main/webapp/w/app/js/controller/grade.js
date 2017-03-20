controllers.controller('GradeCtrl', function($scope, common, modal, configuration, $filter, gradeConf) {

    $scope.load = function(page, limit) {
        common.loadPage('/grade/obtain.cmd',{
            page: page,
            limit: limit,
            creatorId: $scope.user.id
        }, $scope.fillGrid($scope.grid));
    }
    $scope.fileList = function(v) {
        var html = '';
        angular.each(v.items, function(t) {
            html += '<a href="../mainTemplate/showFile.cmd?id=' + t.id + '" alt="' + t.fileName + '">' + t.fileName + '</a>&nbsp;&nbsp;';
        });
        return html;
    };

    $scope.grid = common.createGridOption([{
        name: '所属年月',
        field: 'belong',
        cellTemplate: '<div class="ui-grid-cell-contents">{{grid.appScope.onlyYearAndMonth(row.entity.belong)}}</div>'
    },{
        name: '部门',
        field: 'dept',
        cellTemplate: '<div class="ui-grid-cell-contents">{{grid.appScope.deptName(row.entity.deptId)}}</div>'
    }, {
        name: '文件',
        width: "55%",
        cellTemplate: '<div class="ui-grid-cell-contents" ng-bind-html="grid.appScope.fileList(row.entity) | trusted"></div>'
    }, {
        name: '描述',
        field: 'comments',
        width: "20%"
    },{
        name: '状态',
        field: 'status',
        cellTemplate: '<div class="ui-grid-cell-contents" >{{grid.options.configuration.status(row.entity)}}</div>'
    }], $scope, $scope.load, gradeConf);

    $scope.grid.refresh(true);

    $scope.add = function(conf){
        modal.openWithCtrl('GradeItemCtrl',{
            title: '上传绩效',
            url: 'app/js/tpl/z-template-info.html',
            width: 600
        });
    };
});
