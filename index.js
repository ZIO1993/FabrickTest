//Costanti
const https = require('https')
const hostname='sandbox.platfr.io'
const apiKey='FXOVVXXHVCPVPBZXIJOBGUGSKHDNFRRQJP'
const authSchema='S2S'
const accountId='14537780'
const fromAccountingDate='2019-01-01'
const toAccountingDate='2019-12-01'

//Eseguo le operazioni
letturaSaldo()
bonifico()
letturaTransazioni()

//Operazione: Lettura saldo
function letturaSaldo() {
  
  const optionsGet = {
    hostname: hostname,
    method: 'GET',
    path:'/api/gbs/banking/v4.0/accounts',
    headers:{
        'Content-Type': 'application/json',
        'Api-Key': apiKey,
        'Auth-Schema': authSchema,
        'accountId':accountId
    }
  }

  const req = https.request(optionsGet, res => {
    res.on('data', d => {
      console.log("Lettura saldo:")
      data=JSON.parse(d.toString()).payload.list[0]
      console.log(JSON.stringify(data, null, 2))
      console.log(' ')
    })
  })

  req.on('error', error => {
    console.error(error)
  })

  req.end()
}

//Operazione: Bonifico
function bonifico() {

  const postData = JSON.stringify({
    'X-Time-Zone': '',
    "creditor": {
      "name": "John Doe",
      "account": {
        "accountCode": "IT23A0336844430152923804660",
        "bicCode": "SELBIT2BXXX"
      },
      "address": {
        "address": null,
        "city": null,
        "countryCode": null
      }
    },
    "executionDate": "2019-04-01",
    "uri": "REMITTANCE_INFORMATION",
    "description": "Payment invoice 75/2017",
    "amount": 800,
    "currency": "EUR",
    "isUrgent": false,
    "isInstant": false,
    "feeType": "SHA",
    "feeAccountId": "45685475",
    "taxRelief": {
      "taxReliefId": "L449",
      "isCondoUpgrade": false,
      "creditorFiscalCode": "56258745832",
      "beneficiaryType": "NATURAL_PERSON",
      "naturalPersonBeneficiary": {
        "fiscalCode1": "MRLFNC81L04A859L",
        "fiscalCode2": null,
        "fiscalCode3": null,
        "fiscalCode4": null,
        "fiscalCode5": null
      },
      "legalPersonBeneficiary": {
        "fiscalCode": null,
        "legalRepresentativeFiscalCode": null
      }
    }
  });

  const optionsPost = {
      hostname: 'sandbox.platfr.io',
      method: 'POST',
      path:`/api/gbs/banking/v4.0/accounts/${accountId}/payments/money-transfers`,
      headers:{
          'Content-Type': 'application/json',
          'Api-Key': apiKey,
          'Auth-Schema': authSchema,
          'accountId': accountId,
          'Content-Length': postData.length
    }
  }

  const req = https.request(optionsPost, res => {

    res.on('data', d => {
      console.log("Bonifico:")
      code=JSON.parse(d.toString()).errors[0].code
      description=JSON.parse(d.toString()).errors[0].description
      console.log(JSON.stringify({code, description}, null, 2))
      console.log(' ')
    })
  })

  req.on('error', error => {
    console.error(error)
  })
  req.write(postData);
  req.end()
}

//Operazione: Lettura Transazioni
function letturaTransazioni() {
  
  const optionsGet = {
    hostname: hostname,
    method: 'GET',
    path:`/api/gbs/banking/v4.0/accounts/${accountId}/transactions?fromAccountingDate=${fromAccountingDate}&toAccountingDate=${toAccountingDate}`,
    headers:{
      'Content-Type': 'application/json',
      'Api-Key': apiKey,
      'Auth-Schema': authSchema,
      'accountId':accountId
    }
  }
  
  const req = https.request(optionsGet, res => {
    console.log("Lettura transazioni:")
    res.on('data', d => {
      process.stdout.write(d)
      console.log(" ")
    })
  })
  
  req.on('error', error => {
    console.error(error)
  })
  
  req.end()
}