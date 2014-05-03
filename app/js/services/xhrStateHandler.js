angular.module('teamViewerApp')

.factory('XhrStateHandler', [ "$window", 'ngProgress', function ($window, ngProgress) {
  // Write Handler here
  function Handler () {

    function setAPIProperties() {
      instance.message    = currentState.message;
      instance.isIdle     = ( currentState == states[0] );
      instance.isWorking  = ( currentState == states[1] );
      instance.isComplete = ( currentState == states[2] );
      instance.isSuccess  = ( currentState == states[3] );
      instance.isError    = ( currentState == states[4] );
      instance.isFatal    = ( currentState == states[5] );
    }

    var states = [
      { message : ""         },
      { message : "Working"  },
      { message : "Complete" },
      { message : "Success"  },
      { message : "Error"    },
      { message : "Fatal"    }
    ],
    currentState = states[0],

    // going with object literal pattern
    instance = {

      setAllMessages: function(messages) {
         for(var i = 0; i < states.length; i++) {

           if(!messages[i]){
             messages[i] = "";
           }
           states[i].message = messages[i];
         }
      },

      setMessageForState: function(n,message) {
         if(states[n]){
           states[n]["message"] = message;
         }
      },

      reset: function(){
        instance.idle();
      },

      idle: function(){
        currentState = states[ 0 ];
        ngProgress.reset();
        setAPIProperties();
      },

      initiate: function(){
        currentState = states[ 1 ];
        ngProgress.reset();
        ngProgress.start();
        setAPIProperties();
      },

      complete:function(){
        currentState = states[ 2 ];
        ngProgress.complete();
        setAPIProperties();
      },

      success: function(){
        currentState = states[ 3 ];
        ngProgress.complete();
        setAPIProperties();
      },

      error: function(){
        currentState = states[ 4 ];
        ngProgress.stop();
        setAPIProperties();
      },

      fatal: function(showAlert){
        currentState = states[ 5 ];
        ngProgress.stop();
        setAPIProperties();
        if(showAlert)
          $window
             .alert("An unexpected error occurred while processing this request. Please refresh the page and try again.");
      }
    };
    return instance;
  }

  Handler.getInstance = function () {
    var instance = new Handler();
    instance.idle();
    return instance;
  }
return Handler;
}])