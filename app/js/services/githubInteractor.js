angular.module('teamViewerApp')

.factory('$gitHubInteractor', ["$http", "GITHUB_URI",

  function($http, GITHUB_URI){
    return {
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
]);