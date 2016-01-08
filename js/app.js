angular.module('storeApp', [])

  .controller('orderController', function($scope, $http, $location, $httpParamSerializerJQLike) {

  $scope.options = [
    { label: '0', value: 0 },
    { label: '1', value: 1 },
    { label: '2', value: 2 },
    { label: '3', value: 3 },
    { label: '4', value: 4 },
    { label: '5', value: 5 }
  ];
 
  $scope.qty = $scope.options[1];

  var getMetadata = function() {
    var metadata = {};
    //metadata.givenName = $scope.givenName;
    //metadata.lastName = $scope.lastName;
    //metadata.email = $scope.email;
    //metadata.address = $scope.street;
    //metadata.city = $scope.city;
    //metadata.postcode = $scope.postcode;
    metadata.quantity = $scope.qty.value;
    return metadata;
  }

  var getAmountCents = function() {
    var amount = $scope.qty.value * 4995; // cents
    return amount;
  }

  /*
   * use token and other args to call out to heroku server which wil call
   * out to stripe to make payment
   */
  var onTokenRecv = function(token) {

    /* token
     * Object {id: "tok_123456123456123456123456", livemode: true, created: 1423112123, used: false, object: "token"…}card: Objectclient_ip: "107.192.0.177"created: 1423112123email: "mericsson@gmail.com"id: "tok_123456123456123456KMqDfv"livemode: trueobject: "token"type: "card"used: falseverification_allowed: true}
     */

    var metadata = getMetadata();

    var payload = {
      amount: getAmountCents(),
      description: 'Eartear, bluetooth headphone',
      metadata: metadata,
      stripeToken: token.id,
      stripeTokenType: token.type,
      stripeEmail: token.email
    }

    var data = {
      payload: payload
    }

    $http({method: 'POST',
          url: 'https://eartear.herokuapp.com/',
          data: $httpParamSerializerJQLike(payload),
          //data: payload,
          headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
          }
    }).
      then(function(response) {
        $location.path("https://eartear.com.au/success.html");
      }, function(response) {
        $location.path("https://eartear.com.au/error.html");
    });

  };

    var stripeHandler = StripeCheckout.configure({
      key: 'pk_test_VN6Rcp9fk9AKC8Grprg6ryt6',
      // key: 'pk_test_q8NAb1ewbs64MPgELxVLCC1K',
      image: 'img/navlogo-blue.png',
      color: 'blue',
      shippingAddress: true,
      token: function(token, args) {
        onTokenRecv(token, args);
      }
    });

    $scope.openStripeHandler = function() {
      stripeHandler.open({
        name: 'EarTear',
        description: 'micro headphone',
        success_redirect_url:"http://darcys22.github.io/eartear/success.html",
        amount: getAmountCents()
      });
    }


});
