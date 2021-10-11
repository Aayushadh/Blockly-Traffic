Blockly.defineBlocksWithJsonArray([
    // Block for colour picker.
    {
        "type": "traffic",
        "message0": "%1 %2 %3 %4",
        "args0": [
          {
            "type": "field_label_serializable",
            "name": "",
            "text": "turn"
          },
          {
            "type": "field_dropdown",
            "name": "color",
            "options": [
              [
                "red",
                "red"
              ],
              [
                "yellow",
                "yellow"
              ],
              [
                "green",
                "green"
              ]
            ]
          },
          {
            "type": "field_dropdown",
            "name": "status",
            "options": [
              [
                "on",
                "on"
              ],
              [
                "off",
                "off"
              ],
              [
                "",
                ""
              ]
            ]
          },
          {
            "type": "input_value",
            "name": "light"
          }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 20,
        "tooltip": "",
        "helpUrl": ""
      }
  ]);

  function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
  }

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  function sendSignal(clr,status)
  {
      console.log(clr);
      document.getElementById(clr).style.opacity=status;
    //  await sleep(3000);
      //sleep(3000);
  }

Blockly.JavaScript['traffic'] = function(block) {
    var dropdown_color = block.getFieldValue('color');
    var dropdown_status = block.getFieldValue('status');
    var value_light = Blockly.JavaScript.valueToCode(block, 'light', Blockly.JavaScript.ORDER_ATOMIC);
    // TODO: Assemble JavaScript into code variable.
    if(dropdown_status=="on")
    {
      dropdown_status=1;
    }
    else
    {
      dropdown_status=0.4;
    }
    var code="\nsendSignal(\""+dropdown_color+"\","+dropdown_status+");";
    return code;
  };
