

const MODEL = (() => {

    const func = {};

    func.data = {
        nodes: {},
        elems: {},
        elem_press: {},
        cons: {},
        node_w_res: [],
        node_h_res: [],
        w_pos: [],
        h_pos: [],
    };


    func.genPlate = () => {

        func.data.nodes = {};
        func.data.elems = {};
        func.data.elem_press = {};
        func.data.cons = {};
        func.data.node_w_res = [];
        func.data.node_h_res = [];

        let w = parseFloat($("#plate_w").val());
        let h = parseFloat($("#plate_h").val());

        let w_num = parseFloat($("#plate_w_num").val());
        let h_num = parseFloat($("#plate_h_num").val());

        let w_pos = [0];
        let h_pos = [0];

        let w_span = w / w_num;
        let h_span = h / h_num;

        for (let i = 0; i < w_num; i++) w_pos.push(w_pos[w_pos.length - 1] + w_span);
        for (let i = 0; i < h_num; i++) h_pos.push(h_pos[h_pos.length - 1] + h_span);

        let node_row_arr = [];
        let node_id = 1;

        for (let i = 0; i < h_pos.length; i++) {
            let row = [];
            for (let j = 0; j < w_pos.length; j++) {

                let x = w_pos[j];
                let y = h_pos[i];
                func.data.nodes[node_id] = { X: x, Y: y, Z: 0 };

                if (j == parseInt(0.5 * w_pos.length)) func.data.node_h_res.push(node_id);

                row.push([node_id++, x, y]);
            }

            if (i == parseInt(0.5 * h_pos.length)) func.data.node_w_res = row.map(v => { return v[0]; });

            node_row_arr.push(row);
        }

        func.data.w_pos = w_pos.map(v=>{ return Number(v.toFixed(4)); });
        func.data.h_pos = h_pos.map(v=>{ return Number(v.toFixed(4)); });

        let elem_id = 1;

        for (let i = 0; i < node_row_arr.length - 1; i++) {

            if (i == 0) {
            
                for (let j = 0; j < node_row_arr[i].length; j++) {
                    func.data.cons[node_row_arr[i][j][0]] = { "ITEMS": [{ "ID": 1, "GROUP_NAME": "", "CONSTRAINT": "1110000" }] };
                }
            }
            else if (i == node_row_arr.length - 2) {

                for (let j = 0; j < node_row_arr[i + 1].length; j++) {
                    func.data.cons[node_row_arr[i + 1][j][0]] = { "ITEMS": [{ "ID": 1, "GROUP_NAME": "", "CONSTRAINT": "1110000" }] };
                }

                func.data.cons[node_row_arr[i][0][0]] = { "ITEMS": [{ "ID": 1, "GROUP_NAME": "", "CONSTRAINT": "1110000" }] };
                func.data.cons[node_row_arr[i][node_row_arr[i].length - 1][0]] = { "ITEMS": [{ "ID": 1, "GROUP_NAME": "", "CONSTRAINT": "1110000" }] };
            }
            else {
                
                func.data.cons[node_row_arr[i][0][0]] = { "ITEMS": [{ "ID": 1, "GROUP_NAME": "", "CONSTRAINT": "1110000" }] };
                func.data.cons[node_row_arr[i][node_row_arr[i].length - 1][0]] = { "ITEMS": [{ "ID": 1, "GROUP_NAME": "", "CONSTRAINT": "1110000" }] };
            }


            for (let j = 0; j < node_row_arr[i].length - 1; j++) {

                let p1 = node_row_arr[i][j][0];
                let p2 = node_row_arr[i][j + 1][0];
                let p3 = node_row_arr[i + 1][j + 1][0];
                let p4 = node_row_arr[i + 1][j][0];

                func.data.elems[elem_id] = {
                    "TYPE": "PLATE",
                    "MATL": 1,
                    "SECT": 1,
                    "NODE": [p1, p2, p3, p4, 0, 0, 0, 0],
                    "ANGLE": 0.0,
                    "STYPE": 1
                };

                func.data.elem_press[elem_id] = {
                    "ITEMS": [
                        {
                            "ID": 1,
                            "LCNAME": "Dead Load",
                            "GROUP_NAME": "",
                            "CMD": "PRES",
                            "ELEM_TYPE": "PLATE",
                            "FACE_EDGE_TYPE": "FACE",
                            "DIRECTION": "LZ",
                            "FORCES": [-parseFloat($("#plate_p").val()), 0.0, 0.0, 0.0, 0.0]
                        }
                    ]
                };

                elem_id++;
            }
        }

    };

    return func;

})();