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
    var lookup = {};
    var seriesMap = [];
    var yearB = new Date($routeParams.year, 0,1,0,0,0,0);
    var yearE = new Date($routeParams.year, 11,31,23,59,59,999);
    
    DataService.getFunnelDynamics($routeParams.year)
      .then(function(result) {
        console.log(JSON.stringify(result));
        
        // Перебирая все элементы массивов, находим их пересечение
        result[0].rows.forEach(function(element) {
          lookup[element.id] = element;
        });
        lookup['total'] = new Array(0,0,0,0,0,0,0,0,0,0,0,0);
        // Для каждого элемента в пересечении делаем следующее:
        result[1].rows.forEach(function(element) {
          if (lookup[element.id]) {
            if (seriesMap.indexOf(element.value) == -1 ) {
              // 1. Если такого статуса еще нет в словаре статусов, то:
              // пишем статус в словарь
              // создаем в объекте lookup массив из 12 нулей
              seriesMap.push(element.value);
              lookup[element.value] = new Array(0,0,0,0,0,0,0,0,0,0,0,0);
            } 
            // 3. Определяем месяц начала и месяц окончания действия записи. Если совпадают - пропускаем
            var monthB = (lookup[element.id].key < yearB) ? 0 : (new Date(lookup[element.id].key).getMonth());
            var monthE = (element.key == null) ? 11 : (new Date(element.key).getMonth() - 1);
            
            if (monthE >= monthB) {
              // 2. Извлекаем из объекта lookup массив, соответствующий статусу
              // 4. В статусном массиве увеличиваем на единицу соответствующие элементы
              for (var index = monthB; index <= monthE; index++){
                lookup[element.value][index]++;
                lookup['total'][index]++;
              }                
            }            
          };
        });

        var series = [];
        if (seriesMap.indexOf("Интерес") !== -1) {
          series.push({
            tooltip: {
              text: '%t: %v (%npv%)'
            },
            legendText: 'Интерес',
            values: lookup['Интерес']
          });
        }
        if (seriesMap.indexOf("Убеждение") !== -1) {
          series.push({
            tooltip: {
              text: '%t: %v (%npv%)'
            },
            legendText: 'Убеждение',
            values: lookup['Убеждение']
          });
        }        
        if (seriesMap.indexOf("Сделка") !== -1) {
          series.push({
            tooltip: {
              text: '%t: %v (%npv%)'
            },
            legendText: 'Сделка',
            values: lookup['Сделка']
          });
        }         
        // В итоге есть объект со свойствами == массивам статусов
        // Пушим их в массив series и передаем в настройки графика
        
        // Задаем параметры диаграммы в целом
        $scope.chartData = {
          type: 'bar',
          stacked: 'true',
          stackType: '100%',
          title: {text: 'Динамика воронки продаж'},
          series: series,
          legend: {
            visible: true
          }
        };        
      });
  }
 
]);