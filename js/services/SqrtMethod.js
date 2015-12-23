'use strict';

angular
    .module('Labs')
    .factory('SqrtMethod', [SqrtMethod]);

function SqrtMethod()
{
	var a = null;
	var b = null;
	var s = null;
	var d = null;
	var n = 0;
	var x = null;
	var inv = null;
    var cond = 0;
	var setSD = function()
	{
		s = [];
		d = [];
		 for(var i = 0; i < n; i++)
		 {
		 	s[i] = [];
			d[i] = Math.sign(a[i][i] - sum(i,i));
            s[i][i]= Math.sqrt( Math.abs(a[i][i] - sum(i,i)));
            for(var j = i + 1; j < n; j++)
            {
                s[i][j] = (a[i][j] - sum(i,j)) / (d[i] * s[i][i]);
            }
        }
	};
	var sum = function(i, j)
	 {
        var res = 0;
        for (var k = 0; k < i; k++)
        {
            res += s[k][i] * s[k][j] * d[k];
        }
        return res;
    };
    var solveY = function()
    {
    	var y = [];
    	for (var i = 0; i < n; i++)
        {
            var sum = 0;
            for (var j = 0; j < i; j++)
                sum += s[j][i] * d[j] * y[j];
            y[i] = (b[i] - sum) / (s[i][i] * d[i]);
        }
        return y;
    };
    var solveX = function(y)
    {
    	var x = [];
    	for (var i = n-1; i >= 0; i--)
        {
            var sum = 0;
            for (var j = n-1; j > i; j--)
                sum += s[i][j] * x[j];
            x[i] = ((y[i] - sum) / s[i][i]).toFixed(5);
        }
        return x;
    };

    var  solveYforInv = function(k) 
    {
    	var y = [];
        for (var i = 0; i < n; i++)
        {
            var sum = 0;
            for (var j = 0; j < i; j++)
            {
                sum += s[j][i] * d[j] * y[j];
            }
            
            y[i] = ((i == k ? 1 : 0) - sum) / (s[i][i] * d[i]);
        }
        return y;
    };
    var findCond = function()
    {

        var modA = 0;
        for (var i = 0; i < n; i++)
        {
            var sum = 0;
            for (var j = 0; j < n; j++)
            {
                sum += Math.abs(a[i][j]);
            }
            modA = Math.max(modA, sum);
        }
        var modAinv = 0;
        for (var i = 0; i < n; i++)
        {
            var sum = 0;
            for (var j = 0; j < n; j++)
            {
                sum += Math.abs(inv[i][j]);
            }
            modAinv = Math.max(modAinv, sum);
        }
        cond = modA * modAinv;
    };
    var findInv = function()
    {
        inv = [];
        for (var k = 0; k < n; k++)
        {
            var y = solveYforInv(k);
            for (var i = n - 1; i >= 0; i--)
            {
                if(!inv[i])
                {
                    inv[i] = [];
                }
                var sum = 0;
                for (var j = n - 1; j > i; j--)
                {
                    sum += s[i][j] * inv[j][k];
                }
                inv[i][k] = ((y[i] - sum) / s[i][i]).toFixed(1);
            }
        }
    };

	return {
		init: init,
		getDet: getDet,
		getInv: getInv,
		getAns: getAns,
        getCond: getCond
	};
	function init(matrix, bb)
	{
		a = matrix;
		b = bb;
		n = a.length;
		setSD();
		var y = solveY();
		x = solveX(y);
        findInv();	
        findCond();	
	};
	function getDet()
	{
		var det = 1;
        for (var k = 0; k < n; k++)
            det *= d[k] * s[k][k] * s[k][k];
        return det.toFixed(1);
	};
	function getInv()
	{
		
        return inv;

	};
	function getAns()
	{
		return x;
	};
    function getCond()
    {
        return cond;
    };
}