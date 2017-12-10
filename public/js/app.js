var app = angular.module('app', []);

app.directive('fileModel', ['$parse', function ($parse) {
	return {
		restrict: 'A',
		link: function(scope, element, attrs) {
			var model = $parse(attrs.fileModel);
			var modelSetter = model.assign;
			
			element.bind('change', function(){
				scope.$apply(function(){
					modelSetter(scope, element[0].files[0]);
				});
			});
		}
	};
}]);

app.service('fileUpload', ['$http', function($http) {
	this.uploadFileToUrl = function(file, uploadUrl, callback){
		var fd = new FormData();
		fd.append('xlsx', file);
		$http.post(uploadUrl, fd, {
			transformRequest: angular.identity,
			headers: {'Content-Type': undefined}
		})
		.then(function(res){
			callback(res.data)
		},

		function(res){
			callback(false)
		});
	}
}]);

app.controller('myCtrl', ['$scope', 'fileUpload', function($scope, fileUpload){
	$scope.file = null;
	$scope.active = 0;

	$scope.SelectFile = function() {
		document.getElementById('fileEvent').click();
	};

	$scope.UploadTable = function() {
		fileUpload.uploadFileToUrl($scope.xlsxFile, '/parse', function(data) {
			if(!data) return alert('Error loading file');
			if(data.status === false) return alert(data.message);
			console.log(data.file);
			$scope.file = data.file;
			$scope.active = 0;
		});
	};

	$scope.setPage = function(index) {
		$scope.active = index;
	};
}]);
