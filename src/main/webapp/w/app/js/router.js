//angular.module('xdApp').requires.push('');

angular.module('xdApp').config(function($stateProvider) {
    $stateProvider.xdParse2('grade-user');

    $stateProvider.xdParse('upload-template', {
        controller: 'TemplateCtrl'
    });
    $stateProvider.xdParse('add-template-item', {
        controller: 'TemplateCtrl'
    });
    $stateProvider.xdParse('download-template', {
        controller: 'TemplateCtrl'
    });
    


});
