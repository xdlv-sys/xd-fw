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