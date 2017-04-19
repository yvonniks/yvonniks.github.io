angular.module('quickTasks.controllers', ['quickTasks.services'])
.controller('LoadingCtrl', function($scope, $ionicLoading) {
  $scope.show = function() {
    $ionicLoading.show({
      template: 'Loading...'
    });
  };
  $scope.hide = function(){
    $ionicLoading.hide();
  };
})
.controller('MapCtrl', function($scope) {

  $scope.map = {
    center: {
        latitude: 45,
        longitude: -73
    },
    zoom: 8
    };

  $scope.centerMap = function () {
    if (!$scope.map) {
      return;
    }

    navigator.geolocation.getCurrentPosition(function (pos) {
      //console.log('Got pos', pos.coords.latitude, ", ", pos.coords.longitude); // ok
      //$scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));     // does not work
      //$scope.map.control.refresh({latitude: pos.coords.latitude, longitude: pos.coords.longitude});   // does not work

    }, function (error) {
      alert('Unable to get location: ' + error.message);
    });
  };
})
.controller('SignInCtrl', function ($rootScope, $scope, API, $window) {
    // if the user is already logged in, take him to his bucketlist
    if ($rootScope.isSessionActive()) {
        $window.location.href = ('#/provider/profile');
    }

    $scope.user = {
        email: "",
        password: ""
    };

    $scope.validateUser = function () {
        var email = this.user.email;
        var password = this.user.password;
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
            $window.location.href = ('#/provider/profile');
        }).error(function (error) {
            console.log(error);
            $rootScope.hide();
            $rootScope.notify("Invalid Username or password");
        });
    };

})

.controller('SignUpCtrl', function ($rootScope, $scope, API, $window) {
    $scope.user = {
        email: "",
        password: "",
        name: ""
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
            $window.location.href = ('#/provider/profile');
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
})
.controller('searchCustomersCtrl', function ($rootScope, $scope, API, $window, $timeout) {
    // Setup the loader
    $scope.hideLoader=false;

    // Set a timeout to clear loader, however you would actually call the $ionicLoading.hide(); method whenever everything is ready or loaded.
    $timeout(function () {

        $scope.hideLoader=true;
        $scope.list = data.customers;


    }, 2200);

    var data = {
        "customers":[
            {
                "name": "Zac E.",
                "image_url": "img/photos/zac-efron.png",
                "request_desc": "Pipe Repair or Replacement Needed!"
            },
            {
                "name": "Bruno M.",
                "image_url": "img/photos/bruno-mars.png",
                "request_desc": "Sink has a leak"
            },
            {
                "name": "Ryan R.",
                "image_url": "img/photos/ryan-reynolds.png",
                "request_desc": "Clogged kitchen sink"
            },
            {
                "name": "Kristen B.",
                "image_url": "img/photos/kristen-bell.png",
                "request_desc": "Dishwasher has sprung a leak"
            }
        ]
    };

    console.log($scope.data);
})
.controller('customerRequestCtrl', function ($rootScope, $scope, API, $window) {
    var data =
            {
                "customer_name": "Zac E",
                "location": "San Jose, CA",
                "request_desc": "Pipe Repair or Replacement Needed!",
                "request_details": "We have a leaky faucet that we need repaired. It may need to be replaced. Need immediate service!"
            };
    $scope.data = data;
})

.controller('connectMessageCtrl', function ($rootScope, $scope, API, $window) {
    console.log("connect message");
})

.controller('searchProvidersCtrl', function ($rootScope, $scope, API, $window) {
    var latitude, longitude, output = document.getElementById("out");

    if (!navigator.geolocation){
        output.innerHTML = "<p>Geolocation is not supported by your browser</p>";
        return;
    }

    function success(position) {
        latitude  = position.coords.latitude;
        longitude = position.coords.longitude;

        API.searchProvidersByGeo({
            term: "painting",
            ll: latitude+","+longitude
        }).success(function (data) {
            $scope.list = data.businesses;
            console.log($scope.list);
        }).error(function (error) {
            console.log("error");
        });
    }

    function error() {
        API.searchProviders({
            term: "plumber",
            location: "90026"
        }).success(function (data) {
            $scope.list = data.businesses;
            console.log($scope.list);
        }).error(function (error) {
            console.log("error");
        });
    }

    navigator.geolocation.getCurrentPosition(success, error);
})
.controller('profileForkCtrl', function ($rootScope, $scope, API, $timeout, $ionicModal, $window) {
    console.log("test");
    $rootScope.$on('fetchAll', function(){
            API.getAll($rootScope.getToken()).success(function (data, status, headers, config) {
                $rootScope.show("Please wait... Processing");
                $scope.list = [];
                for (var i = 0; i < data.length; i++) {
                    if (data[i].isCompleted === false) {
                        $scope.list.push(data[i]);
                    }
                }
                if($scope.list.length !== 0)
                {
                    $window.location.href = ('#/provider/profile');
                }
                else
                {
                    $scope.noData = false;
                }

            $rootScope.hide();
        }).error(function (data, status, headers, config) {
            $rootScope.hide();
            $rootScope.notify("Oops something went wrong!! Please try again later");
        });
    });
    $rootScope.$broadcast('fetchAll');

})
.controller('profileCtrl', function ($rootScope, $scope, API, $timeout, $ionicModal, $window) {
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
                if($scope.list.length === 0)
                {
                    $scope.noData = true;
                }
                else
                {
                    $scope.noData = false;
                }

                $ionicModal.fromTemplateUrl('templates/createProfile.html', function (modal) {
                    $scope.newTemplate = modal;
                });
                $ionicModal.fromTemplateUrl('templates/updateProfile.html', function (modal) {
                    $scope.updateProfileTemplate = modal;
                },
                {
                 // Use our scope for the scope of the modal to keep it simple
                 scope: $scope
            });

            $scope.createProviderProfile = function () {
                $scope.newTemplate.show();
            };
            $scope.updateProfile = function (id) {
                $scope.updateProfileTemplate.show();
            };
            $rootScope.hide();
        }).error(function (data, status, headers, config) {
            $rootScope.hide();
            $rootScope.notify("Oops something went wrong!! Please try again later");
        });
    });

    $rootScope.$broadcast('fetchAll');


    $scope.markCompleted = function (id) {
        $rootScope.show("Please wait... Updating List");
        API.putItem(id, {
            isCompleted: true
        }, $rootScope.getToken())
            .success(function (data, status, headers, config) {
                $rootScope.hide();
                $rootScope.doRefresh(1);
            }).error(function (data, status, headers, config) {
                $rootScope.hide();
                $rootScope.notify("Oops something went wrong!! Please try again later");
            });
    };



    $scope.deleteItem = function (id) {
        $rootScope.show("Please wait... Deleting from List");
        API.deleteItem(id, $rootScope.getToken())
            .success(function (data, status, headers, config) {
                $rootScope.hide();
                $rootScope.doRefresh(1);
            }).error(function (data, status, headers, config) {
                $rootScope.hide();
                $rootScope.notify("Oops something went wrong!! Please try again later");
            });
    };

})

.controller('completedCtrl', function ($rootScope,$scope, API, $window) {
        $rootScope.$on('fetchCompleted', function () {
            API.getAll($rootScope.getToken()).success(function (data, status, headers, config) {
                $scope.list = [];
                for (var i = 0; i < data.length; i++) {
                    if (data[i].isCompleted === true) {
                        $scope.list.push(data[i]);
                    }
                }
                if(data.length > 0 & $scope.list.length === 0)
                {
                    $scope.incomplete = true;
                }
                else
                {
                    $scope.incomplete= false;
                }

                if(data.length === 0)
                {
                    $scope.noData = true;
                }
                else
                {
                    $scope.noData = false;
                }
                console.log($scope.noData);
            }).error(function (data, status, headers, config) {
                $rootScope.notify("Oops something went wrong!! Please try again later");
            });

        });

        $rootScope.$broadcast('fetchCompleted');
        $scope.deleteItem = function (id) {
            $rootScope.show("Please wait... Deleting from List");
            API.deleteItem(id, $rootScope.getToken())
                .success(function (data, status, headers, config) {
                    $rootScope.hide();
                    $rootScope.doRefresh(2);
                }).error(function (data, status, headers, config) {
                    $rootScope.hide();
                    $rootScope.notify("Oops something went wrong!! Please try again later");
                });
        };
    })
.controller('updateProfileCtrl', function ($rootScope, $scope, API, $window) {
        $scope.data = $scope.list[0];


        $scope.close = function () {
            $scope.updateProfileTemplate.hide();
        };


        $scope.update = function (id) {
            var yourName = this.data.yourName,
                companyName = this.data.companyName,
                location = this.data.location,
                description = this.data.description,
                tags = this.data.tags,
                tocharge = this.data.tocharge,
                chargeunit = this.data.chargeunit,
                range = this.data.range,
                zipcode = this.data.zipcode,
                monHours = this.data.monHours,
                tueHours = this.data.tueHours,
                wedHours = this.data.wedHours,
                thuHours = this.data.thuHours,
                friHours = this.data.friHours,
                satHours = this.data.satHours,
                sunHours = this.data.sunHours;
            if (!companyName) return;

            $scope.updateProfileTemplate.hide();
            $rootScope.show();

            $rootScope.show("Please wait... updating profile");

            API.putItem(id, {
                yourName: yourName,
                companyName: companyName,
                location: location,
                description: description,
                tags: tags,
                tocharge: tocharge,
                chargeunit: chargeunit,
                range: range,
                zipcode: zipcode,
                monHours: monHours,
                tueHours: tueHours,
                wedHours: wedHours,
                thuHours: thuHours,
                friHours: friHours,
                satHours: satHours,
                sunHours: sunHours,
                isCompleted: false,
                user: $rootScope.getToken(),
                updated: Date.now()
            }, $rootScope.getToken())
                .success(function (data, status, headers, config) {
                    $rootScope.hide();
                    $rootScope.doRefresh(1);
                }).error(function (data, status, headers, config) {
                    $rootScope.hide();
                    $rootScope.notify("Oops something went wrong!! Please try again later");
                });
        };

        $scope.searchCustomers =  function() {

        };
    })
.controller('newCtrl', function ($rootScope, $scope, API, $window) {
        $scope.data = {
            yourName:"",
            companyName: "",
            location: "",
            description: "",
            tags: "",
            tocharge: "",
            chargeunit: "",
            range: "",
            zipcode:"",
            monHours:"",
            tueHours:"",
            wedHours:"",
            thuHours:"",
            friHours:"",
            satHours:"",
        };

        $scope.close = function () {
            $scope.modal.hide();
        };

        $scope.create = function () {
            var yourName = this.data.yourName,
                companyName = this.data.companyName,
                location = this.data.location,
                description = this.data.description,
                tags = this.data.tags,
                tocharge = this.data.tocharge,
                chargeunit = this.data.chargeunit,
                range = this.data.range,
                zipcode = this.data.zipcode,
                monHours = this.data.monHours,
                tueHours = this.data.tueHours,
                wedHours = this.data.wedHours,
                thuHours = this.data.thuHours,
                friHours = this.data.friHours,
                satHours = this.data.satHours,
                sunHours = this.data.sunHours;
            if (!companyName) return;
            $scope.modal.hide();
            $rootScope.show();

            $rootScope.show("Please wait... Creating new");

            var form = {
                yourName: yourName,
                companyName: companyName,
                location: location,
                description: description,
                tags:tags,
                tocharge:tocharge,
                chargeunit:chargeunit,
                range: range,
                zipcode: zipcode,
                monHours: monHours,
                tueHours: tueHours,
                wedHours: wedHours,
                thuHours: thuHours,
                friHours: friHours,
                satHours: satHours,
                sunHours: sunHours,
                isCompleted: false,
                user: $rootScope.getToken(),
                created: Date.now(),
                updated: Date.now()
            };

            API.saveItem(form, form.user)
                .success(function (data, status, headers, config) {
                    $rootScope.hide();
                    $rootScope.doRefresh(1);
                })
                .error(function (data, status, headers, config) {
                    $rootScope.hide();
                    $rootScope.notify("Oops something went wrong!! Please try again later");
                });
        };
    });