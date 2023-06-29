var layout_div_num = 0;
var short_cut = 0;

// 단축키 지정
document.addEventListener('keydown', (event) => {
  if (short_cut == 1) {
    event.preventDefault();

    function post_layer_add() {
      let previous_layer = document.getElementById("layer" + layer_num);
      parentNode = previous_layer;
      target_layer(parentNode, "layer", "rgb(47, 59, 76)", "brown");

      let previous_click_pos = divpos_get(parentNode)
      type_selector_show(previous_click_pos, "layout_type");
    }

    function post_layout_done() {
      let temp_layout_div_list = parentNode.childNodes;
      if (layout_div_num < temp_layout_div_list.length) {
        parentNode2 = temp_layout_div_list[layout_div_num];
        target_layer(parentNode2, "layout_div", "rgb(72, 82, 95)", "yellow");
        let previous_click_pos = divpos_get(parentNode2);
        type_selector_show(previous_click_pos, "widget_type");
        layout_div_num++;
      }
      else {
        layout_div_num = 0;
      }
    }

    if (event.key === 'q') {
      layer_add();
      post_layer_add();
      return false;
    }

    if (event.key === 'w') {
      block_add();
      return false;
    }

    if (event.key === 'e') {
      preview();
      return false;
    }

    if (event.key === 'a') {
      layout_pick(1);
      return false;
    }

    if (event.key === 's') {
      layout_pick(2);
      return false;
    }

    if (event.key === 'd') {
      layout_pick(3);
      return false;
    }

    if (event.key === 'z') {
      widget_pick(1);
      return false;
    }

    if (event.key === 'x') {
      widget_pick(2);
      return false;
    }

    if (event.key === 'c') {
      widget_pick(3);
      return false;
    }

    if (event.key === 'v') {
      widget_pick(4);
      return false;
    }

    if (event.key === 'b') {
      widget_pick(5);
      return false;
    }

    if (event.key === 'n') {
      widget_pick(6);
      return false;
    }

    if (event.key === 'f') {
      layout_done();
      post_layout_done();
      return false;
    }

    if (event.key === 'm') {
      widget_done();
      post_layout_done();
      return false;
    }
  }
});