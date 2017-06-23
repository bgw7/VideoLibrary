angular.module("VidLib").service("ItemService", function($http) {

    var transform = function(data){
        return $.param(data);
    };
    var item = this;

    item.getBarcodeData = function(dataObj){
        return $http.put("/scan", dataObj, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
            transformRequest: transform
        });
    };


    item.putBarcodeItem = function(dataObj){
        return $http.put("/scan/add", dataObj, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
            transformRequest: transform
        });
    };

    item.getItems = function(){
        return $http.get('/barcode');
    };

    item.deleteItem = function(itemID){
        return $http.delete("/barcode/" + itemID)
    };

});