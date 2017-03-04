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
                map[id].parent = parent;
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
