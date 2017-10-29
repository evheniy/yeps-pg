# YEPS PostgreSQL


YEPS PostgreSQL client

[![NPM](https://nodei.co/npm/yeps-pg.png)](https://npmjs.org/package/yeps-pg)

[![npm version](https://badge.fury.io/js/yeps-pg.svg)](https://badge.fury.io/js/yeps-pg)
[![Build Status](https://travis-ci.org/evheniy/yeps-pg.svg?branch=master)](https://travis-ci.org/evheniy/yeps-pg)
[![Coverage Status](https://coveralls.io/repos/github/evheniy/yeps-pg/badge.svg?branch=master)](https://coveralls.io/github/evheniy/yeps-pg?branch=master)
[![Linux Build](https://img.shields.io/travis/evheniy/yeps-pg/master.svg?label=linux)](https://travis-ci.org/evheniy/)

[![Dependency Status](https://david-dm.org/evheniy/yeps-pg.svg)](https://david-dm.org/evheniy/yeps-pg)
[![devDependency Status](https://david-dm.org/evheniy/yeps-pg/dev-status.svg)](https://david-dm.org/evheniy/yeps-pg#info=devDependencies)
[![NSP Status](https://img.shields.io/badge/NSP%20status-no%20vulnerabilities-green.svg)](https://travis-ci.org/evheniy/yeps-pg)

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/evheniy/yeps-pg/master/LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/evheniy/yeps-pg.svg)](https://github.com/evheniy/yeps-pg/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/evheniy/yeps-pg.svg)](https://github.com/evheniy/yeps-pg/network)
[![GitHub issues](https://img.shields.io/github/issues/evheniy/yeps-pg.svg)](https://github.com/evheniy/yeps-pg/issues)
[![Twitter](https://img.shields.io/twitter/url/https/github.com/evheniy/yeps-pg.svg?style=social)](https://twitter.com/intent/tweet?text=Wow:&url=%5Bobject%20Object%5D)


## How to install

    npm i -S yeps-pg
    
## How to use

### Docker

If you use docker you can start PostgreSQL:

    npm run test:db:start
    
And stop it:

    npm run test:db:stop

### Config

config/default.json

    {
        "pg": {
            "host": "127.0.0.1",
            "port": 5432,
            "user": "user",
            "password": "password",
            "database": "database"
         }
    }

### Middleware

    const App = require('yeps');
    const app = new App();
    const error = require('yeps-error');
    const logger = require('yeps-logger');
    
    const pg = require('yeps-pg');
    
    app.all([
        error(),
        logger(),
        pg(),
    ]);
    
    app.then(async ctx => {
        const result = await ctx.pg.query('SELECT * FROM users;');
    });
    
And with connection:

    const App = require('yeps');
    const app = new App();
    const error = require('yeps-error');
    const logger = require('yeps-logger');
    
    const pg = require('yeps-pg');
    
    app.all([
        error(),
        logger(),
        pg(),
    ]);
    
    app.then(async ctx => {
        const client = await ctx.pg.connect();
        const result = await client.query('SELECT * FROM users;');
        client.release();
    });
    
### In module

    const pool = require('yeps-pg/pool');
    const logger = require('yeps-logger/logger');
    
    async () => {
        try {
            const result = await pool.query('SELECT * FROM users;');
        } catch (error) {
            logger.error(error);
        }
    };
    
And with connection:

    const pool = require('yeps-pg/pool');
    const logger = require('yeps-logger/logger');
    
    async () => {
        try {
            const client = await ctx.pg.connect();
            const result = await client.query('SELECT * FROM users;');
            client.release();
        } catch (error) {
            logger.error(error);
        }
    };
    
### Transactions

    const App = require('yeps');
    const app = new App();
    const error = require('yeps-error');
    const logger = require('yeps-logger');
    
    const pg = require('yeps-pg');
    
    app.all([
        error(),
        logger(),
        pg(),
    ]);
    
    app.then(async ctx => {
        const client = await ctx.pg.connect();
        
        try {
            await client.query('BEGIN');
            await client.query('DELETE FROM users;');
            await client.query('COMMIT');
        } catch (e) {
            await client.query('ROLLBACK');
        } finally {
            client.release();
        }
    });
    
In module:

    const pool = require('yeps-pg/pool');
    const logger = require('yeps-logger/logger');
    
    async () => {
        const client = await pool.connect();
    
        try {
            await client.query('BEGIN');
            await client.query('DELETE FROM users;');
            await client.query('COMMIT');
        } catch (error) {
            logger.error(error);
            await client.query('ROLLBACK');
        } finally {
            client.release();
        }
    };
    
#### [YEPS documentation](http://yeps.info/)


#### Dependencies:

* [node-postgres](https://node-postgres.com/) - PostgreSQL node client
* [config](https://github.com/lorenwest/node-config) - node.js config
