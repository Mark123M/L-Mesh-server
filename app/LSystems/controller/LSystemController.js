/* eslint-disable guard-for-in */
/* eslint-disable camelcase */
const pool = require('../../../db');

const createProduction = async (symbol, data, lsystem_id, errors) => {
  try {
    const newProduction = await pool.query(`
      INSERT INTO public."Production"(symbol, lsystem_id)
      VALUES($1, $2)
      RETURNING production_id;`,
    [symbol, lsystem_id]);

    const rulesetPromises = [];
    data.forEach((rs) => {
      const promise = createRuleset(rs, newProduction.rows[0].production_id,
          errors);
      rulesetPromises.push(promise);
    });
    await Promise.all(rulesetPromises);
  } catch (err) {
    errors.push(err);
  }
};

const createRuleset = async (data, production_id, errors) => {
  try {
    const newRuleset = await pool.query(`
      INSERT INTO public."Ruleset"(condition, production_id)
      VALUES($1, $2)
      RETURNING ruleset_id;`,
    [data.condition, production_id]);

    const rulePromises = [];
    data.ruleset.forEach((r) => {
      const promise = createRule(r, newRuleset.rows[0].ruleset_id, errors);
      rulePromises.push(promise);
    });
    await Promise.all(rulePromises);
  } catch (err) {
    errors.push(err);
  }
};

const createRule = async (data, ruleset_id, errors) => {
  try {
    const newRule = await pool.query(`
      INSERT INTO public."Rule"(prob, rule, ruleset_id)
      VALUES($1, $2, $3);`,
    [data.prob, data.rule, ruleset_id]);
  } catch (err) {
    errors.push(err);
  }
};

const createConstant = async (name, val, lsystem_id, errors) => {
  try {
    const constant = await pool.query(`
    INSERT INTO public."Constant"(name, value, lsystem_id)
    VALUES($1, $2, $3);`,
    [name, val, lsystem_id]);
  } catch (err) {
    errors.push(err);
  }
};

const createImport = async (name, val, lsystem_id, errors) => {
  try {
    const i = await pool.query(`
    INSERT INTO public."Import"(symbol, file, lsystem_id)
    VALUES($1, $2, $3);`,
    [name, val, lsystem_id]);
  } catch (err) {
    errors.push(err);
  }
};

const deleteLSystem = async (id, errors) => {
  try {
    const LSystem = await pool.query(`
      DELETE FROM public."LSystem" l
      WHERE l.lsystem_id = $1`,
    [id]);
    // deleteProduction(id);
  } catch (err) {
    errors.push(err);
    console.log(err);
  }
};

module.exports = {
  index: async (req, res) => {
    res.status(200).json('Hello from l system controller');
  },
  init: async (req, res) => {
    res.status(200).json('Initializing tables');
  },
  createLSystem: async (req, res) => {
    try {
      const errors = [];
      const newLSystem = await pool.query(
          `INSERT INTO public."LSystem"(name, axiom, profile_id)
          VALUES($1, $2, $3)
          RETURNING lsystem_id;`,
          [req.body.name, req.body.axiom, req.user.profile_id]);

      const productionPromises = [];
      // eslint-disable-next-line guard-for-in
      for (const symbol in req.body.productions) {
        const promise = createProduction(symbol, req.body.productions[symbol],
            newLSystem.rows[0].lsystem_id, errors);
        productionPromises.push(promise);
      }
      await Promise.all(productionPromises);

      const constantPromises = [];
      for (const c in req.body.constants) {
        const promise = createConstant(c, req.body.constants[c],
            newLSystem.rows[0].lsystem_id, errors);
        constantPromises.push(promise);
      }
      await Promise.all(constantPromises);

      const importPromises = [];
      for (const i in req.body.imports) {
        const promise = createImport(i, req.body.imports[i],
            newLSystem.rows[0].lsystem_id, errors);
        importPromises.push(promise);
      }
      await Promise.all(importPromises);

      // TODO: create constants and create imports
      if (errors.length > 0) {
        // if creation has any errors, delete entire preset
        await deleteLSystem(newLSystem.rows[0].lsystem_id, errors);
        res.status(200).json(errors);
      } else {
        res.status(200).json(newLSystem);
      }
    } catch (err) {
      res.status(500).json(err);
    }
  },
  deleteLSystem: async (req, res) => {
    deleteLSystem(req.params.id, []);
    res.status(200).json(`Deleted LSystem.`);
  },
};
