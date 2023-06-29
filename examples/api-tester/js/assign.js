


const ASSIGN = (() => {

    const func = {};

    func.mapi_key = "eyJ1ciI6ImFwaWRldiIsInBnIjoiY2l2aWwiLCJjbiI6IjRZRUdveVlyUWcifQ.8509f2c69bfb2ae2d01270e4c8617e749fbf85412f3da833a11ccacd628756c0";
    func.url = "https://api-beta.midasit.com:443/civil";

    func.connected = false;
    func.analysed = false;
    func.created = false;

    func.check_assign = {
        unit: false,
        matl: false,
        thik: false,
        nodes: false,
        elems: false,
        cons: false,
        analysis: false,
        stld: false,
        press: false,
    };

    func.chart_x = null;
    func.chart_y = null;

    func.assignModel = () => {

        $(".ui.dimmer").show();
        $(".ui.text.loader").empty().append("Check connection with midas Civil ...");

        $.ajax({
            type: "GET", url: func.url + "/db/unit", headers: { "MAPI-Key": func.mapi_key }, data: {}, dataType: "json", contentType: "application/json",
            success: function (res) {

                console.log(res)
                func.connected = true;

                $(".ui.text.loader").empty().append("Assign model global units ...");

                let json_data = {
                    "Assign": {
                        "1": {
                            "FORCE": "KN",
                            "DIST": "M",
                            "HEAT": "KCAL",
                            "TEMPER": "C"
                        }
                    }
                };

                $.ajax({
                    type: "PUT", url: func.url + "/db/unit", headers: { "MAPI-Key": func.mapi_key }, data: JSON.stringify(json_data), dataType: "json", contentType: "application/json",
                    success: function (res) {

                        console.log(res)
                        func.check_assign.unit = true;

                        // UNITS SET ---------------------------------------------------------------------------------------------------------------
                        $(".ui.text.loader").empty().append("Assign material properties ...");

                        json_data = {
                            "Assign": {
                                "1": {
                                    "TYPE": "CONC",
                                    "NAME": "USER-MAT",
                                    "HE_SPEC": 0.0,
                                    "HE_COND": 0.0,
                                    "THMAL_UNIT": "C",
                                    "PLMT": 0,
                                    "P_NAME": "",
                                    "bMASS_DENS": false,
                                    "DAMP_RAT": 0.05,
                                    "PARAM": [
                                        {
                                            "P_TYPE": 2,
                                            "ELAST": parseFloat($("#mat_E").val()),
                                            "POISN": parseFloat($("#mat_v").val()),
                                            "THERMAL": 0.00001,
                                            "DEN": 24.5,
                                            "MASS": 0.0
                                        }
                                    ]
                                }
                            }
                        };

                        $.ajax({
                            type: "POST", url: func.url + "/db/matl", headers: { "MAPI-Key": func.mapi_key }, data: JSON.stringify(json_data), dataType: "json", contentType: "application/json",
                            success: function (res) {

                                console.log(res)
                                func.check_assign.matl = true;

                                // NODES SET -------------------------------------------------------------------------------------------------------------------------------------------
                                $(".ui.text.loader").empty().append("Assign model nodes ...");
                                MODEL.genPlate();

                                json_data = {
                                    "Assign": MODEL.data.nodes
                                };

                                $.ajax({
                                    type: "POST", url: func.url + "/db/node", headers: { "MAPI-Key": func.mapi_key }, data: JSON.stringify(json_data), dataType: "json", contentType: "application/json",
                                    success: function (res) {

                                        console.log(res)
                                        func.check_assign.nodes = true;

                                        // PLATE THICKNESS ---------------------------------------------------------------------------------------------------------------------------------------
                                        $(".ui.text.loader").empty().append("Assign plate thickness ...");

                                        json_data = {
                                            "Assign": {
                                                "1": {
                                                    "NAME": "1",
                                                    "TYPE": "VALUE",
                                                    "bINOUT": false,
                                                    "T_IN": 0.6,
                                                    "T_OUT": 0.0,
                                                    "O_VALUE": 0.0
                                                },
                                            }
                                        };

                                        $.ajax({
                                            type: "POST", url: func.url + "/db/thik", headers: { "MAPI-Key": func.mapi_key }, data: JSON.stringify(json_data), dataType: "json", contentType: "application/json",
                                            success: function (res) {

                                                console.log(res)
                                                func.check_assign.thik = true;

                                                // NODES SET -----------------------------------------------------------------------------------------------------------------------------------------------------
                                                $(".ui.text.loader").empty().append("Assign model elements ...");

                                                json_data = {
                                                    "Assign": MODEL.data.elems
                                                };

                                                $.ajax({
                                                    type: "POST", url: func.url + "/db/elem", headers: { "MAPI-Key": func.mapi_key }, data: JSON.stringify(json_data), dataType: "json", contentType: "application/json",
                                                    success: function (res) {

                                                        // console.log(res)
                                                        func.check_assign.elems = true;

                                                        // LOAD CASES SET -----------------------------------------------------------------------------------------------------------------------------------------------
                                                        $(".ui.text.loader").empty().append("Assign load cases ...");

                                                        json_data = {
                                                            "Assign": {
                                                                "1": {
                                                                    "NAME": "Dead Load",
                                                                    "TYPE": "D",
                                                                    "DESC": "Dead Load"
                                                                },
                                                            }
                                                        };

                                                        $.ajax({
                                                            type: "POST", url: func.url + "/db/stld", headers: { "MAPI-Key": func.mapi_key }, data: JSON.stringify(json_data), dataType: "json", contentType: "application/json",
                                                            success: function (res) {

                                                                console.log(res)
                                                                func.check_assign.stld = true;

                                                                // LOAD PRESSURE SET ----------------------------------------------------------------------------------------------------------------------------
                                                                $(".ui.text.loader").empty().append("Assign plate pressure ...");

                                                                json_data = {
                                                                    "Assign": MODEL.data.elem_press
                                                                };

                                                                $.ajax({
                                                                    type: "POST", url: func.url + "/db/pres", headers: { "MAPI-Key": func.mapi_key }, data: JSON.stringify(json_data), dataType: "json", contentType: "application/json",
                                                                    success: function (res) {

                                                                        // console.log(res)
                                                                        func.check_assign.press = true;

                                                                        // CONSTRAIN SET ----------------------------------------------------------------------------------------------------------------------------
                                                                        $(".ui.text.loader").empty().append("Assign plate constrains ...");

                                                                        json_data = {
                                                                            "Assign": MODEL.data.cons
                                                                        };

                                                                        $.ajax({
                                                                            type: "POST", url: func.url + "/db/cons", headers: { "MAPI-Key": func.mapi_key }, data: JSON.stringify(json_data), dataType: "json", contentType: "application/json",
                                                                            success: function (res) {

                                                                                // console.log(res)
                                                                                func.check_assign.cons = true;

                                                                                $(".ui.dimmer").hide();

                                                                            },
                                                                            error: function () { errorOutput('Something went wrong. Please check your input data for plate constrains.') }
                                                                        });

                                                                    },
                                                                    error: function () { errorOutput('Something went wrong. Please check your input data for plate pressure.') }
                                                                });

                                                            },
                                                            error: function () { errorOutput('Something went wrong. Please check your input data for load cases.') }
                                                        });

                                                    },
                                                    error: function () { errorOutput('Something went wrong. Please check your input data for elements.') }
                                                });

                                            },
                                            error: function () { errorOutput('Something went wrong. Please check your input data for plate thickness.') }
                                        });

                                    },
                                    error: function () { errorOutput('Something went wrong. Please check your input data for nodes.') }
                                });

                            },
                            error: function () { errorOutput('Something went wrong. Please check your input data for material properties.') }
                        });

                    },
                    error: function () { errorOutput('Something went wrong. Please check your input data for units.') }
                });

            },
            error: function () {
                errorOutput("No conenction with midas Civil");
                func.connected = false;
            }
        });

    };


    func.initChart = (labels, data, div_id, name) => {

        let options = {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: name,
                    data: data,
                    pointRadius: 0, borderColor: `rgb(51, 153, 255)`, borderWidth: 2, fill: false, showLine: true,
                }]
            },
            options: {
                responsive: true,
                scales: {
                    x: { title: { display: true, text: 'Node position [m]' } },
                    y: { title: { display: true, text: 'Deisplacement [mm]' } },
                },
                animations: false
            }
        };


        if (name == "Side X") func.chart_x = new Chart(document.getElementById(div_id), options);
        else if (name == "Side Y") func.chart_y = new Chart(document.getElementById(div_id), options);


    };


    func.preformAnalysis = () => {

        $(".ui.dimmer").show();
        $(".ui.text.loader").empty().append("Run analysis ...");

        let json_data = {};

        $.ajax({
            type: "POST", url: func.url + "/doc/anal", headers: { "MAPI-Key": func.mapi_key }, data: JSON.stringify(json_data), dataType: "json", contentType: "application/json",
            success: function (res) {

                console.log(res)
                func.analysed = true;

                $(".ui.text.loader").empty().append("Extracting results ...");

                json_data = {
                    "Argument": {
                        "TABLE_TYPE": "DISPLACEMENTG",
                        "NODE_ELEMS": { "KEYS": [...MODEL.data.node_w_res, ...MODEL.data.node_h_res] },
                        "LOAD_CASE_NAMES": ["Dead Load(ST)"],
                        "COMPONENTS": ["Node", "Load", "DX", "DY", "DZ", "RX", "RY", "RZ"]
                    }
                };

                $.ajax({
                    type: "POST", url: func.url + "/post/table", headers: { "MAPI-Key": func.mapi_key }, data: JSON.stringify(json_data), dataType: "json", contentType: "application/json",
                    success: function (res) {

                        console.log(res)
                        func.analysed = true;
                        $(".ui.dimmer").hide();

                        let table_data = {};

                        for (let i = 0; i < res.empty.DATA.length; i++) {
                            let row_i = res.empty.DATA[i];
                            table_data[parseInt(row_i[1])] = Number((-parseFloat(row_i[5]) * 1000).toFixed(5));
                        }

                        let data_x = [];
                        let data_y = [];
                        $("#table-res").empty();

                        for (let i = 0; i < MODEL.data.node_w_res.length; i++) {
                            let node = MODEL.data.node_w_res[i];
                            data_x.push(table_data[node]);
                            $("#table-res").append(`
                                <tr>
                                    <td style="width:33%">${node}</td>
                                    <td style="width:33%">Along X</td>
                                    <td style="width:33%">${table_data[node]}</td>
                                </tr>
                            `);
                        }

                        for (let i = 0; i < MODEL.data.node_h_res.length; i++) {
                            let node = MODEL.data.node_h_res[i];
                            data_y.push(table_data[node]);
                            $("#table-res").append(`
                                <tr>
                                    <td style="width:33%">${node}</td>
                                    <td style="width:33%">Along Y</td>
                                    <td style="width:33%">${table_data[node]}</td>
                                </tr>
                            `);
                        }

                        func.chart_x.data.labels = MODEL.data.w_pos;
                        func.chart_x.data.datasets[0].data = data_x;
                        func.chart_x.update();

                        func.chart_y.data.labels = MODEL.data.h_pos;
                        func.chart_y.data.datasets[0].data = data_y;
                        func.chart_y.update();
                    },
                    error: function () {
                        func.analysed = false;
                        errorOutput('Something went wrong. Results can nnot be extracted.')
                    }
                });

            },
            error: function () {
                func.analysed = false;
                errorOutput('Something went wrong. Analysis can not be performed.')
            }
        });


    };


    func.checkConnection = () => {

        func.mapi_key = $("#con_map_key").val().trim();
        func.url = $("#con_url").val().trim();
        // func.mapi_key = "eyJ1ciI6ImFwaWRldiIsInBnIjoiY2l2aWwiLCJjbiI6IjRZRUdveVlyUWcifQ.8509f2c69bfb2ae2d01270e4c8617e749fbf85412f3da833a11ccacd628756c0" // $("#con_map_key").val().trim();
        // func.url = "https://api-beta.midasit.com:443/civil" // $("#con_url").val().trim();

        $(".ui.dimmer").show();
        $(".ui.text.loader").empty().append("Check connection ...");

        $.ajax({
            type: "GET", url: func.url + "/db/unit", headers: { "MAPI-Key": func.mapi_key }, data: {}, dataType: "json", contentType: "application/json",
            success: function (res) {

                console.log(res)
                func.connected = true;
                $(".ui.dimmer").hide();
                messageOutput("Found connection with midas Civil");
            },
            error: function () {
                errorOutput("No conenction with midas Civil");
                func.connected = false;
            }
        });

    };


    function errorOutput(msg) {

        $(".ui.dimmer").hide();
        $('.ui.modal').modal({
            title: 'Server Error!',
            content: msg,
            actions: [{ text: 'Close', class: 'red' }],
            class: 'mini',
            blurring: true, centered: true, closeIcon: false, closable: false,
        }).modal('show');
    }

    function messageOutput(msg) {

        $(".ui.dimmer").hide();
        $('.ui.modal').modal({
            title: 'Message',
            content: msg,
            actions: [{ text: 'Close', class: 'green' }],
            class: 'mini',
            blurring: true, centered: true, closeIcon: false, closable: false,
        }).modal('show');
    }


    return func;


})();