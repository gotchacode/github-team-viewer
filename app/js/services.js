angular.module('teamViewerApp')

.factory('$gitHubInteractor', ["$http", "GITHUB_ORGANIZATION_URI",

	function($http, GITHUB_ORGANIZATION_URI){
		return {
			isOrganization: function(organization){
				return $http.get(GITHUB_ORGANIZATION_URI + organization)	
			},
			getOrganization: function(organization){
				return $http.jsonp("https://api.github.com/orgs/" + organization + "/members?callback=JSON_CALLBACK")
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