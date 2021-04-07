

Blockly.Themes.Halloween = Blockly.Theme.defineTheme('halloween', {
    'base': Blockly.Themes.Classic,
    'categoryStyles': {
    'list_category': {
       'colour': "#4a148c"
     },
     'logic_category': {
       'colour': "#8b4513",
     },
     'loop_category': {
       'colour': "#85E21F",
     },
     'text_category': {
       'colour': "#FE9B13",
     }
    },
    'blockStyles': {
     'list_blocks': {
       'colourPrimary': "#4a148c",
       'colourSecondary':"#AD7BE9",
       'colourTertiary':"#CDB6E9"
     },
     'logic_blocks': {
       'colourPrimary': "#8b4513",
       'colourSecondary':"#ff0000",
       'colourTertiary':"#C5EAFF"
     }, 
     'loop_blocks': {
       'colourPrimary': "#85E21F",
       'colourSecondary':"#ff0000",
       'colourTertiary':"#C5EAFF"
     }, 
     'text_blocks': {
       'colourPrimary': "#FE9B13",
       'colourSecondary':"#ff0000",
       'colourTertiary':"#C5EAFF"
     } 
    },
    'componentStyles': {
      'workspaceBackgroundColour': '#ff7518',
      'toolboxBackgroundColour': '#F9C10E',
      'toolboxForegroundColour': '#fff',
      'flyoutBackgroundColour': '#252526',
      'flyoutForegroundColour': '#ccc',
      'flyoutOpacity': 1,
      'scrollbarColour': '#ff0000',
      'insertionMarkerColour': '#fff',
      'insertionMarkerOpacity': 0.5,
      'scrollbarOpacity': 0.5,
      'cursorColour': '#d0d0d0',
      'blackBackground': '#333'
    }
  });

var demoWorkspace = Blockly.inject('blocklyDiv',
        {media: 'https://unpkg.com/blockly/media/',
         toolbox: document.getElementById('toolbox'),
         theme: Blockly.Themes.Halloween,});
    Blockly.Xml.domToWorkspace(document.getElementById('startBlocks'),
                               demoWorkspace);

    // Exit is used to signal the end of a script.
    Blockly.JavaScript.addReservedWords('exit');

    var outputArea = document.getElementById('output');
    var redLight=document.getElementById('red');
    var yellowLight=document.getElementById('yellow');
    var greenLight=document.getElementById('green');
    var runButton = document.getElementById('runButton');
    var myInterpreter = null;
    var runner;

    function initApi(interpreter, globalObject) {
      // Add an API function for the alert() block, generated for "text_print" blocks.
      var wrapper = function(text) {
        text = text ? text.toString() : '';
        console.log(text)
        outputArea.value = outputArea.value + '\n' + text;
      };
      interpreter.setProperty(globalObject, 'alert',
          interpreter.createNativeFunction(wrapper));

      var wrapper = function(text,num) {
        text = text ? text.toString() : '';
        if(text=="red")
        {
            redLight.style.opacity=num;
        }
        else if(text=="yellow")
        {
            yellowLight.style.opacity=num;
        }
        else
        {
            greenLight.style.opacity=num;
        }
        console.log(text);
        console.log(num);
      };
      interpreter.setProperty(globalObject, 'sendSignal',
          interpreter.createNativeFunction(wrapper));


      // Add an API function for the prompt() block.
      var wrapper = function(text) {
        text = text ? text.toString() : '';
        return interpreter.createPrimitive(prompt(text));
      };
      interpreter.setProperty(globalObject, 'prompt',
          interpreter.createNativeFunction(wrapper));

      // Add an API for the wait block.  See wait_block.js
      initInterpreterWaitForSeconds(interpreter, globalObject);

      // Add an API function for highlighting blocks.
      var wrapper = function(id) {
        id = id ? id.toString() : '';
        return interpreter.createPrimitive(highlightBlock(id));
      };
      interpreter.setProperty(globalObject, 'highlightBlock',
          interpreter.createNativeFunction(wrapper));
    }

    

    var highlightPause = false;
    var latestCode = '';

    function highlightBlock(id) {
      demoWorkspace.highlightBlock(id);
      highlightPause = true;
    }

    function resetStepUi(clearOutput) {
      demoWorkspace.highlightBlock(null);
      highlightPause = false;
      runButton.disabled = '';

      if (clearOutput) {
        outputArea.value = 'Program output:\n=================';
      }
    }

    function generateCodeAndLoadIntoInterpreter() {
      // Generate JavaScript code and parse it.
      Blockly.JavaScript.STATEMENT_PREFIX = 'highlightBlock(%1);\n';
      Blockly.JavaScript.addReservedWords('highlightBlock');
      latestCode = Blockly.JavaScript.workspaceToCode(demoWorkspace);

      resetStepUi(true);
    }

    function resetInterpreter() {
      myInterpreter = null;
      if (runner) {
        clearTimeout(runner);
        runner = null;
      }
    }

    function runCode() {
      if (!myInterpreter) {
        // First statement of this code.
        // Clear the program output.
        resetStepUi(true);
        runButton.disabled = 'disabled';

        // And then show generated code in an alert.
        // In a timeout to allow the outputArea.value to reset first.
        setTimeout(function() {
        //   alert('Ready to execute the following code\n' +
        //     '===================================\n' +
        //     latestCode);

          // Begin execution
          highlightPause = false;
          myInterpreter = new Interpreter(latestCode, initApi);
          runner = function() {
            if (myInterpreter) {
            //   var hasMore = myInterpreter.run();
            //   console.log(hasMore+"hello");
              if (myInterpreter.step() && highlightPause==true) {
                // Execution is currently blocked by some async call.
                // Try again later.
                setTimeout(runner, 50);
              } 
              else if(highlightPause==false)
              {
                  setTimeout(runner,5);
              }
              else {
                // Program is complete.
                outputArea.value += '\n\n<< Program complete >>';
                resetInterpreter();
                resetStepUi(false);
              }
            }
          };
          runner();
        }, 1);
        return;
      }
    }

    // Load the interpreter now, and upon future changes.
    generateCodeAndLoadIntoInterpreter();
    demoWorkspace.addChangeListener(function(event) {
      if (!event.isUiEvent) {
        // Something changed. Parser needs to be reloaded.
        resetInterpreter();
        generateCodeAndLoadIntoInterpreter();
      }
    });