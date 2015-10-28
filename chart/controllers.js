angular.module('Chart')

.controller('ChartCtrl', ['$scope', '$http', function($scope, $http) {

  $scope.chartData = {
    type: 'bar',
    stacked: 'true',
    stackType: '100%',
    title: {text:'Текущее состояние сегментов'},
    series: [
      {
        values: [5,10,15,20,25,30]
      },
      {
        values: [50,25,10,20,45,5]
      }
    ]
  };
  
}]);