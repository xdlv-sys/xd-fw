controllers.controller('UploadTemplate2Ctrl', function($scope, common, modal, configuration, $filter, gradeConf) {

    $scope.loadTemplates = function(page, limit) {
        $scope.loadRecord(page, limit, 2, $scope.grid, $scope.user.dept.id);
    }
    $scope.fileList = function(v) {
        var html = '';
        angular.each(v.templates, function(t, i) {
            html += '<a href="../mainTemplate/showFile.cmd?id=' + t.id + '" alt="' + t.fileName + '">文件' + ++i + '</a>&nbsp;&nbsp;';
        });
        return html;
    };

    $scope.grid = common.createGridOption([{
        name: '所属年月',
        field: 'belong',
        cellTemplate: '<div class="ui-grid-cell-contents">{{grid.appScope.onlyYearAndMonth(row.entity.belong)}}</div>'
    }, {
        name: '文件',
        width: "50%",
        cellTemplate: '<div class="ui-grid-cell-contents" ng-bind-html="grid.appScope.fileList(row.entity) | trusted"></div>'
    }, {
        name: '描述',
        width: "20%",
        field: 'comments'
    },{
        name: '状态',
        field: 'status',
        cellTemplate: '<div class="ui-grid-cell-contents" >{{grid.options.configuration.status(row.entity)}}</div>'
    }], $scope, $scope.loadTemplates, gradeConf);

    $scope.upload = function(conf) {
        modal.open({
            title: '上传绩效合同模板',
            url: 'app/js/tpl/w-template-info.html',
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

    $scope.mod = function(){
        $scope.upload($scope.firstSelectedRow());
    };
    $scope.grid.refresh(true);

    $scope.delete = function() {
        common.delete('/mainTemplateRecord/delete.cmd', $scope.constructSelectedId($scope.grid, 'recordIds'), function() {
            $scope.grid.refresh();
        });
    };
});
