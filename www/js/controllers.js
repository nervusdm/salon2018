angular.module('app.controllers', ['ngCordova'])

.controller('scanQRCodeCtrl',  // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope,$state,$timeout, $stateParams,$http,$cordovaBarcodeScanner,$ionicPopup,intervenant  ) {

/*
cordova.plugins.diagnostic.requestCameraRollAuthorization(function(granted){
    console.log("Authorization request for camera roll was " + (granted ? "granted" : "denied"));
}, function(error){
  alert("error");
    console.error(error);
});
alert("cool")

*/
$scope.intervenants = intervenant.intervenant;

$scope.scanBarcode = function($scope) {
//alert("Merci d'accepter l'application à utiliser l'appareil photo pour scanner le qrCode !!")







try{
  const permissions = cordova.plugins.permissions;
  permissions.checkPermission(permissions.CAMERA, function( status ){
    console.log(status)
    if ( status.hasPermission ) {
    }
    else 
    {
      alert("L'application a besoin de pouvoir prendre une photo pour scanner les qrCode. Une fenêtre va s'ouvrir pour vous demander cette permission.");
      permissions.requestPermission(permissions.CAMERA, success, error);
    }
  });

}catch(e){
  console.log('caught error in a chunk of code');
  alert("zut");
  alert(e);
  console.error(e);
}


function error() {
  alert("Vous n'avez pas autorisé l'application à prendre une photo.");
}

function success( status ) {
  if( !status.hasPermission ) error();
}


cordova.plugins.barcodeScanner.scan(
  function (result) {
    var tab= {code:result.text};
    $http.post( url_projet + '/rha/appsalon/hello/',tab)
    .then(function (response) {
      response = response.data;
      if (response.error)
      {
        alert(response.error);
        return false;
      }
      if (response.success)
      {

        var alertPopup = $ionicPopup.alert({
         title: 'Succès',
         template: "Visite enregistrée"
       });

        alertPopup.then(function(res) {
          $state.go("tabsController.lesExposants");
          $timeout(function() { $state.go("tabsController.exposant",{id:response.intervenant.si_id})},200);
        });
          intervenant.visite.push(response.visite)

        return false;




        return false;
      }
     // alert(response);
    });



  },
  function (error) {
    alert("Erreur lors du scan: " + error);
  },
  {
          preferFrontCamera : false, // iOS and Android
          showFlipCameraButton : true, // iOS and Android
          showTorchButton : true, // iOS and Android
          torchOn: false, // Android, launch with the torch switched on (if available)
          prompt : "Prenez en photo le QR Code du fournisseur.. ", // Android
          resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
          formats : "QR_CODE,PDF_417", // default: all but PDF_417 and RSS_EXPANDED
          disableAnimations : true, // iOS
          disableSuccessBeep: false // iOS
        }
        );


};



})

.controller('lesExposantsCtrl', ['$scope', '$stateParams', 'intervenant','$filter',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams,intervenant,$filter) {
console.log($stateParams);
 $scope.intervenantId  = false;
$scope.intervenant = intervenant;
if ($stateParams.id)
{
  $scope.intervenantId = $stateParams.id;
  $scope.t_intervenant= $scope.$eval("(intervenant.intervenant | filter:{si_id: intervenantId })[0]");
console.log(  $scope.t_intervenant)
}


$scope.tabSelect = function(id,$document)
{
angular.element(document.getElementsByClassName("tabsSelect-content")).removeClass('active');
angular.element(document.getElementById(id)).addClass('active slide-left-right');
}



}])

.controller('cloudTabDefaultPageCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])
.controller('loginCtrl',['$rootScope','$scope','$stateParams','login','$http', '$location','login',
function($rootScope,$scope,$stateParams,login,$http, $location,login)
{


login.loadLogin();
if ($rootScope.globals && $rootScope.globals.user)
{
$location.path('/page1/scan');
console.log($rootScope.globals)
}



$scope.login = function()
{
var tab= {account:$scope.account}

$http.post(url_projet + '/rha/appsalon/login/',tab).then(function(response)
{
response = response.data;
if (response.error)
{
  alert("Err" + response.error);
  return false; 
}
if (response.success)
{
 login.setLogin({nom:$scope.account.nom,email:$scope.account.email,id:response.id,password:$scope.account.password,"auth":response.auth});
$location.path('/page1/scan');
  
}


});



}


$scope.register = function()
{


  var tab= {account:$scope.account}
$http.post( url_projet + '/rha/appsalon/register/',tab)
     .then(function (response) {
      response = response.data;

      if (response.error)
      {
          return false;
      }
      if (response.success)
      {
 login.setLogin({nom:$scope.account.nom,email:$scope.account.email,id:response.id,password:$scope.account.password,"auth":response.auth});
$location.path('/page1/scan');

          return false;
      }
      });
}
}]);
