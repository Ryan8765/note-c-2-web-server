const express = require('express');

//handlebars is a view templating engine that allows you to use {{varialbe}} in your html. 
const hbs = require('hbs');

const fs = require('fs');


//this creates functionality for allowing partials to be used. 
hbs.registerPartials(__dirname + '/views/partials')

//this creates an application
var app = express();

//setting up the view engine for express.  we want to use handlebars.  "views" is the default direcotry that handlebars looks at for templating.   When creating your files in the views folder, the extension on the files is ".hbs".
app.set('view engine', 'hbs');

//this allows middleware to be used with express. This is a built in piece of middleware.  This tells express to serve up /public folder.  For instance if  you want to go to public/help.html you would go to localhost:3000/help.html
app.use(express.static(__dirname + '/public'));

//this is going to register another middelware.  app.use is used to register middleware.  "next" is used for when you have done what you need to in the middleware and want to move on.  For instance, you do a bunch of code in the middleware (check if a user is really allowed in a certain place of the application), and when you are done with that code, you run the next() method.  If you don't call next(), it will never end.  Middleware is used inbetween requests, you can check certain things before giving access, log times users entered a page etc.  
app.use((req, res, next)=> {
	var now = new Date().toString();
	//to see all the methods available on the req, res objects - go to expressjs.com and look at the documenation.
	var log = `${now}: ${req.method} ${req.url}`; 
	//print the log to the command line
	console.log(log);
	//print the log to a logs file.  first argument is filename, second is what to write, third is a callback used if there is an error logging to the file
	fs.appendFile('server.log', log + '\n', (err) => {
		if(err) {
			console.log('Unable to append to server.log');
		}
	});
	next();
});

//creating a piece of middleware that never uses next() to display a page that is shown to users when the site is down for maintenance.  Note, middleware works in the order it is laid out in the file.  So if you render a webpage at say localhost:3000/somePage BEFORE the middleware code, that particular page "somePage" will still render.

// app.use( (req, res, next)=> {
// 	//never use the next function and always return the maintenance page. 
// 	res.render('maintenance.hbs');
// });

//this allows you to create helper functions that you can use in your views.  For instance, if you wanted to run this in the view you would just use: {{getCurrentYear}}.  Handlebars first looks for a helper function in the view to use, if it doesn't find a helper function, it will look for a variable.  So no special syntax is needed, handlebars does the lifting behind the scenes. 
hbs.registerHelper('getCurrentYear_H', ()=> {
	return new Date().getFullYear();
});

//to usethis in the view, first you reference the helper function name, then you enter a space, and then you enter the argument you're going to use for "text".  For instance, {{screamIt welcomeMessage}} - where welcomeMessage will be passwed asthe "text"
hbs.registerHelper('screamIt_H', (text)=> {

	return text.toUpperCase();

});

// //you can register routes like below
// app.get('/', (req, res)=>{

// 	//this is the repsonse for the http request.  So the body being sent back will be "hello express"
// 	//res.send('<h1>Hello express</h1>');

// 	//you can send json data like below.  Express automatically converts objects to JSON
// 	res.send({
// 		name: 'Andrew',
// 		likes: [
// 			'Biking',
// 			'Cities'
// 		]
// 	});
// });

app.get('/', (req, res)=> {

	res.render('home.hbs', {
		pageTitle: 'Home',
		currentYear: new Date().getFullYear(),
		welcomeMessage: 'Welcome to the homepage for this particular application'
	});

});



app.get('/about', (req, res) => {
	//using this syntax allows you to setup your current view with a view engine.  This looks in your views folder when you use "render".  The second argument for render, allows you to pass information to the view {{pageTitle}} etc. 
	res.render('about.hbs', {
		pageTitle: 'About Page',
		currentYear: new Date().getFullYear()
	});
});




app.get('/bad', (req, res) => {

	res.send({
		errorMessage: "Something fucked up"
	});

});

//this binds our application to a port on our machine to listen for requests.  once this is in place, run nodemon on the command line and run this file.  This does take a second option.  It lets us do something once the server is up and running.    
app.listen(3000, ()=> {
	console.log("server is up on port 3000");
});