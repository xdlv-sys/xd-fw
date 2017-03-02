xdApp.requires.push('froala');
xdApp.requires.push('ngSanitize');

xdApp.config(function ($stateProvider) {
    $stateProvider.xdParse('draw').xdParse('drawItem');
});