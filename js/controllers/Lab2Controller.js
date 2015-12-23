angular
    .module('Labs')
    .controller('Lab2Controller', ['$scope', 'SqrtMethod', 'ZeidelMethod', Lab2Controller]);

function Lab2Controller($scope, SqrtMethod, ZeidelMethod)
{
	$scope.A = [
	[7, 2, 2, -2],
	[2, 5, -1, -1],
	[2, -1, 6, -2],
	[-2, -1, -2, 6]];
	$scope.b = [8, -6, -9, 3];

	$scope.method = 'sqrt';
	$scope.eps;
	$scope.x0 = [];
	$scope.findAnsSqrt = function()
	{
		SqrtMethod.init($scope.A, $scope.b);
		$scope.ans = SqrtMethod.getAns();
		$scope.det = SqrtMethod.getDet();
		$scope.inv = SqrtMethod.getInv();
		$scope.cond = SqrtMethod.getCond();
	}
	$scope.findAnsZeidel = function()
	{
		if(checkInput())
		{
			$scope.inputError = false;
			ZeidelMethod.init($scope.A, $scope.b, $scope.x0.slice(), parseFloat($scope.eps));
			$scope.x = ZeidelMethod.getAns();
			$scope.tCount = ZeidelMethod.getTeorCount();
			$scope.aCount = ZeidelMethod.getActualCount();
		}
		else
		{
			$scope.inputError = true;
		}

	}
	var checkInput = function ()
	{
		for (var i = 0; i<4; i++)
		{
			if(!$scope.x0[i])
				return false;
		}
		if(!$scope.eps)
		{
			return false;
		}
		return true;
	}




























































































}