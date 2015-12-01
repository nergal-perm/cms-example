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
  ['$scope', '$http', '$routeParams', 'DataService', '$rootScope', 
  function($scope, $http, $routeParams, DataService, $rootScope) {
    var lookup = {};
    var seriesMap = [];
    var yearB = new Date($routeParams.year, 0,1,0,0,0,0);
    var yearE = new Date($routeParams.year, 11,31,23,59,59,999);
    var curUser = $rootScope.globals.currentUser.username;


    $scope.reportLocation = true;
  // Нужно выполнить один запрос к базе данных - получить все данные по воронке продаж за текущий год
  // Текущий статус мы определим, достав только активные записи
  // Динамику конкретного продавца мы определим, достав только записи продавца
  // Текущий статус конкретного продавца мы определим, достав только активные записи продавца
  
  // Нужно создать 4 объекта с данными для графиков.

    function initClientsCounterFor(sStatus, user, isActive) {
      if (seriesMap.indexOf('team_' + sStatus) == -1 ) {
        seriesMap.push('team_' + sStatus);
        lookup['team_' +sStatus] = new Array(0,0,0,0,0,0,0,0,0,0,0,0);
      };       
      if (seriesMap.indexOf(user + '_' + sStatus) == -1 ) {
        seriesMap.push(user + '_' + sStatus);
        lookup[user + '_' + sStatus] = new Array(0,0,0,0,0,0,0,0,0,0,0,0);
      };
      if (isActive) {
        if(seriesMap.indexOf(user + '_' + sStatus + '_active') == -1 ) {
          seriesMap.push(user + '_' + sStatus + '_active');
          lookup[user + '_' + sStatus + '_active'] = [0];
        }
        if(seriesMap.indexOf('team_' + sStatus + '_active') == -1) {
          seriesMap.push('team_' + sStatus + '_active');
          lookup['team_' + sStatus + '_active'] = [0];
        }
      };
          
    };
    
    function getSeriesFor(subject, isActive) {
        var postfix = isActive !=undefined ? '_active' : '';
        var series = [];
        if (seriesMap.indexOf(subject + '_' + "Интерес" + postfix) !== -1) {
          series.push({
            tooltip: {
              text: '%t: %v (%npv%)'
            },
            legendText: 'Интерес',
            values: lookup[subject + '_' + 'Интерес' + postfix]
          });
        }
        if (seriesMap.indexOf(subject + '_' + "Убеждение" + postfix) !== -1) {
          series.push({
            tooltip: {
              text: '%t: %v (%npv%)'
            },
            text: "Убеждение",
            legendText: 'Убеждение',
            values: lookup[subject + '_' + 'Убеждение' + postfix]
          });
        }        
        if (seriesMap.indexOf(subject + '_' + "Сделка" + postfix) !== -1) {
          series.push({
            tooltip: {
              text: '%t: %v (%npv%)'
            },
            legendText: 'Сделка',
            values: lookup[subject + '_' + 'Сделка' + postfix]
          });
        }
        if (seriesMap.indexOf(subject + '_' + "Резерв" + postfix) !== -1) {
          series.push({
            tooltip: {
              text: '%t: %v (%npv%)'
            },
            legendText: 'Резерв',
            values: lookup[subject + '_' + 'Резерв' + postfix]
          });
        }               
        return series;      
    };
  
      
    DataService.getFunnelDynamics($routeParams.year)
      .then(function(result) {
        // Используем вспомогательный объект - сохраняем в него все записи из первого запроса
        result[0].rows.forEach(function(element) {
          lookup[element.id] = element;
        });

        var users = [];
        // Если запись из второго запроса найдена во вспомогательном объекте - ее надо отобразить
        // на графиках
        result[1].rows.forEach(function(element) {
          if (lookup[element.id]) {
            var _status = element.value[0];
            var _user = element.value[1];
            var _isActive = element.value[2];
            // При необходимости инициализируем общий счетчик клиентов с этим статусом и счетчик конкретного продавца
            initClientsCounterFor(_status, _user, _isActive);
            
            if(users.indexOf(_user) === -1) {
              users.push(_user);
            }
      
            // 3. Определяем месяц начала и месяц окончания действия записи. Если совпадают - пропускаем
            var monthB = (lookup[element.id].key < yearB) 
              ? 0 
              : (new Date(lookup[element.id].key).getMonth());
            var monthE = (element.key == null) 
              ? 11 
              : (new Date(element.key).getMonth() - 1);
            
            if (monthE >= monthB) {
              // 2. Извлекаем из объекта lookup массив, соответствующий статусу
              // 4. В статусном массиве увеличиваем на единицу соответствующие элементы
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
        });
        // Теперь заполняем конкретные объекты, "лежащие" под графиками
        // Их должно быть четыре:
        // 1. Team Funnel Status
        // 2. Team Funnel Dynamics
        // 3. Salesman Funnel Status
        // 4. Salesman Funnel Dynamics
         
        users.sort();
        $scope.users=users;
        console.log($scope.users);
        // Задаем параметры диаграммы в целом
        setUpCharts(curUser);
       
      });
      
    function setUpCharts(user) {
        $scope.teamDynamicsJson = {
          type: 'bar',
          stacked: 'true',
          stackType: '100%',
          title: {text: 'Динамика'},
          series: getSeriesFor('team'),
          legend: {
            draggable: true,
            visible: true
          }
        };        
        
        $scope.userDynamicsJson = {
          type: 'bar',
          stacked: 'true',
          stackType: '100%',
          title: {text: 'Динамика по ' + user},
          series: getSeriesFor(user),
          legend: {
            draggable: true,            
            visible: true,
            
          }
        };
        
        $scope.userStatusJson = {
          type: 'funnel',
          stacked: 'true',
          //stackType: '100%',
          title: {text: 'Статус по ' + user},
          series: getSeriesFor(user, true),
          legend: {
            align: "right",
            verticalAlign: "bottom",
            draggable: true,            
            visible: true
          }
        };        
        
        $scope.teamStatusJson = {
          type: 'bar',
          stacked: 'true',
          stackType: '100%',
          title: {text: 'Cтатус'},
          series: getSeriesFor('team', true),
          legend: {
            draggable: true,            
            visible: true
          }
        };       
    }      
        
    $scope.setSalesman = function($event, user) {
      console.log(user);
      setUpCharts(user);
    };
  }
 
]);