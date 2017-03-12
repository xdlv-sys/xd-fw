controllers.controller('DownloadTemplateCtrl', function($scope, common, modal, configuration, $state, $filter) {

    $scope.loadRecord = function(page, limit) {
        common.loadPage('/mainTemplate/obtain.cmd', {
            page: page,
            limit: limit,
            deptId: $scope.user.dept.id,
            'record.status': 1
        }, function(data) {
            $scope.grid.data = data.data;
            $scope.grid.totalItems = data.total;
        });
    };

    $scope.grid = common.createGridOption([{
        name: '所属年月',
        field: 'belong'
    }, {
        name: '文件',
        cellTemplate: '<div class="ui-grid-cell-contents"><a href="../mainTemplate/showFile.cmd?id={{row.entity.id}}">{{row.entity.fileName}}</a></div>'
    }, {
        name: '下载次数',
        field: 'downloadTimes'
    }], $scope, $scope.loadRecord, configuration);

    $scope.grid.refresh(true);

    $scope.upload = function(){
        modal.open({
            title: '上传绩效合同模板',
            url : 'app/js/tpl/w-template-info.html',
            width: 600,
            data: {
                templates: [{}]
            },
            toolbar: {
                cls: 'fa fa-plus icon-button',
                titleClick: function(data){
                    if (data.templates.length === 5){
                        modal.alert('不能超过5个模板');
                        return;
                    }
                    data.templates[data.templates.length] = {};
                }
            },
            ok : function(templates){

            }
        });
    };
});
