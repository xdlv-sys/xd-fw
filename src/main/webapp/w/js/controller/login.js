controllers.controller('LoginCtrl', [
    '$scope', '$mdSidenav', 'common', 'menu','modal',
    function ($scope, $mdSidenav, common, menu,modal) {
        $scope.login = function () {
            common.post('/user/userLogin.cmd', $scope.user, {
                success: function (data) {
                    var mods = [];
                    var user = data.data;
                    if (!user){
                        modal.alert('用户名或者密码有误，请重试。');
                        return;
                    }
                    user.roles.each(function (role) {
                        role.mods.each(function (mod) {
                            if (!mods.containsId(mod)){
                                mods.push(mod);
                            }
                        });
                    });
                    var userMods = angular.copy(mods);
                    mods = menu.parseMenu(mods, true);
                    var state;

                    mods.each(function(m){
                        if (!angular.isBlank(state)){
                            return;
                        }
                        if (m.type === 'link'){
                            state = m.state;
                        } else {
                            state = m.pages[0].state;
                        }
                    });
                    $scope.$emit("loginSuccess", user, state,userMods);
                }
            });
        }
    }
]);
