angular.module('teamViewerApp')

.factory('CollectionHandler', ['$gitHubInteractor', function($gitHubInteractor){
    function Collection(endPoint){
      var self = this;

      self.list = [];
      self.current = [];
      self.invalidList = [];

      self.addToList = function(key, value){
        self.current = self.list[key] = value.data;
      };

      self.addToInvalidList = function(key) {
        self.current = {};
        self.invalidList[key] = true;
      };

      self.currentObjectPresent = function(){
        return !_.isEmpty(self.current);
      };

      self.resetCurrent = function(){
        self.current = {};
      };

      self.findObject = function(name, objDataFoundHandler, invalidObjHandler, errorHandler){
        if( self.invalidList[name] ) {
          invalidObjHandler(name);
          return;
        }

        else if( !_.isEmpty( self.list[name]) ) {
          self.current = self.list[name];
          objDataFoundHandler(self.list[name]);
          return;
        }

        else {
          var isInvalidObject = function(data){
            return data.message === 'Not Found';
          };

          var onGetObjectSuccess = function(data, status){
            self.addToList(name, data);
            objDataFoundHandler(data, status);
          };

          var onFatal = function(data, status) {
            if (isInvalidObject(data)) {
              invalidObjHandler(name);
              self.addToInvalidList(name);
              return;
            }
            errorHandler(data, status);
          };

          $gitHubInteractor[endPoint](name)
            .success(onGetObjectSuccess)
            .error(onFatal);
        }
      };
    }

    return Collection;
  }
]);
