controllers.controller('DrawCtrl', function($scope, common, modal, module, $filter, util, $interval, $state) {

    $scope.loadData = function(page, limit) {
        common.loadPage('/draw/obtainDraws.cmd', {
            page: page,
            limit: limit,
            userId: $scope.user.id
        }, function(data) {
            $scope.grid.data = data.data;
            $scope.grid.totalItems = data.total;
        });
    };

    $scope.grid = common.createGridOption([{
        name: '名称',
        field: 'name'
    }, {
        name: '时间',
        field: 'duration'
    }, {
        name: '是否放回',
        field: 'reset',
        cellTemplate: '<div class="ui-grid-cell-contents" >' + '{{row.entity.reset === 1? "是" : "否"}}' + '</div>'
    }, {
        name: '创建时间',
        field: 'createTime'
    }], $scope, $scope.loadData);

    $scope.grid.refresh(true);

    $scope.addDraw = function() {
        modal.open(angular.extend({
            url: 'app/tpl/draw-info.html',
            width: 500,
            title: '新增',
            canGo: function(data) {
                return true; //;data.importFile && data.importFile.length > 0;
            },
            ok: function(draw) {
                draw.file = draw.importFile[0].lfFile;
                draw.userId = $scope.user.id;
                delete draw.importFile;
                draw.froala = draw.froala? 1 : 0;
                common.uploadFile('/draw/addDraw.cmd', draw, {
                    success: function(result) {
                        $scope.grid.refresh();
                    }
                });
            }
        }), $scope);
    };

    $scope.downloadTemplate = function() {
        util.downloadFile('../draw/downloadTemplate.cmd');
    };
    $scope.delDraw = function() {
        common.post('/draw/deleteDraws.cmd', $scope.constructSelectedId($scope.grid, 'drawIds'), {
            success: function() {
                $scope.grid.refresh();
            }
        });
    };

    $scope.modDraw = function() {
        $state.go('drawItem', { params: $scope.firstSelectedRow() });
    };

    $scope.startDraw = function() {
        common.loadAllPage('/drawItem/obtainDrawItems.cmd', function(data) {
            modal.openWithCtrl('DrawDialogCtrl', {
                url: 'app/tpl/draw-show.html',
                width: 600,
                title: '同学们，注意了，要提问了:)',
                hideConfirmButton: true,
                draw: $scope.firstSelectedRow(),
                drawItems: data.data
            });
        }, {
            drawId: $scope.firstSelectedRow().id
        });
    };
});
