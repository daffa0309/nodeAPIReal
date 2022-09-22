module.exports = {
    created(carrier, data = null) {
        if (data) {
            return carrier.status(201).json({
                responses: data,
            });
        }
  
        return carrier.status(201).send();
    },
    custom(carrier, code, message) {
        return carrier({
            status: code,
            message,
        });
    },
    empty(carrier) {
        return carrier({
            status: 204,
        });
    },
    error(carrier) {
        return carrier({
            status: 500,
            message: 'Internal server error.',
        });
    },
    ok(carrier, data = null) {
        if (data) {
            let res;
            if (data.metaData) {
                res = {
                    metaData: data.metaData,
                };
                delete data['metaData'];
                res.responses = data;
            } else {
                res = {
                    responses: data
                };
            }

            return carrier.status(200).json(res);
        }
  
      return carrier.status(200).send();
    },
};