class APIFeatures {
  constructor(query, reqQueryObj) {
    this.query = query;
    this.reqQueryObj = reqQueryObj;
  }

  filter() {
    const filteredQueryObj = { ...this.reqQueryObj };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => {
      delete filteredQueryObj[el];
    });

    //ADVANCED FILTERIING
    // console.log(req.query, queryObj);

    let queryStr = JSON.stringify(filteredQueryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    if (this.reqQueryObj.sort) {
      const sortBy = this.reqQueryObj.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  limitFields() {
    if (this.reqQueryObj.fields) {
      const fields = this.reqQueryObj.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  paginate() {
    const page = this.reqQueryObj.page * 1 || 1;
    const limit = this.reqQueryObj.limit * 1 || 100;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;
