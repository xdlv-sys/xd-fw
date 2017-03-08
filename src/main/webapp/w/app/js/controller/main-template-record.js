controllers.controller('MainTemplateRecordCtrl', function($scope, common, modal, configuration, $state, $filter) {

    $scope.loadRecord = function(page, limit) {
        common.loadPage('/mainTemplateRecord/obtain.cmd', {
            page: page,
            limit: limit
        }, function(data) {
            $scope.grid.data = data.data;
            $scope.grid.totalItems = data.total;
        });
    };

    $scope.grid = common.createGridOption([{
        name: '所属年月',
        field: 'belong'
    }, {
        name: '完成',
        cellTemplate: '<div class="ui-grid-cell-contents" >{{row.entity.templates.length + "/17"}}</div>'
    }, {
        name: '操作者',
        field: 'creator'
    }, {
        name: '状态',
        field: 'status',
        cellTemplate: '<div class="ui-grid-cell-contents" >{{row.entity.templates.status === 1 ? "己下发": "未下发"}}</div>'
    }], $scope, $scope.loadRecord, configuration);

    $scope.grid.refresh(true);

    $scope.addRecord = function() {
        $state.go('add-template-item');
    };

    $scope.modRecord = function() {
        $state.go('add-template-item', { params: $scope.firstSelectedRow() });
    };
});
