/*
    Author: XpertRule
    Link: http://www.xpertrule.com/
    Year: 2016

    A minimal example that demonstrates how to run Decision Author knowledge in a node js bluemixenvironment. 
    When calling the server component, a http request is made to the knowledge passing inputs and the desired outputs and returning the inference outcome. 
*/

var http = require("http"),
    https = require("https");

/* ////////////////////////////// Settings////////////////////////////// */
var settings = {
    server_port: 1337
};

/* ////////////////////////////// Knowledge ////////////////////////////// */
var knowledge = {
    request_host:  "ibmxrkb.xpertrule.com",                                        
    request_path: "/Super_Admin_All_Users_NodejsGettingStarted",
    request_port: "8125",
    request_input: {
        inputs: [
            {
                name: "Cost",
                value: 0
            },
            {
                name: "Department",
                value: "Sales"
            },
            {
                name: "Grade",
                value: "Director"
            },
            {
                name: "In_London",
                value: false
            }
        ],
        outputs: [
            {
                name: "Cost_Less_tax"
            },
            {
                name: "Expenses"
            },
            {
                name: "Hotel"
            }
        ]

    }
}

/* ////////////////////////////// Server ////////////////////////////// */
var server = http.createServer(function(request, response) {
    var knowledge_request = http.request(
        {
            host: knowledge.request_host,
            path: knowledge.request_path +"?input=" +escape(JSON.stringify(knowledge.request_input)),
            port: knowledge.request_port,  
            method: "GET"
        },
        function(res) {
            var body = "";

            res.on("data", function(chunk) {
                body += chunk;
            });
            res.on("end", function() {
                var results = { ok: true };

                try {
                    results.data = JSON.parse(body);
                } catch(e) {
                    results.ok = false;
                    results.error = e;
                }

                response.writeHead(200, {"Content-Type": "text/html; charset=UTF-8", "Access-Control-Allow-Origin": "*"});
                response.end(JSON.stringify(results));
            });
        }
    );
    knowledge_request.end();
    knowledge_request.on("error", function(err) {
        var results = {
            ok: false,
            error: err
        }

        response.writeHead(200, {"Content-Type": "text/html; charset=UTF-8", "Access-Control-Allow-Origin": "*"});
        response.end(JSON.stringify(results));
    });
}).listen(process.env.PORT || settings.server_port, "0.0.0.0", 511, function() {
    console.log("Server started with port: " +(process.env.PORT || settings.server_port));
});