$(document).ready(function()
	{

		$('#btn-calc').click(function()
		{
			setTimeout(function()
			{
				var FX1 = $('#func1').val();
				var FX2 = $('#func2').val();
				var FX3 = $('#func3').val();
				var f = 'f(x) = e^(x*x)';
				if(!FX1 || !FX2)
					return;
				draw(FX1, FX2, FX3, f);	
			}, 500);
			
		});
		
}); 

var draw = function(FX1, FX2, FX3, fx)
 {
     try
      	{
	      functionPlot(
	      {
	        target: '#plot',
	        yDomain: [0, 100],
	        xDomain: [0, 3],
	        width: 800,
  			height: 800,
  			grid: true,
	        data: [
	        {
	          fn: math.eval(FX1),
	        },
	        {
	          fn: math.eval(FX2),
	        },
	        {
	          fn: math.eval(fx),
	        },/*
	         {
	          fn: math.eval('f(x) = (sign(sign((2-x)(x-1))+1)*sign(sign(2-x)+1)-(((sign(abs(x-2)))+ 1) mod 2)-(((sign(abs(x-1)))+ 1) mod 2))*2*x '),
	        },/*s
	        {
	          fn: math.eval('f(x) = e^(x*x)'),
	        }//*/
			]
	      });
	    }
	    catch (err)
	    {
	      console.log(err);
	      alert(err);
	    }
 };
