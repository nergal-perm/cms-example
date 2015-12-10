angular.module('Chart')

.controller('FunnelCtrl', 
  ['$scope', '$http', 'DataService', '$rootScope', 'chartSettings', '$q',
  function($scope, $http, DataService, $rootScope, chartSettings, $q) {
    var lookup = {};
    var seriesMap = [];
    var yearB;
    var yearE;
    var curUser = $rootScope.globals.currentUser;

		$scope.salesmenInputPlaceholder = 'Данные не загружены...';
		$scope.salesmenInputDisabled = true;
		$scope.reportUser = '0';
		$scope.setUpCharts = setUpCharts;
    
    function initialize() {
      yearB = new Date($scope.year, 0,1,0,0,0,0);
      yearE = new Date($scope.year, 11,31,23,59,59,999);
    };
    
    $scope.run = function($event) {
      initialize();
      var reportKey = $scope.year + '_' + $scope.type;
      if(!lookup[reportKey]) {
				console.log('Fetching new data for ' + reportKey);
        DataService.getDynamics($scope.year, $scope.type)
          .then(processQuery)
					.then(function() {
						setUpCharts(JSON.stringify(curUser));
						setSalesmenInputStatus();
					});
			} else {
				console.log('Using fetched data for ' + reportKey);
				setUpCharts(JSON.stringify(curUser));
				setSalesmenInputStatus();
			}
    };

		function setSalesmenInputStatus() {
			var reportKey = $scope.year + '_' + $scope.type;
			console.log('report key for seting input state: ' + reportKey + ', its index: ' + lookup[reportKey]);
			if (!lookup[reportKey]) {
				$scope.salesmenInputDisabled = true;
				$scope.salesmenInputPlaceholder = 'Данные не загружены';
				$scope.reportUser = '0';
			} else {
				$scope.salesmenInputDisabled = false;
				$scope.salesmenInputPlaceholder = 'Выберите продавца...';
				$scope.reportUser = '0';
			}
		};

		$scope.setSalesmenInputStatus = setSalesmenInputStatus;

		$scope.isCurUserAManager = function() {
			return curUser.roles.indexOf('manager') !== -1;
		};

    function initClientsCounterFor(subject) {
      chartSettings[$scope.type + 'Series' + 'Order'].forEach(function(element, index, array) {
        var keyDynamics = subject + '_' + element + '_' + $scope.year; 
        seriesMap.push(keyDynamics);
        lookup[keyDynamics] = new Array(0,0,0,0,0,0,0,0,0,0,0,0);
        
        var keyStatus = subject + '_' + element + '_active' + '_' + $scope.year;
        seriesMap.push(keyStatus);
        lookup[keyStatus] = [0];
      });
      // Сохраняем запись о том, что для данного 
      lookup[subject + '_' + $scope.type + '_' + $scope.year] = true;
    };
    
    function getSeriesFor(subject, isActive) {
        var postfix = (isActive !=undefined ? '_active' : '') + '_' + $scope.year;
        var series = [];
        chartSettings[$scope.type + 'Series' + 'Order'].forEach(function(element, index, array) {
          var template = JSON.parse(JSON.stringify(chartSettings.seriesTemplate));
          template.text = element;
          template.legendText = element;
          template.values = lookup[subject + '_' + element + postfix];
          template.backgroundColor1 = chartSettings.plotColors[element][0];
					template.backgroundColor2 = chartSettings.plotColors[element][1];
          series.push(template);
        });
        return series;      
    };
  
    function processQuery(result) {
      return $q(function(resolve, reject) {
        initClientsCounterFor('team');

        var clientsRepository = {};
        var users = [];
				var usersLookup = [];

        // Используем вспомогательный объект - сохраняем в него все записи из первого запроса,
        // а в отчете покажем только те из них, что присутствуют и во втором запросе тоже
        result[0].rows.forEach(function(element) {
          if (element.key <= yearE.toISOString()) {
            clientsRepository[element.id] = element;
          }
        });

        result[1].rows.forEach(function(element) {
          if (clientsRepository[element.id] && element.key >= yearB.toISOString()) {
            var _status = element.value[0];
            var _user = element.value[1];
            var _isActive = element.value[2];
            // При необходимости инициализируем общий счетчик клиентов с этим статусом и счетчик конкретного продавца
            if (!lookup[_user.name + '_' + $scope.type + '_' + $scope.year]) {
              initClientsCounterFor(_user.name);
            }

            if(!usersLookup[_user.name]) {
              users.push(_user);
							usersLookup[_user.name] = true;
            }
      
            // Определяем месяц начала и месяц окончания действия записи. Если совпадают - пропускаем
            var monthB = (clientsRepository[element.id].key < yearB.toISOString()) 
              ? 0 
              : (new Date(clientsRepository[element.id].key).getMonth());
            var monthE = (element.key > yearE.toISOString()) 
              ? 11 
              : (new Date(element.key).getMonth());

            if (monthE > monthB || element.key > yearE.toISOString()) {
              for (var index = monthB; index <= monthE; index++){
                lookup['team' + '_' + _status + '_' + $scope.year][index]++;
                lookup[_user.name + '_' + _status + '_' + $scope.year][index]++;
              }
              if (_isActive) {
                lookup[_user.name + '_' + _status + '_' + 'active' + '_' + $scope.year][0]++;
                lookup['team' + '_' + _status + '_' + 'active' + '_' + $scope.year][0]++;
              };                
            }            
          };
        });
				
				lookup[$scope.year + '_' + $scope.type] = true;
        
        users.sort();
        $scope.users=users;
				console.log('Done processing, lookup object: ' + JSON.stringify(lookup));
        resolve();       
      });        
    };
      
    function setUpCharts(user) {
			console.log('Preparing charts...');
      var dashboard = {
        graphset: []
      };
      
			user = JSON.parse(user);
			console.log(user);

      var teamDynamicsJson = getChartSettings('bar');
      teamDynamicsJson.title = {text: 'Общая динамика'};
      teamDynamicsJson.series = getSeriesFor('team');
    
      var userDynamicsJson = getChartSettings('bar');
      userDynamicsJson.title = {text: 'Динамика по ' + user.displayedName};
      userDynamicsJson.series = getSeriesFor(user.name);
      
      var userStatusJson = getChartSettings('funnel');
      userStatusJson.title = {text: 'Статус по ' + user.displayedName};
      userStatusJson.series = getSeriesFor(user.name, true);        
      
      var teamStatusJson = getChartSettings('funnel');
      teamStatusJson.title = {text: 'Общий статус'};
      teamStatusJson.series = getSeriesFor('team', true);
      
      dashboard.graphset.push(userStatusJson);
      dashboard.graphset.push(userDynamicsJson);
      dashboard.graphset.push(teamStatusJson);
      dashboard.graphset.push(teamDynamicsJson);
      
			console.log('Starting render...');

      zingchart.render({
        id:'dashboard',
        container: 'dashboard',
        data: dashboard,
        height: "100%",
        width: "100%"
      });
    };      
    
    function getChartSettings(chartType, user) {
      if (chartType === 'funnel') {
        return JSON.parse(JSON.stringify(chartSettings.funnelSettings));
      }
      if (chartType === 'bar') {
        return JSON.parse(JSON.stringify(chartSettings.barSettings));
      }
    }
        
  }

]);
