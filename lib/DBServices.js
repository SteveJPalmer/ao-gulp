/* application DB Service */
angular.module('store').service('DBService',function($http,myConfig){

   //Configure Database
	var host = myConfig.mongohost;
	var port = "3000";
   // var database = 'prod';   // production database
	var database = myConfig.mongodb;   // test database

	this.refreshDashboard=function(store){
		console.log('Log:Call DBServices.refreshDashboard');
		refreshDashboard(store);
	};

   /* reload records section */
   refreshDashboard=function(store){ // define an instance method
         console.log('Log:Call refreshDashboard');

	     //total pending
		 // filter construction
		 var request_url = 'http://'+host+':'+port+'/'+database+'/fingerprinting';
		 var request_params = '?query={"supervised":{"$exists":false}}&operation=count';
	     var request1 = request_url + request_params ;

		 console.log('Log:refreshDashboard - Total Pending - XHR request:' + request1);

		 $http.get(request1)
		 	.success(function(data){
    		  store.total = data;
			  console.log('Log:refreshDashboard - Total Pending - data:'+data);
		    })
		    .error(function(){
    		  store.total = 'error';
			  console.log('error');
		    });


	   // infringing processed records requiring iaps upload
	   // filter construction
	   var requestUrl = 'http://'+host+':'+port+'/'+database+'/fingerprinting';
	   var requestQuery = '?query={"supervised":{"$exists":true}, "supervised.infringing":true, "supervised.iaps-uploaded":{"$exists":false} }&operation=count';

	   var request2 = requestUrl + requestQuery;

	   console.log('Log:refreshDashboard - IAPS Pending - XHR request:' + request2);

	   $http.get(request2)
		   .success(function(data){
			   store.iapstotal = data;
			   console.log('Log:refreshDashboard - Iaps Pending - data:'+data);
		   })
		   .error(function(){
			   store.iapstotal = 'error';
			   console.log('error');
		   });
   };

});
