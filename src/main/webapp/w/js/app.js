controllers.controller('xdController', function($scope, $rootScope, common, modal, menu, $state, $filter, $mdSidenav, $location, configuration) {

    //functions for menu-link and menu-toggle
    this.isOpen = $scope.isOpen = function(section) {
        return menu.isSectionSelected(section);
    };

    this.toggleOpen = $scope.toggleOpen = function(section) {
        menu.toggleSelectSection(section);
    };
    $scope.menuOpen = true;
    $scope.toggleMenu = function() {
        $scope.menuOpen = !$scope.menuOpen;
    };

    $scope.menu = menu;

    $scope.loginSuccess = false;

    $scope.$on('loginSuccess', function(event, user, goState) {
        $rootScope.user = $scope.user = user;
        var mods = [];
        user.roles.each(function(role) {
            role.mods.each(function(mod) {
                if (!mods.containsId(mod)) {
                    mods.push(mod);
                }
            });
        });
        if (mods.length < 1) {
            modal.alert('非常抱歉，你没有权限访问，请联系管理员');
            return;
        }

        var userMods = angular.copy(mods);
        mods = menu.parseMenu(mods, true);

        $rootScope.mods = userMods;
        common.loadAllPage('/dept/obtainDepts.cmd', function(data) {
            $rootScope.depts = data.data;
        });

        if (!goState) {
            //open the default state which is first state in menu
            $state.go(menu.openedSection.state ? menu.openedSection.state : menu.openedSection.pages[0].state);
        }
        $scope.loginSuccess = true;
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
                return user.newPassword === user.newPassword2;
            },
            ok: function(user) {
                if (user.password === user.newPassword) {
                    modal.alert('新密码与密码相同，请重新输入');
                    return;
                }
                user.name = $scope.user.name;
                common.post('/user/changePassword.cmd', user, {
                    fail: function() {
                        modal.alert('修改密码失败: 原密码不正确');
                    }
                });
            }
        }, $scope);
    };

    //refresh
    common.post('/user/sessionUser.cmd', {}, function(data) {
        if (data.data) {
            $scope.$emit("loginSuccess", data.data, window.location.hash);
        } else {
            $state.go('login');
        }
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
    $rootScope.monthFormat = {
        formatDate: function(date) {
            if (date) return $filter('date')(date, 'yyyy-MM');
            else return null;
        },
        parseDate: function(dateString) {
            if (angular.isBlank(text)) {
                return '';
            }
            return new Date(text);
        }
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
    $rootScope.onlyYearAndMonth = function(d) {
        if (angular.isBlank(d)) {
            return '';
        }
        return $filter('date')(new Date(d), 'yyyy-MM');
    };
    $rootScope.safeDate = function(d) {
        if (angular.isBlank(d)) {
            return null;
        }
        return new Date(d);
    };
    $rootScope.firstSelectedRow = function() {
        return this.grid.selection.getSelectedRows()[0];
    };
    $rootScope.allSelectedRow = function() {
        return this.grid.selection.getSelectedRows();
    };

    $rootScope.fillGrid = function(grid) {
        grid = grid ? grid : this.grid;
        return function(data, total) {
            if (total) {
                grid.data = data;
                grid.totalItems = total;
            } else {
                grid.data = data.data;
                grid.totalItems = data.total;
            }
        }
    };

    common.post('/user/version.cmd', {}, function(data) {
        $scope.appName = data.name;
        document.title = $scope.appName;
    });

});
