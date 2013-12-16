var myApp = angular.module('myApp',[]).service('UserService',['$rootScope', function($rootScope) {
	  return {
      login:false,
      add: function(item) {
        this.login= item;
        $rootScope.$broadcast('UserService.update',this.login );
      }
   };
}]);
       
    

myApp.config(['$routeProvider', function($routeProvider) {
  if(sessionStorage.login){
  window.location.hash='/list';
  }else{
  	window.location.hash='/';
  }
  $routeProvider.
      when('/', {templateUrl: 'assets/tpl/login.html', controller: LoginCtrl}).
      when('/list', {templateUrl: 'assets/tpl/lists.html', controller: ListCtrl}).
      when('/add-user', {templateUrl: 'assets/tpl/add-new.html', controller: AddCtrl}).
      when('/edit/:id', {templateUrl: 'assets/tpl/edit.html', controller: EditCtrl}).
      otherwise({redirectTo: '/'});
}]).run( function($rootScope, $location) {
    $rootScope.$on("$routeChangeStart", function(event, next, current) {
      if (!sessionStorage.login) {
        if ( next.templateUrl == "assets/tpl/login.html" ) {
        } else {
          $location.path( "/" );
        }
      }         
    });
 });
 
 
function MyCtrl($scope,$location,UserService) {
 	 $scope.activePath = null;
  	 $scope.userlogin =UserService.login;
	 
	 $scope.username ="sdsd";
	 
	 $scope.logout = function() {
	 UserService.add(false);
	 
  	 sessionStorage.clear();
	 setTimeout(function(){
	 	 $location.path('/'); 
	 },200)
  	
	};
	
	$scope.$on('UserService.update', function(event,login ) {
     $scope.userlogin = login;
   });
}

function ListCtrl($scope,$http,$location) {
  $scope.activePath = null;
  $http.get('api/users').success(function(data) {
    $scope.users = data;
  });
  
    $scope.del = function(user) {
    console.log(user);

    var deleteU = confirm('Are you absolutely sure you want to delete?');
    if (deleteU){
      $http.delete('api/users/'+user.id).success(function(data) {
	   $scope.users = data;
      });
    }
  };
  
  
}
function LoginCtrl($scope, $http,$location,UserService) {
    $scope.activePath = null;
	$scope.logerror=false;
    $scope.loginuser = function(login) {
    $http.post('api/login',login).success(function(data) {
	if(data!=''){
	if(data[0].id!=undefined)
	{
	UserService.add(true);
	sessionStorage.id=data[0].id;
	sessionStorage.username=data[0].username;
	sessionStorage.login=true;
	$scope.activePath = $location.path('/list');
	}else{
		$scope.logerror=true;
	}
	}else{
		$scope.logerror=true;
	}
  });
  };
}


function AddCtrl($scope, $http, $location) {
  $scope.master = {};
  $scope.activePath = null;

  $scope.add_new = function(user, AddNewForm) {

    $http.post('api/add_user', user).success(function(){
      $scope.reset();
      $scope.activePath = $location.path('/list');
    });

    $scope.reset = function() {
      $scope.user = angular.copy($scope.master);
    };

    $scope.reset();

  };
}

function EditCtrl($scope, $http, $location, $routeParams) {
  var id = $routeParams.id;
  $scope.activePath = null;

  $http.get('api/users/'+id).success(function(data) {
    $scope.users = data;
  });

  $scope.update = function(user){
    $http.put('api/users/'+id, user).success(function(data) {
      $scope.users = data;
      $scope.activePath = $location.path('/list');
    });
  };

  $scope.delete = function(user) {
    console.log(user);

    var deleteUser = confirm('Are you absolutely sure you want to delete?');
    if (deleteUser) {
      $http.delete('api/users/'+user.id);
      $scope.activePath = $location.path('/list');
    }
  };
}