To deploy
1. Define deploy/.env file following the example with your tokens and configuration
2. Run `node deploy-commands.js`
3. Run the following command `docker-compose --env-file deploy/.env up --build`