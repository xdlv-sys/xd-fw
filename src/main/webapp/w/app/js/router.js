//angular.module('xdApp').requires.push('');

angular.module('xdApp').config(function ($stateProvider) {
    $stateProvider.xdParse2(
    	'grade-user'
    	,'main-template-record'
    	,'add-template-item'
    	,'download-template');
});