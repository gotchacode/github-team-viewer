/* Controllers */
/**/
function AppCtrl($scope, $http, $log, flash, OrganizationModel, UserModel) {

  var resetExcept = function (exceptions) {
    _.each(["user","members","repos","commits"], function(attr){
      if( !_.contains(exceptions, attr)) {
        $scope[attr] = [];
      }
    });
    $scope.current_member = null;
    $scope.current_repo = null;
  }, 
  getMembers,
  getUser,
  getRepos;

  // Define Properties on the scope
  var defineScope = function() {
    $scope.loading = true;
    $scope.finding = false;
    $scope.organization = 'github';

    $scope.Organization = new OrganizationModel();
    $scope.User = new UserModel();

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

    var organizationFound = function(organization){
      flash('success', 'Organization found, Looking for additional information', 200); 
    };

    var organizationDetailFound = function(data){
      $scope.members = data.data;
      $scope.loading = false;
      $scope.company = true;
      $scope.finding = true;
      flash('success', 'Organization information loaded', 200); 
    };

    var fatalConnection = function(data, status){
      $log.log("Oops Something went wrong!");
      $log.log(data);
      $log.log(status);
    };

    $scope.Organization.findOrganization(organization, organizationFound, organizationDetailFound, organizationInvalid, fatalConnection);
  };

  // get user's detail
  getUser = function (user) { 
    resetExcept(["members"]);

    $scope.current_member = null;
    $scope.current_repo = null;

    $log.log("Getting " + user + "'s data.");

    var onUserFound = function(data){
      $scope.user = data.data;
      $scope.loading = false;
    };

    $scope.User.findUser(user, onUserFound);
  };

  // get user's repo
  getRepos = function (user) {
    resetExcept(["user", "members"]);

    $scope.current_member = null;
    $scope.current_repo = null;

    $log.log("Fetching projects of " + user);

    var onProjectsFound = function(data){
      angular.element('#flash-messages').css('display', 'none');
      $scope.repos = data.data;
    };

    var onFatal = function(data){
      flash('error', 'User does not have any projects!', 200);
    };

    $scope.User.findProjects(user, onProjectsFound, onFatal);
  };

  defineScope();
}
//MyCtrl1.$inject = [];