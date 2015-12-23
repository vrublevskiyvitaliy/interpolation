function ModNewtonMethod (func) 
{
	 var nextStep = function(x)
	 {
	 	return x = x - func.f(x) / func.df(func.x0);
	 };
	var iterations = [];
	var func = func;
	var checkX0 = function(x)
	{
		if(func.df(x) == 0) 
	 	{
	 		return false;
	 	}
	 	if(func.d2f(x) * func.f(x) <= 0)
		{
			return false;
		}
		return true;
	};
	this.calc = function()
	{
		if(!checkX0(func.x0))
		{
			return 'invalid input';
		}
		var x = func.x0;
	 	while(Math.abs(x - nextStep(x)) > func.eps)
	 	{
	 		iterations.push(x);
	 		x = nextStep(x);
	 	}
	 	iterations.push(x);
	 	func.result = x;
	 	return true;
	};
	this.getIterations = function()
	{
		return iterations;
	}
};
function RelaxationMethod (func) 
{
	 var t;
	 var calcT = function()
	 {
	 	var der = func.df(func.x0);
	 	if(der < 0)
	 	{
	 		t = 0.17;
	 	}
	 	else
	 	{
	 		t = -0.17;
	 	}
	 	return true;
	 }
	 var nextStep = function(x)
	 {
	 	return x = x + t * func.f(x);
	 };
	var checkX0 = function(x)
	{
		if(func.x0 < 4.267895 && func.x0 > -2.33018)
		{
			return true;
		}
		return false;
	};
	var iterations = [];
	var func = func;
	this.calc = function()
	{
		if(!calcT() || !checkX0())
		{
			return 'error';
		}
		var x = func.x0;
	 	while(Math.abs(x - nextStep(x)) > func.eps)
	 	{
	 		iterations.push(x);
	 		x = nextStep(x);
	 	}
	 	iterations.push(x);
	 	func.result = x;
	 	return true;
	};
	this.getIterations = function()
	{
		return iterations;
	}
};

var func = 
 {
 	f: function(x)
 	{
 		return (x-1) * (x-1) - math.sin(2*x);
 	},
 	df: function(x)
	{
		return 2*(x-1) - 2 * math.cos(2*x);
	},
	d2f: function(x)
	{
		return 2*x +  4 * math.sin(2*x);
	},
	x0: 0,
	result: null
 };


$(document).ready(function()
	{
		draw();
		$('.plot-toggle-btn').click(function()
			{
				$('#plot').toggle(200);
				$(this).children('.glyphicon').toggleClass('glyphicon-fast-backward');
				$(this).children('.glyphicon').toggleClass('glyphicon-fast-forward');

			});
		$('#plot').click(function()
			{
				var data = $('#legend').text();
				data = data.split(' ');
				data = data[0].substring(0, data[0].length - 1);
				$('#x0-input').val(data);
			});
		$('#calc-btn-mmn').click(function()
			{
				$('#mm-ok-message').addClass('hidden');
				$('.iter-table').addClass('hidden');
				if(inputCorrect())
				{
					var p = new ModNewtonMethod(func);
					if(p.calc() == true)
					{
						$('#invalid-input').addClass('hidden');
						$('#mm-result').text(func.result);
						$('#mm-ok-message').removeClass('hidden');
						$('#iter-result').html(showIterations(p.getIterations()));
						$('.iter-table').removeClass('hidden');
					}
					else
					{
						$('#invalid-input').removeClass('hidden');
					}
				}
			});
		$('#calc-btn-mr').click(function()
			{
				$('#mm-ok-message').addClass('hidden');
				$('.iter-table').addClass('hidden');
				if(inputCorrect())
				{
					var p = new RelaxationMethod(func);
					if(p.calc() == true)
					{
						$('#invalid-input').addClass('hidden');
						$('#mm-result').text(func.result);
						$('#mm-ok-message').removeClass('hidden');
						$('#iter-result').html(showIterations(p.getIterations()));
						$('.iter-table').removeClass('hidden');
					}
					else
					{
						$('#invalid-input').removeClass('hidden');
					}
				}
			});

		
	}); 

var inputCorrect = function()
{
	var x = $('#x0-input').val();
	var eps = $('#eps-input').val();
	var ok = true;
	if(isNaN(x) || x.length == 0)
	{
		$('#inputX-error').removeClass('hidden');
		ok = false;
	}
	else
	{
		$('#inputX-error').addClass('hidden');
		func.x0 = parseFloat(x);
	}
	if(isNaN(eps) || eps.length == 0 || parseFloat(eps) == 0)
	{
		$('#inputE-error').removeClass('hidden');
		ok = false;
	}
	else
	{
		$('#inputE-error').addClass('hidden');
		func.eps = parseFloat(eps);
	}
	return ok;
}

var draw = function()
 {
     try
      	{
	      functionPlot(
	      {
	        target: '#plot',
	        yDomain: [-10, 10],
	        xDomain: [-10, 10],
	        width: 600,
  			height: 600,
  			grid: true,
	        data: [
	        {
	          fn: math.eval('f(x) = (x-1)^2 - sin(2*x)'),
	          color: '#0000000'
	        }/*,
	        {
	          fn: math.eval('f(x) = 2* (x-1) - 2* cos(2*x)'),
	          color: '#0000000'
	        }*/]
	      });
	    }
	    catch (err)
	    {
	      console.log(err);
	      alert(err);
	    }
 };
var showIterations = function(iterations)
{
	var table = '<tr><th>№</th><th>Значення</th></tr>';
		for(var i in iterations)
		{
			if(i != iterations.length - 1)
			{
				var row = '<tr><td>' + i + '</td><td>' + iterations[i] + '</td></tr>';
			}
			else
			{
				var row = '<tr><th>Результат:</th><th>' + iterations[i] + '</th></tr>';
			}
			table += row;
		}
		return table;
};
