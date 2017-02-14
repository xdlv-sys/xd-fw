controllers.controller('xdController', ['$scope', '$rootScope', 'common', 'modal', 'menu', '$state', '$filter','$mdSidenav', function($scope, $rootScope, common, modal, menu, $state, $filter,$mdSidenav) {

    //functions for menu-link and menu-toggle
    this.isOpen = $scope.isOpen = function(section) {
        return menu.isSectionSelected(section);
    };
 
    this.toggleOpen = $scope.toggleOpen = function(section) {
        menu.toggleSelectSection(section);
    };
    $scope.menuOpen = true;
    $scope.toggleMenu = function(){
        $scope.menuOpen = !$scope.menuOpen;
    };

    $scope.menu = menu;

    $scope.loginSuccess = false;

    $scope.$on('loginSuccess', function(event, user, state, mods) {
        $scope.loginSuccess = true;
        $rootScope.user = $scope.user = user;
        $rootScope.mods = mods;
        common.loadAllPage('/dept/obtainDepts.cmd', function(data) {
            $rootScope.depts = data.data;
        });
        $rootScope.back = function() {
            history.back();
        };
        $rootScope.allow = function(modId) {
            var allow = false;
            $rootScope.mods.each(function(v) {
                if (!allow && v.id === modId) {
                    allow = true;
                }
            });
            return allow;
        };

        $rootScope.constructSelectedId = function(grid, key) {
            var products = grid.selection.getSelectedRows();
            var params = {};
            params[key] = [];
            angular.forEach(products, function(v) {
                params[key].push(v.id);
            });
            return params;
        };
        $rootScope.convertDate = function(d) {
            if (!angular.isDate(d)) {
                return d;
            }
            return $filter('date')(d, 'yyyy-MM-dd');
        };
        //used to convert all data and nested objectes to display, now unused since we have a directive for this
        $rootScope.convertDates = function(obj) {
            //convert all date time
            angular.forEach(obj, function(v) {
                obj[i] = $rootScope.convertDates(v);
            });
        };
        $rootScope.convertList = function(param, key, subKey) {
            subKey = subKey || 'id';
            var array = param[key];
            angular.forEach(array, function(v, i) {
                param[key + '[' + i + '].' + subKey] = v;
            });
            delete param[key];
        };
        $rootScope.onlyTheFirstDayPredicate = function(date) {
            return date.getDate() === 1;
        };
        //used to convert all date and list parameters to the right style
        $rootScope.convertParams = function(param, key) {
            //convert all date time
            for (var p in param) {
                param[p] = $rootScope.convertDate(param[p]);
            }
            //convert the nested parameters
            var array = param[key];
            angular.forEach(array, function(v, i) {
                for (var k in v) {
                    if (k === '$$hashKey') {
                        continue;
                    }
                    param[key + '[' + i + '].' + k] = $rootScope.convertDate(v[k]);
                }
            });
            delete param[key];
        };
        $rootScope.onlyYearAndMonth = function(d){
            if (angular.isBlank(d)){
                return '';
            }
            return $filter('date')(new Date(d), 'yyyy-MM');
        };

        $state.go(state);
    });

    $scope.logout = function() {
        common.post('/user/userLogout.cmd', null, {});
        $scope.loginSuccess = false;
        $state.go('login');
    };

    $scope.changePassword = function(e) {
        modal.open({
            title: '修改密码',
            url: 'js/tpl/change-password.html',
            canGo: function(user) {
                console.log(user);
                return user.password && user.newPassword && user.newPassword === user.newPassword2;
            },
            ok: function(user) {
                user.name = $scope.user.name;
                common.post('/user/changePassword.cmd', user, {
                    fail: function() {
                        modal.alert('修改密码失败');
                    }
                });
            }
        }, $scope);
    }
}]);
