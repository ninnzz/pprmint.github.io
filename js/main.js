/** JS FILE **/

var available_cmd = {
        help : {
            m : "Displays the list of all available commands.",
            e : 1,
            u : 'help',
            f : function () {
                var i,
                    str = '<br/>List of all available commands for ninz terminal.<br/><br/><br/>';
                for (i in available_cmd) {
                    str += '<span class="white">' + i + '</span> : ';
                    str += available_cmd[i].u;
                    str += '  (' + available_cmd[i].m + ")<br/>";
                }

                write_result(str, 1);   
            }
        },
        whoami : {
            m : "Displays the description of the user.",
            e : 1,
            u : 'whoami',
            f : function () {
                write_result(   '<br/> <p>Call me <em class="white" >Ninz </em>! Avid dreamer (and heavy sleeper). Has a crush on <em class="white" >music </em>. Loves to play around with <em class="white" >technology</em>. Wants to marry <em class="white" >astronomy</em> and <em class="white" >physics</em>. </p>' +
                                '<p>Currently tinkering with <em class="white" >backend</em> and <em class="white" >systems architecture</em> stuff!  Building <em class="white" >API</em> and backend processing of data is my daily supplement. </p>' +
                                '<p>Computer science graduate from one of the top universities in PH. If you can\'t find me on the front of my laptop/PC doing some eloquent stuff <br/>' +
                                'or with my guitar playing some majestic riffs, then I\'m probably with my <em class="white" >trusty mountain bike</em> exploring the world! :P </p>', 1);
            }
        },
        clear : {
            m : "Clears the terminal view",
            e : 1,
            u : 'clear',
            f : function () {
                var i = 0,
                    c = document.getElementById('commands');

                while (c.firstChild) {
                    if (c.childNodes.length === 2) {
                        break;
                    } else {
                        c.removeChild(c.firstChild);
                    }
                }
                write_result(false, 0);
            }
        },
        resume : {
            m : "Downloads the user's resume.",
            e : 2,
            u : 'resume',
            f : function () {
                window.open('https://cvs-kickresume-com.s3.amazonaws.com/203955/7d4ad4b407012450d5fd1bd1b690a6a3/cv.pdf');
            }
        },
        under_construction : {
            m : "To know more, browser's console! :P",
            e : 1,
            u : 'F12, cmd + opt + i',
            f : function () {
                
                
            }
        }
    },
    command_history = [],
    actual_command = [],
    curr_command = 0,
    cursor_pointed = 1,
    write_result = function (str, type) {
        var dv = document.createElement('div');

        switch(type) {
            case 3:
                dv.innerHTML = '<div class="command-item"><span>&nbsp;-bash cannot do ' + str + ': ' + str + ' does not exist!</span></div>';   
                break;

            case 2:
                dv.innerHTML = '<div class="command-item"><span>&nbsp;-bash usage: ' + str + '</span></div>';   
                break;

            case 1:
                dv.innerHTML = '<div class="command-item result">' + str + '<br/></div>';
                break;
        }   
        if (str) {
            document.getElementById("commands").insertBefore(dv, document.getElementById("command"));
        }
    },
    keydown_callback = function (e) {
        var rc = document.getElementById("root-command"),
            chr = e.keyCode || e.charCode,
            span = document.createElement("span"),
            uncapture = [8, 46, 37, ,38, 39, 40, 13];   
        
        if (!~uncapture.indexOf(chr)) {
            cursor_pointed++;
            if (chr === 32) {
                span.innerHTML = '&nbsp;';
            } else {
                span.innerHTML = String.fromCharCode(chr);
            }
            rc.insertBefore(span, document.getElementsByClassName("cursor-blink")[0]);
        }


    },
    mousedown_callback = function (e) {
        document.getElementById("cmd-txt").focus();
    },
    special_callback = function (e) {
        var rc = document.getElementById("root-command")
            c_document = document.getElementById("commands")
            chr = e.keyCode || e.charCode;
            
            if (chr === 8 || chr === 46) {
                if (cursor_pointed > 1) {
                    cursor_pointed--;
                    rc.removeChild(document.getElementsByClassName("cursor-blink")[0].previousSibling);
                }
            } else if (chr === 37) {
                if (cursor_pointed > 1) {
                    cursor_pointed--;
                    c_class = document.getElementsByClassName("cursor-blink")[0];
                    c_class.previousSibling.className = "cursor-blink";
                    c_class.className = '';
                }
            } else if (chr === 39) {
                //check if last node
                c_class = document.getElementsByClassName("cursor-blink")[0];
                if (c_class.nextSibling) {
                    cursor_pointed++;
                    c_class = document.getElementsByClassName("cursor-blink")[0];
                    c_class.nextSibling.className = "cursor-blink";
                    c_class.className = '';
                }
            } else if (chr === 38) {
                
                if (command_history.length > 0 && curr_command > 0) {
                    curr_command--;
                    document.getElementById("cmd-txt").focus();
                    document.getElementById("cmd-txt").value = actual_command[curr_command];
                    document.getElementById("root-command").innerHTML = command_history[curr_command];
                    document.getElementById("cmd-txt").focus();
                    cursor_pointed = actual_command[curr_command].length + 1;
                    document.getElementById("cmd-txt").selectionEnd = actual_command[curr_command].length;
                    
                }

            } else if (chr === 40) {
                if (command_history.length > 0 && curr_command < command_history.length-1) {
                    curr_command++;
                    document.getElementById("cmd-txt").focus();
                    document.getElementById("cmd-txt").value = "";
                    document.getElementById("cmd-txt").value = actual_command[curr_command];
                    document.getElementById("root-command").innerHTML = command_history[curr_command];
                    document.getElementById("cmd-txt").focus();
                }

            } else if (chr === 13) {
                dv = document.createElement("div");
                dv2 = document.createElement("div");
                cmd = document.getElementById("cmd-txt").value;
                
                if (cmd.trim() !== '') {
                    command_history.push(document.getElementById("root-command").innerHTML);
                    actual_command.push(cmd);
                    curr_command = command_history.length;
                }

                document.getElementById("root-command").innerHTML = '<span class="cursor-blink">&nbsp;</span>';
                
                dv.innerHTML = '<div class="command-item"><span class="root-name">root@ninz:~$&nbsp;&nbsp;</span><span>' + cmd.replace(/ /g, '&nbsp;').trim() + '</span></div>';
                
                document.getElementById("commands").insertBefore(dv, document.getElementById("command"));
                document.getElementById("cmd-txt").value = "";
                cursor_pointed = 1;
                
                cds = cmd.trim().split(" ");
                if (available_cmd[cds[0].trim()]) {
                    if (available_cmd[cds[0].trim()].e < cds.length) {
                        write_result(available_cmd[cds[0].trim()].u, 2);
                    } else {
                        st = available_cmd[cds[0].trim()].f();
                    }
                } else if (cds[0] === "") {

                } else {
                    write_result(cds[0], 3)
                }
            }
            document.getElementById( 'command' ).scrollIntoView();
    };


(function(r) {
    document.getElementById("cmd-txt").focus(); 
    document.addEventListener("click", function(e) {
        document.getElementById("cmd-txt").focus();
    }, false);

    document.getElementById("cmd-txt").addEventListener("keydown", function (e) {
        var chr = e.keyCode || e.charCode;

        document.getElementById( 'command' ).scrollTop = document.getElementById( 'command' ).scrollHeight;

        if (chr === 38) {
            e.preventDefault();
            return;
        }
    }, false);

    document.addEventListener("keypress", keydown_callback, true);
    document.addEventListener("keydown", special_callback, true);
    
    console.log(" __   __                        _                    _ \n \ \ / /__  _   _    __ _  ___ | |_   _ __ ___   ___| |\n  \ V / _ \| | | |  / _` |/ _ \| __| | '_ ` _ \ / _ \ |\n   | | (_) | |_| | | (_| | (_) | |_  | | | | | |  __/_|\n   |_|\___/ \__,_|  \__, |\___/ \__| |_| |_| |_|\___(_)\n                    |___/                               ");
    console.log("SECRET MESSAGE:");
    console.log("010000110110111101101111011011000010000100100000010100110110111100100000011110010110111101110101001000000111001101100001011101110010000001101001011011100111001101101001011001000110010100101110001000000100111001101111011101110010000001101000011001010110010101100100001000000111010001101000011010010111001100101100001000000111010001101111001000000110001001100101001000000110000101100010011011000110010100100000011101000110111100100000011010110110111001101111011101110010000001101101011001010010110000100000011110010110111101110101001000000110110101110101011100110111010000100000011001110110010101110100001000000111010001101000011001010010000001101110011011110111010001100101011100110010000001110010011010010110011101101000011101000010000100100000");
})(document);
