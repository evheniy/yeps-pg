const App = require('yeps');
const srv = require('yeps-server');
const error = require('yeps-error');
const chai = require('chai');
const chaiHttp = require('chai-http');
const Router = require('yeps-router');
const pg = require('..');
const pool = require('../pool');

const expect = chai.expect;

chai.use(chaiHttp);
let app;
let router;
let server;

describe('YEPS pg test', () => {
  beforeEach(() => {
    app = new App();
    app.all([
      error(),
      pg(),
    ]);
    router = new Router();
    server = srv.createHttpServer(app);
  });

  afterEach(() => {
    server.close();
  });

  it('should test middleware', async () => {
    let isTestFinished1 = false;
    let isTestFinished2 = false;

    app.then(async (ctx) => {
      const result = await ctx.pg.query('SELECT 1+1 AS res;');

      expect(result).is.a('object');
      expect(result.rowCount).to.be.equal(1);
      expect(result.rows).is.a('array');
      expect(result.rows.length).to.be.equal(1);
      expect(result.rows[0]).to.have.property('res');
      expect(result.rows[0].res).to.exist;
      expect(result.rows[0].res).to.be.equal(2);

      isTestFinished1 = true;

      ctx.res.writeHead(200);
      ctx.res.end(JSON.stringify(result.rows[0].res));
    });

    await chai.request(server)
      .get('/')
      .send()
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res.text).to.be.equal('2');
        isTestFinished2 = true;
      });

    expect(isTestFinished1).is.true;
    expect(isTestFinished2).is.true;
  });

  it('should test middleware with connection', async () => {
    let isTestFinished1 = false;
    let isTestFinished2 = false;

    app.then(async (ctx) => {
      const client = await ctx.pg.connect();

      expect(client).to.exist;
      expect(client.query).to.be.a('function');

      const result = await client.query('SELECT 1+1 AS res;');

      client.release();

      expect(result).is.a('object');
      expect(result.rowCount).to.be.equal(1);
      expect(result.rows).is.a('array');
      expect(result.rows.length).to.be.equal(1);
      expect(result.rows[0]).to.have.property('res');
      expect(result.rows[0].res).to.exist;
      expect(result.rows[0].res).to.be.equal(2);

      isTestFinished1 = true;

      ctx.res.writeHead(200);
      ctx.res.end(JSON.stringify(result.rows[0].res));
    });

    await chai.request(server)
      .get('/')
      .send()
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res.text).to.be.equal('2');
        isTestFinished2 = true;
      });

    expect(isTestFinished1).is.true;
    expect(isTestFinished2).is.true;
  });

  it('should test router', async () => {
    let isTestFinished1 = false;
    let isTestFinished2 = false;

    router.catch().then(async (ctx) => {
      const result = await ctx.pg.query('SELECT 1+1 AS res;');

      expect(result).is.a('object');
      expect(result.rowCount).to.be.equal(1);
      expect(result.rows).is.a('array');
      expect(result.rows.length).to.be.equal(1);
      expect(result.rows[0]).to.have.property('res');
      expect(result.rows[0].res).to.exist;
      expect(result.rows[0].res).to.be.equal(2);

      isTestFinished1 = true;

      ctx.res.writeHead(200);
      ctx.res.end(JSON.stringify(result.rows[0].res));
    });

    app.then(router.resolve());

    await chai.request(server)
      .get('/')
      .send()
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res.text).to.be.equal('2');
        isTestFinished2 = true;
      });

    expect(isTestFinished1).is.true;
    expect(isTestFinished2).is.true;
  });

  it('should test router with connection', async () => {
    let isTestFinished1 = false;
    let isTestFinished2 = false;

    router.catch().then(async (ctx) => {
      const client = await ctx.pg.connect();

      expect(client).to.exist;
      expect(client.query).to.be.a('function');

      const result = await client.query('SELECT 1+1 AS res;');

      client.release();

      expect(result).is.a('object');
      expect(result.rowCount).to.be.equal(1);
      expect(result.rows).is.a('array');
      expect(result.rows.length).to.be.equal(1);
      expect(result.rows[0]).to.have.property('res');
      expect(result.rows[0].res).to.exist;
      expect(result.rows[0].res).to.be.equal(2);

      isTestFinished1 = true;

      ctx.res.writeHead(200);
      ctx.res.end(JSON.stringify(result.rows[0].res));
    });

    app.then(router.resolve());

    await chai.request(server)
      .get('/')
      .send()
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res.text).to.be.equal('2');
        isTestFinished2 = true;
      });

    expect(isTestFinished1).is.true;
    expect(isTestFinished2).is.true;
  });

  it('should test pool', async () => {
    const result = await pool.query('SELECT 1+1 AS res;');

    expect(result).is.a('object');
    expect(result.rowCount).to.be.equal(1);
    expect(result.rows).is.a('array');
    expect(result.rows.length).to.be.equal(1);
    expect(result.rows[0]).to.have.property('res');
    expect(result.rows[0].res).to.exist;
    expect(result.rows[0].res).to.be.equal(2);
  });

  it('should test pool with connection', async () => {
    const client = await pool.connect();

    expect(client).to.exist;
    expect(client.query).to.be.a('function');

    const result = await client.query('SELECT 1+1 AS res;');

    client.release();

    expect(result).is.a('object');
    expect(result.rowCount).to.be.equal(1);
    expect(result.rows).is.a('array');
    expect(result.rows.length).to.be.equal(1);
    expect(result.rows[0]).to.have.property('res');
    expect(result.rows[0].res).to.exist;
    expect(result.rows[0].res).to.be.equal(2);
  });

  it('should test transaction', async () => {
    let isTestFinished1 = false;
    let isTestFinished2 = false;

    const client = await pool.connect();

    try {
      await client.query('BEGIN');
      await client.query('SELECT 1+1 AS res;');
      await client.query('COMMIT');
      isTestFinished1 = true;
    } catch (e) {
      await client.query('ROLLBACK');
      isTestFinished2 = true;
    } finally {
      client.release();
    }

    expect(isTestFinished1).is.true;
    expect(isTestFinished2).is.false;
  });

  it('should test transaction with error', async () => {
    let isTestFinished1 = false;
    let isTestFinished2 = false;

    const client = await pool.connect();

    try {
      await client.query('BEGIN');
      await client.query('DELETE FROM users;');
      await client.query('COMMIT');
      isTestFinished1 = true;
    } catch (e) {
      await client.query('ROLLBACK');
      isTestFinished2 = true;
    } finally {
      client.release();
    }

    expect(isTestFinished1).is.false;
    expect(isTestFinished2).is.true;
  });
});
