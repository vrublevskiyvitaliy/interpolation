'use strict';

angular
    .module('Labs')
    .factory('ZeidelMethod', [ZeidelMethod]);

function ZeidelMethod()
{
	var a = null;
	var b = null;
    var x = null;
    var eps = 0;
    var x0 = null;
    var teorCount = 0;
    var actualCount = 0;
    var q = 0;
    var n = 0;
    var calcQ = function()
    {
        for (var i = 0; i < n; i++)
        {
            var temp = 0;
            for (var j = 0; j < n; j++)
            {
                if (i == j) continue;
                temp += Math.abs(a[i][j]);
            }
            temp /= Math.abs(a[i][i]);
            q = Math.max(q, temp);
        }
    };
    var calcTeor = function()
    {
        teorCount = Math.floor((Math.log(eps * (1.0 - q)) / Math.log(q)) + 1);
    };
    var checker = function(prevX)
    {
        for (var i = 0; i < n; i++)
            if (Math.abs(prevX[i] - x[i]) >= eps) return false;
        return true;
    };

     var findX = function()
    {
        var check = 1/(1-q);
        var prevX = [];
        x = x0;
        while (check >= eps || !checker(prevX))
        {
            prevX = x.slice();
            for (var i = 0; i < n; i++)
            {
                x[i] = b[i];
                for (var j = 0; j < n; j++)
                {
                    if (i == j) continue;
                    x[i] -= a[i][j] * x[j];
                }
                x[i] /= a[i][i];
            }
            check *= q;
            actualCount++;
        }
    };


	return {
		init: init,
		getAns: getAns,
        getTeorCount: getTeorCount,
        getActualCount: getActualCount
	};
	function init(matrix, bb, x00, epss)
	{
		a = matrix;
		b = bb;
		n = a.length;
        eps = epss;
        x0 = x00;
        calcQ();
        calcTeor();
        findX();
	};	
	function getAns()
	{
        for(var i = 0; i<n; i++)
        {
            x[i] = x[i].toFixed(5);
        }
		return x;
	};
    function getTeorCount()
    {
        return teorCount;
    };
    function getActualCount()
    {
        return actualCount;
    };
}