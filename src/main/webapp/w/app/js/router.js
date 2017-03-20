//angular.module('xdApp').requires.push('');

angular.module('xdApp').config(function($stateProvider) {
    $stateProvider.xdParse2('grade-user');

    function f(n) {
        n.each(function(v) {
            $stateProvider.xdParse(v, {
                controller: 'TemplateCtrl'
            });
        });
    }
    f(['upload-template'
        ,'add-template-item'
        ,'download-template'
        ,'grade']);
});
