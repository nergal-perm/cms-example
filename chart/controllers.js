angular.module('Chart')

.controller('StatusCtrl', 
  ['$scope', '$http', '$routeParams', 'DataService', 
  function($scope, $http, $routeParams, DataService) {

  var sourceData = [];
  

  switch ($routeParams.chartType) {
    case "segment": 
      showCurrentStatus(DataService.getCurrentStatus, 'Текущее состояние сегментов');
      break;
    case "funnel":
      showCurrentStatus(DataService.getCurrentStatus, 'Текущее состояние воронки продаж');
      break;
    default:
      // do nothing
  } 
  
  function showCurrentStatus(query, title) {
    query($routeParams.chartType).then(function(result) {
        sourceData = result.rows;

        // Рассчитываем общий итог, чтобы потом красиво отобразить доли
        var sourceTotal = sourceData.reduce(function(prev, next) {
          return prev + next.value;
        }, 0); 

        // Преобразуем исходные данные в правильный набор для графика
        var series= [];
        sourceData.forEach(function(el, index){
          series.push({
            tooltip: {
              text: 'Клиентов: %node-value\n' + 'Доля: ' + (sourceData[index].value / sourceTotal * 100).toFixed(2) + '%'
            },
            legendText: el.key,
            values: [el.value]
          });
        });
        
        // Задаем параметры диаграммы в целом
        $scope.chartData = {
          type: 'bar',
          stacked: 'true',
          stackType: '100%',
          title: {text: title},
          series: series,
          legend: {
            visible: true
          }
        };                    
    });
  }
  
}])

.controller('DynamicsCtrl', 
  ['$scope', '$http', '$routeParams', 'DataService', 
  function($scope, $http, $routeParams, DataService) {
  
    var sourceData = [];
    var sourceTotal = [];
    
    DataService.getFunnelDynamics($routeParams.year)
      .then(function(byStart, byEnd) {
        console.log(JSON.stringify(byStart));
        console.log("======================");
        console.log(JSON.stringify(byEnd));        
      });
  }
  
]);

