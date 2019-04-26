angular.module('starter.controllers', [])
  
.controller('ChatsCtrl', function($scope, $ionicLoading, NewsData, NewsStorage) {
    
    $scope.news = [];
    $scope.storage = '';
    
    $scope.loading = $ionicLoading.show({
      template: '<i class="icon ion-loading-c"></i> Loading Data',

      //Will a dark overlay or backdrop cover the entire view
      showBackdrop: false,

      // The delay in showing the indicator
      showDelay: 10
    });
    
    NewsData.async().then(
        // successCallback
        function() {
            $scope.news = NewsData.getAll();
            $ionicLoading.hide();
        },
        // errorCallback 
        function() {
            $scope.news = NewsStorage.all();
            $scope.storage = 'Data from local storage';
            $ionicLoading.hide();
        },
        // notifyCallback
        function() {}
    );

})

.controller('DashCtrl', function( $scope, $http, DataLoader, $timeout, $log ) {

  var singlePostApi = 'https://xmxx.herokuapp.com/posts/', postsApi ='https://channelmyanmar.org/wp-json/wp/v2/posts/';

  $scope.moreItems = false;

  $scope.loadPosts = function() {

    // Get all of our posts
    DataLoader.get( postsApi ).then(function(response) {

      $scope.posts = response.data;

      $scope.moreItems = true;

      console.log(postsApi, response.data);

    }, function(response) {
      console.log(postsApi, response.data);
    });

  }

  // Load posts on page load
  $scope.loadPosts();

  paged = 2;

  // Load more (infinite scroll)
  $scope.loadMore = function() {

    if( !$scope.moreItems ) {
      return;
    }

    var pg = paged++;

    console.log('loadMore ' + pg );

    $timeout(function() {

      DataLoader.get( postsApi + '?page=' + pg ).then(function(response) {

        angular.forEach( response.data, function( value, key ) {
          $scope.posts.push(value);
        });

        if( response.data.length <= 0 ) {
          $scope.moreItems = false;
        }
      }, function(response) {
        $scope.moreItems = false;
        $log.error(response);
      });

      $scope.$broadcast('scroll.infiniteScrollComplete');
      $scope.$broadcast('scroll.resize');

    }, 1000);

  }

  $scope.moreDataExists = function() {
    return $scope.moreItems;
  }

  // Pull to refresh
  $scope.doRefresh = function() {
  
    $timeout( function() {

      $scope.loadPosts();

      //Stop the ion-refresher from spinning
      $scope.$broadcast('scroll.refreshComplete');
    
    }, 1000);
      
  };
    
})

.controller('DashDetailCtrl', function($scope, $stateParams, DataLoader, $ionicLoading) {
   var xmxx='https://xmxx.herokuapp.com/posts/';
    DataLoader.get(xmxx+ $stateParams.id).then(function(response) {
    console.log(response.data);
      $scope.posts = response.data;
 })
  
})

.controller('ChatsxxCtrl', function($scope) {
})

.controller('ChatDetailCtrl', function($scope, $stateParams) {
  
})

.controller('AccountCtrl', function($scope, DataLoader) {
  $scope.settings = {
    enableFriends: true
  };
  var cat = 'http://channelmyanmar.org/wp-json/wp/v2/categories';
 DataLoader.get( cat ).then(function(response) {

      $scope.category = response.data;
 });
});
