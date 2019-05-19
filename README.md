# Portfolio Management API
It is a portfolio management API built on nodejs, express and mongoDb.
The API allows adding/deleting/updating trades and can do basic return calculations.

## Installation
Install nodejs and mongodb. Start MongoDb and node server. 
```sh
$ git clone git@gitlab.com:nams05/portfolio-tracker.git
$ cd portfolio-tracker
$ npm install
$ npm start
```
## Running the application using any API testing tool like Postman, Insomnia etc
Set the header - Content-Type: application/json
1. Buy/Sell a securtiy
```sh
$ Send a POST request to http://35.238.38.7:80/updateTrade
$ Request: JSON
    {
        "securityId": 100,
        "securityName": "NamrataG",
        "securitySymbol": "NG",
        "userId": 1000,
        "quantity": 1,
        "price":60,
        "transactionType":  "BUY"  // values allowed: "BUY", "SELL", "UPDATE", "REMOVE"      
    }
$ Returns a Respose:JSON
    {
        "status": "success",
        "trade": {
            "tradeId": 1,
            "securityId": 100,
            "userId": 1000,
            "quantity": 1,
            "createdAt": "2019-05-18T22:17:31.520Z",
            "updatedAt": "2019-05-18T22:17:31.520Z",
            "transactionType": "BUY"
        }
    }
```
2. Update a trade
```sh
$ Send a POST request to http://35.238.38.7:80/updateTrade
$ Request: JSON
    {
        "tradeId": 1,
        "securityId": 100,
        "userId": 1000,
        "quantity": 2,
        "price":60,
        "transactionType":  "UPDATE"
    }
$ Returns a Response: JSON
    {
        "status": "success",
        "trade": {
            "tradeId": 1,
            "securityId": 100,
            "userId": 1000,
            "quantity": 2,
            "createdAt": "2019-05-18T21:22:38.352Z",
            "updatedAt": "2019-05-19T10:08:22.667Z",
            "transactionType": "BUY"
        }
    }  
```

3. Delete a trade
```sh
$ Send a POST request to http://35.238.38.7:80/updateTrade
$ Request: JSON
    {
        "tradeId": 1,
        "transactionType":  "REMOVE"
    }
$ Returns a Response: JSON
    {
        "status": "success",
        "trade": {
            "tradeId": 1,
            "securityId": 100,
            "userId": 1000,
            "quantity": 2,
            "createdAt": "2019-05-18T21:22:38.352Z",
            "updatedAt": "2019-05-19T10:39:52.169Z",
            "transactionType": "BUY"
        }
    }
```

4. Fetch user portfolio with userId: 1000
```sh
$ Send a GET request to http://35.238.38.7:80/fetchPortfolio/1000
$ Returns a Response: JSON
    {
        "status": "success",
        "portfolio": {
            "100": [
            {
                "tradeId": 1,
                "securityId": 100,
                "userId": 1000,
                "quantity": 2,
                "createdAt": "2019-05-18T21:22:38.352Z",
                "updatedAt": "2019-05-19T10:39:52.169Z",
                "transactionType": "BUY"
            },
            {
                "tradeId": 2,
                "securityId": 100,
                "userId": 1000,
                "quantity": 3,
                "createdAt": "2019-05-18T21:44:10.918Z",
                "updatedAt": "2019-05-18T21:44:10.918Z",
                "transactionType": "BUY"
            },
            {
                "tradeId": 3,
                "securityId": 100,
                "userId": 1000,
                "quantity": 3,
                "createdAt": "2019-05-18T21:44:43.886Z",
                "updatedAt": "2019-05-18T21:44:43.886Z",
                "transactionType": "BUY"
            },
            {
                "tradeId": 4,
                "securityId": 100,
                "userId": 1000,
                "quantity": 1,
                "createdAt": "2019-05-18T22:03:01.155Z",
                "updatedAt": "2019-05-18T22:03:01.155Z",
                "transactionType": "SELL"
            }
        ]
    }
}
```
5. Fetch user holdings with userId: 1000
```sh
$ Send a GET request to http://35.238.38.7:80/fetchHoldings/1000/
$ Returns a Response: JSON
    {
        "status": "success",
        "holdings": {
            "100": {
            "buyQuantity": 6,
            "quantity": 5,
            "averageBuyPrice": 56,
            "securityName": "NamrataG",
            "securitySymbol": "NG",
            "securityType": "ST",
            "ltp": 60
            }
        }
    }
```

6. Fetch user returns with userId: 1000
```sh
$ Send a GET request to http://35.238.38.7:80/fetchReturns/1000/
$ Returns a Response: JSON
    {
        "status": "success",
        "returns": {
            "profit": 20
        }
    }
```

## To be Noted
1. User needs to send the securityName and securitySymbol for the 1st trade. This is because            currently our API is fetching securityName and securitySymbol from the trade itself. 
2. Username is optional while trading. It works the same way as point 1.
