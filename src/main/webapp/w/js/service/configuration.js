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
    this.init = function() {
        if (me.flag){
            return null;
        }
        return common.loadAllPage('/conf/obtainConfigs.cmd', function(data) {
            me.parse(data);
            me.flag = true;
        });
    }

    this.makeKey = function(groupNo, name) {
        return groupNo + '-' + name;
    };

    this.i18n = function(groupNo, name, value) {
        return this.configurations[this.makeKey(groupNo, name)][value].value;
    };
    this.group = function(groupNo, name) {
        var ret = [];
        angular.forEach(this.configurations[this.makeKey(groupNo, name)], function(v) {
            if (!angular.isBlank(v)) {
                ret.push(angular.copy(v));
            }
        });
        return ret;
    };

}]);
