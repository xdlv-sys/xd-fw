controllers.controller('DrawItemCtrl', function($scope, common, modal, module, $filter, util, $interval, $stateParams) {

    $scope.loadData = function(page, limit) {
        common.loadPage('/drawItem/obtainDrawItems.cmd', {
            page: page,
            limit: limit,
            drawId: $stateParams.params.id
        }, function(data) {
            $scope.grid.data = data.data;
            $scope.grid.totalItems = data.total;
        });
    };

    $scope.grid = common.createGridOption([{
        name: '内容',
        cellTemplate: '<div ng-bind-html="row.entity.content"></div>'
    },{
        name: '点赞',
        field: 'heart'
    },{
        name: '星',
        field: 'star'
    }], $scope, $scope.loadData);

    $scope.grid.refresh(true);

    $scope.openDrawItem = function(drawItem) {
        modal.open(angular.extend({
            url: 'app/tpl/draw-item.html',
            width: 1000,
            title: '新增',
            draw: $stateParams.params,
            data: drawItem,
            froalaConfig: {
                placeholderText: '在此编辑内容',
                imageUploadURL: '../drawItem/uploadImage.cmd'
            },
            ok: function(drawItem) {
                drawItem.drawId = $stateParams.params.id;
                common.post('/drawItem/addDrawItem.cmd', drawItem, function(data) {
                    $scope.grid.refresh();
                });
            }
        }), $scope);
    };

    $scope.addDrawItem = function() {
        $scope.openDrawItem({});
    };

    $scope.delDrawItem = function() {
        common.post('/drawItem/deleteDrawItems.cmd', $scope.constructSelectedId($scope.grid, 'drawItemIds'), {
            success: function() {
                $scope.grid.refresh();
            }
        });
    };

    $scope.modDrawItem = function() {
        $scope.openDrawItem($scope.firstSelectedRow());
    };
});
