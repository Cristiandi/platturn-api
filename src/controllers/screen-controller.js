const { Controller } = require('./controller');

class ScreenController extends Controller {
  constructor ({ app }) {
    super({ app });
  }

  /**
   * function to get all the screens
   *
   * @param {{
    * attribute: string,
    * value: string
    * }} { attribute, value }
    * @returns {Promise<{ id: number }[]>} screens array
    * @memberof RouteControllor
    */
  async getAllScreens ({ attribute, value }) {
    const routes = await this.getAll({
      tableName: 'Screen',
      attributeName: attribute,
      attributeValue: value
    });

    return routes;
  }
}

module.exports = {
  ScreenController
};
