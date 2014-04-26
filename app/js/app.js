var teamViewerApp = angular.module('teamViewerApp', ['flash']);

teamViewerApp.constant('GITHUB_URI', {
  organizations: 'https://api.github.com/orgs/',
  users: 'https://api.github.com/users/'
});
