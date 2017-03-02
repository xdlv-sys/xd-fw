controllers.controller('LoginCtrl',
    function($scope, common) {
        $scope.login = function() {
            common.post('/user/userLogin.cmd', $scope.user, {
                success: function(data) {
                    var user = data.data;
                    if (!user) {
                        modal.alert('用户名或者密码有误，请重试。');
                        return;
                    }
                    $scope.$emit("loginSuccess", user);
                }
            });
        }
    }
);
