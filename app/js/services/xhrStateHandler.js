angular.module('teamViewerApp')

.factory("XhrStateHandler", [ "$window", "ngProgress", function($window, ngProgress){
  function Handler(){
    
    var instance = { }
       ,states = [
          { message : ""         }
         ,{ message : "Working"  }
         ,{ message : "Complete" }
         ,{ message : "Success"  }
         ,{ message : "Error"    }
         ,{ message : "Fatal"    } 
        ]
       ,currentState = states[ 0 ];
    
    function setAPIProperties(){
      
      instance.message    = currentState.message;

      instance.isIdle     = ( currentState == states[0] );
      instance.isWorking  = ( currentState == states[1] );
      instance.isComplete = ( currentState == states[2] );
      instance.isSuccess  = ( currentState == states[3] );
      instance.isError    = ( currentState == states[4] );
      instance.isFatal    = ( currentState == states[5] ); 
    }

    instance.setAllMessages = function(messages){
       for( var i = 0; i < states.length; i++ ){
         
         if(!messages[i]){
           messages[i] = "";
         };
         
         states[i].message = messages[i];
       }
    };

     instance.setMessageForState = function(n,message){
       if(states[n]){
         states[n]["message"] = message;
       };
     };
     instance.reset = function(){
       instance.idle();
     };
     instance.idle = function(){
       currentState = states[ 0 ];
       ngProgress.reset();
       setAPIProperties();
     };
     instance.initiate = function(){
       currentState = states[ 1 ];
       ngProgress.reset();
       ngProgress.start();
       setAPIProperties();
     };

     instance.complete = function(){
       currentState = states[ 2 ];
       ngProgress.complete();
       setAPIProperties();
     };

     instance.success = function(){
       currentState = states[ 3 ];
       ngProgress.complete();
       setAPIProperties();
     };

     instance.error = function(){
       currentState = states[ 4 ];
       ngProgress.stop();
       setAPIProperties();
     };

     instance.fatal = function(showAlert){
       currentState = states[ 5 ];
       ngProgress.stop();
       setAPIProperties();
       if(showAlert)
         $window
           .alert("An unexpected error occurred while processing this request. Please refresh the page and try again.");
     };
     
     return instance;  
  };
  Handler.getInstance = function(){
    var ins = new Handler();
    ins.idle();
    return ins;
  };
  return Handler;
}]);