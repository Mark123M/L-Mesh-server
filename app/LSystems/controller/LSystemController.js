/* eslint-disable guard-for-in */
/* eslint-disable camelcase */
const pool = require('../../../db');

const createProduction = async (symbol, data, lsystem_id, client) => {
  try {
    const newProduction = await client.query(`
      INSERT INTO public."Production"(symbol, lsystem_id)
      VALUES($1, $2)
      RETURNING production_id;`,
    [symbol, lsystem_id]);

    const rulesetPromises = [];
    data.forEach((rs) => {
      const promise = createRuleset(rs, newProduction.rows[0].production_id,
          client);
      rulesetPromises.push(promise);
    });
    await Promise.all(rulesetPromises);
  } catch (err) {
    throw err;
  }
};

const createRuleset = async (data, production_id, client) => {
  try {
    const newRuleset = await client.query(`
      INSERT INTO public."Ruleset"(condition, production_id)
      VALUES($1, $2)
      RETURNING ruleset_id;`,
    [data[0], production_id]);

    const rulePromises = [];
    data[1].forEach((r) => {
      const promise = createRule(r, newRuleset.rows[0].ruleset_id, client);
      rulePromises.push(promise);
    });
    await Promise.all(rulePromises);
  } catch (err) {
    throw err;
  }
};

const createRule = async (data, ruleset_id, client) => {
  try {
    await client.query(`
      INSERT INTO public."Rule"(rule, prob, ruleset_id)
      VALUES($1, $2, $3);`,
    [data[0], data[1], ruleset_id]);
  } catch (err) {
    throw err;
  }
};

const createConstant = async (name, val, lsystem_id, client) => {
  try {
    await client.query(`
      INSERT INTO public."Constant"(name, value, lsystem_id)
      VALUES($1, $2, $3);`,
    [name, val, lsystem_id]);
  } catch (err) {
    throw err;
  }
};

const createImport = async (name, val, lsystem_id, client) => {
  try {
    await client.query(`
      INSERT INTO public."Import"(symbol, file, lsystem_id)
      VALUES($1, $2, $3);`,
    [name, val, lsystem_id]);
  } catch (err) {
    throw err;
  }
};

const deleteLSystem = async (id) => {
  try {
    await pool.query(`
      DELETE FROM public."LSystem" l
      WHERE l.lsystem_id = $1`,
    [id]);
    // deleteProduction(id);
  } catch (err) {
    throw err;
  }
};

module.exports = {
  getAll: async (req, res) => {
    try {
      const allLSystem = await pool.query(`
        SELECT * FROM public."LSystem" l
        WHERE l.profile_id = $1
        ORDER BY l.lsystem_id ASC;`,
      [req.user.profile_id]);
      res.status(200).json(allLSystem.rows);
    } catch (err) {
      res.status(200).json(err);
    }
  },
  createLSystem: async (req, res) => {
    const client = await pool.connect();
    try {
      await client.query('BEGIN;');
      const newLSystem = await client.query(
          `INSERT INTO public."LSystem"(name, axiom, profile_id)
          VALUES($1, $2, $3)
          RETURNING lsystem_id;`,
          [req.body.name, req.body.axiom, req.user.profile_id]);

      const productionPromises = [];
      req.body.productions.forEach((p) => {
        const promise = createProduction(p[0], p[1],
            newLSystem.rows[0].lsystem_id, client);
        productionPromises.push(promise);
      });
      await Promise.all(productionPromises);

      const constantPromises = [];
      req.body.constants.forEach((c) => {
        const promise = createConstant(c[0], c[1],
            newLSystem.rows[0].lsystem_id, client);
        constantPromises.push(promise);
      });
      await Promise.all(constantPromises);

      const importPromises = [];
      req.body.imports.forEach((i) => {
        const promise = createImport(i[0], i[1],
            newLSystem.rows[0].lsystem_id, client);
        importPromises.push(promise);
      });
      await Promise.all(importPromises);
      await client.query('COMMIT;');
      res.status(200).json(newLSystem);
    } catch (err) {
      await client.query('ROLLBACK;');
      res.status(200).json(err);
    } finally {
      client.release();
    }
  },
  updateLSystem: async (req, res) => {
    // update l-system by id and then replace productions -> rulesets -> rules
    // if creation fails, previous version is rolled back
    const client = await pool.connect();
    try {
      await client.query('BEGIN;');
      const newLSystem = await client.query(`
      UPDATE public."LSystem"
      SET axiom=$1, name=$2
      WHERE lsystem_id=$3;`,
      [req.body.axiom, req.body.name, req.params.id]);

      await client.query(`
      DELETE FROM public."Production" p
      WHERE p.lsystem_id = $1`,
      [req.params.id]);

      await client.query(`
      DELETE FROM public."Constant" c
      WHERE c.lsystem_id = $1`,
      [req.params.id]);

      await client.query(`
      DELETE FROM public."Import" i
      WHERE i.lsystem_id = $1`,
      [req.params.id]);

      const productionPromises = [];
      req.body.productions.forEach((p) => {
        const promise = createProduction(p[0], p[1],
            req.params.id, client);
        productionPromises.push(promise);
      });
      await Promise.all(productionPromises);

      const constantPromises = [];
      req.body.constants.forEach((c) => {
        const promise = createConstant(c[0], c[1],
            req.params.id, client);
        constantPromises.push(promise);
      });
      await Promise.all(constantPromises);

      const importPromises = [];
      req.body.imports.forEach((i) => {
        const promise = createImport(i[0], i[1],
            req.params.id, client);
        importPromises.push(promise);
      });
      await Promise.all(importPromises);
      await client.query('COMMIT;');
      res.status(200).json(newLSystem);
    } catch (err) {
      await client.query('ROLLBACK;');
      res.status(200).json(err);
    } finally {
      client.release();
    }
  },
  deleteLSystem: async (req, res) => {
    deleteLSystem(req.params.id);
    res.status(200).json(`Deleted LSystem.`);
  },
};
