const http = require('http');
const hostname = 'localhost';
const port = 3000;

const server = http.createServer();
const database = {
	users: [
		{
			id: '123',
			name: 'Alex',
			email: 'alex@hotmail.com',
			password: 'password',
			entries: 0,
			joined: new Date(),
		},
		{
			id: '124',
			name: 'Roxie',
			email: 'roxie@hotmail.com',
			password: 'pazzword',
			entries: 0,
			joined: new Date(),
		}
	],
}



server.listen(port, hostname, ()=> {
    console.log(`Server running on http://${hostname}:${port}`)
})