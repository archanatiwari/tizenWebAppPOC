app.controller('loginController', ['$scope', '$state', 'SharedFactory', 'SharedDataService', function($scope, $state, SharedFactory, SharedDataService) {
    //$scope.userContacts = null;
    // $scope.errorMsg = false;
    //  $http.get('data/user-data.json').success(function(data){
    //      $scope.userContacts = data.data;
    //
    //  });

    //$scope.email = "archit.soni@globant.com", $scope.password = "1234";

    // SharedFactory.getData().then(function(response) {
    //     $scope.userContacts = response;
    // }, function(response) {
    //     $scope.userContacts = response;
    // });

    // $scope.login = function() {
    //     var userContacts = $scope.userContacts;
    //     for (var i = 0; i < userContacts.length; i++) {
    //         var user = userContacts[i];
    //         if (user.email == $scope.email && user.password == $scope.password) {
    //             SharedDataService.setCurrentUser(user);
    //             $state.go('home');
    //             break;
    //         } else {
    //             console.log('Enter correct username and password');
    //             // $scope.errorMsg = true;
    //         }
    //     }
    // };

    function getDeviceContacts(callBack){
        var contactArr = [], defaultAddressBook = [];
        if(typeof(tizen) !== "undefined"){
            function contactsFoundCB(contacts) {
                contacts.forEach(function(contact, index){
                    var obj = {};
                    obj.name = contact.name.firstName + (contact.name.lastName ? contact.name.lastName : ""); 
                    obj.contact_id = contact.phoneNumbers[0].number; //considering first number
                    obj.profile_pic = (contact.photoURI ? contact.photoURI : "");
                    contactArr.push(obj);
                });
                callBack.apply(null, contactArr);
            }
            
            function errorCB(err) {
                console.log('The following error occurred: ' +  err.name);
                callBack.apply(null, contactArr);
            }
                
           defaultAddressBook = tizen.contact.getDefaultAddressBook();
           defaultAddressBook.find(contactsFoundCB, errorCB);
        }
        else{
            //default contacts, for testing purpose
            var obj1 = {}, obj2 = {};
            
            obj1.name = "Charan Adiga"; 
            obj1.contact_id = "919878721704";
            obj1.profile_pic = "";

            obj2.name = "Archit Soni"; 
            obj2.contact_id = "918972721704";
            obj2.profile_pic = "";
            
            contactArr.push(obj1);
            contactArr.push(obj2);
            
            callBack.apply(null, [contactArr]);
        }
    };

    $scope.doRegister = function(){
        var requestObj = {};
        var phoneNo = $scope.phoneNo;
        if($scope.userName != "" && $scope.phoneNo != ""){
            requestObj.name = $scope.userName;
            requestObj.user_id = phoneNo;
            SharedDataService.registerUser(requestObj, function(response){
                localStorage.setItem('registeredUser', $scope.phoneNo);
                //get device contacts & add to DB
                getDeviceContacts(function(contactList){
                    var contactReq = {};
                    contactReq.contact_list = contactList;
                    contactReq.user_id = phoneNo;
                    SharedDataService.addUserContacts(contactReq, function(res){
                        $state.go('home');
                    }, function(res){
                        //unable add contacts to db
                    });
                });
                
            }, function(response){
                localStorage.removeItem('registeredUser');
                alert("Unable to Register");
            });
        }
    };
}]);
