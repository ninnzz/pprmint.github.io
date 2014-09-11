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

				return str;
			}
		},
		whoami : {
			m : "Displays the description of the user."
		}
	},
	command_history = [],
	actual_command = [],
	curr_command = 0,
	cursor_pointed = 1,
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
						dv2.innerHTML = '<div class="command-item"><span>&nbsp;-bash usage: ' + available_cmd[cds[0].trim()].u + '</span></div>';
					} else {
						st = available_cmd[cds[0].trim()].f();
						dv2.innerHTML = '<div class="command-item result">' + st + '<br/></div>';
					}
				} else {
					dv2.innerHTML = '<div class="command-item"><span>&nbsp;-bash cannot ' + cds[0] + ': Command not found</span></div>';

				}
				document.getElementById("commands").insertBefore(dv2, document.getElementById("command"));
			}

	};


(function(r) {
	document.getElementById("cmd-txt").focus();	
	document.addEventListener("click", function(e) {
    	document.getElementById("cmd-txt").focus();
    }, false);

    document.getElementById("cmd-txt").addEventListener("keydown", function (e) {
    	var chr = e.keyCode || e.charCode;
    	if (chr === 38) {
    		e.preventDefault();
    		return;
    	}
    }, false);

    document.addEventListener("keypress", keydown_callback, true);
    document.addEventListener("keydown", special_callback, true);

})(document);