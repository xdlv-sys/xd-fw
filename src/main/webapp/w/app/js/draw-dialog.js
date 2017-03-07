controllers.controller('DrawDialogCtrl', function($scope, common, modal, module, $filter, util, $interval, dialogConf, $mdSidenav, $mdToast) {

    angular.extend($scope, dialogConf);

    $scope.times = 0;
    $scope.timer = $interval(function() {
        $scope.modal.waitFlag = '-----'.substring(0, $scope.times++ % 4);
    }, 800);

    $scope.cancleFlag = function() {
        $interval.cancel($scope.timer);
        $scope.modal.checkFlag = false;
    };

    $scope.beginDraw = function() {
        $scope.cancleFlag();
        $scope.modal.drawItems = util.shuffle($scope.modal.drawItems);
        var length = $scope.modal.drawItems.length;
        var count = 0;
        var index;
        var timer = $interval(function() {
            index = count++ % length;
            $scope.currentItem = $scope.modal.drawItems[index];
            $scope.modal.waitFlag = $scope.currentItem.content;
        }, 20, $scope.modal.draw.duration * 1000 / 20).then(function() {
            $scope.modal.checkFlag = true;
            if ($scope.modal.draw.reset === 0) {
                $scope.modal.drawItems = $scope.modal.drawItems.splice(index, 1);
            }
        });
    };

    $scope.submitScore = function(row, heart, star, fresh) {
        common.post('/drawItem/submitScore.cmd', {
            drawItemId: row.id,
            heart: heart,
            star: star
        }, function() {
            $mdToast.show($mdToast.simple().textContent('分数己记录').position('bottom left right').hideDelay(2000));
            if (fresh){
                $scope.grid.refresh(true);
            }
            row.heart += heart;
            row.star += star;
        });
    };

    $scope.showGrid = function() {
        $mdSidenav('right').toggle();
        $scope.grid.refresh(true); //.then(function() {});
    };

    $scope.loadData = function() {
        common.loadAllPage('/drawItem/obtainDrawItems.cmd', function(data) {
            //var top = 10;
            data.data.sort(function(a, b) {
                return b.heart * 3 + b.star - a.star - a.heart * 3;
            });//.splice(top - 1, data.data.length - top);

            $scope.grid.data = data.data;

            //var index = 0, score = 100000;
            $scope.grid.data.each(function(d,i){
                d.index = i + 1;
                if (d.index < 10){
                    d.index = '0' + d.index;
                }
                /*if (score > d.score){
                    score = d.score;
                    index ++;
                }
                d.index = index;
                d.heart = parseInt(d.score / 3);
                d.star = d.score % 3;*/
            });
        }, {
            drawId: $scope.modal.draw.id
        });
    };

    $scope.grid = common.createGridOption([{
        name: '序号',
        cellTemplate: ['<div class="ui-grid-cell-contents">{{row.entity.index}}&nbsp;&nbsp;'
        , '<md-button class="fa fa-arrow-up draw_heart" ng-click="grid.appScope.submitScore(row.entity,0,1, false)"></md-button>'
        ,, '<md-button class="fa fa-arrow-down draw_star" ng-click="grid.appScope.submitScore(row.entity, 0,-1, false)"></md-button>'
        ,'</div>'].join('')
    },{
        name: '姓名',
        field: 'content'
    }, {
        name: '榜单',
        cellTemplate: ['<div class="ui-grid-cell-contents">',
        '<md-button class="fa fa-heart draw_heart" ng-click="grid.appScope.submitScore(row.entity,1,0, false)">&nbsp;{{row.entity.heart}}</md-button>'
        ,'<md-button class="fa fa-star draw_star" ng-click="grid.appScope.submitScore(row.entity,0,1, false)">&nbsp;{{row.entity.star}}</md-button>'
        ,'</div>'].join('')
    }], $scope, $scope.loadData);
});
