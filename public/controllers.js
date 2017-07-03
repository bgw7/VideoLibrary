


angular.module("VidLib").controller("ItemsCtrl", function (ItemService, $cookies, $uibModal, $scope) {
var itemController = this;
$scope.loadingItems = false;
    itemController.itemsArray = [];
    itemController.barcode;
var Quagga = window.Quagga;
var App = {
    _scanner: null,
    init: function() {
        this.attachListeners();
    },
    activateScanner: function() {
        
        var scanner = this.configureScanner('.overlay__content'),
            onDetected = function (result) {
                // document.querySelector('input.isbn').value = result.codeResult.code;
                stop();
                searchBarcode(result.codeResult.code);
            }.bind(this),
            stop = function() {
                scanner.stop();  // should also clear all event-listeners?
                scanner.removeEventListener('detected', onDetected);
                this.hideOverlay();
                this.attachListeners();
            }.bind(this),
            searchBarcode = function(barcodeToSearch){
                var getScope = function(id) {
var elem;
$('.ng-scope').each(function(){
    var s = angular.element(this).scope(),
        sid = s.$id;

    if(sid == id) {
        elem = this;
        return false; // stop looking at the rest
    }
});
return elem;
};
                var appElement = getScope(3);
            var $scope = angular.element(appElement).scope();
            $scope.item.postItem(barcodeToSearch);      
//                 $.ajax ({
// type: "PUT",
// url: "/scan",
// data: {number: barcodeToSearch},
// cache: false,
// success: function(response) { 
// if(!response.code.includes("INVALID_UPC")){
//     document.getElementById("barcode.title").value = response.items[0].title
// }else{alert("data for barcode not found")}

// }})
       
        //             // 097361455044
        //             //search to get video title
        //             //search to get video cover art
        //             // google search api key AIzaSyC9_GNYFtg0k1MLflxCVOmb0Sb-IGdWgi0
        //             // https://upcdatabase.org/ucp-api api key 63e5a677e6c02c9a32f257abb55dc385
        //
        //      http://www.upcitemdb.com/
        //
        //             // https://www.googleapis.com/customsearch/v1?key=INSERT_YOUR_API_KEY&cx=017576662512468239146:omuauf_lfve&q=lectures
        //             // http://api.upcdatabase.org/json/63e5a677e6c02c9a32f257abb55dc385/097361455044
        //     
            };
        this.showOverlay(stop);
        scanner.addEventListener('detected', onDetected).start();
    },
    attachListeners: function() {
        var self = this,
            button = document.querySelector('#scannerButton'); //change to button select by id, button id

        button.addEventListener("click", function onClick(e) {
            e.preventDefault();
            button.removeEventListener("click", onClick);
            self.activateScanner();
        });
    },
    showOverlay: function(cancelCb) {
        if (!this._overlay) {
            var content = document.createElement('div'),
                closeButton = document.createElement('i');

            closeButton.appendChild(document.createTextNode(''));
            content.className = 'overlay__content';
            closeButton.className = 'overlay__close fa fa-times-circle-o fa-5x';
            this._overlay = document.createElement('div');
            this._overlay.className = 'overlay';
            this._overlay.appendChild(content);
            content.appendChild(closeButton);
            closeButton.addEventListener('click', function closeClick() {
                closeButton.removeEventListener('click', closeClick);
                cancelCb();
            });
            document.body.appendChild(this._overlay);
        } else {
            var closeButton = document.querySelector('.overlay__close');
            closeButton.addEventListener('click', function closeClick() {
                closeButton.removeEventListener('click', closeClick);
                cancelCb();
            });
        }
        this._overlay.style.display = "block";
    },
    hideOverlay: function() {
        if (this._overlay) {
            this._overlay.style.display = "none";
        }
    },
    configureScanner: function(selector) {
        if (!this._scanner) {
            this._scanner = Quagga
                .decoder({readers: ['ean_reader']})
                .locator({patchSize: 'medium'})
                .fromSource({
                    target: selector,
                    constraints: {
                        width: 640,
                        height: 480,
                        facingMode: "environment"
                    }
                });
        }
        return this._scanner;
    }
};
App.init();

    itemController.postItem = function(barcode){
        var postBarcode = {
            number : barcode
        };
        var promiseGetBarcode = ItemService.getBarcodeData(postBarcode);
    promiseGetBarcode.then(function (response) {
        if(!response.data.code.includes("INVALID") || !response.data.items === []){
        var newBarcode = {
            Title       : response.data.items[0].title,
            Number      : barcode,
            Description : response.data.items[0].description,
            Image       : response.data.items[0].images[0]
        };
        var promisePostBarcode = ItemService.putBarcodeItem(newBarcode);
        promisePostBarcode.then(function(response){
            newBarcode.id = response.data.created;
            newBarcode.Number = newBarcode.Number.toString();
            itemController.itemsArray.push(newBarcode);
        }, function(response){});
    }else{
            console.log("barcode not found");}
    }, function (response) {
        //failure
        alert("public barcode API failed")                

    })
};

    itemController.isCollapsed = false;

    var promise = ItemService.getItems();
    $scope.loadingItems = true;
    promise.then(function (response) {
        //success      
        itemController.itemsArray = response.data.items;
        if(response.data.items === null){
        itemController.itemsArray = [];
        };
        $scope.loadingItems = false;
        itemController.sortColumn = "-title";
    }, function (response) {
        //failure
        $scope.loadingItems = false;
        itemController.itemsArray = [];
        alert("failure message: " + JSON.stringify({data: response.data}));
    });


    // MODAL WINDOW
    itemController.open = function (itemObj) {
        var modalInstance = $uibModal.open({
            controller: "ModalInstanceCtrl",
            controllerAs: "descriptionModal",
            templateUrl: 'myModalContent.html',
            resolve: {
                itemObj: function () {
                    return itemObj;
                }
            }
        });

    };

});



angular.module("VidLib").controller("ModalInstanceCtrl", function ($cookies, itemObj, ItemService, $scope, $uibModal) {

    var descriptionModal = this;

    descriptionModal.itemI = itemObj;
    

    descriptionModal.deleteItem = function(itemID){
        barcodeId = itemID;
        var promise = ItemService.deleteItem(barcodeId);
        promise.then(function (response) {
            //success
            //remove item from array
            var dog = $scope.$$prevSibling.item.itemsArray;
            var x;
            var removeItemIndex = dog.findIndex(x => x.Number === itemID);
            dog.splice(removeItemIndex, 1);
                //modal for success
                var x = document.getElementById("snackbar")
                x.className = "show";
                setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
        }, function (response) {
            //failure
            alert("Failed to delete");
        })};  
});


