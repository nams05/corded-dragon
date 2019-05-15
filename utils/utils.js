const {body} = require('express-validator/check');

exports.validate = (method) => {
    switch(method){
        case 'update': {
            return [
                body('securityId','securityId doesn\'t exists').exists(),
                body('userId','userId doesn\'t exists').exists(),
                body('price','price doesn\' t exists').exists(),
                body('quantity','quantity doesn\' t exists').exists(),
                body('transactionType').isIn(['BUY','SELL','UPDATE','REMOVE'])
            ]

        }
    }
}