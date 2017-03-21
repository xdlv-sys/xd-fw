controllers.controller('GradeCtrl', function($scope, common, modal, configuration, $filter, gradeConf) {

    $scope.isDeptManager = function(){
        return $scope.allow(23);
    };
    $scope.load = function(page, limit) {
        var params = {
            page: page,
            limit: limit
        };
        if ($scope.isDeptManager()){
            params['user.id'] = $scope.user.id;
        } else {
            params['dept.id'] = $scope.user.dept.id;
        }
        
        common.loadPage('/grade/obtain.cmd',params, $scope.fillGrid($scope.grid));
    };

    $scope.grid = common.createGridOption([{
        name: '所属年月',
        field: 'belong',
        cellTemplate: '<div class="ui-grid-cell-contents">{{grid.appScope.onlyYearAndMonth(row.entity.belong)}}</div>'
    },{
        name: '班组长',
        field: 'user.fullName'
    },{
        name: '部门',
        field: 'dept.name'
    }, {
        name: '文件',
        width: "35%",
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
        return angular.each($scope.allSelectedRow(), function(d){
            return d.status !== 0 && d.status !== 2;
        });
    };
    $scope.disabledSubmit = function(){
        return angular.each($scope.allSelectedRow(), function(d){
            return d.status === 1 || angular.each(d.items, function(i){
                return angular.isBlank(i.selfScore) || angular.isBlank(i.score);
            });
        });
    };

    $scope.add = function(it){
        modal.openWithCtrl('GradeItemCtrl',{
            title: '上传绩效',
            url: 'app/js/tpl/z-template-info.html',
            width: 600,
            data: it,
            from : $scope
        });
    };

    $scope.approve = function(status){
        var params = $scope.constructSelectedId($scope.grid, 'ids');
        params.status = status;
        common.post('/grade/approve.cmd',params, function(){
            $scope.grid.refresh();
        });
    };
    $scope.mod = function(){
        $scope.add($scope.firstSelectedRow());
    };
    $scope.del = function(){
        common.delete('/grade/delete.cmd',$scope.constructSelectedId($scope.grid, 'ids'), function(){
            $scope.grid.refresh();
        });
    };
});
