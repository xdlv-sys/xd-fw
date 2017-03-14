controllers.controller('ApproveCtrl', function($scope, common, modal, configuration, $filter, gradeConf) {

    $scope.loadTemplates = function(page, limit) {
        $scope.loadRecord(page, limit, 3, $scope.grid
            , null,$scope.user.id);
    }
    $scope.fileList = function(v) {
        var html = '';
        angular.each(v.templates, function(t) {
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
    }], $scope, $scope.loadTemplates, gradeConf);

    $scope.grid.refresh(true);

    $scope.add = function(conf){
        modal.open({
            title: '上传绩效',
            url: 'app/js/tpl/z-template-info.html',
            width: 600,
            data: angular.extend({
                templates: [{}]
            },conf),
            toolbar: {
                cls: 'fa fa-plus icon-button',
                titleClick: function(data) {
                    if (data.templates.length === 5) {
                        modal.toast('最大附件数为5个');
                        return;
                    }
                    data.templates[data.templates.length] = {};
                }
            },
            ok: function(data) {
                data.status = 0;
                data.comments = ' ';
                $scope.save(data, 2, function() {
                    $scope.grid.refresh();
                });
            }
        });
    };


});
