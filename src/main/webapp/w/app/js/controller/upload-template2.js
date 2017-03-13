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

    $scope.upload = function() {
        modal.open({
            title: '上传绩效合同模板',
            url: 'app/js/tpl/w-template-info.html',
            width: 600,
            data: {
                templates: [{}]
            },
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
                $scope.save(data, 2, function() {
                    $scope.grid.refresh();
                });
            }
        });
    };
    $scope.grid.refresh(true);

    $scope.delete = function() {
        common.delete('/mainTemplateRecord/delete.cmd', $scope.constructSelectedId($scope.grid, 'recordIds'), function() {
            $scope.grid.refresh();
        });
    };
    $scope.approve = function(status) {
        var params = $scope.constructSelectedId($scope.grid, 'recordIds');
        params.status = status;
        params.comments = '通过';

        var deferred = common.promise(function() {
            common.post('/mainTemplateRecord/push.cmd', params, function() {
                $scope.grid.refresh();
            });
        });

        if (status === 2) {
            modal.prompt({
                content: '请输入拒绝理由:',
                ok: function(result) {
                    params.comments = result;
                    deferred.resolve();
                }
            });
        } else {
            deferred.resolve();
        }
    };

    $scope.canApprove = function(status) {
        var rows = $scope.allSelectedRow();
        return rows.length < 1 || angular.each(rows, function(v) {
            return v.status === status;
        });
    }


});