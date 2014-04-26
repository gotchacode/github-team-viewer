angular.module('teamViewerApp')

.factory('$gitHubInteractor', ["$http", "GITHUB_URI",

  function($http, GITHUB_URI){
    return {
      isOrganization: function(organization){
        return $http.get(GITHUB_URI.organizations + organization) 
      },
      getOrganization: function(organization){
        return $http.jsonp(GITHUB_URI.organizations + organization + "/members?callback=JSON_CALLBACK")
      },
      getUser: function(user){
        return $http.jsonp(GITHUB_URI.users + user + "?callback=JSON_CALLBACK")
      },
      getUserRepos: function(user){
        return $http.jsonp(GITHUB_URI.users + user + "/repos?callback=JSON_CALLBACK")
      }     
    }
  }
])

.factory('organizationModel', ['$gitHubInteractor', function($gitHubInteractor){
    function Organization(){
      this.list = []
      this.invalidList = []

      var _class = this;

      _class.addToList = function(organizationName, result){
        _class.list[organizationName] = result
      }

      _class.addToInvalidList = function(organizationName){
        _class.invalidList[organizationName] = true
      }   

      _class.findOrganization = function(organization, orgFoundHandler, orgDataFoundHandler, invalidOrgHandler, errorHandler){

        if( _class.invalidList[organization] ){
          invalidOrgHandler(organization)
          return
        }

        if( !_.isEmpty( _class.list[organization]) ){
          orgDataFoundHandler(_class.list[organization])
          return
        }
        else{

          var isInvalidOrganization = function(data){
            return data.message == 'Not Found'
          }

          var onGetOrganizationSuccess = function(data, status){
            _class.addToList(organization, data)
            orgDataFoundHandler(data, status)
          }

          var onFatal = function(data, status){
            if( isInvalidOrganization(data) ){
              invalidOrgHandler(organization)
              _class.addToInvalidList(organization)
              return
            }
            errorHandler(data, status)
          }

          var onIsOrganizationSuccess = function(data, status){
            $gitHubInteractor
              .getOrganization(organization)
              .success(onGetOrganizationSuccess)
              .error(onFatal)
            orgFoundHandler(organization)
          }       


          $gitHubInteractor
            .isOrganization(organization)
            .success(onIsOrganizationSuccess)
            .error(onFatal)
        }
      }
    }

    return Organization
  }
])


.factory('userModel', ['$gitHubInteractor', function($gitHubInteractor){
    function User(){
      this.list = []
      this.repos = []

      var _class = this;

      _class.addToUserList = function(user, data){
        _class.list[user] = data
      }

      _class.addToRepoList = function(user, data){
        _class.repos[user] = data
      }

      _class.findUser = function(user, userFoundHandler){
        if( !_.isEmpty(_class.list[user]) ){
          userFoundHandler(_class.list[user])
          return;
        }

        var onGetUserSuccess = function(data){
          _class.addToUserList(user, data)
          userFoundHandler(data)
        }

        $gitHubInteractor
            .getUser(user)
            .success(onGetUserSuccess)
      }

      _class.findProjects = function(user, userFoundHandler, errorHandler){
        if( !_.isEmpty(_class.repos[user]) ){
          userFoundHandler(_class.repos[user])
          return;
        }

        var onGetUserReposSuccess = function(data){
          _class.addToRepoList(user, data)
          userFoundHandler(data)
        }

        $gitHubInteractor
            .getUserRepos(user)
            .success(onGetUserReposSuccess)
            .error(errorHandler)
      }
    }

    return User;
  }
])