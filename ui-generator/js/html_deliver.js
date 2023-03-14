var layer_num=0;
$(document).ready(function () {	
  $("#add_layer").click(function () {    
    layer_num++;
    $("#block_create").append(
      "<div id='layer" + layer_num + "' class='layer'><button class='layout_selector' onclick='itemClick(event);'></button></div>"
      );
  });
});

function divpos_get(target_div) {
  this.x = target_div.getBoundingClientRect().left;
  this.y = target_div.getBoundingClientRect().bottom;
  return this;
}

function layer_add() {
  document.getElementById("add_layer").click();
}

var block_num = 1;
function block_add() {
  let html_body = document.getElementById("block_wrap").innerHTML

  html_body = html_body.replace('"block_create"', '"block' + block_num + '" class = "new_block"')

  let block_wrap = document.getElementById("block_wrap")
  let block = block_wrap.childNodes;

  while (block[1].hasChildNodes()) {
    block[1].removeChild(block[1].firstChild);
  }

  $("#ui_result").append(
    html_body
    );
    
  block_num++;
}

function preview() {
  let all_layer = document.getElementsByClassName("layer");
  let all_layout_div = document.getElementsByClassName("layout_div");

  for (i = 0; i < all_layer.length; i++) {
      if (all_layer[i].style.backgroundColor != 'rgb(47, 59, 76)')
          all_layer[i].style.backgroundColor = 'rgb(47, 59, 76)';
      else
          all_layer[i].style.backgroundColor = 'transparent';
  }

  for (i = 0; i < all_layout_div.length; i++) {
      if (all_layout_div[i].style.backgroundColor != 'rgb(72, 82, 95)')
          all_layout_div[i].style.backgroundColor = 'rgb(72, 82, 95)';
      else
          all_layout_div[i].style.backgroundColor = 'transparent';
  }
}