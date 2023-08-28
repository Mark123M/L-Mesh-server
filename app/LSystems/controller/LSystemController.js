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


const getLSystem = async (data) => {
  try {
    const allProductions = await pool.query(`
        SELECT * FROM public."Production" p
        WHERE p.lsystem_id = $1
        ORDER BY p.production_id ASC;`,
    [data.lsystem_id]);

    const allConstants = await pool.query(`
        SELECT * FROM public."Constant" c
        WHERE c.lsystem_id = $1
        ORDER BY c.constant_id ASC;`,
    [data.lsystem_id]);

    const allImports = await pool.query(`
        SELECT * FROM public."Import" i
        WHERE i.lsystem_id = $1
        ORDER BY i.import_id ASC;`,
    [data.lsystem_id]);

    const productionPromises = [];
    allProductions.rows.forEach((p) => {
      const promise = getProduction(p);
      productionPromises.push(promise);
    });
    const allProductionsJSON = await Promise.all(productionPromises);

    const constantPromises = [];
    allConstants.rows.forEach((c) => {
      const promise = getConstant(c);
      constantPromises.push(promise);
    });
    const allConstantsJSON = await Promise.all(constantPromises);

    const importPromises = [];
    allImports.rows.forEach((i) => {
      const promise = getImport(i);
      importPromises.push(promise);
    });
    const allImportsJSON = await Promise.all(importPromises);

    // TODO, retrive all constants and imports as well
    return {name: data.name, axiom: data.axiom, constants: allConstantsJSON,
      productions: allProductionsJSON, imports: allImportsJSON};
  } catch (err) {
    throw err;
  }
};

const getProduction = async (data) => {
  try {
    const allRulesets = await pool.query(`
        SELECT * FROM public."Ruleset" rs
        WHERE rs.production_id = $1
        ORDER BY rs.ruleset_id ASC;`,
    [data.production_id]);

    const rulesetPromises = [];
    allRulesets.rows.forEach((rs) => {
      const promise = getRuleset(rs);
      rulesetPromises.push(promise);
    });
    const allRulesetsJSON = await Promise.all(rulesetPromises);

    return [data.symbol, allRulesetsJSON];
  } catch (err) {
    throw err;
  }
};

const getRuleset = async (data) => {
  try {
    const allRules = await pool.query(`
        SELECT * FROM public."Rule" r
        WHERE r.ruleset_id = $1
        ORDER BY r.rule_id ASC;`,
    [data.ruleset_id]);

    const rulePromises = [];
    allRules.rows.forEach((r) => {
      const promise = getRule(r);
      rulePromises.push(promise);
    });
    const allRulesJSON = await Promise.all(rulePromises);
    return [data.condition, allRulesJSON];
  } catch (err) {
    throw err;
  }
};

const getRule = async (data) => {
  try {
    return [data.rule, data.prob];
  } catch (err) {
    throw err;
  }
};

const getConstant = async (data) => {
  try {
    return [data.name, data.value];
  } catch (err) {
    throw err;
  }
};

const getImport = async (data) => {
  try {
    return [data.symbol, data.file];
  } catch (err) {
    throw err;
  }
};

module.exports = {
  getAll: async (req, res) => {
    try {
      const allLSystems = await pool.query(`
        SELECT * FROM public."LSystem" l
        WHERE l.profile_id = $1
        ORDER BY l.lsystem_id ASC;`,
      [req.user.profile_id]);

      const lsystemPromises = [];
      allLSystems.rows.forEach((l) => {
        const promise = getLSystem(l);
        lsystemPromises.push(promise);
      });
      const allLSystemsJSON = await Promise.all(lsystemPromises);

      res.status(200).json(allLSystemsJSON);
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
