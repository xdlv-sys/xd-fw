services.service('modal', ['$mdDialog', function($mdDialog) {
    this.confirm = function(msg, conf) {
        var confirm = $mdDialog.confirm()
            .title('提示信息')
            .textContent(msg)
            .ok('继续')
            .cancel('取消');
        $mdDialog.show(confirm).then(function() {
            if (conf && conf.postive) {
                conf.postive();
            }
        }, function() {
            if (conf && conf.negative) {
                conf.negative();
            }
        });
    };

    this.wait = function() {
        $mdDialog.show({
            templateUrl: 'js/tpl/wait.html',
            parent: angular.element(document.body)
        });
    };
    this.hide = function() {
        $mdDialog.hide();
    };
    this.alert = function(msg) {
        $mdDialog.show(
            $mdDialog.alert()
            .parent(angular.element(document.body))
            .clickOutsideToClose(true)
            .title('提示')
            .textContent(msg)
            .ariaLabel('Alert Dialog Demo')
            .ok('确定')
        );
    };
    this.open = function(conf, scope) {
        $mdDialog.show({
                controller: function() {
                    this.data = {};
                    this.width = 300;
                    this.cancel = function() {
                        $mdDialog.cancel();
                    };
                    this.answer = function() {
                        $mdDialog.hide(this.data);
                    };
                    for (var k in conf) {
                        this[k] = conf[k];
                    }
                    this.from = scope;
                },
                templateUrl: 'js/tpl/dialog-common.html',
                parent: angular.element(document.body),
                targetEvent: conf.ev,
                controllerAs: 'modal',
                clickOutsideToClose: false // Only for -xs, -sm breakpoints.
            })
            .then(function(data) {
                if (conf.ok) {
                    conf.ok(data);
                }
            }, function() {
                if (conf.cancel) {
                    conf.cancel();
                }
            });
    };
}]);
