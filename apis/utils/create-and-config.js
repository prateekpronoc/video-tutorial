'use strict'
var express = require('express');
module.exports = function(config, _) {
    return config.Promise.try(function() {
        var api = express();
        api.listen(8080, function() {
            console.log('server listing at parot 8080');
        })
        return api;
    }).then(function(svr) {
        if (svr) {
            console.log('server started at part 8080');
        }
        console.log(1);
        return config.Promise.resolve(svr);
    });
    // config.api.listen(8080, () => {
    //     console.log('sever is listing to port 8080');
    //     //eturn configure(api);
    // });
};
// 'use strict'
// var express = require('express');
// var bodyParser = require("body-parser");
// var cors = require('cors');
// //var api = express
// module.exports = () => {
//     //console.log('config', config.api);
//     return function(config, api) {
//         var req = { 'value': 1 };
//         config.api.listen(8080, () => {
//             console.log('sever is listing to port 8080');
//             //eturn configure(api);
//         });

//         config.api.use(bodyParser.urlencoded({ extended: true }));
//         config.api.use(bodyParser.json());
//         config.api.use(cors());
//         config.api.use(express.static('public'));

//         return config.Promise.resolve(req);
//         //return req;
//     };

//     function startServer(config) {
//         // config.api.listen(8080, () => {
//         //     console.log('sever is listing to port 8080');
//         //     //eturn configure(api);
//         // });
//     }

//     function configure(svr, config) {
//         // svr.use(bodyParser.urlencoded({ extended: true }));
//         // svr.use(bodyParser.json());
//         // svr.use(cors());
//         // svr.use(express.static('public'));
//         // if (svr) {
//         //     console.log('Server has started !!!');
//         // }
//         // return config.Promise.resolve(svr);
//     }
// };


// //create a server && configure it ..
