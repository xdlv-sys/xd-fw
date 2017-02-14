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
