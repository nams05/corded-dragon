const {body} = require('express-validator/check');

exports.validate = (method) => {
    switch(method){
        case 'update': {
            return [
                body('securityId','Field securityId is missing').exists(),
                body('userId','Field userId is missing').exists(),
                body('price',' Field price is missing').exists(),
                body('quantity','Field quantity is missing').exists(),
                body('transactionType').isIn(['BUY','SELL','UPDATE','REMOVE'])
            ]

        }
    }
}

exports.validationHandler = next => result => {
    if (result.isEmpty()) return
    if (!next)
      return Promise.reject(result.array().map(i => `'${i.param}': ${i.msg}`).join(' '))
  else
    return next(
      Promise.reject(result.array().map(i => `'${i.param}': ${i.msg}`).join(' '))
    )
}