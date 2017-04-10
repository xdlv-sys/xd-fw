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

    this.shuffle = function(arr) {
        var len = arr.length;
        for (var i = 0; i < len - 1; i++) {
            var idx = Math.floor(Math.random() * (len - i));
            var temp = arr[idx];
            arr[idx] = arr[len - i - 1];
            arr[len - i - 1] = temp;
        }
        return arr;
    };

    this.lastMonth = function() {
        var d = new Date();
        var month = d.getMonth();
        var year = d.getFullYear();
        if (month === 0) {
            year = year - 1;
            month = 12;
        }
        return year + '-' + month + '-01';
    };

}]);
