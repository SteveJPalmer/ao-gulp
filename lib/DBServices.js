/* application DB Service */
angular.module('store').service('DBService',function($http,myConfig){

   //Configure Database
	var host = myConfig.mongohost;
	var port = "3000";
   // var database = 'prod';   // production database
	var database = myConfig.mongodb;   // test database

   //Configure IAPS upload Notice Service
   var iapshost = myConfig.iapshost;   // test service
   //var iapshost = '192.168.251.21';        // production service

   //temp fix 
   //var iapshost = '192.168.251.64:8080';        // single node call


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


    /* reload records section */
    this.refreshDashboardDetails=function(store){ // define an instance method
        console.log('Log:Call refreshDashboardDetails');
        //Note: total of 8 calls will be make, two for each platform
        var requestUrl = 'http://'+host+':'+port+'/'+database+'/fingerprinting';

        //Platform: YouTube
        //hits
        var requestParams = '?query={"supervised":{"$exists":false},"platform":"YouTube"}&operation=count';
        var request1 = requestUrl + requestParams;
        $http.get(request1)
            .success(function(data1){
                store.hits_youtube = data1;
                console.log('Log:refreshDashboardDetails - Hits YouTube: '+data1);
            });

        //iaps upload
        requestParams = '?query={"supervised":{"$exists":true}, "platform":"YouTube", "supervised.infringing":true, "supervised.iaps-uploaded":{"$exists":false} }&operation=count';
        var request2 = requestUrl + requestParams;
        $http.get(request2)
            .success(function(data2){
                store.iaps_youtube = data2;
                console.log('Log:refreshDashboardDetails - IAPS YouTube: '+data2);
            });

        //Platform: Soundcloud
        //hits
        var requestParams = '?query={"supervised":{"$exists":false},"platform":"Soundcloud"}&operation=count';
        var request1 = requestUrl + requestParams;
        $http.get(request1)
            .success(function(data1){
                store.hits_soundcloud = data1;
                console.log('Log:refreshDashboardDetails - Hits SoundCloud: '+data1);
            });

        //iaps upload
        requestParams = '?query={"supervised":{"$exists":true}, "platform":"Soundcloud", "supervised.infringing":true, "supervised.iaps-uploaded":{"$exists":false} }&operation=count';
        var request2 = requestUrl + requestParams;
        $http.get(request2)
            .success(function(data2){
                store.iaps_soundcloud = data2;
                console.log('Log:refreshDashboardDetails - IAPS SoundCloud: '+data2);
            });


        //Platform: DailyMotion
        //hits
        var requestParams = '?query={"supervised":{"$exists":false},"platform":"DailyMotion"}&operation=count';
        var request1 = requestUrl + requestParams;
        $http.get(request1)
            .success(function(data1){
                store.hits_dailymotion = data1;
                console.log('Log:refreshDashboardDetails - Hits DailyMotion: '+data1);
            });

        //iaps upload
        requestParams = '?query={"supervised":{"$exists":true}, "platform":"DailyMotion", "supervised.infringing":true, "supervised.iaps-uploaded":{"$exists":false} }&operation=count';
        var request2 = requestUrl + requestParams;
        $http.get(request2)
            .success(function(data2){
                store.iaps_dailymotion = data2;
                console.log('Log:refreshDashboardDetails - IAPS DailyMotion: '+data2);
            });


        //Platform: Vimeo
        //hits
        var requestParams = '?query={"supervised":{"$exists":false},"platform":"Vimeo"}&operation=count';
        var request1 = requestUrl + requestParams;
        $http.get(request1)
            .success(function(data1){
                store.hits_vimeo = data1;
                console.log('Log:refreshDashboardDetails - Hits Vimeo: '+data1);
            });

        //iaps upload
        requestParams = '?query={"supervised":{"$exists":true}, "platform":"Vimeo", "supervised.infringing":true, "supervised.iaps-uploaded":{"$exists":false} }&operation=count';
        var request2 = requestUrl + requestParams;
        $http.get(request2)
            .success(function(data2){
                store.iaps_vimeo = data2;
                console.log('Log:refreshDashboardDetails - IAPS Vimeo: '+data2);
            });


        console.log('Log:Exiting refreshDashboardDetails');
    };


    /* reload records section */
   this.reload=function(store,$scope){ // define an instance method
         console.log('Log:Call DBServices.reload');
		 //reset media player
		 store.playerlink = ' ';
		 store.playerurl = ' ';
	     store.uploadmessagetype = 0;

		 // filter construction
    	 console.log('Log:reload - constructing http get');
		 // var request = 'http://54.154.193.206:3000/test/fingerprinting?query={"supervised":{"$exists":false}}&limit=10';
		 var requestUrl = 'http://'+host+':'+port+'/'+database+'/fingerprinting';
         // var request_query = '?query={"platform":"YouTube","supervised":{"$exists":false}}&limit='+store.numrows;

		 var filterPlatform = '';
         if (store.platform != 'ALL') {
         	 console.log('Log:reload - adding platform filter');
 		 	 filterPlatform = ',"platform":"'+store.platform+'"';
         }
         //var filterArtist = '';
         //if (store.artistFilter != '') {
         //	 console.log('Log:reload - adding artist filter');
 		 //	 filterArtist = ',"artist.artist":"'+store.artistFilter+'"';
         //}
         //var filterTitle = '';
         //if (store.titleFilter != '') {
         //	 console.log('Log:reload - adding title filter');
 		 //	 filterTitle = ',"title.titlename":"'+store.titleFilter+'"';
         //}
         // var filterOwner = '';
         //if (store.ownerFilter != '') {
         //	 console.log('Log:reload - adding owner filter');
 		 //	 filterOwner = ',"title.owner":"'+store.ownerFilter+'"';
         //}

         //Need to check for both empty string and null when determining if artist selected or 'all' artists (cf note belwo)
         //note: issue found with Angular ngoptions directive.
         //      When set <options> to "" for the All values option, If select option then reselect 'All' then
         //      Angulars javascript sets it to null (not empty string)
         var filterArtist = '';
         if ($scope.artist != '' && $scope.artist != null) {
         	 console.log('Log:reload - adding artist filter');
         	 filterArtist = ',"artist.artist":"'+$scope.artist+'"';
         }
         var filterTitle = '';
         if ($scope.track != '' && $scope.track != null) {
             console.log('Log:reload - adding title filter');
             filterTitle = ',"title.titlename":"'+$scope.track+'"';
         }

		 var requestQuery = '?query={"supervised":{"$exists":'+store.results+'}'+filterPlatform+filterArtist+filterTitle+'}';
         //var requestQuery = '?query={"supervised":{"$exists":'+store.results+'}'+filterPlatform+filterArtist+filterTitle+filterOwner+'}';

		 var requestSort = '&sort={"_id":'+store.order+'}';
         var request0 = requestUrl + requestQuery+requestSort;

         if (store.numrows != 'ALL') {
         	 console.log('Log:reload - adding sort clause');
   		     request0 = request0 +'&limit='+store.numrows;
         }

		 console.log('Log:reload request:  ' + request0);
		 $http.get(request0).success(function(data){
			store.products = data;
			data.forEach.call(data,function(a){
				if(!a.supervised){
					a.supervised = Object();
					a.supervised.artist = a.artist.artist;
					a.supervised.titlename=a.title.titlename;
					a.supervised.owner=a.title.owner;
					a.supervised.infringing=false;
					a.supervised.comments="";
				}
			});
			console.log('Log:reload - data: '+data);
		});
   };

   /*save document changes */
   this.save = function(product, store){
		console.log('Log:Call DBServies.save');
		console.log('Log:save - product obj: '+JSON.stringify(product));
		console.log('Log:save - store total (entering): '+store.total);

		//prepare request to save to Mongo
		product.supervised.date = new Date();
		//create a clone of underlying angular product row (so can manipulate for request) 

		// var productupdate = JSON.parse(JSON.stringify(product));
		var productupdate = jQuery.extend({}, product);
        productupdate.supervised.date = new Date();
		var productId = productupdate._id;	
		delete productupdate._id;
		delete productupdate.$$hashKey;
		delete productupdate.$$hashKey;
		//request url
		var request = 'http://'+host+':'+port+'/'+database+'/fingerprinting/'+productId;
		
		console.log('Log:save - request: ' + request);
		console.log('test--- doublechecking what product model is now:  '+JSON.stringify(product));
		console.log('test--- doublechecking what productupdate is now:  '+JSON.stringify(productupdate));
		
		$http.put(request,JSON.stringify(productupdate))
		  .success(function(){	
  		    console.log('Log:save - success path');
			refreshDashboard(store);
  		  //  store.total -= 1;
            //if 	(productupdate.supervised.infringing == true) {
 			//  store.iapstotal += 1;
            //}
    		//console.log('Log:save - store total(exiting): '+store.total);
		});	

	};

    /* Filtering methods (incl ordering) */
    //attempts were made to order at source (ie within MongoDB),
    // but the REST service doesn't sort when distinct
    this.filterArtist = function($scope) {
        console.log('Log:Call DBServices.filterArtist');
        console.log('Log:filterArtist - constructing http get');

        console.log('Log:filterArtist - adding platform filter: '+ $scope.platform);
        var filterPlatform = ',"platform":"'+$scope.platform+'"';


        //Logical DB query - retrieve distinct Artist names for the given platform
        var requestUrl = 'http://'+host+':'+port+'/'+database+'/fingerprinting';
        var requestQuery = '?query={"supervised":{"$exists":false}' + filterPlatform + '}&operation=distinct&fields=artist&sort={"artist.artist":1}';

        var request = requestUrl + requestQuery;
        console.log('Log:filterArtist - XHR request:' + request);

        $http.get(request)
            .success(function(data){
                console.log('Log:filterArtist - data: '+data);

                //sort the array for display
                data.sort(function (value1, value2) {
                    if (value1.artist < value2.artist) {
                        return -1;
                    } else if (value1.artist > value2.artist) {
                        return 1;
                    } else {
                        return 0;
                    }
                });

                $scope.artists = data;
                //data.sort();
                //return data;
            })
            .error(function(){
                console.log('Log:filterArtist - Error');
                //return data;
            });
    };

    this.filterTrack = function($scope) {
        console.log('Log:Call DBServices.filterTrack');
        console.log('Log:filterTrack - constructing http get');

        console.log('Log:filterTrack - adding platform filter: '+ $scope.platform);
        console.log('Log:filterTrack - adding artist filter: '+ $scope.artist);
        var filterPlatform = ',"platform":"'+$scope.platform+'"';
        var filterArtist = ',"artist.artist":"'+$scope.artist+'"';

        //Logical DB query - retrieve distinct Artist names for the given platform
        var requestUrl = 'http://'+host+':'+port+'/'+database+'/fingerprinting';
        var requestQuery = '?query={"supervised":{"$exists":false}' + filterPlatform + filterArtist + '}&operation=distinct&fields=title&sort={"title.titlename":1}';

        var request = requestUrl + requestQuery;
        console.log('Log:filterTrack - XHR request:' + request);

        $http.get(request)
            .success(function(data){
                console.log('Log:filterTracks - data: '+data);

                //sort the array for display
                data.sort(function (value1, value2) {
                    if (value1.titlename < value2.titlename) {
                        return -1;
                    } else if (value1.titlename > value2.titlename) {
                        return 1;
                    } else {
                        return 0;
                    }
                });

                $scope.tracks = data;

            })
            .error(function(){
                console.log('Log:filterTracks - Error');
                //return data;
            });
    };



    /*NDI IAPS notice call - Submit call */
   this.iapsUpload = function(store, platform){

	   console.log('Log:Call DBServices.iapsUpload');
	   //retrieve data from Mongo where Supervised & infringing but not yet Submitted
	   // filter construction
	   console.log('Log:iapsUpload - constructing http get');
	   var requestUrl = 'http://'+host+':'+port+'/'+database+'/fingerprinting';
	   //tbc.. add platform to the query...
	   console.log('Log:iapsUpload - adding platform filter'+platform);
	   filterPlatform = ',"platform":"'+platform+'"';

	   var requestQuery = '?query={"supervised":{"$exists":true}, "supervised.infringing":true, "supervised.iaps-uploaded":{"$exists":false} ' + filterPlatform + '}';
	   var request = requestUrl + requestQuery;

	   //reset variables
	   var hitsSegment = '';
	   store.uploadmessagetype = 0;  //success

	   //loop through and create the XML structure for each hit
	   console.log('Log:iapsUpload request:  ' + request);
	   $http.get(request)
		    .success(function(data){
			    //check iy records to process
			    if (data.length == 0) {
					//alert ('No new infringing records to upload to IAPS.');
					store.uploadmessagetype = 3;  //warning
					return;
				}

			    //output all json array for initial testing
			    console.log('Log:iapsUpload - data: '+JSON.stringify(data));
		        $.each(data, function(index, obj){
				   // examine the data record.
                   //output each element for testing
				   console.log('Log:iapsUpload: ' + JSON.stringify(obj));

				   //var d  = new Date();
				   var d  = new Date(obj.supervised.date);
				   var dy = d.getFullYear();
				   var dm = d.getMonth() + 1;
				   var dd = d.getDate();
				   var dt = d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
				   var iapsDate = dm + '-' + dd + '-' + dy + ' ' + dt;

				   var url = document.createElement('a');
				   url.href = obj.link;
				   var iapsArtist = obj.artist['artist-id'];
				   var iapsTrack  = obj.title['title-id'];
				   var iapsDomain = url['hostname'];
				   var iapsUrl    = url['pathname'] + url['search'];

				   console.log('Log:iapsUpload- iapsDate: ' + iapsDate);
				   console.log('Log:iapsUpload- iapsDomain: ' + iapsDomain);
				   console.log('Log:iapsUpload- iapsUrl: ' + iapsUrl);
				   console.log('Log:iapsUpload- iapsArtist: ' +iapsArtist);
				   console.log('Log:iapsUpload- iapsTrack: ' + iapsTrack);

				   var hit = '<hit timestamp="' + iapsDate + '">' +
							   '<host>' +
							     '<uid>' + iapsDomain + '</uid>' +
							     '<ip-address>173.252.120.6</ip-address>' +
							   '</host>' +
							   '<doc>' +
								 '<location><![CDATA[' + iapsUrl + ']]></location>' +
								 '<size>0</size>' +
								 '<match>' +
								   '<infringement-type>13</infringement-type>' +
								   '<artist id="' + iapsArtist + '"><![CDATA[[JOURNEY]]></artist>' +
								   '<track id="' + iapsTrack + '"><![CDATA[[MAIN]]></track>' +
								 '</match>' +
								 '<snapshot></snapshot>' +
								 '<referrer>' +
								   '<uid></uid>' +
								   '<location></location>' +
								 '</referrer>' +
							   '</doc>' +
							 '</hit>';
				   //construct the hits xml segments
				   hitsSegment = hitsSegment + hit;
			   });  // $.each

			   var d  = new Date();
			   var dy = d.getFullYear();
			   var dm = d.getMonth() + 1;
			   //hardcode if testing..
			   //var dd = 2;
			   var dd = d.getDate();
			   var dt = d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
			   var firstNoticeDate = dm + '-' + dd + '-' + dy + ' ' + dt;

			   var iapsXml = '<?xml version="1.0" encoding="UTF-8"?>' +
				   '<hits xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">' +
				   '<channel>3</channel>' +
				   '<provider>19</provider>' +
				   '<notice local-notice-id="UGCMonitoring" notice-status="3" notice-owner="211150">' +
				   '<csv-file-name></csv-file-name>' +
				   '<first-notice-date>' + firstNoticeDate + '</first-notice-date>' +
				   '<next-notice-date></next-notice-date>' +
				   '<notice-issue-email></notice-issue-email>' +
				   '<isp>' +
				     '<isp-name></isp-name>' +
				     '<isp-location></isp-location>' +
				     '<isp-country></isp-country>' +
				   '</isp>' +
				   '</notice>' +
				   hitsSegment +
				   '</hits>';

			   //call NDI C&D HTTP service to upload hits to iaps
			   //request url
			   var request	   = 'http://'+iapshost+'/iaps-NoticesCall/callProcedure';
			   console.log('Log:iapsUpload - request: ' + request);
			   console.log('Log:iapsUpload - iapsXml: ' + iapsXml);

			   // $http.post(request, JSON.stringify(iapsXml))
			   $http.post(request, iapsXml)
				   .success(function(dataxml){
					   //extract notice id
					   console.log('Log:iapsUpload - Http Request Success');
					   console.log('Log:iapsUpload - Check returned status');
					   console.log('log:iapsUpload Success - Data: ' + dataxml);
					   console.log('log:iapsUpload ResponseXML - Data: ' + dataxml.responseXML);
					   console.log('log:iapsUpload ResponseXML - Data: ' + dataxml.responseText);

					   //extract the Notice Id
					   //var noticeId = '1111111';  //testing
					   var $xml = $(dataxml);
					   var status = $xml.find('status').first().text();
					   var detail = $xml.find('detail').first().text();
					   var noticeId = $xml.find('noticeId').first().text();
					   console.log('log:iapsUpload status:' + status + '  detail:' + detail + '  Notice Id:' + noticeId);

					   if (detail == 'SUCCESS') {
						   //alert('Successfully uploaded new infringing records to IAPS. \n\nNoticeId: ' + noticeId);
						   console.log('Successfully uploaded new infringing records to IAPS. NoticeId: ' + noticeId);

						   store.noticeid = noticeId;
						   store.uploadmessagetype = 1;  //success
					   }
					   else {
						   //alert('Error uploaded new infringing records to IAPS. \n\nError: ' + status);
						   console.log('Error uploaded new infringing records to IAPS. Error: ' + status);
						   store.uploadmessagetype = 2;  //error
					   }

					   // update the mongo database supervisor field to indicate has been submitted.
					   $.each(data, function(index2, obj2) {

						   //put request for each record.  cf save
						   var productId = obj2._id;
						   delete obj2._id;
						   obj2.supervised['iaps-uploaded'] = store.noticeid;
						   //request url
						   var request = 'http://' + host + ':' + port + '/' + database + '/fingerprinting/' + productId;

						   console.log('Log:iapsUpdate - request: ' + request);
						   console.log('test--- Mongo record is now:  ' + JSON.stringify(obj2));

						   $http.put(request, JSON.stringify(obj2))
							   .success(function() {
								   console.log('Log:iapsUpdate - updated Mongo record success - iaps processed - productId:' + productId);

								   if (index2 == data.length -1) {
									   refreshDashboard(store);
								   }
							   });
					   });

				   })
				   .error(function(data){
					   //alert('Failure calling IAPS Upload Service.' );
					   store.uploadmessagetype = 4;  //error
					   console.log('Log:iapsUpload - Http Request Error');
					   console.log('log:iapsUpload Error - Data: ' + data);
				   });

		   })  //success - retrieve data from Mongo
	   	    .error(function(data) {
			   //alert('Error retrieving supervised records.' );
			   store.uploadmessagetype = 5;  //error
		       //output all json array for initial testing
		       console.log('Log:iapsUpload - Error retrieving Mongo Data: ' + JSON.stringify(data));
	        });

	}; //this.iapsUpload


});
 
