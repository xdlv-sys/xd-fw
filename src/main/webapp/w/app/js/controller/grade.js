controllers.controller('GradeCtrl', function($scope, common, modal, configuration, $filter, gradeConf) {

    $scope.load = function(page, limit) {
        common.loadPage('/grade/obtain.cmd',{
            page: page,
            limit: limit,
            'user.id' : $scope.user.id
        }, $scope.fillGrid($scope.grid));
    }

    $scope.grid = common.createGridOption([{
        name: '所属年月',
        field: 'belong',
        cellTemplate: '<div class="ui-grid-cell-contents">{{grid.appScope.onlyYearAndMonth(row.entity.belong)}}</div>'
    },{
        name: '部门',
        field: 'user.user.dept.name'
    }, {
        name: '文件',
        width: "55%",
        cellTemplate: '<div class="ui-grid-cell-contents"><a href="../grade/showFile.cmd?id={{row.entity.id}}">{{row.entity.fileName}}</a></div>'
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

    $scope.disabledMod = function(){
        return angular.each($scope.grid.data, function(d){
            return d.status !== 0 && d.status !== 2;
        });
    }

    $scope.add = function(conf){
        modal.openWithCtrl('GradeItemCtrl',{
            title: '上传绩效',
            url: 'app/js/tpl/z-template-info.html',
            width: 600
        });
    };
});
