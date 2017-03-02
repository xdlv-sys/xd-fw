services.service('util', ['common', function(common) {
    this.downloadFile = function(url, params){
        url += '?';
        angular.forEach(params, function(v, k) {
            url += (k + '=' + v + '&');
        });
        window.open(url, '_self');
    };

    this.preview = function(divName) {
        var printContents = document.getElementById(divName).innerHTML;
        var popupWin = window.open('', '_blank', 'width=600,height=600');
        popupWin.document.open();
        popupWin.document.write('<html><head><link rel="stylesheet" type="text/css" href="css/app.css" /></head><body onload="window.print()">' + printContents + '</body></html>');
        popupWin.document.close();
    };

}]);
