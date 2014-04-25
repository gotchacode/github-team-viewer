/* Controllers */
function AppCtrl($scope, $http, $log, flash, organizationModel) {
  $scope.loading = true;
  $scope.finding = false;
  $scope.organization = 'github';
  var reset = function () {
    $scope.members = [];
    $scope.repos = [];
    $scope.repos = [];
    $scope.commits = [];
    $scope.current_member = null;
    $scope.current_repo = null;
  };

  $scope.Organization = new organizationModel()

  reset();

  // get members of the organization
  $scope.getMembers = function (organization) {
    reset();
    $scope.company = false;
    // check if the entered value is org or not!
    $log.log("Getting " + organization + ", for you, hold tight!")

    var organizationInvalid = function(organization){
      flash('error', 'Please enter correct Organization name')
    }

    var organizationFound = function(organization){
      flash('success', 'Organization found, Looking for additional information') 
    }

    var organizationDetailFound = function(data){
      $scope.members = data.data;
      $scope.loading = false;
      $scope.finding = true;
      $scope.company = true;
    }

    var fatalConnection = function(data, status){
      console.log(data);
      console.log(status);
    }

    $scope.Organization.findOrganization(organization, organizationFound, organizationDetailFound, organizationInvalid, fatalConnection)
  };

  // get user's detail
  $scope.getUser = function (user) { 
    $scope.user = [];
    $scope.repo = [];
    $scope.repos = [];
    $scope.repos = [];
    $scope.commits = [];
    $scope.current_member = null;
    $scope.current_repo = null;

    $log.log("Getting " + user + "'s data.");
    $http.jsonp("https://api.github.com/users/" + user + "?callback=JSON_CALLBACK").success(function (data) {
      $scope.user = data.data;
      $scope.loading = false;
    });
  };

  // get user's repo
  $scope.getRepos = function (user) {
    $scope.repos = [];
    $scope.repos = [];
    $scope.commits = [];
    $scope.current_member = null;
    $scope.current_repo = null;

    $log.log("Fetching projects of " + user);
    $http.jsonp("https://api.github.com/users/" + user + "/repos?callback=JSON_CALLBACK")
      .success(function (data) {
        angular.element('#flash-messages').css('display', 'none');
        $scope.repos = data.data;
      }).error(function () {
        flash('error', 'User does not have any projects!');
      });
  };
}
//MyCtrl1.$inject = [];
