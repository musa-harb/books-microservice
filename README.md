# books-microservice
Books Reading List Microservice

REQUEST DATA:
To request data, send a GET request to:
http://localhost:PORT/?keyword="search query"

The search query is the search keyword that will be used to 
search Google Books API.

The request should include a query with "keyword"

RECEIVE data:
The microservice sends JSON data to the requester which includes an array of JSON objects, each object is a book with properties that include book's information.

UML Sequence Diagram:
