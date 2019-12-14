NSSPI = {
    nodesspi: function (req, res, next) {
        const nodeSSPI = require('node-sspi')
        const nodeSSPIObj = new nodeSSPI({
            retrieveGroups: true
        })
        try {
            nodeSSPIObj.authenticate(req, res, function(err){
                console.log(req.connection.user);
                res.finished;
                return next()
            })
        }
        catch (e) {
            res.status(500).json(e)
        }
    }
}

module.exports = NSSPI;
