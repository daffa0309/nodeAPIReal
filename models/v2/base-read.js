require('dotenv').config();

const {Model, raw} = require('objection');

const conn = require('../../configs/knex-read')(process.env.NODE_ENV || 'production');

/**
 * Base read class for all other models to extend
 */
class BaseRead extends Model {
  /**
   * Get all data from a table
   * @param {string[]} [columns=['*']] - columns that will be selected
   * @param {Object} [conditions={}] - where conditions for the query
   * @param {Object[]} [orderConditions=[]] - order condition for the query
   * @param {string} orderConditions[].column - column to order to
   * @param {string} orderConditions[].order
   * - the order for the data to be sorted
   * @param {Object} pagination
   * @return {Objection.QueryBuilder} - query to be executed
   */
  static async all(
      columns = ['*'],
      conditions = {},
      orderConditions = [],
      pagination = {}
    ) {
    const query = this
        .query()
        .select(columns)
        .where(conditions)
        .orderBy(orderConditions).clone();

    if (Object.keys(pagination).length === 2) {
      return await query.limit(pagination.limit).offset(pagination.offset);
    } else {
      return await query;
    }
  }

  /**
   * @param {string} counter - column to count for
   * @param {Object} [conditions={}] - where conditions for the query
   */
  static async countRows(counter, conditions = {}, isRaw = false) {
    let query = this.query().select(raw(`COUNT(${counter})`).as('total_rows')).clone();

    if (isRaw) {
      query = query.where(raw(conditions)).clone();
    } else {
      query = query.where(conditions).clone();
    }

    query = query.orderBy(`${counter}`);

    return await query;
  }

  /**
   * Insert new data to a table
   * @param {Object} args - values to be inserted
   * @return {Objection.QueryBuilder} - query to be executed
   */
  static async create(args) {
    if (Array.isArray(args)) {
      return await this.query().insert(args);
    }
    return await this.query().insert({...args});
  }

  /**
   * Change visible status on a cell to 0 based on table's primary key
   * @param {Object} condition - contains column and it's value that will be hidden
   * @return {Objection.QueryBuilder} - query to be executed
  */
  static async hide(conditions) {
    return await this.query().where(conditions).patch({VISIBLE: 0});
  }

   /**
   * Change visible status on a cell to 1 based on table's primary key
   * @param {Object} condition - contains column and it's value that will be hidden
   * @return {Objection.QueryBuilder} - query to be executed
  */
  static async unhide(conditions) {
    return await this.query().where(conditions).patch({VISIBLE: 1});
  }

  /**
   * Update existing data on a table
   * @param {Object} [conditions={}] - where conditions for the query
   * @param {Object} [data={}] - data to be inserted
   * @return {Objection.QueryBuilder} - query to be executed
   */
  static async update(conditions = {}, data = {}) {
    return await this.query().where(conditions).patch(data);
  }
}

BaseRead.knex(conn);

module.exports = {BaseRead};
