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
          type: 'funnel',
          //stacked: 'true',
          //stackType: '100%',
          title: {text: title},
          series: series,
          legend: {
            visible: true
          }
        };                    
    });
  }
  
}])

.controller('FunnelCtrl', 
  ['$scope', '$http', '$routeParams', 'DataService', '$rootScope', 'chartSettings',
  function($scope, $http, $routeParams, DataService, $rootScope, chartSettings) {
    var lookup = {};
    var seriesMap = [];
    var yearB = new Date($routeParams.year, 0,1,0,0,0,0);
    var yearE = new Date($routeParams.year, 11,31,23,59,59,999);
    var curUser = $rootScope.globals.currentUser.username;

    DataService.getDynamics($routeParams.year, $routeParams.type).then(processQuery);

    function initClientsCounterFor(user) {
      chartSettings[$routeParams.type + 'Series' + 'Order'].forEach(function(element, index, array) {
        var keyDynamics = user + '_' + element; 
        seriesMap.push(keyDynamics);
        lookup[keyDynamics] = new Array(0,0,0,0,0,0,0,0,0,0,0,0);
        
        var keyStatus = user + '_' + element + '_active';
        seriesMap.push(keyStatus);
        lookup[keyStatus] = [0];
      });
      lookup[user] = true;
    };
    
    function getSeriesFor(subject, isActive) {
        var postfix = isActive !=undefined ? '_active' : '';
        var series = [];
        chartSettings[$routeParams.type + 'Series' + 'Order'].forEach(function(element, index, array) {
          var template = JSON.parse(JSON.stringify(chartSettings.seriesTemplate));
          template.text = element;
          template.legendText = element;
          template.values = lookup[subject + '_' + element + postfix];
          
          series.push(template);
        });
        return series;      
    };
  
    function processQuery(result) {
        initClientsCounterFor('team');
        var users = [];

        // Используем вспомогательный объект - сохраняем в него все записи из первого запроса,
        // а в отчете покажем только те из них, что присутствуют и во втором запросе тоже
        result[0].rows.forEach(function(element) {
          if (element.key <= yearE.toISOString()) {
            lookup[element.id] = element;
          }
        });

        result[1].rows.forEach(function(element) {
          if (lookup[element.id] && element.key >= yearB.toISOString()) {
            var _status = element.value[0];
            var _user = element.value[1];
            var _isActive = element.value[2];
            // При необходимости инициализируем общий счетчик клиентов с этим статусом и счетчик конкретного продавца
            if (!lookup[_user]) {
              initClientsCounterFor(_user);
            }
            
            if(users.indexOf(_user) === -1) {
              users.push(_user);
            }
      
            // Определяем месяц начала и месяц окончания действия записи. Если совпадают - пропускаем
            var monthB = (lookup[element.id].key < yearB.toISOString()) 
              ? 0 
              : (new Date(lookup[element.id].key).getMonth());
            var monthE = (element.key > yearE.toISOString()) 
              ? 11 
              : (new Date(element.key).getMonth());

            if (monthE > monthB) {
              for (var index = monthB; index <= monthE; index++){
                lookup['team' + '_' + _status][index]++;
                lookup[_user + '_' + _status][index]++;
              }
              if (_isActive) {
                lookup[_user + '_' + _status + '_' + 'active'][0]++;
                lookup['team' + '_' + _status + '_' + 'active'][0]++;
              };                
            }            
          };
        
          users.sort();
          $scope.users=users;
  
          $scope.$apply(setUpCharts(curUser));
        });
    };
      
    function setUpCharts(user) {
        $scope.teamDynamicsJson = getChartSettings('bar');
        $scope.teamDynamicsJson.title = {text: 'Общая динамика'};
        $scope.teamDynamicsJson.series = getSeriesFor('team');
      
        $scope.userDynamicsJson = getChartSettings('bar');
        $scope.userDynamicsJson.title = {text: 'Динамика по ' + user};
        $scope.userDynamicsJson.series = getSeriesFor(user);
        
        $scope.userStatusJson = getChartSettings('funnel');
        $scope.userStatusJson.title = {text: 'Статус по ' + user};
        $scope.userStatusJson.series = getSeriesFor(user, true);        
        
        $scope.teamStatusJson = getChartSettings('funnel');
        $scope.teamStatusJson.title = {text: 'Общий статус'};
        $scope.teamStatusJson.series = getSeriesFor('team', true);
    };      
    
    function getChartSettings(chartType, user) {
      if (chartType === 'funnel') {
        return JSON.parse(JSON.stringify(chartSettings.funnelSettings));
      }
      if (chartType === 'bar') {
        return JSON.parse(JSON.stringify(chartSettings.barSettings));
      }
    }
        
    $scope.setSalesman = function($event, user) {
      setUpCharts(user);
    };
  }
 
]);