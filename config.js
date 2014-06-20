/**
 * 
 */
exports.config = {
		routes:[
		        	{from:'/page',to:'/ui/index.html'},
		        	{from:'/user/<id:([0-9]*)/',to:'/ui/user.html'}
		       ],
		errors:{
			
		},
		modules:[
		         ]
}

