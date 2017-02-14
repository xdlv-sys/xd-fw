var services = angular.module('common.services', []);
var controllers = angular.module('xdApp.controllers', ['common.directives']);
var directives = angular.module('common.directives', ['common.services']);
controllers.controller('taxController', ['$scope', '$rootScope', 'common', 'modal', 'menu', '$state', '$filter','$mdSidenav', function($scope, $rootScope, common, modal, menu, $state, $filter,$mdSidenav) {

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

controllers.controller('BudgetItemCtrl', ['$scope', 'common', 'modal', 'module', '$filter', '$stateParams', 'configuration', function($scope, common, modal, module, $filter, $stateParams, configuration) {

    //var project = $scope.convertParams($stateParams.project,'outSources');
    /*$scope.modal = module.getProjectTypes({
        add: false,
        data: $scope.project
    });*/
    $scope.budget = $stateParams.budget;
    
    $scope.indexes = ['一、','二、','三、','四、','五、','六、','七、','八、','九、','十、'];
}]);

controllers.controller('BudgetCtrl', ['$scope', '$rootScope', 'configuration', 'common', 'modal', 'module', '$filter', '$state', function($scope, $rootScope, configuration, common, modal, module, $filter, $state) {

    $scope.showDetail = function(row) {
        $state.go('budget-item', { budget: row.entity });
    };

    $scope.loadBudgets = function(page, limit) {
        common.loadPage('/budget/obtainBudgets.cmd', angular.extend({
            page: page,
            limit: limit
        }, $scope.query), {
            success: function(data) {
                $scope.budgetGrid.data = data.data;
                $scope.budgetGrid.totalItems = data.total;
            }
        });
    };

    $scope.budgetGrid = module.createBudgetGrid($scope, $scope.loadBudgets, configuration);
    $scope.loadBudgets(1, $scope.budgetGrid.paginationPageSize);

    $scope.delBudget = function() {
        var budgets = $scope.budgetGrid.selection.getSelectedRows();
        var params = { budgetIds: [] };
        angular.forEach(budgets, function(v) {
            params.budgetIds.push(v.projectId);
        });

        common.post('/budget/deleteBudget.cmd', params, {
            success: function() {
                $scope.budgetGrid.refresh();
            }
        });
    };
}]);

controllers.controller('CalculateItemCtrl', ['$scope', 'common', 'modal', 'module', '$filter', '$stateParams', 'configuration','util', function($scope, common, modal, module, $filter, $stateParams, configuration,util) {

    $scope.budget = $stateParams.budget;

    var ratios = [{
        name: '17%',
        value: 0.17
    }, {
        name: '13%',
        value: 0.13
    }, {
        name: '11%',
        value: 0.11
    }, {
        name: '6%',
        value: 0.06
    }, {
        name: '5%',
        value: 0.05
    }, {
        name: '3%',
        value: 0.03
    }, {
        name: '1.5%',
        value: 0.015
    }, {
        name: '0%',
        value: 0.0
    }];


    var columnDefs = [{
        name: '序号',
        enableCellEdit: false,
        field: 'itemIndex'
    }, {
        name: '材料名称',
        enableCellEdit: false,
        field: 'materialName'
    }, {
        name: '型号规格',
        enableCellEdit: false,
        field: 'model'
    }, {
        name: '单位',
        enableCellEdit: false,
        field: 'unit'
    }, {
        name: '数量',
        enableCellEdit: false,
        field: 'count'
    }, {
        name: '预算价',
        enableCellEdit: false,
        field: 'price'
    }, {
        name: '合计',
        enableCellEdit: false,
        field: 'total'
    }, {
        name: '税率',
        editModelField: 'taxRatio',
        cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.taxRatio !== null? (row.entity.taxRatio* 100 + "%") : ""}}</div>',
        editableCellTemplate: 'ui-grid/dropdownEditor',
        enableCellEdit: true,
        editDropdownIdLabel: 'value',
        editDropdownValueLabel: 'name',
        editDropdownOptionsArray: ratios
    }, {
        name: '税额',
        enableCellEdit: false,
        cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.taxRatio !== null ? (row.entity.total * row.entity.taxRatio/ (row.entity.taxRatio + 1)).toFixed(2) : ""}}</div>'
    }, {
        name: '不含税金额',
        enableCellEdit: false,
        cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.taxRatio !== null ? (row.entity.total / (row.entity.taxRatio + 1)).toFixed(2) : ""}}</div>'
    }];


    $scope.createGrid = function(data) {
        return {
            columnDefs: angular.copy(columnDefs),
            data: data,
            onRegisterApi: function(gridApi) {
                gridApi.edit.on.afterCellEdit($scope, function(rowEntity, colDef, newValue, oldValue) {
                    $scope.$apply();
                    $scope.updateTotal(); // update total info manually
                    common.post('/calculate/updateRatio.cmd',{
                        id : rowEntity.id,
                        taxRatio: rowEntity.taxRatio
                    });
                });
            }
        };
    };
    $scope.manBudgetGrid = $scope.createGrid([]);
    $scope.materialBudgetGrid = $scope.createGrid([]);
    $scope.machineBudgetGrid = $scope.createGrid([]);

    
    angular.forEach($scope.budget.groups, function(g) {
        if (g.name === '人工') {
            $scope.manBudgetGrid = $scope.createGrid(g.items);
        } else if (g.name === '材料') {
            $scope.materialBudgetGrid = $scope.createGrid(g.items);
        } else if (g.name === '机械') {
            $scope.machineBudgetGrid = $scope.createGrid(g.items);
        }
    });

    $scope.totalBudgetGrid = {
    	columnDefs : [{
    		name : '人工',
    		field: 'man',
    		cellFilter: 'toFixed'
    	},{
    		name : '材料',
    		field: 'material',
    		cellFilter: 'toFixed'
    	},{
    		name : '机械',
    		field: 'machine',
    		cellFilter: 'toFixed'
    	},{
    		name : '合计',
    		field: 'total',
    		cellFilter: 'toFixed'
    	}],
    	data:[]
    };

    $scope.updateTotal = function(){
    	var manTotal = 0, 
        materialTotal = 0, 
        machineTotal = 0;

        angular.forEach($scope.manBudgetGrid.data, function(v){
        	manTotal += util.taxCount(v);
        });
        angular.forEach($scope.materialBudgetGrid.data, function(v){
        	materialTotal += util.taxCount(v);
        });
        angular.forEach($scope.machineBudgetGrid.data, function(v){
        	machineTotal += util.taxCount(v);
        });
        $scope.totalBudgetGrid.data = [{
        	man : manTotal,
    		material : materialTotal,
    		machine : machineTotal,
    		total: (manTotal + materialTotal + machineTotal)
        }];
    };
    $scope.updateTotal();

    $scope.exportCalculate = function(){
        var url = '../calculate/exportCalculate.cmd?';
        url += 'id=' + $scope.budget.projectId;
        window.open(url,'_self');
    };

}]);

controllers.controller('CalculateCtrl', ['$scope', '$rootScope', 'configuration', 'common', 'modal', 'module', '$filter', '$stateParams','$state','util', function($scope, $rootScope, configuration, common, modal, module, $filter, $stateParams,$state,util) {

    if ($stateParams.budgets){
        angular.forEach($stateParams.budgets, function(b){
            var rate = configuration.i18n(2,"rate",b.project.rate);
            //remove percent flag % and parsed into float
            rate = parseInt(rate.substring(0, rate.length -1));
            rate = rate /100.0;
            b.unTaxCount = (b.project.totalCount / (1 + rate));
            b.saleCount = b.unTaxCount * rate;

            b.inCount = 0;
            angular.forEach(b.groups, function(g){
                if (g.name === '人工' 
                    || g.name === '材料' || g.name === '机械'){
                    angular.forEach(g.items, function(i){
                        b.inCount += util.taxCount(i);
                    });
                }
            });

            b.shouldTaxCount = b.saleCount - b.inCount;
            b.taxPercent = b.shouldTaxCount / b.unTaxCount;
            
        });
    	$scope.taxCalculateGrid = {
    		configuration: configuration,
    		columnDefs: [{
    			name : '项目名称',
    			field: 'project.name'
    		},{
    			name: '合同金额',
    			field: 'project.totalCount'
    		},{
    			name : '税率',
    			cellTemplate: '<div class="ui-grid-cell-contents" >{{grid.options.configuration.i18n(2,"rate",row.entity.project.rate)}}</div>'
    		},{
    			name: '不含税金额',
                field: 'unTaxCount',
                cellFilter: 'toFixed'
    		},{
    			name: '销项税额 ',
    			field: 'saleCount',
                cellFilter: 'toFixed'
    		},{
    			name: '进项税额',
                field: 'inCount',
                cellFilter: 'toFixed'
    		},{
    			name: '应纳税额',
    			field: 'shouldTaxCount',
                cellFilter: 'toFixed'
    		},{
                name: '税负',
                field: 'taxPercent',
                cellFilter: 'toFixed:4'
            }],
    		data: $stateParams.budgets
    	};
    }

    $scope.exportTaxCalculate = function(){
        var url = '../calculate/exportTaxCalculate.cmd?';
        angular.forEach($stateParams.budgets, function(b){
            url += 'budgetIds=' + b.projectId + '&'
        });
        window.open(url,'_self');
    };

    $scope.calculateBudget = function(){
        var budget = $scope.budgetGrid.selection.getSelectedRows()[0];
        $state.go('calculate-item', { budget: budget });
    };

    $scope.showTaxCalculateBudget = function(){
    	var budgets = $scope.budgetGrid.selection.getSelectedRows();
        $state.go('tax-calculate-item', { budgets: budgets });
    };
    $scope.disableShowTaxCalculte = function(){
        var budgets = $scope.budgetGrid.selection.getSelectedRows();

        return budgets.length < 1 || angular.each(budgets, function(b){
            return angular.each(b.groups, function(g){
                if (g.name === '人工' 
                    || g.name === '材料' || g.name === '机械'){
                    return angular.each(g.items, function(i){
                        if (i.taxRatio === null){
                            return true;
                        }
                    });
                }
            });
        });
    }
}]);

controllers.controller('ConfCtrl', ['$scope', 'common', 'modal', 'module', '$filter', 'menu', function($scope, common, modal, module, $filter, menu) {
    $scope.loadConfs = function(page, limit) {
        common.loadPage('/conf/obtainConfigs.cmd', {
            page: page,
            limit: limit
        }, {
            success: function(data) {
                $scope.confGrid.data = data.data;
                $scope.confGrid.totalItems = data.total;
            }
        });
    };

    $scope.confGrid = module.createConfGrid($scope, $scope.loadConfs);
    $scope.loadConfs(1, $scope.confGrid.paginationPageSize);

    $scope.openConfInfo = function(conf){
        modal.open(angular.extend({
                    url: 'js/tpl/conf-info.html',
                    canGo: function(data) {
                        return data.groupNo > -1 && data.confValue && data.confName;
                    },
                    ok: function(conf) {
                        common.post('/conf/saveConfig.cmd', conf, {
                            success: function() {
                                $scope.confGrid.refresh();
                            }
                        });
                    }
                }, conf), $scope);
    };

    $scope.addConf = function() {
        $scope.openConfInfo({
            title: '新增配置'
        }, $scope);
    };
    $scope.modConf = function() {
        var conf = $scope.confGrid.selection.getSelectedRows()[0];
        $scope.openConfInfo({
            title: '修改配置',
            data: conf
        }, $scope);
    };


    $scope.delConf = function() {
        var confs = $scope.confGrid.selection.getSelectedRows();
        var params = { confIds: [] };
        angular.forEach(confs, function(v) {
            params.confIds.push(v.id);
        });
        common.post('/conf/deleteConfig.cmd', params, {
            success: function() {
                $scope.confGrid.refresh();
            }
        });
    };
}]);

controllers.controller('ConstructionProgressCtrl', ['$scope', '$rootScope', 'configuration', 'common', 'modal', 'module', '$filter', '$state', function($scope, $rootScope, configuration, common, modal, module, $filter, $state) {

    $scope.openProgressInfo = function(conf) {
        var params = {
            url: 'js/tpl/construction-progress-info.html',
            width: 400,
            ok: function(progress) {
                common.post('/construction-progress/saveProgress.cmd', progress, {
                    success: function() {
                        modal.alert('工程进度录入成功。');
                    },
                    fail: function(data){
                        if (data.errorCode === 1){
                            modal.alert('工程进度录入失败：己存在对应月份的记录。');
                        }
                    }
                });
            }
        };
        modal.open(angular.extend(params, conf), $scope);
    };

    $scope.addProgress = function() {
        var project = $scope.getSelectedProjects()[0];
        $scope.openProgressInfo({
            title: '新增工程进度',
            add: true,
            data: {
                'project.id': project.id,
                importUser: $scope.user.name
            },
            projectName: project.name
        });
    };
}]);

controllers.controller('ContractProgressCtrl', ['$scope', '$rootScope', 'configuration', 'common', 'modal', 'module', '$filter', '$state', function($scope, $rootScope, configuration, common, modal, module, $filter, $state) {
    
    $scope.openProgressInfo = function(conf) {
        var params = {
            url: 'js/tpl/contract-progress-info.html',
            width: 400,
            ok: function(progress) {
                common.post('/contract-progress/saveProgress.cmd', progress, {
                    success: function() {
                        modal.alert('合同进度录入成功。');
                    },
                    fail: function(data){
                        if (data.errorCode === 1){
                            modal.alert('合同进度录入失败：己存在对应月份的记录。');
                        }
                    }
                });
            }
        };
        modal.open(angular.extend(params, conf), $scope);
    };

    $scope.addProgress = function() {
        var project = $scope.getSelectedProjects()[0];
        $scope.openProgressInfo({
            title: '新增合同进度',
            add: true,
            data: {
                'project.id': project.id,
                importUser: $scope.user.name
            },
            projectName: project.name
        });
    };
}]);

controllers.controller('CostTaxCtrl', ['$scope', 'common', 'modal', 'module', '$filter', '$stateParams', 'configuration', 'supplierTypeName','util', function($scope, common, modal, module, $filter, $stateParams, configuration, supplierTypeName,util) {

    supplierTypeName.success(function(allSupplierTypes) {
        $scope.modal = module.getSupplierTypes({
            allSupplierTypes: allSupplierTypes
        });

        $scope.$watch('identityType', function(n) {
            $scope.modal.supplierTypes = $scope.modal.allSupplierTypes[n];
        });
    });
    $scope.identityType = 1;

    $scope.costTaxGrid = {
        columnDefs: [{
            name: '供应商类别',
            field: 'supplierType'
        },{
            name: '最优采购成本',
            field: 'cost',
            cellFilter: 'toFixed'
        },{
            name: '税率',
            field: 'rate'
        },{
            name: '进项税',
            field: 'inCount',
            cellFilter: 'toFixed'
        },{
            name: '最优采购支付总额',
            field: 'finallyTotal'
        },{
            name: '备注',
            field: 'remark'
        }]
    };

    $scope.calculate = function(){
        // find index and subIndex
        var index, subIndex;
        $scope.modal.supplierTypes.each(function (v, i){
            if (v === $scope.supplierType){
                index = i;
                return true;
            }
        });

        $scope.supplierType.supplierSubTypeNames.each(function(v,i){
            if (v === $scope.supplierSubType){
                subIndex = i;
                return true;
            }
        });

        function f(i){
            var s = $scope.modal.allSupplierTypes[i][index].supplierSubTypeNames[subIndex];
            return util.rate(s.name);
        }

        function item(st, rate){
            var totalCount = parseFloat($scope.totalCount);
            rate = rate / 100.0;
            this.supplierType = st + '类';
            this.cost = totalCount / (1 + rate);
            this.rate = rate;
            this.inCount = this.cost * rate;
            this.finallyTotal = totalCount;
        }

        var data = [];
        angular.forEach(f(1),function(v){
            data.push(new item('A',v));
        });
        angular.forEach(f(2),function(v){
            data.push(new item('B',v));
        });

        var cItem = new item('C', 0);
        cItem.remark = '假定取得增值税发票';
        cItem.cost = cItem.cost / 1.03;
        data.push(cItem);

        cItem = new item('C', 0);
        cItem.remark = '假定无法取得发票去税务机关代开';
        data.push(cItem);

        $scope.costTaxGrid.data = data;
    }
}]);

controllers.controller('DeptCtrl', ['$scope', 'common', 'modal', 'module', '$filter', function($scope, common, modal, module, $filter) {

    $scope.loadDepts = function(page, limit) {
        common.loadPage('/dept/obtainDepts.cmd', {
            page: page,
            limit: limit
        }, {
            success: function(data) {
                $scope.deptGrid.data = data.data;
                // convert roleNames to display
                angular.forEach($scope.deptGrid.data, function(v){
                    v.roleNames = '';
                    angular.forEach(v.roles, function(r){
                        v.roleNames += (r.name + ' ') 
                    });
                });
                $scope.deptGrid.totalItems = data.total;
            }
        });
    };

    $scope.deptGrid = module.createDeptGrid($scope, $scope.loadDepts);
    $scope.loadDepts(1, $scope.deptGrid.paginationPageSize);
}]);

controllers.controller('EngineeringPurchaseItemCtrl', ['$scope', '$rootScope', 'configuration', 'common', 'modal', 'module', '$filter', '$state', '$stateParams', 'supplierTypeName','util', function($scope, $rootScope, configuration, common, modal, module, $filter, $state, $stateParams, supplierTypeName,util) {

    $scope.modal = module.getSupplierTypes($stateParams.project);
    
    if (angular.isBlank($scope.modal.data)){
        $scope.modal.data = {};
    } else {
        //mod
        $scope.modal.data.dept = $scope.modal.data.dept.id;
    }

    supplierTypeName.success(function(allSupplierTypes) {
        $scope.modal.allSupplierTypes = allSupplierTypes;

        $scope.$watch('modal.data.supplierType', function(n) {
            $scope.modal.supplierTypes = $scope.modal.allSupplierTypes[n];
        });
        $scope.$watch('modal.data.serviceType', function(n) {
            if ($scope.modal.supplierTypes){
                angular.each($scope.modal.supplierTypes, function(v){
                    if (v.id === n){
                        $scope.modal.supplierSubTypes = v.supplierSubTypeNames;
                        return true;
                    }
                });
            }
        });

        $scope.$watch('modal.data.serviceSubType', function(n) {
            angular.each($scope.modal.supplierSubTypes, function(v){
                if (v.id === n){
                    $scope.modal.data.rate = util.rate(v.name)[0] / 100.0;
                    return true;
                }
            });
        });
    });
    //watch count price and rate to calculate unTaxCount, rateCount and total
    $scope.$watch('modal.data.productCount + modal.data.price + modal.data.rate', function() {
        var modalData = $scope.modal.data;
        var count = parseFloat(modalData.productCount) || 0;
        var price = parseFloat(modalData.price) || 0;
        var rate = parseFloat(modalData.rate) || 0;

        modalData.unTaxCount = count * price;
        modalData.rateCount = modalData.unTaxCount * rate;
        modalData.total = modalData.unTaxCount + modalData.rateCount;
    });
    
    $scope.querySupplier = function(name){
    	return common.loadAllPage2('/supplier/obtainSuppliers.cmd', {
            name : name
        }); 
    };
    $scope.queryPorject = function(name){
        return common.loadAllPage2('/project/obtainProjects.cmd', {
            name : name
        });
    };
    
    $scope.savePurchase = function(){
        var data = angular.copy($scope.modal.data);
        function f(name){
            data[name + '.id'] = data[name].id || data[name];
            delete data[name];
        }
        f('dept');
        f('project');
        f('supplier');
        
        common.post('/' + $scope.modal.type +'-purchase/savePurchases.cmd', data, function(){
            modal.alert('保存采购成功');
        });
    };
}]);

controllers.controller('EngineeringPurchaseCtrl', ['$scope', '$rootScope', 'configuration', 'common', 'modal', 'module', '$filter', '$state', 'supplierTypeName', function($scope, $rootScope, configuration, common, modal, module, $filter, $state, supplierTypeName) {

    $scope.query = {
        dept: undefined
    };
    
    $scope.loadEngineerPurchases = function(page, limit) {
        common.loadPage('/' + $scope.type +'-purchase/obtainPurchases.cmd', {
            page: page,
            limit: limit,
            'dept.id': $scope.query.dept == -1 ? undefined : $scope.query.dept
        }, {
            success: function(data) {
                $scope.purchaseGrid.data = data.data;
                $scope.purchaseGrid.totalItems = data.total;
            }
        });
    };
    $scope.purchaseGrid = module.createEngineeringPurchaseGrid($scope, $scope.loadEngineerPurchases, configuration);
    
    /*common.async(function(){
    	//load when the page finish render
    	$scope.loadEngineerPurchases(1, $scope.purchaseGrid.paginationPageSize);
    });*/
    
    $scope.deletePurchases = function() {
        common.post('/' + $scope.type +'-purchase/deletePurchases.cmd', $scope.constructSelectedId($scope.purchaseGrid, 'purchaseIds'), {
            success: function() {
                $scope.purchaseGrid.refresh();
            }
        });
    };
    $scope.modPurchase = function() {
        $state.go('engineering-purchase-item', {
            project: {
                type: $scope.type,
                add: true,
                data: $scope.purchaseGrid.selection.getSelectedRows()[0]
            }
        });
    };

    $scope.$watch('query.dept', function(v) {
        $scope.loadEngineerPurchases(1, $scope.purchaseGrid.paginationPageSize);
    });

     $scope.addPurchase = function(row) {
        $scope.showDetail(true);
    };

    $scope.showDetail = function(add) {
        $state.go('engineering-purchase-item', {
            project: {
                type: $scope.type,
                add: add
            }
        });
    };
}]);

controllers.controller('LoginCtrl', [
    '$scope', '$mdSidenav', 'common', 'menu',
    function ($scope, $mdSidenav, common, menu) {
        $scope.login = function () {
            common.post('/user/userLogin.cmd', $scope.user, {
                success: function (data) {
                    var mods = [];
                    var user = data.data;
                    if (!user){
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

controllers.controller('ProductImportCtrl', ['$scope', 'common', 'modal', 'module', '$filter', function($scope, common, modal, module, $filter) {

    $scope.loadProductImports = function(page, limit) {
        common.loadPage('/product/obtainProductImports.cmd', {
            page: page,
            limit: limit
        }, {
            success: function(data) {
                $scope.productImportGrid.data = data.data;
                $scope.productImportGrid.totalItems = data.total;
            }
        });
    };

    $scope.productImportGrid = module.createProductImportGrid($scope, $scope.loadProductImports);
    $scope.loadProductImports(1, $scope.productImportGrid.paginationPageSize);

    $scope.uploadFile = function() {
        common.uploadFile('/product/importProduct.cmd', {
            file: $scope.importFile[0].lfFile,
            userName: $scope.user.name
        }, {
            success: function(result) {
                $scope.productImportGrid.refresh();
                modal.alert('成功导入:' + result.data.right + '条，失败:' + result.data.wrong + '条');
            }
        });
    };

    $scope.delImport = function() {
        modal.confirm('删除导入记录，将同时删除关联的商品信息，是否继续？', {
            postive: function() {
                common.post('/product-import/deleteProductImport.cmd', $scope.constructSelectedId($scope.productImportGrid, 'productImportIds'), {
                    success: function() {
                        $scope.productImportGrid.refresh();
                    }
                });
            }
        });
    };

    $scope.approveImport = function() {
        modal.confirm('导入记录审核通过后，所有关联的商品都将审核通过，是否继续？', {
            postive: function() {
                common.post('/product-import/approveProductImport.cmd', $scope.constructSelectedId($scope.productImportGrid, 'productImportIds'), {
                    success: function() {
                        $scope.productImportGrid.refresh();
                    }
                });
            }
        });
    };

    $scope.canApprove = function(){
        // just a workround to protect undefined selection
        if (!$scope.productImportGrid.selection){
            return false;
        }
        var products = $scope.productImportGrid.selection.getSelectedRows();
        return products.length > 0 && !products.contains(function(p) {
            return p.status !== 0;
        });
    };
}]);

controllers.controller('ProductItemCtrl', ['$scope', 'common', 'modal', 'module', '$filter', '$stateParams', 'configuration', function($scope, common, modal, module, $filter, $stateParams, configuration) {

    $scope.modal = module.getProductTypes({
        add: false,
        data: $stateParams.product
    });
   
    $scope.approvalProduct = function() {
        common.post('/product/approvalProduct.cmd', {
            productIds: [$scope.modal.data.id]
        }, {
            success: function() {
                $scope.modal.data.status = 1;
            }
        });
    };
}]);

controllers.controller('ProductCtrl', ['$scope', '$rootScope', 'configuration', 'common', 'modal', 'module', '$filter', '$state', function($scope, $rootScope, configuration, common, modal, module, $filter, $state) {

    $scope.showDetail = function(row) {
        $state.go('product-item', { product: row.entity });
    };
    $scope.query = {};
    $scope.loadProducts = function(page, limit) {
        common.loadPage('/product/obtainProducts.cmd', angular.extend({
            page: page,
            limit: limit
        }, $scope.query), {
            success: function(data) {
                $scope.productGrid.data = data.data;
                $scope.productGrid.totalItems = data.total;
            }
        });
    };

    $scope.productGrid = module.createProductGrid($scope, $scope.loadProducts, configuration);
    $scope.loadProducts(1, $scope.productGrid.paginationPageSize);

    $scope.openProductInfo = function(conf) {
        var params = module.getProductTypes({
            url: 'js/tpl/product-info.html',
            width: 500,
            add: true,
            ok: function(product) {
                common.post('/product/saveProduct.cmd', product, {
                    success: function() {
                        $scope.productGrid.refresh();
                    }
                });
            }
        });
        modal.open(angular.extend(params, conf), $scope);
    };

    $scope.addProduct = function() {
        $scope.openProductInfo({
            title: '新增商品'
        }, $scope);
    };

    $scope.delProduct = function() {
        common.post('/product/deleteProduct.cmd', $scope.constructSelectedId($scope.productGrid, 'productIds'), {
            success: function() {
                $scope.productGrid.refresh();
            }
        });
    };

    $scope.canApprove = function() {
        var products = $scope.productGrid.selection.getSelectedRows();
        return products.length > 0 && !products.contains(function(p) {
            return p.status !== 0;
        });
    };
    $scope.approvalProduct = function() {
        common.post('/product/approvalProduct.cmd', $scope.constructSelectedId($scope.productGrid, 'productIds'), {
            success: function() {
                $scope.productGrid.refresh();
            }
        });
    };

    $scope.loadImports = function() {
        common.loadAllPage('/product/obtainProductImports.cmd', {
            success: function(data) {
                $scope.imports = data.data;
            }
        });
    };
    $scope.queryProduct = function(){
        $scope.productGrid.refresh(true);
    };

    $scope.exportProduct = function(){
        var url = '../product/exportProduct.cmd?';
        for (var v in $scope.query){
            url+= v + '=' + $scope.query[v];
            url += '&';
        }
        window.open(url,'_self');
    };
}]);

controllers.controller('ProgressItemCtrl', ['$scope', 'common', 'modal', 'module', '$filter', '$stateParams', 'configuration', function($scope, common, modal, module, $filter, $stateParams, configuration) {

    $scope.project = $stateParams.project;
    $scope.query = {
        'project.id' : $stateParams.project.id
    };
    $scope.isContract = $scope.project.itemType === 'contract';
    if ($scope.isContract){
        $scope.tpl = 'js/tpl/contract-progress-info.html';
        $scope.saveCmd = '/contract-progress/saveProgress.cmd';
        $scope.moduleName = 'createContractGrid';
        $scope.loadProgressUrl = '/contract-progress/obtainProgresses.cmd';
    } else {
        $scope.tpl = 'js/tpl/construction-progress-info.html';
        $scope.saveCmd = '/construction-progress/saveProgress.cmd';
        $scope.moduleName = 'createConstructionItemGrid';
        $scope.loadProgressUrl = '/construction-progress/obtainProgresses.cmd';
    }

    $scope.loadProgress = function(page, limit) {
        common.loadPage($scope.loadProgressUrl, angular.extend({
            page: page,
            limit: limit
        }, $scope.query), {
            success: function(data) {
                var lastAllCount = 0.0;
                var progresses = data.data;
                for (var i = progresses.length -1;i > -1;i--){
                    progresses[i].lastAllCount = lastAllCount;
                    lastAllCount += progresses[i].finished;
                }
                $scope.itemGrid.data = data.data;
                $scope.itemGrid.totalItems = data.total;
            }
        });
    };
    $scope.itemGrid = module[$scope.moduleName]($scope, $scope.loadProgress, configuration);

    $scope.loadProgress(1, 9999);

    $scope.modProgress = function(){
        var params = {
            url: $scope.tpl,
            width: 400,
            projectName: $scope.project.name,
            data: $scope.itemGrid.selection.getSelectedRows()[0],
            ok: function(progress) {
                var params = angular.copy(progress);
                delete params.project;
                params['project.id'] = progress.project.id;
                common.post($scope.saveCmd, params, {
                    success: function() {
                        modal.alert('进度修改成功。');
                        $scope.itemGrid.refresh();
                    }
                });
            }
        };
        modal.open(params, $scope);
    };
}]);

controllers.controller('ProjectItemCtrl', ['$scope', 'common', 'modal', 'module', '$filter', '$stateParams', 'configuration', function($scope, common, modal, module, $filter, $stateParams, configuration) {

    //var project = $scope.convertParams($stateParams.project,'outSources');
    $scope.modal = module.getProjectTypes({
        add: false,
        data: $stateParams.project
    });
}]);

controllers.controller('ProjectPurchaseCtrl', ['$scope', '$rootScope', 'configuration', 'common', 'modal', 'module', '$filter', '$state', function($scope, $rootScope, configuration, common, modal, module, $filter, $state) {

    $scope.importProjectPurchase = function() {
        common.uploadFile('/purchase/importProjectPurchase.cmd', {
            file: $scope.importFile[0].lfFile,
            importDate: $scope.importDate,
            operator: $scope.user.name,
            projectId: $scope.getSelectedProjects()[0].id
        }, {
            success: function(result) {
                modal.alert('成功导入:' + result.data.right + '条');
            }
        });
    };
    $scope.showPurchase = function(row) {
        $state.go('purchase-import', { project: $scope.getSelectedProjects()[0] });
    };
}]);

controllers.controller('ProjectCtrl', ['$scope', '$rootScope', 'configuration', 'common', 'modal', 'module', '$filter', '$state', function($scope, $rootScope, configuration, common, modal, module, $filter, $state) {

    $scope.modal = module.getProjectTypes();

    $scope.showDetail = function(row) {
        $state.go('project-item', { project: row.entity });
    };

    $scope.query = {};
    $scope.loadProjects = function(page, limit) {
        common.loadPage('/project/obtainProjects.cmd', angular.extend({
            page: page,
            limit: limit
        }, $scope.query), {
            success: function(data) {
                $scope.projectGrid.data = data.data;
                $scope.projectGrid.totalItems = data.total;
            }
        });
    };

    $scope.projectGrid = module.createProjectGrid($scope, $scope.loadProjects, configuration);
    $scope.loadProjects(1, $scope.projectGrid.paginationPageSize);

    $scope.openProjectInfo = function(conf) {
        var params = module.getProjectTypes({
            url: 'js/tpl/project-info.html',
            width: 750,
            add: true,
            addOutSource: function() {
                if (!this.data.outSources) {
                    this.data.outSources = [];
                }
                this.data.outSources[this.data.outSources.length] = {};
            },
            ok: function(project) {
                $scope.convertParams(project, 'outSources');
                common.post('/project/saveProject.cmd', project, {
                    success: function() {
                        $scope.projectGrid.refresh();
                    }
                });
            }
        });
        modal.open(angular.extend(params, conf), $scope);
    };

    $scope.addProject = function() {
        $scope.openProjectInfo({
            title: '新增项目'
        }, $scope);
    };

    $scope.delProject = function() {
        common.post('/project/deleteProject.cmd', $scope.constructSelectedId($scope.projectGrid, 'projectIds'), {
            success: function() {
                $scope.projectGrid.refresh();
            }
        });
    };

    $scope.queryProject = function() {
        $scope.projectGrid.refresh(true);
    };

    $scope.exportProject = function() {
        var url = '../project/exportProject.cmd?projectId=';
        url += $scope.projectGrid.selection.getSelectedRows()[0].id;
        window.open(url, '_self');
    };

    $scope.modProject = function() {
        var project = $scope.projectGrid.selection.getSelectedRows()[0];
        $scope.openProjectInfo({
            title: '修改项目',
            data: angular.copy(project)
        }, $scope);
    };

    // upload budget for projects
    $scope.uploadFile = function() {
        common.uploadFile('/budget/importBudget.cmd', {
            file: $scope.importFile[0].lfFile,
            userName: $scope.user.name,
            projectId: $scope.projectGrid.selection.getSelectedRows()[0].id
        }, {
            success: function(result) {
                $scope.budgetGrid.refresh();
                modal.alert('成功导入:' + result.data.right + '条');
            }
        });
    };

    $scope.getSelectedProjects = function() {
        return $scope.projectGrid.selection.getSelectedRows();
    };

    $scope.showProgress = function(itemType) {
        var project = angular.copy($scope.getSelectedProjects()[0]);
        project.itemType = itemType;
        $state.go('progress-item', { project: project });
    };

    $scope.showProgressAndReceipt = function(){
        $state.go('receipt-progress-item', { 
            project: {
                project : $scope.getSelectedProjects()[0],
                belong: $scope.belong
            } 
        });
    };
}]);

controllers.controller('PurchaseImportCtrl', ['$scope', 'common', 'modal', 'module', '$filter', '$stateParams', 'configuration', function($scope, common, modal, module, $filter, $stateParams, configuration) {

    $scope.project = $stateParams.project;

    $scope.loadPurchaseImports = function(page, limit) {
        var params = angular.extend({
            page: page,
            limit: limit,
            projectId: $scope.project.id
        }, $scope.query);
        params.startDate = params.startDate || '1971-1-1';
        params.endDate = params.endDate || '2064-1-1';

        common.loadPage('/purchase/obtainPurchaseImports.cmd', params, {
            success: function(data) {
                $scope.purchaseImportGrid.data = data.data;
                $scope.purchaseImportGrid.totalItems = data.total;
            }
        });
    };

    $scope.purchaseImportGrid = module.createPurchaseImportGrid($scope, $scope.loadPurchaseImports, configuration);
    $scope.loadPurchaseImports(1, $scope.purchaseImportGrid.paginationPageSize);

    $scope.deletePurchaseImport = function() {
        modal.confirm('删除导入记录，将同时删除关联的采购记录，是否继续？', {
            postive: function() {
                common.post('/purchase/deletePurchaseImport.cmd', $scope.constructSelectedId($scope.purchaseImportGrid, 'purchaseImportIds'), {
                    success: function() {
                        $scope.purchaseImportGrid.refresh();
                    }
                });
            }
        });
    };

    // 
    $scope.loadPurchases = function(page, limit) {
        var params = angular.extend({
            page: page,
            limit: limit,
            projectId: $scope.project.id
        }, $scope.query2);
        params.startDate = params.startDate || '1971-1-1';
        params.endDate = params.endDate || '2064-1-1';

        common.loadPage('/purchase/obtainPurchases.cmd', params, {
            success: function(data) {
                $scope.purchaseGrid.data = data.data;
                $scope.purchaseGrid.totalItems = data.total;
            }
        });
    };

    $scope.purchaseGrid = module.createPurchaseGrid($scope, $scope.loadPurchases, configuration);
    $scope.loadPurchases(1, $scope.purchaseGrid.paginationPageSize);

}]);

controllers.controller('PurchaseQueryCtrl', ['$scope', '$rootScope', 'configuration', 'common', 'modal', 'module', '$filter', '$state', 'supplierTypeName', function($scope, $rootScope, configuration, common, modal, module, $filter, $state, supplierTypeName) {
    $scope.queryPorject = function(name) {
        return common.loadAllPage2('/project/obtainProjects.cmd', {
            name: name
        });
    };
    $scope.loadPurchases = function(page, limit) {
        var params = angular.extend({
            page: page,
            limit: limit,
            projectId: $scope.selectedProject.id
        }, $scope.query2);
        params.startDate = params.startDate || '1971-1-1';
        params.endDate = params.endDate || '2064-1-1';
        var url;

        switch ($scope.queryType) {
            case '1':
                url = '/purchase/obtainPurchases.cmd';
                params
                break;
            case '2':
                url = '/engineering-purchase/obtainPurchasesForQuery.cmd';
                break;
            case '3':
                url = '/composite-purchase/obtainPurchasesForQuery.cmd';
                break;
        }
        common.loadPage(url, params, function(data) {
            $scope.purchaseQueryGrid.data = data.data;
            $scope.purchaseQueryGrid.totalItems = data.total;
        });
    };

    $scope.purchaseQueryGrid = module.createPurchaseGrid($scope, $scope.loadPurchases, configuration);
}]);

controllers.controller('ReceiptProgressItemCtrl', ['$scope', '$rootScope', 'configuration', 'common', 'modal', 'module', '$filter', '$state', '$stateParams', 'supplierTypeName', function($scope, $rootScope, configuration, common, modal, module, $filter, $state, $stateParams, supplierTypeName) {
    $scope.project = $stateParams.project.project;
    $scope.config = configuration;

    $scope.loadPage = function() {
        common.loadPage('/project-receipt/receiptAndProgress.cmd', {
            projectId: $scope.project.id,
            belong: $stateParams.project.belong
        }, function(data) {
            $scope.show = data;
        });
    };
    $scope.loadPage();

    $scope.modProgress = function() {
        modal.open({
            url: 'js/tpl/receipt-progress-remark-info.html',
            width: 500,
            title: '编辑工程月进度、收款说明',
            projectName: $scope.project.name,
            data: {
                projectId: $scope.project.id,
                belong: $stateParams.project.belong,
                id : $scope.show.addition_id,
                progress: $scope.show.addition_progress,
                progress2: $scope.show.addition_progress2
            },
            ok: function(data) {
                common.post('project-receipt/saveProgressRemark.cmd'
                	, data,$scope.loadPage);
            }
        });
    };

    $scope.exportProgress = function(){
    	var url = '../project-receipt/exportProgress.cmd?projectId=';
        url += $scope.project.id + '&belong=' + $stateParams.project.belong;
        window.open(url, '_self');
    };
    $scope.print = function(){
        window.print();
    };

}]);

controllers.controller('ReceiptCtrl', ['$scope', '$rootScope', 'configuration', 'common', 'modal', 'module', '$filter', '$state', '$stateParams', 'supplierTypeName', function($scope, $rootScope, configuration, common, modal, module, $filter, $state, $stateParams, supplierTypeName) {

    $scope.showReceiptInfo = function(conf) {
        var params = {
            url: 'js/tpl/receipt-info.html',
            width: 400,
            ok: function(receipt) {
                receipt['project.id'] = receipt.project.id;
                delete receipt.project;
                common.post('/project-receipt/saveReceipt.cmd', receipt, {
                    success: function() {
                        modal.alert('项目收款录入成功。');
                        $scope.itemGrid && $scope.itemGrid.refresh();
                    },
                    fail: function(data) {
                        if (data.errorCode === 1) {
                            modal.alert('项目收款录入失败：己存在对应月份的记录。');
                        }
                    }
                });
            }
        };
        modal.open(angular.extend(params, conf), $scope);
    };

    $scope.addReceipt = function() {
        var project = $scope.getSelectedProjects()[0];
        $scope.showReceiptInfo({
            title: '新增项目收款',
            add: true,
            data: {
                project: project
            }
        });
    };

    $scope.showReceipt = function() {
        var project = angular.copy($scope.getSelectedProjects()[0]);
        $state.go('receipt-item', { project: project });
    };
    if (!$stateParams.project) {
        return;
    }
    $scope.project = $stateParams.project;

    $scope.loadReceipt = function(page, limit) {
        common.loadAllPage('/project-receipt/obtainReceipts.cmd', function(data) {
            $scope.itemGrid.data = [];
            var count = 0;
            angular.forEach(data.data, function(v) {
                var d = angular.extend({
                    allByLastMonth: count,
                    allByNow: count + v.count,
                    percent: (count + v.count) * 100 / v.project.totalCount
                }, v);
                count += v.count;
                $scope.itemGrid.data.push(d);
            });

        }, { 'project.id': $scope.project.id });
    };

    $scope.itemGrid = module.createReceiptGrid($scope, $scope.loadReceipt, configuration);
    $scope.loadReceipt();

    $scope.deleteReceipt = function() {
        common.post('/project-receipt/deleteReceipt.cmd', $scope.constructSelectedId($scope.itemGrid, 'receiptIds'), {
            success: function() {
                $scope.itemGrid.refresh();
            }
        });
    };
    $scope.modReceipt = function() {
        $scope.showReceiptInfo({
            title: '修改收款',
            data: $scope.itemGrid.selection.getSelectedRows()[0]
        });
    };
}]);

controllers.controller('RoleCtrl', ['$scope', 'common', 'modal', 'module', '$filter', 'menu', function($scope, common, modal, module, $filter, menu) {

    $scope.loadRoles = function(page, limit) {
        common.loadPage('/role/obtainRoles.cmd', {
            page: page,
            limit: limit
        }, {
            success: function(data) {
                $scope.roleGrid.data = data.data;
                $scope.roleGrid.totalItems = data.total;
            }
        });
    };

    $scope.roleGrid = module.createRoleGrid($scope, $scope.loadRoles);
    $scope.loadRoles(1, $scope.roleGrid.paginationPageSize);

    $scope.openRoleInfo = function(conf) {
        var roleForUpdate = conf.data;
        //obtain all dept in advance
        common.loadAllPage('/dept/obtainDepts.cmd', {
            success: function(data) {
                var depts = data.data;
                var mods = [];
                angular.forEach(depts, function(dept) {
                    angular.forEach(dept.roles, function(role) {
                        if (roleForUpdate && roleForUpdate.id === role.id){
                            roleForUpdate.dept = dept;
                        }
                        angular.forEach(role.mods, function(mod) {
                            if (!mods.contains(function(m) {
                                    return m.id === mod.id;
                                })) {
                                mods.push(mod);
                                //selected the mod for update
                                mod.selected = roleForUpdate && roleForUpdate.mods.containsId(mod);
                            }
                        });
                    });
                });
                mods = menu.parseMenu(mods, false, 'children');

                var selectedMods;
                modal.open(angular.extend({
                    url: 'js/tpl/role-info.html',
                    width: 500,
                    depts: depts,
                    mods: mods,
                    treeCallback: function(item, selectedItems) {
                        selectedMods = selectedItems;
                        return true;
                    },
                    ok: function(role) {
                        role.deptId = role.dept.id;
                        delete role.dept;
                        delete role.mods;
                        angular.forEach(selectedMods, function(v, i) {
                            role['mods[' + i + '].id'] = v.id;
                        });

                        common.post('/role/saveRole.cmd', role, {
                            success: function() {
                                $scope.roleGrid.refresh();
                            }
                        });
                    }
                }, conf), $scope);
            }
        });
    };

    $scope.addRole = function() {
        $scope.openRoleInfo({
            title: '新增角色'
        }, $scope);
    };

    $scope.delRole = function() {
        var roles = $scope.roleGrid.selection.getSelectedRows();
        var params = { roleIds: [] };
        angular.forEach(roles, function(v) {
            params.roleIds.push(v.id);
        });
        common.post('/role/deleteRole.cmd', params, {
            success: function() {
                $scope.roleGrid.refresh();
            }
        });
    };

    $scope.modRole = function() {
        var role = $scope.roleGrid.selection.getSelectedRows()[0];
        role = angular.copy(role);

        $scope.openRoleInfo({
            title: '修改角色',
            data: role
        }, $scope);
    };
}]);

controllers.controller('SupplierItemCtrl', ['$scope', 'common', 'modal', 'module', '$filter', '$stateParams', 'configuration', function($scope, common, modal, module, $filter, $stateParams, configuration) {

    $scope.modal = module.getSupplierTypes(angular.extend({
    }, $stateParams.supplier));

    $scope.$watch('modal.data.identityType', function(n) {
        //reset all type and sub types ,don't modify this easily due to be very complicate
        $scope.modal.supplierTypes = $scope.modal.allSupplierTypes[n];
        $scope.modal.supplierSubTypes = [];
        
    });

    $scope.$watch('modal.data.supplierTypes', function(types) {
        $scope.modal.supplierSubTypes = [];
        angular.forEach($scope.modal.supplierTypes, function(s){
            if (types && types.contains(s.id)){
                $scope.modal.supplierSubTypes.pushAll(s.supplierSubTypeNames);
            }
        });
    });

    //for edit
    $scope.modal.licenseImg = $scope.modal.data.licenseImg;
    $scope.modal.registryImg = $scope.modal.data.registryImg;
    $scope.modal.organizationImg = $scope.modal.data.organizationImg;
    $scope.modal.openAccountImg = $scope.modal.data.openAccountImg;

    $scope.saveSupplier = function() {
        var supplier = angular.copy($scope.modal.data);
        supplier.supplierTypes.each(function(t,i){
            supplier['supplierTypes[' + i + '].supplierType'] = t;
            
            //find all sub types in this type
            var st = angular.each($scope.modal.supplierTypes,function(v){
                if (v.id === t){
                    return v;
                }
            });
            var si = 0;
            st.supplierSubTypeNames.each(function(sst){
                if (supplier.supplierSubTypes.contains(sst.id)){
                    supplier['supplierTypes[' + i + '].supplierSubTypes[' + si++ + '].supplierSubType'] = sst.id;
                }
            });
        });
        delete supplier.supplierTypes;
        delete supplier.supplierSubTypes;

        function f(key) {
            if (angular.isBlank(supplier[key])) {
                // make sure these file we don't wanna change to be overwritten
                supplier[key] = $scope.modal[key];
                return;
            }
            supplier[key + 'F'] = $scope.modal.data[key][0].lfFile;
            supplier[key] = $scope.modal.data[key][0].lfFileName;
        }
        f('licenseImg');
        f('openAccountImg');
        f('organizationImg');
        f('registryImg');

        console.log(supplier);

        common.uploadFile('/supplier/saveSupplier.cmd', supplier, {
            success: function() {
                modal.alert('供应商保存成功');
            }
        });
    };

    $scope.showImage = function(type) {
        modal.open({
            url: 'js/tpl/supplier-img.html',
            width: 800,
            title: '查看',
            imageName: '../supplier/showImage.cmd?supplierId=' + $scope.modal.data.id + '&type=' + type
        });
    };
}]);

controllers.controller('SupplierCtrl', ['$scope', '$rootScope', 'configuration', 'common', 'modal', 'module', '$filter', '$state','supplierTypeName','$stateParams', function($scope, $rootScope, configuration, common, modal, module, $filter, $state,supplierTypeName,$stateParams) {

    $scope.query = {
        dept: undefined
    };
    $scope.loadSuppliers = function(page, limit) {
        common.loadPage('/supplier/obtainSuppliers.cmd', {
            page: page,
            limit: limit,
            dept: $scope.query.dept == -1 ? undefined : $scope.query.dept
        }, {
            success: function(data) {
                $scope.supplierGrid.data = data.data;
                $scope.supplierGrid.totalItems = data.total;
            }
        });
    };
    $scope.$watch('query.dept', function(v) {
        $scope.loadSuppliers(1, $scope.supplierGrid.paginationPageSize);
    });

    $scope.supplierGrid = module.createSupplierGrid($scope, $scope.loadSuppliers, configuration);
    if ($stateParams.man){
        $scope.supplierGrid = module.createSupplierGrid2($scope, $scope.loadSuppliers, configuration);
    }
    $scope.loadSuppliers(1, $scope.supplierGrid.paginationPageSize);

    $scope.addSupplier = function() {
        $scope.showDetail({}, true);
    };

    $scope.modSupplier = function() {
        $scope.showDetail($scope.supplierGrid.selection.getSelectedRows()[0], true, true);
    };
    $scope.showDetail = function(supplier, add, edit) {
        supplierTypeName.success(function(data) {
            var allSupplierTypes = data;
            //convert types and sub types accordingly
            var supplierTypes = supplier.supplierTypes;
            supplier.supplierTypes = [];
            supplier.supplierSubTypes = [];
            angular.forEach(supplierTypes,function(t){
                supplier.supplierTypes.push(t.supplierType);
                t.supplierSubTypes.each(function(st){
                    supplier.supplierSubTypes.push(st.supplierSubType);
                });
            });
            $state.go('supplier-item', {
                supplier: {
                    data: supplier,
                    add: add,
                    edit: edit,
                    allSupplierTypes : allSupplierTypes
                }
            });
        });
    };

    // upload budget for suppliers
    $scope.uploadFile = function() {
        common.uploadFile('/budget/importBudget.cmd', {
            file: $scope.importFile[0].lfFile,
            userName: $scope.user.name,
            supplierId: $scope.supplierGrid.selection.getSelectedRows()[0].id
        }, {
            success: function(result) {
                $scope.budgetGrid.refresh();
                modal.alert('成功导入:' + result.data.right + '条');
            }
        });
    };
}]);

controllers.controller('TaxAnalysisTaxCtrl', ['$scope', '$rootScope', 'configuration', 'common', 'modal', 'module', '$filter', '$state', '$stateParams', 'supplierTypeName', function($scope, $rootScope, configuration, common, modal, module, $filter, $state, $stateParams, supplierTypeName) {
    
    $scope.project = $stateParams.project.project;
    $scope.belong = $stateParams.project.belong;

    common.post('/tax-manager/taxAnalysis.cmd',{
    	projectId: $scope.project.id,
    	belong: $scope.belong
    }, function(data){
    	$scope.data = {};
    	angular.forEach(data, function(v,k){
    		$scope.percent = k;
    		$scope.data = v;
    	});
    });

    $scope.export = function(){
    	var url = '../tax-manager/exportTax.cmd?projectId=';
        url += $scope.project.id;
        url += '&belong=' + $scope.belong;
        window.open(url, '_self');
    };

}]);

controllers.controller('TaxAnalysisCtrl', ['$scope', '$rootScope', 'configuration', 'common', 'modal', 'module', '$filter', '$state', '$stateParams', 'supplierTypeName', function($scope, $rootScope, configuration, common, modal, module, $filter, $state, $stateParams, supplierTypeName) {
    $scope.inCountAnalysis = function(){
    	$state.go('tax-analysis-in-count-item',{
    		project: {
    			project: $scope.getSelectedProjects()[0],
    			belong : $scope.belong
    		}
    	});
    };
    $scope.taxAnalysis = function(){
    	$state.go('tax-analysis-tax-item',{
    		project: {
    			project: $scope.getSelectedProjects()[0],
    			belong : $scope.belong
    		}
    	});
    };

    // ---------------
    if (!$stateParams.project) {
        return;
    }
    $scope.project = $stateParams.project.project;
    $scope.belong = $stateParams.project.belong;

    common.post('/tax-manager/inCountAnalysis.cmd',{
    	projectId: $scope.project.id,
    	belong: $scope.belong
    }, function(data){
    	$scope.data = {};
    	angular.forEach(data, function(v,k){
    		if (k === 'total'){
    			$scope.total = v;
    			return;
    		}
    		$scope.data[k] = v;
    	});
    });

    $scope.export = function(){
    	var url = '../tax-manager/exportInCount.cmd?projectId=';
        url += $scope.project.id;
        url += '&belong=' + $scope.belong;
        window.open(url, '_self');
    };

}]);

controllers.controller('TaxQueryCompareCtrl', ['$scope', '$rootScope', 'configuration', 'common', 'modal', 'module', '$filter', '$state', '$stateParams', 'util', function($scope, $rootScope, configuration, common, modal, module, $filter, $state, $stateParams, util) {

    $scope.descs = [1, -1];

    $scope.query = function(){
    	modal.wait();
    	common.post('/tax-manager/taxQueryCompare.cmd',{
    		belong: $scope.belong
    	}, function (data){
    		$scope.data = data;
    		$scope.sortData();
    		modal.hide();
    	});
    };

    $scope.$watch('desc', function(n,o){
    	$scope.sortData();
    });

    $scope.sortData = function(){
    	if (angular.isBlank($scope.data)){
    		return;
    	}
    	$scope.data.sort(function (a,b){
    		return (a[a.length - 1] - b[b.length - 1]) * $scope.desc;
    	});
    };

    $scope.export = function(){
    	util.downloadFile('../tax-manager/exportTaxQuery.cmd',{
    		belong: $scope.belong
    	});
    };
}]);

controllers.controller('UserCtrl', ['$scope', 'common', 'modal', 'module', '$filter', function($scope, common, modal, module, $filter) {

    $scope.loadUsers = function(page, limit) {
        common.loadPage('/user/obtainUsers.cmd', {
            page: page,
            limit: limit
        }, {
            success: function(data) {
                $scope.userGrid.data = data.data;
                $scope.userGrid.totalItems = data.total;
            }
        });
    };

    $scope.userGrid = module.createUserGrid($scope, $scope.loadUsers);
    $scope.loadUsers(1, $scope.userGrid.paginationPageSize);

    $scope.openUserInfo = function(conf) {
        //obtain all dept in advance
        common.loadAllPage('/dept/obtainDepts.cmd', {
            success: function(data) {
                var depts = data.data;
                //replace user dept
                if (conf.data && conf.data.dept){
                	var index = -1;
                	depts.each(function(v,i){
                		if (conf.data.dept.id === v.id){
                			index = i;
                		}
                	});
                	if (index > -1){
                		depts[index] = conf.data.dept;
                	}
                	//TODO simply process
                	if (conf.data.roles 
                		&& conf.data.dept.roles.length === conf.data.roles.length){
                		conf.data.roles = conf.data.dept.roles;
                	}
                }
                modal.open(angular.extend({
                    url: 'js/tpl/user-info.html',
                    width: 500,
                    depts: depts,
                    canGo: function(data) {
                        return conf.mod || data.password === data.password2;
                    },
                    ok: function(user) {
                        //TODO simply process
                        var roles = user.roles.length > 0 ? user.dept.roles : [];
                        delete user.roles;
                        angular.forEach(roles, function(v, i) {
                            user['roles[' + i + '].id'] = v.id;
                        });
                        user['dept.id'] = user.dept.id;
                        delete user.dept;

                        common.post('/user/saveUser.cmd', user, {
                            success: function() {
                                $scope.userGrid.refresh();
                            }
                        });
                    }
                }, conf), $scope);
            }
        });
    };

    $scope.addUser = function() {
        $scope.openUserInfo({
            title: '新增用户'
        }, $scope);
    };

    $scope.delUser = function() {
        var users = $scope.userGrid.selection.getSelectedRows();
        var params = { userIds: [] };
        angular.forEach(users, function(v) {
            params.userIds.push(v.id);
        });
        common.post('/user/deleteUser.cmd', params, {
            success: function() {
                $scope.userGrid.refresh();
            }
        });
    };

    $scope.modUser = function() {
        var user = $scope.userGrid.selection.getSelectedRows()[0];
        $scope.openUserInfo({
            title: '修改用户',
            data: user,
            mod : true
        }, $scope);
    };
}]);

angular.module('xdApp', [
    'xdApp.controllers',
    'ngAnimate',
    'ui.router',
    'ngMaterial',
    'ngAria',
    'ui.grid', 'ui.grid.pagination', 'ui.grid.selection', 'ui.grid.autoResize','ui.grid.edit',
    'multiselect-searchtree', 'ngPopover',
    'ui.tree', 'lfNgMdFileInput'
]).config(['$mdDateLocaleProvider', function($mdDateLocaleProvider) {
    $mdDateLocaleProvider.months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
    $mdDateLocaleProvider.shortMonths = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
    $mdDateLocaleProvider.days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
    $mdDateLocaleProvider.shortDays = ['一', '二', '三', '四', '五', '六', '日'];

    $mdDateLocaleProvider.formatDate = function(date) {
        //manually formate the date style
        if (angular.isDate(date)) {
            return date.Format("yyyy-MM-dd");
        }
        return date;
    };
}]).config(['$mdIconProvider', '$mdThemingProvider', function($mdIconProvider, $mdThemingProvider) {
    /*$mdThemingProvider.theme('default')
        .primaryPalette('light-blue', {
            'default': '300'
        })
        .accentPalette('deep-orange', {
            'default': '500'
        });*/
    $mdIconProvider
        .defaultIconSet("./img/svg/avatars.svg", 128)
        .icon("menu", "./img/svg/menu.svg", 24)
        .icon("share", "./img/svg/share.svg", 24)
        .icon("google_plus", "./img/svg/google_plus.svg", 24)
        .icon("hangouts", "./img/svg/hangouts.svg", 24)
        .icon("twitter", "./img/svg/twitter.svg", 24)
        .icon("phone", "./img/svg/phone.svg", 24);

}]).config(['$stateProvider', '$urlRouterProvider', '$logProvider',
    function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise("/login");
        $stateProvider.state('user', {
            url: '/user',
            templateUrl: 'user.html',
            controller: 'UserCtrl'
        }).state('login', {
            url: '/login',
            templateUrl: 'login.html',
            controller: 'LoginCtrl'
        }).state('conf', {
            url: '/conf',
            templateUrl: 'conf.html',
            controller: 'ConfCtrl'
        }).state('product', {
            url: '/product',
            templateUrl: 'product.html',
            controller: 'ProductCtrl'
        }).state('product-item', {
            url: '/product-item',
            params: { product: null },
            templateUrl: 'product-item.html',
            controller: 'ProductItemCtrl'
        }).state('project', {
            url: '/project',
            templateUrl: 'project.html',
            controller: 'ProjectCtrl'
        }).state('project-item', {
            url: '/project-item',
            params: { project: null },
            templateUrl: 'project-item.html',
            controller: 'ProjectItemCtrl'
        }).state('budget', {
            url: '/budget',
            templateUrl: 'budget.html',
            controller: 'BudgetCtrl'
        }).state('budget-item', {
            url: '/budget-item',
            params: { budget: null },
            templateUrl: 'budget-item.html',
            controller: 'BudgetItemCtrl'
        }).state('progress', {
            url: '/progress',
            templateUrl: 'progress.html',
            controller: 'ProjectCtrl'
        }).state('progress-item', {
            url: '/progress-item',
            params: { project: null },
            templateUrl: 'progress-item.html',
            controller: 'ProgressItemCtrl'
        }).state('calculate', {
            url: '/calculate',
            templateUrl: 'calculate.html',
            controller: 'BudgetCtrl'
        }).state('calculate-item', {
            url: '/calculate-item',
            params: { budget: null },
            templateUrl: 'calculate-item.html',
            controller: 'CalculateItemCtrl'
        }).state('tax-calculate-item', {
            url: '/tax-calculate-item',
            params: { budgets: null },
            templateUrl: 'tax-calculate-item.html',
            controller: 'CalculateCtrl'
        }).state('supplier', {
            url: '/supplier',
            templateUrl: 'supplier.html',
            controller: 'SupplierCtrl'
        }).state('supplier-item', {
            url: '/supplier-item',
            params: { supplier: null },
            templateUrl: 'supplier-item.html',
            controller: 'SupplierItemCtrl'
        }).state('cost-tax', {
            url: '/cost-tax',
            params: { supplier: null },
            templateUrl: 'cost-tax.html',
            controller: 'CostTaxCtrl'
        }).state('purchase', {
            url: '/purchase',
            templateUrl: 'purchase.html',
            controller: 'ProjectCtrl'
        }).state('purchase-import', {
            url: '/purchase-import',
            params: { project: null },
            templateUrl: 'purchase-import.html',
            controller: 'PurchaseImportCtrl'
        }).state('engineering-purchase-item', {
            url: '/engineering-purchase-item',
            params: { project: null },
            templateUrl: 'engineering-purchase-item.html',
            controller: 'EngineeringPurchaseItemCtrl'
        }).state('receipt', {
            url: '/receipt',
            templateUrl: 'receipt.html',
            controller: 'ProjectCtrl'
        }).state('receipt-item', {
            url: '/receipt-item',
            params: { project: null },
            templateUrl: 'receipt-item.html',
            controller: 'ReceiptCtrl'
        }).state('receipt-progress-item', {
            url: '/receipt-progress-item',
            params: { project: null },
            templateUrl: 'receipt-progress-item.html',
            controller: 'ReceiptProgressItemCtrl'
        }).state('tax-manager', {
            url: '/tax-manager',
            params: { project: null },
            templateUrl: 'tax-manager.html',
            controller: 'ProjectCtrl'
        }).state('tax-analysis-in-count-item', {
            url: '/tax-analysis-in-count-item',
            params: { project: null },
            templateUrl: 'tax-analysis-in-count-item.html',
            controller: 'TaxAnalysisCtrl'
        }).state('tax-analysis-tax-item', {
            url: '/tax-analysis-tax-item',
            params: { project: null },
            templateUrl: 'tax-analysis-tax-item.html',
            controller: 'TaxAnalysisTaxCtrl'
        }).state('tax-man-manager', {
            url: '/tax-man-manager',
            templateUrl: 'supplier.html',
            params: { man: true },
            controller: 'SupplierCtrl'
        });

        
    }
]);

services.config(['$httpProvider', function($httpProvider) {
    $httpProvider.defaults.transformRequest = function(obj) {
        var str = [];
        for (var p in obj) {
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        }
        return str.join("&");
    }
    $httpProvider.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
    $httpProvider.defaults.headers.post = {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
    };
}]).config(['$locationProvider', function($locationProvider) {
    /*$locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });*/
}]);

services.service('common', ['$http', 'modal', '$q','$timeout', function($http, modal, $q,$timeout) {
    this.async = function(f){
        var p = $timeout(function(){
            f();
            $timeout.cancel(p);
        });
    };
    this.relativeUrl = function(url) {
        return '../' + (url.indexOf('/') == 0 ? url.substring(1) : url);
    };
    this.loadAllPage2 = function(url, params) {
        var deferred = $q.defer();
        var parmas_0 = angular.extend({ page: 1, limit: 999999 }, params);
        this.post(url, parmas_0, function(data) {
            deferred.resolve(data.data);
        });
        return deferred.promise;
    };
    this.loadAllPage = function(url, call, params) {
        return this.loadPage(url, angular.extend({ page: 1, limit: 999999 }, params), call);
    };
    this.loadPage = function(url, params, call) {
        params = params || {};
        if (params) {
            params.page = params.page || 1;
            params.limit = params.limit || 25;
        }
        return this.post(url, params, call);
    };
    this.post = function(url, params, call) {
        //remove all undefined value
        params = params || {};
        for (var k in params) {
            if (angular.isBlank(params[k])) {
                delete params[k];
            }
        }

        return $http.post(this.relativeUrl(url), params).success(function(data) {
            if (data && data.errorMsg) {
                if (call && call.fail && !call.fail(data)) {
                    return;
                } else {
                    modal.alert('操作失败，请重试或联系管理员。');
                }
            } else {
                // success
                if (angular.isFunction(call)) {
                    call(data);
                } else {
                    if (call && call.success) {
                        call.success(data);
                    }
                }
            }
        });
    };

    this.uploadFile = function(url, params, conf) {
        var formData = new FormData();
        for (var key in params) {
            if (!angular.isBlank(params[key])) {
                formData.append(key, params[key]);
            }
        }

        modal.wait();
        $http.post(this.relativeUrl(url), formData, {
            transformRequest: angular.identity,
            headers: { 'Content-Type': undefined }
        }).then(function(result) {
            if (conf && conf.success) {
                conf.success(result);
            }
            modal.hide();
        }, function(err) {
            if (conf && conf.fail) {
                conf.fail(err);
            }
            modal.hide();
        });
    };

    this.createGridOption = function(columnDefs, scope, loadData, configuration) {
        return {
            paginationPageSizes: [25, 50, 75],
            paginationPageSize: 25,
            useExternalPagination: true,
            useExternalSorting: true,
            columnDefs: columnDefs,
            configuration: configuration,
            refresh: function(start) {
                if (start) {
                    this.paginationCurrentPage = 1;
                }
                loadData(this.paginationCurrentPage, this.paginationPageSize);
            },
            paginationTemplate: 'js/tpl/pagination.html',
            onRegisterApi: function(gridApi) {
                if (!this.selection) {
                    this.selection = gridApi.selection;
                    gridApi.pagination && gridApi.pagination.on.paginationChanged(scope, loadData);
                }

            }
        };
    }
}]);
if (!angular.isFunction) {
    angular.isFunction = function(object) {
        return object && getClass.call(object) == '[object Function]';
    };
}
if (!angular.isBlank) {
    angular.isBlank = function(v) {
        return (v === null) || (v === undefined) || (v === '') || (Array.isArray(v) && v.length === 0);
    };
}
Date.prototype.Format = function(fmt) {
    var o = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S": this.getMilliseconds()
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

Array.prototype.contains = function(compare) {
    var doCompare = function(m) {
        if (angular.isFunction(compare)) {
            return compare(m);
        }
        return compare === m;
    }
    var find = false;
    angular.forEach(this, function(v) {
        if (doCompare(v)) {
            find = true;
        }
    });
    return find;
};
Array.prototype.containsId = function(o) {
    return this.contains(function(v) {
        return v.id === o.id;
    });
};
Array.prototype.each = function(f) {
    angular.forEach(this, f);
};
Array.prototype.pushAll = function(array) {
    var me = this;
    angular.forEach(array, function(v) {
        me.push(v);
    });
};

if (!angular.each) {
    angular.each = function(array, f) {
        if (angular.isBlank(array) || !f) {
            return;
        }
        var tmp;
        for (var i = 0; i < array.length; i++) {
            tmp = f(array[i], i);
            if (tmp) {
                return tmp;
            }
        }
    };
}

services.service('configuration', ['common', function(common) {
    //load all configurations
    var me = this;
    this.parse = function(data) {
        var all = data.data;
        var configurations = me.configurations = {};
        var groups = me.groups = {};
        var key;
        var name, index;
        all.each(function(v) {
            index = v.confName.indexOf('.');
            name = v.confName.substring(0, index);
            index = parseInt(v.confName.substring(index + 1));

            key = me.makeKey(v.groupNo, name);
            if (!configurations[key]) {
                configurations[key] = [];
            }
            configurations[key][index] = {
                index: index, 
                value: v.confValue
            };

        });
    };
    common.loadPage('/conf/obtainConfigs.cmd', {
        page: 1,
        limit: 99999
    }, {
        success: me.parse
    });

    this.makeKey = function(groupNo, name) {
        return groupNo + '-' + name;
    };

    this.i18n = function(groupNo, name, value) {
        return this.configurations[this.makeKey(groupNo, name)][value].value;
    };
    this.group = function(groupNo, name){
        var ret = [];
        angular.forEach(this.configurations[this.makeKey(groupNo, name)], function(v){
            if (!angular.isBlank(v)){
                ret.push(angular.copy(v));
            }
        });
        return ret;
    };

}]);

/**
 * all types status configurations will be loaded when needed
 */
services.factory('supplierTypeName', ['$http','$q',function($http, $q) {
    return {
        success: function(success) {
            var me = this;
            if (me.data) {
            	//ok we just simulate the async operation with promise
                var deferred = $q.defer();
                deferred.promise.then(function() {
                    success(me.data);
                });
                deferred.resolve();
            } else {
                $http.get('../supplier/obtainSupplierTypeNames.cmd').success(function(data) {
                    var allSupplierTypes = [];
                    angular.forEach(data.data, function(v) {
                        allSupplierTypes[v.degree] = allSupplierTypes[v.degree] || [];
                        allSupplierTypes[v.degree].push(v);
                    });

                    me.data = allSupplierTypes;
                    success(me.data);
                });
            }
        }
    };
}]);

 directives.directive('menuToggle', ['$timeout', function($timeout) {
     return {
         scope: {
             section: '='
         },
         templateUrl: 'js/tpl/menu-toggle.tmpl.html',
         link: function($scope, $element) {
             var controller = $element.parent().controller();
             $scope.isOpen = function() {
                 return controller.isOpen($scope.section);
             };
             $scope.toggle = function() {
                 controller.toggleOpen($scope.section);
             };
         }
     };
 }]).directive('menuLink', function() {
     return {
         scope: {
             section: '='
         },
         templateUrl: 'js/tpl/menu-link.tmpl.html',
         link: function($scope, $element) {
             var controller = $element.parent().controller();

             $scope.focusSection = function() {
                 // set flag to be used later when
                 // $locationChangeSuccess calls openPage()
                 controller.autoFocusContent = true;
             };
         }
     };
 }).filter('nospace', function() {
     return function(value) {
         return (!value) ? '' : value.replace(/ /g, '');
     };
 }).filter('humanizeDoc', function() {
     return function(doc) {
         if (!doc) return;
         if (doc.type === 'directive') {
             return doc.name.replace(/([A-Z])/g, function($1) {
                 return '-' + $1.toLowerCase();
             });
         }

         return doc.label || doc.name;
     };
 }).filter('toFixed', function() {
     return function(input, n) {
         return input.toFixed(n || 2);
     };
 }).directive('xdDate', ['$filter',function($filter) {
     //special for md-datepicker
     return {
         restrict: 'A',
         require: 'ngModel',
         priority: 1,
         link: function(scope, element, attr, ngModel) {
             ngModel.$parsers.push(function(d){
                return $filter('date')(d, 'yyyy-MM-dd');
             });
             ngModel.$formatters.push(function(text){
                if (angular.isBlank(text)){
                    return '';
                }
                return new Date(text);
             });
         }
     };
 }]);

services.factory('menu', ['$state', function($state) {
    var sections = [];
    var self;

    return self = {
        sections: sections,

        toggleSelectSection: function(section) {
            self.openedSection = (self.openedSection === section ? null : section);
        },
        isSectionSelected: function(section) {
            return self.openedSection === section;
        },

        parseMenu: function(mods, load,children) {
            var map = {};
            var pageName = children || 'pages';
            mods.each(function(v) {
                var id = v.id;
                if (!map[id]) {
                    map[id] = angular.copy(v);
                    map[id][pageName] = [];
                    map[id].type = 'link';
                } else {
                    //parent
                    map[id] = angular.extend(map[id],v);
                }
                
                if (v.routerId) {
                    map[id].state = v.routerId;
                }
                
                var parent = map[v.parentId];
                if (!parent) {
                    parent = map[v.parentId] = {id : v.parentId};
                    parent[pageName]=[];
                }
                parent[pageName].push(map[id]);
                parent.type = 'toggle';
            });
            if (load) {
                this.loadMenu(map[0][pageName]);
            }
            return map[0][pageName];
        },
        loadMenu: function(page) {
            var me = this;
            me.sections = [];
            me.sections.push({
                name: '导航',
                state: 'home',
                type: 'heading'
            });
            page.each(function(v) {
                me.sections.push(v);
            });
        }
    };

    function sortByHumanName(a, b) {
        return (a.humanName < b.humanName) ? -1 :
            (a.humanName > b.humanName) ? 1 : 0;
    }

}]);

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

services.service('module', ['common', 'configuration', function(common, configuration) {
    this.createUserGrid = function(scope, loadData) {
        return common.createGridOption([{
            name: '用户名',
            field: 'name'
        }, {
            name: '生日',
            field: 'birthday'
        }, {
            name: '性别',
            field: 'sex',
            cellTemplate: '<div class="ui-grid-cell-contents" >{{grid.getCellValue(row, col)===0?\'女\':\'男\'}}</div>'
        }, {
            name: '入职时间',
            field: 'entryTime'
        }, {
            name: '手机号码',
            field: 'mobile'
        }, {
            name: '固定电话',
            field: 'phone'
        }, {
            name: '身份证号',
            field: 'idCard'
        }, {
            name: '邮箱',
            field: 'mail'
        }, {
            name: '部门',
            field: 'dept.name'
        }], scope, loadData);
    };

    this.createDeptGrid = function(scope, loadData) {
        return common.createGridOption([{
            name: '部门名',
            field: 'name'
        }, {
            name: '角色',
            field: 'roleNames'
        }], scope, loadData);
    };

    this.createRoleGrid = function(scope, loadData) {
        return common.createGridOption([{
            name: '角色名',
            field: 'name'
        }], scope, loadData);
    };

    this.createConfGrid = function(scope, loadData) {
        return common.createGridOption([{
            name: '组编号',
            field: 'groupNo'
        }, {
            name: '配置名',
            field: 'confName'
        }, {
            name: '配置值',
            field: 'confValue'
        }, {
            name: '描述',
            field: 'confDesc'
        }], scope, loadData);
    };
    this.createProductGrid = function(scope, loadData, configuration) {
        return common.createGridOption([{
            name: '商品编号',
            field: 'code',
            cellTemplate: '<div class="ui-grid-cell-contents" ng-click="grid.appScope.showDetail(row)"><a href="javascript:void(0)">{{grid.getCellValue(row, col)}}</a></div>'
        }, {
            name: '商品名称',
            field: 'name'
        }, {
            name: '规格型号',
            field: 'model'
        }, {
            name: '商品性质',
            field: 'nature',
            cellTemplate: '<div class="ui-grid-cell-contents" >' + '{{grid.options.configuration.i18n(1,"nature",row.entity.nature)}}' + '</div>'

        }, {
            name: '所属类型',
            field: 'genre',
            cellTemplate: '<div class="ui-grid-cell-contents" >' + '{{grid.options.configuration.i18n(1,"genre",row.entity.genre)}}' + '</div>'
        }, {
            name: '单位',
            cellTemplate: '<div class="ui-grid-cell-contents" >' + '{{grid.options.configuration.i18n(1,"weightUnit",row.entity.weightUnit) + "/" + grid.options.configuration.i18n(1,"countUnit",row.entity.countUnit) + "/" + grid.options.configuration.i18n(1,"bulkUnit",row.entity.bulkUnit)}}' + '</div>'
        }, {
            name: '包装规格',
            field: 'packageType'
        }, {
            name: '税率',
            field: 'rate'
        }, {
            name: '状态',
            field: 'status',
            cellTemplate: '<div class="ui-grid-cell-contents" >' + '{{row.entity.status === 0 ? "待审核": "己审核"}}' + '</div>'
        }], scope, loadData, configuration);
    };

    this.createProductImportGrid = function(scope, loadData) {
        return common.createGridOption([{
            name: '导入',
            field: 'operator'
        }, {
            name: '状态',
            field: 'status',
            cellTemplate: '<div class="ui-grid-cell-contents" >' + '{{row.entity.status === 0 ? "待审核": "己审核"}}' + '</div>'
        }, {
            name: '导入时间',
            field: 'createTime'
        }], scope, loadData);
    };

    this.getProductTypes = function(m) {
        m = m || {};
        m.natures = configuration.group(1, 'nature');
        m.genres = configuration.group(1, 'genre');
        m.countUnits = configuration.group(1, 'countUnit');
        m.weightUnits = configuration.group(1, 'weightUnit');
        m.bulkUnits = configuration.group(1, 'bulkUnit');
        return m;
    };

    this.createProjectGrid = function(scope, loadData, configuration) {
        return common.createGridOption([{
            name: '项目名称',
            field: 'name',
            cellTemplate: '<div class="ui-grid-cell-contents" ng-click="grid.appScope.showDetail(row)"><a href="javascript:void(0)">{{grid.getCellValue(row, col)}}</a></div>'
        }, {
            name: '发包方',
            field: 'employer'
        }, {
            name: '项目承接方式',
            field: 'projectMode',
            cellTemplate: '<div class="ui-grid-cell-contents" >' + '{{row.entity.projectMode === 0 ? "总包": "分包"}}' + '</div>'
        }, {
            name: '项目类型',
            field: 'projectType',
            cellTemplate: '<div class="ui-grid-cell-contents" >' + '{{grid.options.configuration.i18n(2,"projectType",row.entity.projectType)}}' + '</div>'
        }, {
            name: '项目经理',
            field: 'manager'
        }, {
            name: '施工合同号',
            field: 'contractNumber'
        }, {
            name: '施工合同签署日期',
            field: 'contractSignDate'
        }, {
            name: '合同金额',
            field: 'totalCount'
        }], scope, loadData, configuration);
    };
    this.getProjectTypes = function(m) {
        m = m || {};
        m.projectTypes = configuration.group(2, 'projectType');
        m.rates = configuration.group(2, 'rate');
        return m;
    };
    this.getSupplierTypes = function(m) {
        m = m || {};
        m.identities = configuration.group(3, 'identity');
        m.countUnits = configuration.group(1, 'countUnit');
        return m;
    };

    this.createBudgetGrid = function(scope, loadData, configuration) {
        return common.createGridOption([{
            name: '工程名',
            field: 'importName',
            cellTemplate: '<div class="ui-grid-cell-contents" ng-click="grid.appScope.showDetail(row)"><a href="javascript:void(0)">{{grid.getCellValue(row, col)}}</a></div>'
        }, {
            name: '所属项目',
            field: 'project.name'
        }, {
            name: '导入者',
            field: 'importUser'
        }, {
            name: '导入时间',
            field: 'importDate'
        }], scope, loadData, configuration);
    };
    this.createPurchaseImportGrid = function(scope, loadData, configuration) {
        return common.createGridOption([{
            name: '项目名称',
            cellTemplate: '<div class="ui-grid-cell-contents">{{grid.appScope.project.name}}</div>'
        }, {
            name: '所属年月',
            cellTemplate: '<div class="ui-grid-cell-contents">{{grid.appScope.onlyYearAndMonth(row.entity.belong)}}</div>'
        }, {
            name: '导入者',
            field: 'operator'
        }, {
            name: '导入时间',
            field: 'createTime'
        }], scope, loadData, configuration);
    };

    this.createPurchaseGrid = function(scope, loadData, configuration) {
        return common.createGridOption([{
            name: '所属年月',
            cellTemplate: '<div class="ui-grid-cell-contents">{{grid.appScope.onlyYearAndMonth(row.entity.belong)}}</div>'
        }, {
            name: '供应商名称',
            cellTemplate: '<div class="ui-grid-cell-contents" >{{row.entity.company || row.entity.supplier.name}}</div>'
        }, {
            name: '商品服务名',
            cellTemplate: '<div class="ui-grid-cell-contents" >{{row.entity.productName || row.entity.name}}</div>'
        }, {
            name: '商品规格型号',
            field: 'productModel'
        }, {
            name: '计量单位',
            cellTemplate: '<div class="ui-grid-cell-contents" >' + '{{grid.options.configuration.i18n(1,"countUnit",row.entity.productUnit)}}' + '</div>'
        }, {
            name: '入库数量',
            field: 'productCount'
        }, {
            name: '不含税单价',
            field: 'price'
        }, {
            name: '不含税金额',
            field: 'unTaxCount'
        }, {
            name: '税率',
            field: 'rate'
        },{
            name: '税额',
            field: 'rateCount'
        },{
            name: '价税合计金额',
            field: 'total'
        }], scope, loadData, configuration);
    };

    this.createEngineeringPurchaseGrid = function(scope, loadData, configuration) {
        return common.createGridOption([{
            name: '采购时间',
            cellTemplate: '<div class="ui-grid-cell-contents">{{grid.appScope.onlyYearAndMonth(row.entity.belong)}}</div>'
        }, {
            name: '部门',
            field: 'dept.name'
        }, {
            name: '项目名称',
            field: 'project.name'
        }, {
            name: '供应商',
            field: 'supplier.name'
        }, {
            name: '货物或应税劳务、服务名称',
            field: 'name'
        }, {
            name: '规格型号',
            field: 'productModel'
        }, {
            name: '不含税单价',
            field: 'price'
        }, {
            name: '数量',
            field: 'productCount'
        }, {
            name: '不含税金额',
            field: 'unTaxCount'
        }, {
            name: '税率',
            field: 'rate'
        },{
            name: '税额',
            field: 'rateCount'
        },{
            name: '价税合计金额',
            field: 'total'
        }], scope, loadData, configuration);
    };

    this.createConstructionItemGrid = function(scope, loadData, configuration) {
        return common.createGridOption([{
            name: '所属月份',
            field: 'belong'
        }, {
            name: '上期累加',
            field: 'lastAllCount'
        }, {
            name: '本月完工',
            field: 'finished'
        }, {
            name: '施工面积',
            field: 'area'
        },{
            name: '进度累计',
            field: 'allProgress',
            cellTemplate: '<div class="ui-grid-cell-contents" >' + '{{row.entity.lastAllCount + row.entity.finished}}' + '</div>'
        }], scope, loadData, configuration);
    };
    this.createSupplierGrid = function(scope, loadData, configuration) {
        return common.createGridOption([{
            name: '供应商名称',
            cellTemplate: '<div class="ui-grid-cell-contents" ng-click="grid.appScope.showDetail(row.entity, false)"><a href="javascript:">{{row.entity.name}}</a></div>',
            width: '19%'
        }, {
            name: '供应商税号',
            field: 'licenseCode',
            width: '19%'
        }, {
            name: '供应商纳税人身份类别',
            cellTemplate: '<div class="ui-grid-cell-contents">{{grid.options.configuration.i18n(3,"identity",row.entity.identityType)}}</div>',
            width: '19%'
        }, {
            name: '资质是否上传',
            width: '40%',
            cellTemplate:[
            '<input type="checkbox" ng-checked="row.entity.licenseImg">营业执照</input>'
            ,'<input type="checkbox" ng-checked="row.entity.registryImg">税务登记证</input>'
            ,'<input type="checkbox" ng-checked="row.entity.organizationImg">组织机构代码证</input>'
            ,'<input type="checkbox" ng-checked="row.entity.openAccountImg">开户许可证</input>'].join('')
        }/*,{
            name: '纳税人身份复核',
            width: '10%',
            cellTemplate: '<div class="ui-grid-cell-contents"><a href="http://www.yibannashuiren.com/">yibannashuiren.com</a></div>',

        }*/], scope, loadData, configuration);
    };
    this.createSupplierGrid2 = function(scope, loadData, configuration) {
        return common.createGridOption([{
            name: '供应商名称',
            cellTemplate: '<div class="ui-grid-cell-contents" ng-click="grid.appScope.showDetail(row.entity, false)"><a href="javascript:">{{row.entity.name}}</a></div>',
            width: '19%'
        }, {
            name: '供应商税号',
            field: 'licenseCode',
            width: '19%'
        }, {
            name: '供应商纳税人身份类别',
            cellTemplate: '<div class="ui-grid-cell-contents">{{grid.options.configuration.i18n(3,"identity",row.entity.identityType)}}</div>',
            width: '19%'
        },{
            name: '纳税人身份复核',
            width: '40%',
            cellTemplate: '<div class="ui-grid-cell-contents"><a href="http://www.yibannashuiren.com/">http://www.yibannashuiren.com</a></div>',

        }], scope, loadData, configuration);
    };

    this.createContractGrid = function(scope, loadData, configuration) {
        return common.createGridOption([{
            name: '所属月份',
            field: 'belong'
        }, {
            name: '合同金额',
            field: 'project.totalCount'
        }, {
            name: '上期完成合同金额',
            field: 'lastAllCount'
        }, {
            name: '已完成合同金额',
            field: 'finished'
        }, {
            name: '剩余合同金额',
            cellTemplate: '<div class="ui-grid-cell-contents" >' + '{{row.entity.project.totalCount - row.entity.lastAllCount - row.entity.finished}}' + '</div>'
        },{
            name: '合同完成率（%）',
            field: 'progressRate',
            cellTemplate: '<div class="ui-grid-cell-contents" >' + '{{(row.entity.lastAllCount + row.entity.finished) * 100 / row.entity.project.totalCount}}' + '</div>'
        }], scope, loadData, configuration);
    };

    this.createReceiptGrid = function(scope, loadData, configuration) {
        return common.createGridOption([{
            name: '所属月份',
            cellTemplate: '<div class="ui-grid-cell-contents">{{grid.appScope.onlyYearAndMonth(row.entity.belong)}}</div>'
        }, {
            name: '项目名称',
            field: 'project.name'
        }, {
            name: '至上期收款累计',
            field: 'allByLastMonth',
            cellFilter: 'toFixed'
        }, {
            name: '本月回款额',
            field: 'count',
            cellFilter: 'toFixed'
        }, {
            name: '累计收款（含跨年）',
            field: 'allByNow',
            cellFilter: 'toFixed'
        },{
            name: '完成进度回款率（%）',
            field: 'percent'
        }], scope, loadData, configuration);
    };

}]);

services.service('util', ['common', function(common) {
    this.taxCount = function(v) {
        return v.taxRatio !== null ? (v.total * v.taxRatio / (v.taxRatio + 1)) : 0;
    };

    this.rate = function(n) {
        var rates = [];
        n.replace(/(\d+)%/g, function(s, r) {
            rates.push(parseInt(r));
        });
        return rates;
    };
    this.downloadFile = function(url, params){
        url += '?';
        angular.forEach(params, function(v,k){
            url += (k + '=' + v + '&');
        });
        window.open(url, '_self');
    };
}]);

 directives.directive('xdGrid', ['$timeout', function($timeout) {
     return {
         scope: {
             grid: '='
         },
         templateUrl: 'js/tpl/xd-grid-tmpl.html',
         link: function($scope, $element,$attrs) {
             var controller = $element.parent().controller();
         },
         compile: function($element, attrs) {
            //$element.attr('ui-grid',attrs.grid);
        }

     };
 }])