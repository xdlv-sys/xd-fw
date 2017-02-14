services.service('util', ['common', function(common) {
    this.downloadFile = function(url, params){
        url += '?';
        angular.forEach(params, function(v,k){
            url += (k + '=' + v + '&');
        });
        window.open(url, '_self');
    };
}]);
