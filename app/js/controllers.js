/* Controllers */
/**/
function AppCtrl($scope, $http, $log, flash, CollectionHandler, xhrStateHandler) {

  var resetExcept = function (exceptions) {
    _.each(["User","Organization","Project"], function(attr){
      if( !_.contains(exceptions, attr)) {
        $scope[attr].resetCurrent();
      }
    });
  },
  fatalConnection = function(data, status){
    $scope.xhrState.fatal();
    $log.log("Oops Something went wrong!");
    $log.log(data);
    $log.log(status);
  },
  getMembers,
  getUser,
  getRepos;

  // Define Properties on the scope
  var defineScope = function() {
    $scope.xhrState = new xhrStateHandler();
    $scope.xhrState.setAllMessages(["Intializing","Fetching Data","Loading Data","Fetched","Retry","Fatal"]);
    $scope.xhrState.idle();

    $scope.organization = 'github';

    $scope.Organization = new CollectionHandler('getOrganization');
    $scope.User = new CollectionHandler('getUser');
    $scope.Project = new CollectionHandler('getUserRepos');

    // Functions
    $scope.getMembers = getMembers;
    $scope.getUser = getUser;
    $scope.getRepos = getRepos;

    resetExcept(null);
  };

  // get members of the organization
  getMembers = function (organization) {
    $scope.xhrState.initiate();
    resetExcept(null);

    // check if the entered value is org or not!
    $log.log("Getting " + organization + ", for you, hold tight!");

    var organizationInvalid = function(organization){
      $scope.xhrState.error();
      flash('error', 'Please enter correct Organization name');
    };

    var organizationDetailFound = function(data){
      $scope.xhrState.success();
      flash('success', 'Organization information loaded', 200);
    };

    $scope.Organization.findObject(organization, organizationDetailFound, organizationInvalid, fatalConnection);
  };

  // get user's detail
  getUser = function (user) {
    $scope.xhrState.initiate();
    resetExcept(["Organization"]);

    $log.log("Getting " + user + "'s data.");

    var onUserFound = function(data){
      $scope.xhrState.success();
      flash('success', 'User information loaded', 200);
    };

    $scope.User.findObject(user, onUserFound, null, fatalConnection);
  };

  // get user's repo
  getRepos = function (user) {
    $scope.xhrState.initiate();
    resetExcept(["User", "Organization"]);    

    $log.log("Fetching projects of " + user);

    var onProjectsFound = function(data){
      $scope.xhrState.success();
      flash('success', 'Project information loaded', 200);
    };

    $scope.Project.findObject(user, onProjectsFound, null, fatalConnection);
  };

  defineScope();
}
//MyCtrl1.$inject = [];