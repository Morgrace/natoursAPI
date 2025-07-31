/**
 * APIFeatures builds up a Mongoose query from req.query params.
 *
 * @param {Mongoose.Query} query       - A base query (e.g. Model.find())
 * @param {Object}          queryString - The raw req.query object
 *
 * @returns {APIFeatures} this - so you can chain:
 *   new APIFeatures(Model.find(), req.query)
 *     .applyFilter()
 *     .applySort()
 *     .applyFieldLimiting()
 *     .applyPagination()
 *     .query  // the built Mongoose Query
 */

export class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }
  applyFilter() {
    const queryObj = { ...this.queryString };
    ['page', 'sort', 'limit', 'fields'].forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }
  applySort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }
  applyFieldLimiting() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v'); // the negative ensure the field is not selected
    }
    return this;
  }
  applyPagination() {
    const page = +this.queryString.page || 1;
    const limit = +this.queryString.limit || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}
