angular.module('placement', ['ui.router'])

.config(function($stateProvider, $urlRouterProvider){
    
    
    
    $stateProvider
    .state("login", {
        url: "/",
        templateUrl: 'templates/login.html',
        controller: 'LoginCtrl'
    })
    
    .state("signup", {
        url: "/signup",
        templateUrl: 'templates/signup.html',
        controller: 'SignupCtrl'
    })
    
    .state("home", {
        url: "/home",
        templateUrl: 'templates/home.html',
        params:{data:null},
        controller: 'HomeCtrl'
    })
    
    .state("newuser", {
        url: "/newuser",
        templateUrl: 'templates/create.html',
        controller: 'NewuserCtrl'
    });
    
    $urlRouterProvider.otherwise("/");
})

.controller("LoginCtrl", function($scope,$state){
    console.log("Login State");
    
    $scope.signup = function()
    {
        $state.go("signup");
    }
    
    $scope.signin = function(){
        
        if($scope.login.email && $scope.login.password)
            {
                //$state.go('home', {data:{roll: roll}});
                Stamplay.User.login($scope.login)
                .then(function(user){
                    console.log(user);
                    $state.go("home", { data: user});
                }, function(err){

                })

            }
    }
})

.controller("SignupCtrl", function($scope,$state){
    
    console.log("Signup State");
    
    $scope.Blogin = function()
    {
        $state.go("login");
    }
    
    $scope.submit = function(){
        
        Stamplay.User.signup($scope.register)
        .then(function(res){
        console.log(res);
        //alert("ThankYou For the Registering with us !!!");
        },function(err){
        console.log(err);
      })

    }
})

.controller("HomeCtrl", function($scope,$stateParams,$state){
    
    console.log($stateParams);
    $scope.showForm = false;
    $scope.createNew = true;
    $scope.name = $stateParams.data;
    $scope.buttonText = "Create New User";
    
    console.log("Welcome to Home");
    /*$scope.adduser =  function(){
        
        $state.go("newuser");
        
        
    }*/
    $scope.allContacts = [];
    var getData = function(){
        Stamplay.Object("visitingcard").get({})
        .then(function(res){
            console.log(res);
            $scope.allContacts = res.data;
            $scope.$apply();
        })
    }
    
    getData();
    
    $scope.make = function(){
        console.log("showForm", $scope.showForm);
        
        if($scope.createNew == true){
              Stamplay.Object('visitingcard')
              .save($scope.visitingcard)
              .then(function(res){
                  console.log(res);
                  $scope.showForm = false;
                  getData();
                  $scope.$apply();
              });
              
        }
        else{
            console.log($scope.visitingcard);
            var id = $scope.visitingcard._id;
            
            var newData = {};
            newData.CompanyName = $scope.visitingcard.CompanyName;
            newData.Name =$scope.visitingcard.Name;
            newData.Address1 =$scope.visitingcard.Address1;
            newData.Address2  = $scope.visitingcard.Address2;
            newData.City = $scope.visitingcard.City;
            newData.State = $scope.visitingcard.State;
            newData.Country = $scope.visitingcard.Country;
            newData.Phone = $scope.visitingcard.Phone;
            newData.Mobile = $scope.visitingcard.Mobile;
            
            Stamplay.Object("visitingcard").update(id,newData)
            .then(function(response){
                console.log(response);
                $scope.visitingcard = {};
                $scope.showForm = false;
                $scope.createNew = true;
                $scope.buttonText = "Create New User";
                $scope.$apply();
            }, function(err){
                console.log(err);
            })
        }
    }
      
      
      
      $scope.updatedata = function(con){
            console.log(con);
            $scope.visitingcard = con;
            $scope.showForm = true;
            $scope.createNew = false;
            $scope.buttonText = "Update Data";
            
            /*$scope.saveChanges = function(){
                Stamplay.Object("visitingcard")
                .update(con._id, dinner)
                .then(function(result) {
                  // result is the updated dinner object with the new body value
                }, function(error) {
                  // An error occured in the inside method
                })    
            }*/
         }
         
         $scope.deletedata = function(cn){
             
             
          console.log(cn);
          $scope.visitingcard = cn;
          
          Stamplay.Object("visitingcard")
          .remove($scope.visitingcard.id)
            .then(function(response){
                console.log(response);
                $scope.visitingcard = {};
                getData();
            }, function(err){
                console.log(err);
            })
          
          
      }
      
      $scope.logout = function(){
      Stamplay.User.currentUser().then(function(res){
        console.log(res);
      });

       Stamplay.User.logout(true, function(){
          Stamplay.User.currentUser().then(function(res){
            console.log("After logout",res);
          });
          $state.go('login');    
       });
    
      }
		
    
})
