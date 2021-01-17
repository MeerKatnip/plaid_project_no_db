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

app.post('/get_link_token', async(req, res) => {
    const response = await client.getLinkToken(linkToken).catch((err) => {
      if(!linkToken){
          return "no link token"
      }
    });
  })

const PORT = 5000;

app.listen(PORT, () => console.log(`listening on port ${PORT}!`));
