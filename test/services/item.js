var chai = require('chai');

describe('Item Service', function() {

            /**
             * This function insert an entity. 
             * 
             * @param {User} obj - entity to insert. 
             * @return {Object} a promise for the insert operation
             *
             */
            insert: function(obj) {

                if (obj.brand)
                    obj.brand = mongoose.Types.ObjectId(obj.brand);
                if (obj.address) {
                    obj.address = mongoose.Types.ObjectId(obj.address);
                }
                return model.create(obj);
            },

            /**
             * This function updates an entity.
             * 
             * @param {User} obj - entity to update. 
             * @param {Number} id - id of the object to update. 
             * @return {Object} a promise for the update operation
             *
             */
            update: function(id, obj) {

                obj.good_buy = (obj.good_buy) ? true : false;
                obj.promotion = (obj.promotion) ? true : false;

                obj._id = mongoose.Types.ObjectId(id);


                if (obj.brand)
                    obj.brand = mongoose.Types.ObjectId(obj.brand);
                if (obj.address) {
                    obj.address = mongoose.Types.ObjectId(obj.address);
                }

                return model.findByIdAndUpdate(obj._id, obj, {
                    new: true
                }).populate("brand").populate("address").exec();
            },
            /**
             * This function deletes an entity
             *
             * @param {Number} id - id of the object to delete.
             * @return {Object} a promise for this operation
             *
             */
            delete: function(id) {
                var _id = mongoose.Types.ObjectId(id);
                return model.findByIdAndRemove(_id).exec();
            },

            /**
             * This function lists entities corresponding to the query.
             * It includes population from depending references
             * @param {Object} query - json collection of query criteria. This is processed into a mongoose query
             * @return {Object} a promise for this operation
             *
             */
            list: function(query) {
                return model.find(this.buildQuery(query)).populate("brand").populate("address").exec();
            },

            /**
             * This function lists all items in csv format.
             * It includes population from depending references, also in csv format
             * @param {Object} res - response object to which the csv string can be stream to
             * @return {Object} csv string. Moot since it is also streamed directly into the response object
             *
             */
            csv: function(res) {
                return model.find().populate("brand").populate("address").csv(res);
            },

            /**
             * This function builds a mongoose query from the user search criteria.
             * Each criteria is processed by an internal function, specific for each 
             * search field. These functions each one contribute to the final Mongoose query object.
             * 
             * @param {Object} clientQuery - array of search criteria as selected by the user
             * @return {Object} mongoose query object created from search criteria specified
             *
             */
            buildQuery: function(clientQuery) {

                var _in = function(query, clientQuery, field) {
                    if (clientQuery[field]) {
                        if (clientQuery[field].fields.length) {
                            query[field] = {};
                            query[field]["$in"] = _.map(clientQuery[field].fields, (ele) => ele.key);
                        }
                    }
                };

                var _regexp = function(query, clientQuery, field) {
                    if (clientQuery[field]) {
                        if (clientQuery[field].fields.length && clientQuery[field].fields[0].value) {
                            query[field] = {};
                            query[field] = new RegExp(clientQuery[field].fields[0].value);
                        }
                    }
                };

                var _bool = function(query, clientQuery, field) {
                    if (clientQuery[field]) {
                        if (clientQuery[field].fields.length && clientQuery[field].fields[0].value) {
                            query[field] = {};
                            query[field] = clientQuery[field].fields[0].value;
                        }
                    }
                };

                var _date = function(query, clientQuery, field) {
                    if (clientQuery[field]) {
                        if (clientQuery[field].fields.length) {
                            _.each(clientQuery[field].fields, (ele) => {
                                if (ele.key === 'to' && ele.value) {
                                    query[field] = {};
                                    query[field]["$lte"] = moment(ele.value).format("YYYY-MM-DD");
                                }
                                if (ele.key === 'from' && ele.value) {
                                    if (!query[field])
                                        query[field] = {};
                                    query[field]["$gte"] = moment(ele.value).format("YYYY-MM-DD");
                                }
                            });
                        }
                    }
                };

                var _range = function(query, clientQuery, field) {
                    if (clientQuery[field]) {
                        if (clientQuery[field].fields.length) {
                            _.each(clientQuery[field].fields, (ele) => {
                                if (ele.key === 'to' && ele.value) {
                                    query[field] = {};
                                    query[field]["$lte"] = ele.value;
                                }
                                if (ele.key === 'from' && ele.value) {
                                    if (!query[field])
                                        query[field] = {};
                                    query[field]["$gte"] = ele.value;
                                }
                            });
                        }
                    }
                };

                var _weight = function(query, clientQuery, field, field2) {
                    if (clientQuery[field]) {
                        if (clientQuery[field].fields.length) {
                            _.each(clientQuery[field].fields, (ele) => {
                                if (ele.key === 'to' && ele.value) {
                                    query[field] = {};
                                    query[field]["$lte"] = ele.value;
                                }
                                if (ele.key === 'from' && ele.value) {
                                    if (!query[field])
                                        query[field] = {};
                                    query[field]["$gte"] = ele.value;
                                }
                                if (ele.key === 'value' && ele.value) {
                                    query[field2] = {};
                                    query[field2] = ele.value;
                                }
                            });
                        }
                    }
                };


                var query = {};

                _date(query, clientQuery, "date");
                _regexp(query, clientQuery, "product");
                _regexp(query, clientQuery, "comments");
                _in(query, clientQuery, "monthly");
                _in(query, clientQuery, "brand");
                _in(query, clientQuery, "address");
                _in(query, clientQuery, "category");
                _in(query, clientQuery, "reason");
                _in(query, clientQuery, "monthly");
                _in(query, clientQuery, "currency");
                _range(query, clientQuery, "upp");
                _range(query, clientQuery, "units_bought");
                _range(query, clientQuery, "unit_cost");
                _range(query, clientQuery, "item_cost");
                _range(query, clientQuery, "item_cost");
                _weight(query, clientQuery, "weight", "unit");
                _bool(query, clientQuery, "promotion");
                _bool(query, clientQuery, "good_buy");

                return query;
            },

            /**
             * This function creates a paginated view of an item list, 
             * corresponding to the set of search criteria specified by the user
             * 
             * @param {Object} query - array of search criteria as selected by the user
             * @return {Object} a promise for this operation
             *
             */
            paginate: function(query) {

                //   console.log("query " + JSON.stringify(query));
                return model.paginate(this.buildQuery(query), {
                    page: query.page, //query.page?query.page:1,
                    limit: 10, //query.limit?query.limit:10,
                    sort: {
                        date: 'desc'
                    },
                    populate: ["brand", "address"]
                });
            },

            /**
             * This function returns one entity by id. It also populates dependencies
             *
             * @return {Object} a promise for this operation
             *
             */
            findById: function(id) {
                var _id = mongoose.Types.ObjectId(id);
                return model.findById(_id).populate("brand").populate("address").exec();
            },

            /**
             * This function returns a list of monthly payments, and the date on which each one was made. 
             * This is useful for the home page and in signalling if each monthly paymen was made or not. 
             *
             * @return {Object} a promise for this operation
             *
             */
            monthlyList: function() {
                return model.aggregate([{ $group: { _id: "$monthly", lastDate: { $max: "$date" } } }]).exec();
            }



        };