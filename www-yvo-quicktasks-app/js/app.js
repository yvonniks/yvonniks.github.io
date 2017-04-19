(function(){
	'use strict';
	var myApp = angular.module('quickTasksApp', [ 'onsen.directives','ui.bootstrap']);
		myApp.directive('ngEnter', function() {
	        return function(scope, element, attrs) {
	            element.bind("keydown keypress", function(event) {
	                if(event.which === 13) {
	                    scope.$apply(function(){
	                        scope.$eval(attrs.ngEnter, {'event': event});
	                    });

	                    event.preventDefault();
	                }
	            });
	        };
    	});
		myApp.directive('autoFocus', function($timeout) {
		    return {
		        restrict: 'AC',
		        link: function(_scope, _element) {
		            $timeout(function(){
		                _element[0].focus();
		            }, 0);
		        }
		    };
		});

		myApp.factory('API', function ($rootScope, $http, $window) {
			var base = "http://localhost:9804";
			base = "http://quicktasksapp.herokuapp.com/";
	        $rootScope.show = function (text) {
	            console.log("rootscope show");
	        };

	        $rootScope.hide = function () {
	            console.log("rootscope hide");
	        };

	        $rootScope.logout = function () {
	            $rootScope.setToken("");
	            myNavigator.resetToPage("index.html",{ animation: "fade" })
	        };
	        $rootScope.notify =function(text){
	            $rootScope.show(text);
	            $window.setTimeout(function () {
	              $rootScope.hide();
	            }, 1999);
	        };

	        $rootScope.doRefresh = function (tab) {
	            if(tab == 1)
	                $rootScope.$broadcast('fetchAll');
	            else
	                $rootScope.$broadcast('fetchCompleted');

	            $rootScope.$broadcast('scroll.refreshComplete');
	        };

	        $rootScope.setToken = function (token) {
	            return $window.localStorage.token = token;
	        }

	        $rootScope.getToken = function () {
	            return $window.localStorage.token;
	        }

	        $rootScope.setRequestParam = function(paramName, paramValue) {
	        	return $window.localStorage[paramName] = paramValue;
	        }

	        $rootScope.getRequestParam = function(paramName) {
	        	return $window.localStorage[paramName];
	        }

	        $rootScope.isSessionActive = function () {
	            return $window.localStorage.token ? true : false;
	        }
			return {
				signin: function (form) {
					return $http.post(base+'/api/v1/quicktasks/auth/login', form);
				},
				signup: function (form) {
					return $http.post(base+'/api/v1/quicktasks/auth/register', form);
				},
				getAll: function (email) {
					return $http.get(base+'/api/v1/quicktasks/data/list', {
					method: 'GET',
					params: {
						token: email
						}
					});
				},
				getOne: function (id, email) {
					return $http.get(base+'/api/v1/quicktasks/data/item/' + id, {
					method: 'GET',
					params: {
						token: email
						}
					});
				},
				saveItem: function (form, email) {
					return $http.post(base+'/api/v1/quicktasks/data/item', form, {
					method: 'POST',
					params: {
						token: email
						}
					});
				},
				putItem: function (id, form, email) {
					return $http.put(base+'/api/v1/quicktasks/data/item/' + id, form, {
					method: 'PUT',
					params: {
						token: email
						}
					});
				},
				deleteItem: function (id, email) {
					return $http.delete(base+'/api/v1/quicktasks/data/item/' + id, {
					method: 'DELETE',
					params: {
						token: email
						}
					});
				},

				searchProviders: function (params) {
					return $http.get(base+'/api/v1/quicktasks/search/providers', {
					method: 'GET',
					params: {
						term: params.term,
						location: params.location
						}
					});
				},
				searchProvidersByGeo: function (params) {
					return $http.get(base+'/api/v1/quicktasks/search/providers/geo', {
					method: 'GET',
					params: {
						term: params.term,
						ll: params.ll
						}
					});
				},
				searchCustomers: function (params) {
					return $http.get(base+'/api/v1/quicktasks/search/customers', {
					method: 'GET',
					params: {
						term: params.term,
						location: params.location
						}
					});
				},
				sendSMS: function (params) {
					return $http.get(base+'/api/v1/quicktasks/contact/sendSMS', {
					method: 'GET',
					params: {
						customerRequest: params.innerHTML
						}
					});
				},
				sendSMSY: function (params) {
					return $http.get(base+'/api/v1/quicktasks/contact/sendSMSY', {
					method: 'GET',
					params: {

						}
					});
				},
				sendEmail: function (params) {
					return $http.get(base+'/api/v1/quicktasks/contact/sendEmail', {
					method: 'GET',
					params: {
						innerHTML: params.innerHTML
						}
					});
				}
			};
		});

		myApp.controller('WelcomeForkController',  function ($rootScope, $scope ) {
			var options = $scope.myNavigator.getCurrentPage().options;

			$scope.selected = undefined;
			$scope.states = ['Plumber', 'Contractor', 'Caterer', 'Cleaning Service', 'Manicures'];
			// Any function returning a promise object can be used to load values asynchronously
			$scope.data = {
				searchParam: $rootScope.getRequestParam("searchParam")
			};

			$scope.getLocation = function(val) {
				return $http.get('http://maps.googleapis.com/maps/api/geocode/json', {
					params: {
							address: val,
						sensor: false
					}
					}).then(function(res){
					var addresses = [];
						angular.forEach(res.data.results, function(item){
						addresses.push(item.formatted_address);
					});
					return addresses;
				});
			};
			$scope.submit = function(){
				$rootScope.setRequestParam("searchParam", this.data.searchParam);
				myNavigator.pushPage('location.html');
			};

			$scope.cancelRequest = function(){
				mixpanel.track("Dropped off at \"Service Category Page\"");
				myNavigator.popPage();
			};

		});
		myApp.controller('LocationController',  function ($rootScope, $scope) {
			$scope.cancelRequest = function(){
				mixpanel.track("Dropped off at \"Location Page\"");
			};

			var options = $scope.myNavigator.getCurrentPage().options;
			$scope.data = {
				locationParam: $rootScope.getRequestParam("locationParam")
			};
			$scope.submit = function(){
				$rootScope.setRequestParam("locationParam", this.data.locationParam);
				myNavigator.pushPage('time.html');
			};
		});
		myApp.controller('ScheduleController',  function ($rootScope, $scope) {
			$scope.cancelRequest = function(){
				mixpanel.track("Dropped off at \"Scheduler Page\"");

			};
			var options = $scope.myNavigator.getCurrentPage().options;
			$scope.data = {
				dateParam: $rootScope.getRequestParam("dateParam"),
				timeParam: $rootScope.getRequestParam("timeParam")
			};
			$scope.submit = function(){
				$rootScope.setRequestParam("dateParam", this.data.dateParam);
				$rootScope.setRequestParam("timeParam", this.data.timeParam);
				myNavigator.pushPage('description.html');
			};

		});
		myApp.controller('DescriptionController',  function ($rootScope, $scope) {
			$scope.cancelRequest = function(){
				mixpanel.track("Dropped off at \"Description Page\"");

			};
			var options = $scope.myNavigator.getCurrentPage().options;
			$scope.data = {
				descParam: $rootScope.getRequestParam("descParam")
			};
			$scope.submit = function(){
				$rootScope.setRequestParam("descParam", this.data.descParam);
				myNavigator.pushPage('contact.html');
			};
		});
		myApp.controller('ContactController',  function ($rootScope, $scope) {
			$scope.cancelRequest = function(){
				mixpanel.track("Dropped off at \"Contact Page\"");

			};
			var options = $scope.myNavigator.getCurrentPage().options;
			$scope.data = {
			    nameParam: $rootScope.getRequestParam("nameParam"),
				emailParam: $rootScope.getRequestParam("emailParam"),
				phoneParam: $rootScope.getRequestParam("phoneParam"),
			};
			$scope.submit = function(){
				$rootScope.setRequestParam("nameParam", this.data.nameParam);
				$rootScope.setRequestParam("emailParam", this.data.emailParam);
				$rootScope.setRequestParam("phoneParam", this.data.phoneParam);
				myNavigator.pushPage('confirmation.html', {hoge: 'hoge'});
			};
		});
		myApp.controller('ConfirmationController',  function ($rootScope, $scope, API, $http) {
			var options = $scope.myNavigator.getCurrentPage().options;
			$scope.data = {
				searchParam : $rootScope.getRequestParam("searchParam"),
				locationParam : $rootScope.getRequestParam("locationParam"),
				dateParam : $rootScope.getRequestParam("dateParam"),
				timeParam : $rootScope.getRequestParam("timeParam"),
				descParam : $rootScope.getRequestParam("descParam"),
				nameParam : $rootScope.getRequestParam("nameParam"),
				emailParam : $rootScope.getRequestParam("emailParam"),
				phoneParam : $rootScope.getRequestParam("phoneParam")
			};


			$scope.list = {};
			$scope.innerHTML = "";

	        API.searchProviders({
	            term: $scope.data.searchParam,
	            location: $scope.data.locationParam
	        }).success(function (data) {
				$scope.list = data.businesses;

		        $scope.customerRequest =
		    	"<p>I am looking for a "+$scope.data.searchParam
		        + " within "+$scope.data.locationParam
		        + " on "+$scope.data.dateParam + " " + $scope.data.timeParam
		        + "</p><p>"+$scope.data.descParam+"</p>"
		        + "<p>Name: "+$scope.data.nameParam+"</p>"
		        + "<p>Email: "+$scope.data.emailParam+"</p>"
		        + "<p>SMS: "+$scope.data.phoneParam+"</p>"


		        $scope.yelpResults = ""
				for(var i=0;i<3;i++) {
					$scope.yelpResults = $scope.yelpResults + "<div>"
					+ "<h3><a href=\""+$scope.list[i].mobile_url+"\" target=\"_blank\">" +$scope.list[i].name+"</a></h3>"
					+ "<div><img src=\""+$scope.list[i].image_url+"\"></div>"
					+ "<p>"+$scope.list[i].location.address[0]+ " " + $scope.list[i].location.city+ " " + $scope.list[i].location.state_code+ " " + $scope.list[0].location.postal_code+"</p>"
					+ "<p>"+$scope.list[i].display_phone+"</p>"

					+ "<img src=\""+$scope.list[i].rating_img_url+"\">"
					+ "<span> "+$scope.list[i].review_count+"  reviews</span>";
					+ "</div>"
				}
				$scope.innerHTML = $scope.customerRequest + $scope.yelpResults;
		        API.sendEmail({
		            innerHTML: $scope.innerHTML
		        }).success(function (data) {
		            console.log("Email Sent");
		        }).error(function (error) {
		            console.log(innerHTML);
		        });

		        API.sendSMS({
		            customerRequest: $scope.customerRequest
		        }).success(function (data) {
		        	console.log("sms sent");
		        }).error(function (error) {
		            console.log(error);

		        });
	        }).error(function (error) {
	            console.log(error);
	        });



			$rootScope.setRequestParam("searchParam", "");
			$rootScope.setRequestParam("locationParam", "");
			$rootScope.setRequestParam("dateParam", "");
			$rootScope.setRequestParam("timeParam", "");
			$rootScope.setRequestParam("descParam", "");
			$rootScope.setRequestParam("nameParam", "");
			$rootScope.setRequestParam("emailParam", "");
			$rootScope.setRequestParam("phoneParam", "");

		});

		myApp.controller('providerFormController', function ($rootScope, $scope, API, $window) {
			$rootScope.$on('fetchAll', function(){
				API.getAll($rootScope.getToken()).success(function (data, status, headers, config) {
					$scope.data = data[data.length-1];

				if($scope.data.length === 0) {
					$scope.noData = true;
				}
				else {
					$scope.noData = false;
				}

				})
				.error(function (data, status, headers, config) {

				});
			});

		    $rootScope.$broadcast('fetchAll');

			var options = $scope.myNavigator.getCurrentPage().options;

		    $scope.save = function () {
			var yourName = this.data.yourName,
				companyName = this.data.companyName,
				location = this.data.location,
				desc = this.data.desc,
				specialties = this.data.specialties,
				charge = this.data.charge,
				chargeunit = this.data.chargeunit,
				radius = this.data.radius,
				zipcode = this.data.zipcode,
				mon =  this.data.mon,
				tue = this.data.tue,
				wed = this.data.wed,
				thu = this.data.thu,
				fri = this.data.fri,
				sat = this.data.sat,
				su = this.data.su;
	            //if (!companyName) return;


	            var form = {
	                yourName: yourName,
	                companyName: companyName,
	                location: location,
	          		desc: desc,
	                specialties: specialties,
	                charge: charge,
	                chargeunit: chargeunit,
	                radius: radius,
	                zipcode: zipcode,
	                mon: mon,
	                tue: tue,
	                wed: wed,
	                thu: thu,
	                fri: fri,
	                sat: sat,
	                su: su,
	                user: $rootScope.getToken(),
	                created: Date.now(),
	                updated: Date.now()
	            };

            	API.saveItem(form, form.user)
                .success(function (data, status, headers, config) {
                    $rootScope.hide();
                    $rootScope.doRefresh(1);
                    myNavigator.pushPage('serviceProviderProfileView.html', { animation: "lift" })
                })
                .error(function (data, status, headers, config) {
                    $rootScope.hide();
                    $rootScope.notify("Oops something went wrong!! Please try again later");
                });

		    };

		});
		myApp.controller('providerViewController', function ($rootScope, $scope, API, $window) {
		    $rootScope.$on('fetchAll', function(){
		        API.getAll($rootScope.getToken()).success(function (data, status, headers, config) {
	                $rootScope.show("Please wait... Processing");

	                $scope.item = data[data.length-1];


	                $scope.list = [];
	                for (var i = 0; i < data.length; i++) {
	                    if (data[i].isCompleted === false) {
	                        $scope.list.push(data[i]);
	                    }
	                }
	                if($scope.list.length === 0) {
	                    $scope.noData = true;
	                }
	                else {
	                    $scope.noData = false;
	                }

	           		$rootScope.hide();
		        })
		        .error(function (data, status, headers, config) {
		            $rootScope.hide();
		            $rootScope.notify("Oops something went wrong!! Please try again later");
		        });
		    });

		    $rootScope.$broadcast('fetchAll');

		});
		myApp.controller('WelcomePageController', function ($rootScope, $scope, API, $window) {
			$scope.submit = function(){
				mixpanel.track("Welcome Page");
				myNavigator.pushPage('welcomeFork.html');
			};


		    $scope.user = {
		        email: "",
		        password: ""

		    };


		    $scope.validateUser = function () {
		        var email = this.user.email;
		        var password = this.user.password;

		        email = "John@intuit.com",
		        password = "test";

		        if(!email || !password) {
		            $rootScope.notify("Please enter valid credentials");
		            return false;
		        }
		        $rootScope.show('Please wait.. Authenticating');
		        API.signin({
		            email: email,
		            password: password
		        }).success(function (data) {
		            $rootScope.setToken(email); // create a session kind of thing on the client side
		            $rootScope.hide();
		            myNavigator.pushPage('welcomeFork.html', {hoge: 'hoge'})
		        }).error(function (error) {
		            console.log(error);
		            $rootScope.hide();
		            $rootScope.notify("Invalid Username or password");
		        });
		    };

		    $scope.createUser = function () {
		        var email = this.user.email;
		        var password = this.user.password;
		        var uName = this.user.name;
		        if(!email || !password || !uName) {
		            $rootScope.notify("Please enter valid data");
		            return false;
		        }
		        $rootScope.show('Please wait.. Registering');
		        API.signup({
		            email: email,
		            password: password,
		            name: uName
		        }).success(function (data) {
		            $rootScope.setToken(email); // create a session kind of thing on the client side
		            $rootScope.hide();
		            myNavigator.pushPage('welcomeFork.html', {hoge: 'hoge'})
		        }).error(function (error) {
		            $rootScope.hide();
		            if(error.error && error.error.code == 11000)
		            {
		                $rootScope.notify("A user with this email already exists");
		            }
		            else
		            {
		                $rootScope.notify("Oops something went wrong, Please try again!");
		            }

		        });
		    };

		});
		myApp.controller('CustomerSearchController', function ($rootScope, $scope, API, $window) {


		});
		myApp.controller('CustomerRequestViewController', function ($rootScope, $scope, API, $window) {


		});


})();
