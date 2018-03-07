angular.module('app.services', [])

.factory('BlankFactory', [function(){

}])

.service('BlankService', [function(){

}])
.factory("login",function($http,$stateParams,$rootScope,$q,$filter,sessionService)
{
 var data = [],
       lastRequestFailed = true,
       promise,
       produitLocation = false,
       location = false;

function setLogin(p)
{
$rootScope.globals = {};
$rootScope.globals.user = p ;
console.log($rootScope.globals.user);
authdata = "login_id=" 
var login=$rootScope.globals.user.id;
var password = "";
$http.defaults.headers.common['Authorization'] = p.auth;
//window.localStorage.setItem('globalsUser', p);
sessionService.set("globalsUser",p);
    var data = sessionService.get("globalsUser");


}

function loadLogin()
{
    var data = sessionService.get("globalsUser");

    console.log(data);
    if (data && data.auth)
    {
        $rootScope.globals= {};
        $rootScope.globals.user = data;;
        $http.defaults.headers.common['Authorization'] = data.auth;
        return true ;
    }
}



function getData(type)
{
	return loadData().then(function() { return { location:location,produitLocation:produitLocation  } }  );
}

function deleteData(d)
{
location =    $filter('filter')(location,{hs_lp_id:"!"+d},true)
$rootScope.$broadcast('location');

}
function addData(d)
{
	console.log(location.length);
	location.push(d[0])
	console.log(location.length);
}
function loadData()
{
		if  (location!==false)
		{
	                    var deferred = $q.defer();
	                    deferred.resolve({location:location,produitLocation:produitLocation});
	                    return deferred.promise;
		}

                if(!promise)
                            {
                                    var target = document.getElementsByTagName('body')[0];
                                    promise = $http.post( url_projet + '/rha/appsalon/get_info/')
                                    .then(function (response)
                                    {
                                        response = response.data;
                                        produitLocation = response.produitLocation;
                                        lastRequestFailed = false;
                                        data = response.data;
                                        return data;
                                }, function(res) {
                                return $q.reject(res);
                                });

                            }
                            return promise;

}


 return {
            location:location,
            setLogin:setLogin,
 	setLogin:setLogin,
 	getData:getData,
            loadLogin:loadLogin,
 	addData:addData,
 	deleteData:deleteData,
            loadData: loadData

 }
  

})
.factory("intervenant", function($timeout,$http,$q,$filter,$rootScope) {




  function info_intervenant () {
    var self = this;
    self.intervenant =[];
    self.visite=[];
    var promise;






    self.getintervenant= function()
    {
      return self.intervenant;
    }
    self.updateData = function(d,id)
    {
      angular.forEach(self.intervenant, function(value, key) {
        if (value.si_id==id)
        {
          self.intervenant[key]=d[0]
          return false;
        }
      });
    }
    self.deleteData = function(d)
    {
     self.intervenant=    $filter('filter')(self.intervenant,{id:"!"+d},true)
   }
   self.addData = function(d,index)
   {
    if (index)
    {
      var j =  self.intervenant  ;
      j.splice(index, 0, d[0]);
      self.intervenant   = j;
      return true ;
    }
    console.log(self.intervenant.length);
    self.intervenant.push(d[0])
    console.log(self.intervenant.length);
  }

  self.loadData = function()
  {

    if(!promise) 
    {
                                //    alert("ok2")

                                var target = document.getElementsByTagName('body')[0];
                                var spinner = new Spinner().spin(target);    
                                promise = $http.post( url_projet + '/rha/appsalon/get_intervenant/')
                                .then(function (response) 
                                {
                                  response = response.data;
                                  self.intervenant   = response.intervenant ;
                                  self.visite = response.visite;
                                  lastRequestFailed = false;
                                  data = response.data;
                                  spinner.stop();
                                  $rootScope.$broadcast('intervenant');

                                  return data;
                                }, function(res) {
                                  return $q.reject(res);
                                });

                              }
                              return promise;

                            }

                            self.loadData();


                          }

                          return new info_intervenant();

                        })


.factory('sessionService',['$http',function($http){
return {
   set:function(key,value){
      return localStorage.setItem(key,JSON.stringify(value));
   },
   get:function(key){
    console.log((localStorage.getItem(key)));
     return JSON.parse(localStorage.getItem(key));
   },
   destroy:function(key){
     return localStorage.removeItem(key);
   },
 };
}])


;
