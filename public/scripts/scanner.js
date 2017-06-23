var Quagga = window.Quagga;
var App = {
    _scanner: null,
    init: function() {
        this.attachListeners();
    },
    activateScanner: function() {
        
        var scanner = this.configureScanner('.overlay__content'),
            onDetected = function (result) {
                document.querySelector('input.isbn').value = result.codeResult.code;
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
                $.ajax ({
type: "PUT",
url: "/scan",
data: {number: barcodeToSearch},
cache: false,
success: function(response) { 
if(!response.code.includes("INVALID_UPC")){
    document.getElementById("barcode.title").value = response.items[0].title
}else{alert("data for barcode not found")}

}})
        //         $.ajax({
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
        //     method   : "POST",
        //     url      : "/scan",
        //     data     : "0786936825084",
        //     success  : function(response){
        //         debugger;
        //     },
        //     error    : function(){console.log("ajax get error");},
        // });
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
                        width: 800,
                        height: 600,
                        facingMode: "environment"
                    }
                });
        }
        return this._scanner;
    }
};
App.init();