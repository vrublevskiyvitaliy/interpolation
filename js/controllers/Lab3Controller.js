angular
    .module('Labs')
    .controller('Lab3Controller', ['$scope', Lab3Controller]);

function Lab3Controller($scope)
{
	var a = 0, b = 3, M2 = 307917, M4 = 14099400;
	$scope.n;
	var func = function(x)
	{
		return Math.exp(x*x);
	}

	var funcDer = function(x)
	{
		return 2*x*Math.exp(x*x);
	}

	var funcInv = function(x)
	{
		return Math.sqrt(Math.log(x));
	}
	
	$scope.process = function()
	{
		if($scope.n == undefined || $scope.n <= 0)
		{
			$scope.invalid_input = true;
			return;
		}
		$scope.xR = [];
		$scope.yR = [];
		$scope.xT = [];
		$scope.yT = [];
		
		var myXR = [];
		var myYR = [];
		var step = (b - a) / ($scope.n + 1);
		myXR.push(a - step);
		myYR.push(func(a - step));
		for (var i = 0; i<=$scope.n+1; i++)
		{
			$scope.xR.push(a + i*step);
			$scope.yR.push(func($scope.xR[i]));
			myXR.push(a + i*step);
			myYR.push(func(a + i*step));
		}
		myXR.push(b + step);
		myYR.push(func(b + step));
		
		var nt = fillXT($scope.xT, $scope.yT, $scope.eps);
		$scope.func1 = 'f(x) = ' + createFuncLinear(myXR, myYR, $scope.n);
		$scope.func2 = 'f(x) = ' + createFuncCubic(myXR, myYR, $scope.n);
		$scope.func3 = 'f(x) = ' + createFuncLinear($scope.xT, $scope.yT,nt);
		
		//$scope.xInv = L($scope.yT, $scope.xT, $scope.n, $scope.a);
		var finv = math.eval($scope.func3);
		$scope.xInv = finv($scope.a);
		$scope.nInv = nt;
		$scope.epsLin = (M2*step*step)/8;
		$scope.epsCub = (M4*step*step*step*step)/384;
		$scope.processed = true;
	}

	var fillXT = function(x, y, eps)
	{
		var h = Math.sqrt((8 * eps / M2));
		$scope.hInv = h;
		var n = Math.trunc((b-a)/h) + 1;
		var step = h;
		y.push(a - step);
		x.push(func(a - step));
		for (var i = 0; i<=n+1; i++)
		{
			y.push(a + i*step);
			x.push(func(a + i*step));
		}
		y.push(b + step);
		x.push(func(b + step));
		
		return n;
	}

	
	
	var fincInv = function(eps, a, find)
	{
		var h = Math.sqrt(eps * (16*a + 1)*(16*a + 1) * (16*a + 1)*(48*a - 1) / (2048*a*a));
		var x1, x2;
		for (var i = 0.1; i < find; i += h)
		{
			x1 = i; x2 = Math.min(i + h, 1);
		}
		var x = [x1, x2];
		var y = [funcInv(x1), funcInv(x2)];
		var result = L(x, y, 2, find);
		return result;
	}

	var createFunc = function(x, y, n)
	{
		var w = [];
		for (var i = 0; i<n; i++)
		{
			w.push('(x ' + (x[i] > 0 ? '-' + x[i] : '+' + (-x[i])) + ')');
		}
		var Ln = '';
		for (var i = 0; i<n; i++)
		{
			if(Ln != '')
				Ln += '+';
			Ln += '(';
			Ln += y[i] + '*';
			Ln += w.join('*') + '/';
			Ln += '((x ' + (x[i] > 0 ? '-' + x[i] : '+' + (-x[i])) + ') * (' + calcWd(x, i, n) + '))';
			Ln += ')'; 
		}
		return Ln;
	}
	
	var makeIndicatorForDot = function(a)
	{
		return '((sign(abs(x-'+a+'))+1)mod 2)';
	}
	
	
	var makeIndicatorForClosedInterval = function(a,b)
	{
		return '(sign(sign(('+b+'-x)(x-'+a+'))+1)*sign(sign('+b+'-x)+1))';
	}
	
	var makeIndicatorForOpenInterval = function(a,b)
	{
		return '('+makeIndicatorForClosedInterval(a,b)+'-'+makeIndicatorForDot(a)+'-'+makeIndicatorForDot(b)+')';
	}
	
	
	var createFuncLinear = function(x, y, n)
	{
		var Linear = '';
		for (var i = 1; i<=n+2; i++)
		{
			Linear += makeIndicatorForClosedInterval(x[i-1],x[i])+'*((x-'+x[i-1]+')/('+x[i]+'-'+x[i-1]+'))*'+y[i]+'+';
			Linear += makeIndicatorForClosedInterval(x[i],x[i+1])+'*(('+x[i+1]+'-x)/('+x[i+1]+'-'+x[i]+'))*'+y[i];
			if (i != n+2) {
				Linear += '+';
			}
		}
		
		return Linear;
	}

	var createFuncCubic = function(x, y, n)
	{
		var Cubic = '';
		for (var i = 1; i<=n+2; i++)
		{
			Cubic += '('+y[i]+ '*'+makeForFirstAdd(x,i)+'+'+funcDer(x[i])+'* '+makeForSecondAdd(x,i)+')';
			if (i != n+2){
			Cubic += '+';
			}
		}
		return Cubic;
	}

	var makeForFirstAdd = function(x, i)
	{
		var hi = x[i]-x[i-1];
		var hi1 = x[i+1]-x[i];
		var s = '((x-'+x[i]+')/'+hi+')';
		var s1 = '((x-'+x[i]+')/'+hi1+')';
		var firstCase = makeIndicatorForClosedInterval(x[i-1],x[i])+'*(-2*'+s+'*'+s+'*'+s+'-3*'+s+'*'+s+'+1'+')';
		var secondCase = makeIndicatorForClosedInterval(x[i],x[i+1])+'*(2*'+s+'*'+s+'*'+s+'-3*'+s+'*'+s+'+1'+')';
		return '('+firstCase+'+'+secondCase+')';
	}

	var makeForSecondAdd = function(x, i)
	{
		var hi = x[i]-x[i-1];
		var hi1 = x[i+1]-x[i];
		var s = '((x-'+x[i]+')/'+hi+')';
		var s1 = '((x-'+x[i]+')/'+hi1+')';
		var firstCase = makeIndicatorForClosedInterval(x[i-1],x[i])+'*'+hi+'*'+s+'*('+s+'+1)*('+s+'+1)';
		var secondCase = makeIndicatorForClosedInterval(x[i],x[i+1])+'*'+hi1+'*'+s+'*('+s+'-1)*('+s+'-1)';
		return '('+firstCase+'+'+secondCase+')';
	}

	var L = function(x, y, n, x0)
	{
		var result = 0;
		for (var i = 0; i<n; i++)
		{
			result += y[i] * calcW(x, x0, n, i) / calcWd(x, i, n);
		}
		return result;
	}
	var calcW = function(x, x0, n, k)
	{
		var result = 1;
		for (var i = 0; i<n; i++)
		{
			if(i == k)
			{
				continue;
			}
			result *= (x0 - x[i]);
		}
		return result;
	}

	var calcWd = function(x, k, n)
	{
		var mult = 1;
		for (var j = 0; j<n; j++)
		{
			if(j == k)
				continue;
			mult *= (x[k] - x[j]);
		}
		return mult;
	}

}
