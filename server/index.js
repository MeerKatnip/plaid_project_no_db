const express = require('express');
const bodyParser = require('body-parser');
const keys = require('./config/keys');
const cors = require('cors');
const plaid = require('plaid');

const app = express();
app.use(cors())
app.use(bodyParser.json());

const client = new plaid.Client({
    clientID: keys.PLAID_CLIENT_ID,
    secret: keys.PLAID_SECRET,
    env: plaid.environments.sandbox
    });

console.log(client)

//create temporary link_token

app.post('/create_link_token', async (req, res) => {
    try{
        const response = await client.createLinkToken({
            user: {
                client_user_id: clientID,
            },
            client_name: 'Plaid Test App',
            products: ['auth', 'transactions'],
            country_codes: ['US'],
            language: 'en',
            webhook: 'https://sample-web-hook.com',
            account_filters: {
                depository: {
                    account_subtypes: ['checking', 'savings'],
                },
            },
        })
        return res.send({link_token: response.link_token})
    } catch (err) {
        return res.send({err: err.message})
    }
});

app.post('/get_access_token', async(req, res) => {
    //destructure publicToken in response data
    const {publicToken} = req.body
    const response = await client
      .exchangePublicToken(publicToken)
      .catch((err) => {
        if(!publicToken){
          return "no public token"
        }
      });
    const itemId = response.item_id;
    return res.send({access_token: response.access_token}) 
  })
  app.post('/transactions', async(req, res) =>{
    const {accessToken} = req.body
    const response = await client
    .getTransactions(accessToken, '2020-01-01', '2021-01-31', {
      count: 250,
      offset: 0,
    })
    .catch((err) => {
      if(!accessToken){
        return "no access token"
      }
    });
    const transactions = response.transactions
    console.log(transactions)
    return res.send({transactions: transactions}) 
  })

const PORT = 5000;

app.listen(PORT, () => console.log(`listening on port ${PORT}!`));
