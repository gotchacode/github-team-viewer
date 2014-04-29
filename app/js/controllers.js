/* Controllers */
/**/
function AppCtrl($scope, $http, $log, flash, Collection) {

  var resetExcept = function (exceptions) {
    _.each(["User","Organization","Project"], function(attr){
      if( !_.contains(exceptions, attr)) {
        $scope[attr].resetCurrent();
      }
    });
  },
  fatalConnection = function(data, status){
    $log.log("Oops Something went wrong!");
    $log.log(data);
    $log.log(status);
  },
  getMembers,
  getUser,
  getRepos;

  // Define Properties on the scope
  var defineScope = function() {
    $scope.loading = true;
    $scope.finding = false;
    $scope.organization = 'github';

    $scope.Organization = new Collection('getOrganization');
    $scope.User = new Collection('getUser');
    $scope.Project = new Collection('getUserRepos');

    // Functions
    $scope.getMembers = getMembers;
    $scope.getUser = getUser;
    $scope.getRepos = getRepos;

    resetExcept(null);
  };

  // get members of the organization
  getMembers = function (organization) {

    resetExcept(null);

    $scope.company = false;
    // check if the entered value is org or not!
    $log.log("Getting " + organization + ", for you, hold tight!");

    var organizationInvalid = function(organization){
      flash('error', 'Please enter correct Organization name');
    };

    var organizationDetailFound = function(data){
      $scope.loading = false;
      $scope.company = true;
      $scope.finding = true;
      flash('success', 'Organization information loaded', 200);
    };

    $scope.Organization.findObject(organization, organizationDetailFound, organizationInvalid, fatalConnection);
  };

  // get user's detail
  getUser = function (user) {
    resetExcept(["Organization"]);

    $log.log("Getting " + user + "'s data.");

    var onUserFound = function(data){
      $scope.loading = false;
    };

    $scope.User.findObject(user, onUserFound, null, fatalConnection);
  };

  // get user's repo
  getRepos = function (user) {
    resetExcept(["User", "Organization"]);    

    $log.log("Fetching projects of " + user);

    var onProjectsFound = function(data){
    };

    var onFatal = function(data){
      flash('error', 'User does not have any projects!', 200);
    };

    $scope.Project.findObject(user, onProjectsFound, null, fatalConnection);
  };

  defineScope();
}
//MyCtrl1.$inject = [];