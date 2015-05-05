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
				write_result('<br/> The description about me here <br/><br/>', 1);
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
		showbabies : {
			m : "Displays the list of projects.",
			e : 2,
			u : 'showbabies [all | github | others] (defaults to all)',
			f : function () {


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
    console.log("01001000 01100101 01101100 01101100 01101111 00100001                                                                                                                                                  \n01010000 01101111 01110010 01110100 01100110 01101111 01101100 01101001 01101111  01010101 01101110 01100100 01100101 01110010                                                                         \n01000011 01101111 01101110 01110011 01110100 01110010 01110101 01100011 01110100 01101001 01101111 01101110 00100001\n01001001 01100110  01111001 01101111 01110101  01100011 01100001 01101110  01110010 01100101 01100001 01100100  01110100 01101000 01101001 01110011 00101100                                           \n01110100 01101000 01100101 01101110  01100111 01101111 01101111 01100100  01100110 01101111 01110010  01111001 01101111 01110101 00100001  01101000 01100001 01101000 01100001\n01000110 01101111 01110010  01101110 01101111 01110111\n01111001 01101111 01110101  01100011 01100001 01101110  01100011 01101111 01101110 01110100 01100001 01100011 01110100\n01101101 01100101  01110100 01101000 01110010 01101111 01110101 01100111 01101000\n01101110 01110010 01100101 01100011 01101100 01100001 01110010 01101001 01101110 01000000 01100111 01101101 01100001 01101001 01101100 00101110 01100011 01101111 01101101                             \n01101001 01100110  01111001 01101111 01110101  01110111 01100001 01101110 01110100  01110100 01101000 01100101  01100110 01110101 01101100 01101100                                                    \n01101100 01101001 01110011 01110100  01101111 01100110  01101101 01111001  01110000 01110010 01101111 01101010 01100101 01100011 01110100 01110011                                                     \n00101000 01100111 01101001 01110100 01101000 01110101 01100010  01100101 01110100 01100011  01100101 01110100 01100011 00101001\n01010000 01010011 00111010\n01001001 01100110  01111001 01101111 01110101  01100001 01110010 01100101  01100110 01110010 01101111 01101101  01110100 01101000 01100101                                                             \n01100111 01101100 01101111 01100010 01100001 01101100 01101000 01100001 01100011 01101011 01100001 01110100 01101000 01101111 01101110  01110100 01101000 01101001 01101110 01100111 01111001 00101100 \n01010000 01001001 01000011 01001011  01001101 01000101 00101110 00101110 00100001  01001000 01000001 01001000 01000001");
})(document);
