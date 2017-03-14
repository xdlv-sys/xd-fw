controllers.controller('TemplateCtrl', function($scope, common, modal, configuration, $filter) {
    $scope.loadItem = function(page, limit, status, grid) {
        common.loadPage('/mainTemplate/obtain.cmd', {
            page: page,
            limit: limit,
            deptId: $scope.user.dept.id,
            'record.status': status
        }, function(data) {
            grid.data = data.data;
            grid.totalItems = data.total;
        });
    };

    $scope.loadRecord = function(page, limit, genre, grid,deptId,userId) {
        common.loadPage('/mainTemplateRecord/obtain.cmd', {
            page: page,
            limit: limit,
            genre: genre,
            deptId: deptId,
            'user.id' : userId
        }, function(data) {
            grid.data = data.data;
            grid.totalItems = data.total;
        });
    };

    $scope.save = function(data, genre, call) {
        var parmas = {
            files: [],
            creator: $scope.user.name,
            deptId: $scope.user.dept.id,
            belong: data.belong,
            genre: genre,
            status: 0,
            id : data.id
        };
        var i = 0;
        data.templates.each(function(d) {
            if (!angular.isBlank(d.importFile)) {
                parmas.files.push(d.importFile[0].lfFile);
                parmas['templates[' + i++ + '].deptId'] = d.deptId || $scope.user.dept.id;
            }
        });

        common.uploadFile('/mainTemplateRecord/save.cmd', parmas, {
            success: function(result) {
                if (call){
                    call();
                } else {
                    modal.alert('操作成功');
                }
            },
            fail: function(result) {
                modal.alert('操作失败，请联系管理员');
            }
        });
    };
});
