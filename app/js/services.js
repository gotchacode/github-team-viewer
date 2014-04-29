angular.module('teamViewerApp')

.factory('$gitHubInteractor', ["$http", "GITHUB_URI",

  function($http, GITHUB_URI){
    return {
      isOrganization: function(organization){
        return $http.get(GITHUB_URI.organizations + organization);
      },
      getOrganization: function(organization){
        return $http.jsonp(GITHUB_URI.organizations + organization + "/members?callback=JSON_CALLBACK");
      },
      getUser: function(user){
        return $http.jsonp(GITHUB_URI.users + user + "?callback=JSON_CALLBACK");
      },
      getUserRepos: function(user){
        return $http.jsonp(GITHUB_URI.users + user + "/repos?callback=JSON_CALLBACK");
      }
    };
  }
])

.factory('OrganizationModel', ['$gitHubInteractor', function($gitHubInteractor){
    function Organization(){
      this.list = [];
      this.invalidList = [];

      var self = this;

      self.addToList = function(organizationName, result) {
        self.list[organizationName] = result;
      };

      self.addToInvalidList = function(organizationName) {
        self.invalidList[organizationName] = true;
      };

      self.findOrganization = function(organization, orgFoundHandler, orgDataFoundHandler, invalidOrgHandler, errorHandler) {

        if( self.invalidList[organization] ) {
          invalidOrgHandler(organization);
          return;
        }

        if( !_.isEmpty( self.list[organization]) ) {
          orgDataFoundHandler(self.list[organization]);
          return;
        }
        else {

          var isInvalidOrganization = function(data){
            return data.message === 'Not Found';
          };

          var onGetOrganizationSuccess = function(data, status){
            self.addToList(organization, data);
            orgDataFoundHandler(data, status);
          };

          var onFatal = function(data, status) {
            if (isInvalidOrganization(data)) {
              invalidOrgHandler(organization);
              self.addToInvalidList(organization);
              return;
            }
            errorHandler(data, status);
          };

          var onIsOrganizationSuccess = function(data, status) {
            $gitHubInteractor
              .getOrganization(organization)
              .success(onGetOrganizationSuccess)
              .error(onFatal);
            orgFoundHandler(organization);
          };

          $gitHubInteractor
            .isOrganization(organization)
            .success(onIsOrganizationSuccess)
            .error(onFatal);
        }
      };
    }

    return Organization;
  }
])


.factory('UserModel', ['$gitHubInteractor', function($gitHubInteractor){
    function User(){
      this.list = [];
      this.repos = [];

      var self = this;

      self.addToUserList = function(user, data){
        self.list[user] = data;
      };

      self.addToRepoList = function(user, data){
        self.repos[user] = data;
      };

      self.findUser = function(user, userFoundHandler){
        if( !_.isEmpty(self.list[user]) ) {
          userFoundHandler(self.list[user]);
          return;
        }

        var onGetUserSuccess = function(data){
          self.addToUserList(user, data);
          userFoundHandler(data);
        };

        $gitHubInteractor
          .getUser(user)
          .success(onGetUserSuccess);
      };

      self.findProjects = function(user, userFoundHandler, errorHandler){
        if( !_.isEmpty(self.repos[user]) ){
          userFoundHandler(self.repos[user]);
          return;
        }

        var onGetUserReposSuccess = function(data){
          self.addToRepoList(user, data);
          userFoundHandler(data);
        };

        $gitHubInteractor
          .getUserRepos(user)
          .success(onGetUserReposSuccess)
          .error(errorHandler);
      };
    }

    return User;
  }
]);