var currtab = null;
var initialized = {
	me: 0,
	blog: 0,
	tasks: 0,
	notes: 0,
	skills: 0,
	log: 0
};

function init() {
	showPane("tasks");
}

function showPane(tabName) {
	if (currtab) {
 		document.getElementById(currtab).classList.remove("selected");
 		document.getElementById(currtab+"Nav").classList.remove("selected");

 	}		
	
	document.getElementById(tabName).classList.add("selected");
	document.getElementById(tabName+"Nav").classList.add("selected");
	currtab = tabName;
	if (!initialized[tabName]) {
		initialized[tabName] = 1;
		tabInit(tabName);
	}
}

function tabInit(tabName) {
	switch (tabName) {
		case "me":
		
			break;

		case "blog":

			break;

		case "tasks":
			renderTask(0);
			break;

		case "notes":
			openNotes(0);
			break;

		case "skills":

			break;

		case "log":

			break;
	}
}

// EVENT INTIATION 

$(document).ready(function() {
  document.getElementsByClassName("taskSearch")[0].addEventListener("keypress", function(event) {
		if(event.which == 13) {
			renderTask($("#taskDesc .taskId").val());
		}
	});

  document.getElementsByClassName("noteSearch")[0].addEventListener("keypress", function(event) {
		if(event.which == 13) {
			openNotes();
		}
	});
});

//
// TASKS
//

function openTask(taskObj) {
	renderTask(taskObj.getElementsByClassName("taskId")[0].value);
	document.getElementsByClassName("taskSearch")[0].value="";
}

function buttonMainTask() {
	$(".tabpane.selected .addButton").addClass("hide");
	$(".tabpane.selected .addMainButton").removeClass("hide");
	$(".tabpane.selected .editButton").addClass("hide");
	$(".tabpane.selected .delButton").addClass("hide");
	$(".tabpane.selected .submitButton").addClass("hide");
	$(".tabpane.selected .cancelButton").addClass("hide");
	$(".tabpane.selected .undoButton").addClass("hide");
}

function buttonTasks() {
	$(".tabpane.selected .addButton").removeClass("hide");
	$(".tabpane.selected .addMainButton").addClass("hide");
	$(".tabpane.selected .editButton").removeClass("hide");
	$(".tabpane.selected .delButton").removeClass("hide");
	$(".tabpane.selected .submitButton").addClass("hide");
	$(".tabpane.selected .cancelButton").addClass("hide");
	$(".tabpane.selected .undoButton").addClass("hide");
}

function buttonEditTask() {
	$(".tabpane.selected .addButton").addClass("hide");
	$(".tabpane.selected .addMainButton").addClass("hide");
	$(".tabpane.selected .editButton").addClass("hide");
	$(".tabpane.selected .delButton").addClass("hide");
	$(".tabpane.selected .submitButton").removeClass("hide");
	$(".tabpane.selected .cancelButton").removeClass("hide");
	$(".tabpane.selected .undoButton").addClass("hide");
}

function clearTasks() {
	var taskDescDiv = document.getElementById("taskDesc");
	var taskListDiv = document.getElementById("taskList");
	var taskCrumbDiv = document.getElementById("tasksBreadcrumbs");
	var taskFormDiv = document.getElementById("taskForm");
	taskDescDiv.innerHTML = "";
	taskListDiv.innerHTML = "";
	taskCrumbDiv.innerHTML = "";
	taskFormDiv.innerHTML = "";
}

function renderTask(taskId, callback) {
	var taskDescDiv = document.getElementById("taskDesc");
	var taskListDiv = document.getElementById("taskList");
	var taskCrumbDiv = document.getElementById("tasksBreadcrumbs");
	var taskFormDiv = document.getElementById("taskForm");
	taskDescDiv.innerHTML = "";
	taskListDiv.innerHTML = "";
	taskCrumbDiv.innerHTML = "";
	taskDescDiv.classList.remove("hide");
	taskListDiv.classList.remove("hide");
	taskCrumbDiv.classList.remove("hide");
	taskFormDiv.classList.add("hide");

  getTask(taskId, function(taskObj) {
	  if (taskId && taskId != "0") {
	  	buttonTasks();
			taskDescDiv.appendChild(fillTask(taskObj));
		}
		else {
			document.getElementById("taskDesc").innerHTML = "<input type='hidden' class='taskId' value=0>";
			buttonMainTask();
		}
  });  


  var filters = document.getElementsByClassName("taskSearch")[0].value.split(" ");

  getSubTasks(taskId, filters, function(taskList) {
		for (let c = 0, len = taskList.length; c < len; c++) {
	    if (taskList[c][1] == taskId) {
	    	taskListDiv.appendChild(fillSubTask(taskList[c]));
	    }
	  }
	});

	getCrumbs(taskId, function(crumbList) {
		var breadcrumbs = "";
		if (crumbList.length > 0) {
			breadcrumbs = "<div class='crumbButton' onclick='renderTask(0);'> ▪ Tasks </div>";
			for (let c = 0; c < crumbList.length-1; c++) {
				breadcrumbs += "<div class='crumbButton' onclick='renderTask(" + crumbList[c].id + ");'> ▪ " + crumbList[c].name + "</div>";
			}
		}
		taskCrumbDiv.innerHTML = breadcrumbs;
	});

	if (callback) callback();
} 

function renderAddMainTask() {
	var taskDescDiv = document.getElementById("taskDesc");
	var taskListDiv = document.getElementById("taskList");
	var taskCrumbDiv = document.getElementById("tasksBreadcrumbs");
	var taskFormDiv = document.getElementById("taskForm");
	taskFormDiv.innerHTML = "";

	taskDescDiv.classList.add("hide");
	taskListDiv.classList.add("hide");
	taskCrumbDiv.classList.remove("hide");
	taskFormDiv.classList.remove("hide");

	buttonEditTask();

	var taskDiv = document.getElementById("addTaskTemplate").cloneNode(true);

	taskDiv.id = "currTask";
	taskDiv.getElementsByClassName("parentTaskId")[0].value = 0;
	taskDiv.getElementsByClassName("addEdit")[0].value = 1;

	taskDiv.addEventListener("keypress", function(event) {
		if(event.which == 13 && document.getElementsByClassName("focusExcept")[0] != document.activeElement) {
				addTask();
		}
	});

	taskFormDiv.appendChild(taskDiv);
	$('#currTask .datepicker').richDatepicker();
	$('#currTask .timepicker').timeEntry({
		ampmPrefix: " ",
    defaultTime: "12:00 AM"
	});
	$(".timeEntry-control").remove();
	document.getElementsByClassName("focusBlink")[0].focus();
	document.getElementsByClassName("addFocus")[0].focus();
}


function renderAddTask(ae) {
	var x = document.getElementsByClassName("mainTask");
	var taskDescDiv = document.getElementById("taskDesc");
	var taskListDiv = document.getElementById("taskList");
	var taskCrumbDiv = document.getElementById("tasksBreadcrumbs");
	var taskFormDiv = document.getElementById("taskForm");
	taskFormDiv.innerHTML = "";
	taskDescDiv.classList.add("hide");
	taskListDiv.classList.add("hide");
	taskCrumbDiv.classList.remove("hide");
	taskFormDiv.classList.remove("hide");

	buttonEditTask();
	
	var taskDiv = document.getElementById("addTaskTemplate").cloneNode(true);
	taskDiv.id = "currTask";
	taskDiv.getElementsByClassName("parentTaskId")[0].value = x[0].getElementsByClassName("taskId")[0].value;
	taskDiv.getElementsByClassName("addEdit")[0].value = ae;

	taskDiv.addEventListener("keypress", function(event) {
		if(event.which == 13 && document.getElementsByClassName("focusExcept")[0] != document.activeElement) {
				addTask();
		}
	});

	if (!ae) {
		$(".tabpane.selected .undoButton").removeClass("hide");


		taskDiv.getElementsByClassName("taskName")[0].value = x[0].getElementsByClassName("taskName")[0].innerHTML;
		taskDiv.getElementsByClassName("taskDesc")[0].value = x[0].getElementsByClassName("taskDesc")[0].innerHTML;
	}
	taskDiv.getElementsByClassName("taskTime")[0].value = x[0].getElementsByClassName("taskTime")[0].value;

	taskFormDiv.appendChild(taskDiv);
	$('#currTask .datepicker').richDatepicker();

	var fullDate = $('#currTask .taskTime').val();
	var dA = dateJStoNum(fullDate);
	$('#currTask .datepicker').data('date').val(dA[0], dA[1], dA[2]);

	$('#currTask .timepicker').timeEntry({
		ampmPrefix: " ",
    defaultTime: "12:00 AM"
	});
	$(".timeEntry-control").remove();
	document.getElementsByClassName("focusBlink")[0].focus();
	document.getElementsByClassName("addFocus")[0].focus();
}

function addTask() {
	var x = document.getElementById("currTask");
	var ae = x.getElementsByClassName("addEdit")[0].value;
	var time = x.getElementsByClassName("timeInput")[0].value;
	var y = $('#currTask .datepicker').data('date').val()[2];
	var m = $('#currTask .datepicker').data('date').val()[1];
	var d = $('#currTask .datepicker').data('date').val()[0];
	var date = dateJStoSQL(m + " " + d + " " + y + " " + time);

	$.ajax({
		url: '/addTask',
		data: {
			parentId : x.getElementsByClassName("parentTaskId")[0].value,
			name : x.getElementsByClassName("taskName")[0].value,
			desc : x.getElementsByClassName("taskDesc")[0].value,
			time : date,
			ae : ae
		},
		type: 'GET',
		success: function(res) {
			renderTask(x.getElementsByClassName("parentTaskId")[0].value);
		},
		error: function(e) {
			console.log("Task setter fucked up");
		} 
	});
}


function deleteTask() {


	var x = document.getElementsByClassName("mainTask");

	$.ajax({
		url: '/deleteTask',
		data: {
			id : x[0].getElementsByClassName("taskId")[0].value
		},
		type: 'GET',
		success: function(res) {
			renderTask(x[0].getElementsByClassName("parentTaskId")[0].value);
			$(".tabpane.selected .undoButton").removeClass("hide");
		},
		error: function(e) {
			console.log("Task deleter fucked up");
		} 
	});
}

function deleteSubTask(buttonInput) {
	$(".tabpane.selected .undoButton").removeClass("hide");

	var x = $(buttonInput).closest(".task");

	$.ajax({
		url: '/deleteTask',
		data: {
			id : x[0].getElementsByClassName("taskId")[0].value
		},
		type: 'GET',
		success: function(res) {
			x[0].style.display = "none";
		},
		error: function(e) {
			console.log("Task deleter fucked up");
		} 
	});
}

function cancelTask() {

	var x = document.getElementById("currTask").getElementsByClassName("parentTaskId")[0].value;
	renderTask(x);
}

function getTask(taskId, callback) {
	$.ajax({
		url: '/getTask',
		data: {
			id : taskId
		},
		type: 'GET',
		success: function(res) {
			if(callback) callback(res);
		},
		error: function(e) {
			console.log("Task getter fucked up");
		} 
	});
}


function getSubTasks(taskId, filters, callback) {
	$.ajax({
		url: '/getSubTasks',
		data: {
			id : taskId,
			filter: filters
		},
		type: 'GET',
		success: function(res) {
			if(callback) callback(res);
		},
		error: function(e) {
			console.log("Subtask getter fucked up");
		} 
	});
}

function getCrumbs(taskId, callback) {
	return $.ajax({
		url: '/getCrumbs',
		data: {
			id : taskId
		},
		type: 'GET',
		success: function(res) {
			if(callback) callback(res);
		},
		error: function(e) {
			console.log("Breadcrumb getter fucked up");
		} 
	});
}

function fillTask(taskObj) {
	var taskDiv = document.getElementById("taskTemplate").cloneNode(true);
	taskDiv.id = "task" + taskObj[0];
	taskDiv.getElementsByClassName("taskId")[0].value = taskObj[0];
	taskDiv.getElementsByClassName("parentTaskId")[0].value = taskObj[1];
	taskDiv.getElementsByClassName("taskName")[0].innerHTML = taskObj[2];
	taskDiv.getElementsByClassName("taskDesc")[0].innerHTML = taskObj[3];
	taskDiv.getElementsByClassName("taskTime")[0].value = taskObj[4]//reenable date org;
	taskDiv.getElementsByClassName("taskTimeDispDate")[0].innerHTML = dateSQLtoNorm(taskObj[4])[0];
	taskDiv.getElementsByClassName("taskTimeDispTime")[0].innerHTML = dateSQLtoNorm(taskObj[4])[1];
	taskDiv.getElementsByClassName("taskStatus")[0].checked = taskObj[5];
	if (taskObj[5]) {
		taskDiv.classList.add('completed');
	}
	return taskDiv;
}

function fillSubTask(taskObj) {
	var taskDiv = document.getElementById("subTaskTemplate").cloneNode(true);
	taskDiv.id = "task" + taskObj[0];
	taskDiv.getElementsByClassName("taskId")[0].value = taskObj[0];
	taskDiv.getElementsByClassName("parentTaskId")[0].value = taskObj[1];
	taskDiv.getElementsByClassName("taskName")[0].innerHTML = taskObj[2];
	taskDiv.getElementsByClassName("taskTime")[0].value = taskObj[4];
	taskDiv.getElementsByClassName("taskTimeDisp")[0].innerHTML = dateSQLtoSlim(taskObj[4]);
	taskDiv.getElementsByClassName("taskStatus")[0].checked = taskObj[5];
	if (taskObj[5]) {
		taskDiv.classList.add('completed');
	}
	return taskDiv;
}

function checkTask(checkInput) {
	var x = $(checkInput).closest(".task");
	var checkMark = 0 + checkInput.checked;
	if (checkMark) {
		x[0].classList.add('completed');
	}
	else {
		x[0].classList.remove('completed');
	}
	$.ajax({
		url: '/checkTask',
		data: {
			check : checkMark,
			id : x[0].getElementsByClassName("taskId")[0].value
		},
		type: 'GET',
		success: function(res) {
		},
		error: function(e) {
			console.log("Checked post fucked up");
		} 
	});
}



//
//NOTES STUFF
//

function openNotes() {
	renderNotes(function(id) {
		var x = document.getElementById("note"+id)
		renderNote(x);
	});
}

function renderNotes(callback) {
	getNotes(function(res) {

		document.getElementById("noteSidebar").innerHTML = "";

		var sort = document.getElementsByClassName("sortButton")[0].value;

		if (res[0].length == 0) {
			document.getElementById("noteContent").innerHTML = "<div style='margin:30px; color:grey;'> No Notes </div>";
		}
		else {
			for(var c = 0; c < res[0].length; c++) {
				document.getElementById("noteSidebar").append(fillSideNote(res[sort][c]));
			}
			if (callback) callback(res[0][0][0]);
		}
			
	});
}

function fillSideNote(obj) {

		var sideNote = document.getElementById("sideNoteTemplate").cloneNode(true);
		sideNote.id = "note" + obj[0];
		sideNote.getElementsByClassName("noteId")[0].value = obj[0];
		sideNote.getElementsByClassName("noteDate")[0].innerHTML = dateSQLtoSlim(obj[2]);
		sideNote.getElementsByClassName("noteTime")[0].value = obj[2];
		sideNote.getElementsByClassName("noteTopic")[0].innerHTML = obj[1];
		sideNote.getElementsByClassName("noteDescSnip")[0].innerHTML = obj[3];
		sideNote.getElementsByClassName("noteDesc")[0].value = obj[3];
		return sideNote;
}

function getNotes(callback) {
	var filters = document.getElementsByClassName("noteSearch")[0].value.split(" ");
	console.log(filters);
	$.ajax({
		url: '/getNotes',
		data: {
			filter : filters
		},
		type: 'GET',
		success: function(res) {
			if (callback) callback(res);
		},
		error: function(e) {
			console.log("Notes getter fucked up");
		} 
	});
}

function renderNote(noteObj) {
	var note = document.getElementById("noteTemplate").cloneNode(true);
	note.id = "currNote";
	note.getElementsByClassName("noteTopic")[0].value = noteObj.getElementsByClassName("noteTopic")[0].innerHTML;
	note.getElementsByClassName("noteDesc")[0].value = noteObj.getElementsByClassName("noteDesc")[0].value;
	note.getElementsByClassName("noteId")[0].value = noteObj.getElementsByClassName("noteId")[0].value;

	document.getElementById("noteContent").innerHTML = "";
	document.getElementById("noteContent").append(note);
}	

function addNote() {
	var today = new Date();
	time = today.toISOString();
	$.ajax({
		url: '/addNote',
		data: {
			time: time
		},
		type: 'GET',
		success: function(res) {
			openNotes();
		},
		error: function(e) {
			console.log("Notes maker fucked up");
		} 
	});
}

function saveNote() {
	var today = new Date();
	time = today.toISOString();
	$.ajax({
		url: '/editNote',
		data: {
			id : document.getElementById("currNote").getElementsByClassName("noteId")[0].value,
			topic : document.getElementById("currNote").getElementsByClassName("noteTopic")[0].value,
			desc : document.getElementById("currNote").getElementsByClassName("noteDesc")[0].value,
			time : time
		},
		type: 'GET',
		success: function(res) {
			renderNotes();
		},
		error: function(e) {
			console.log("Notes maker fucked up");
		} 
	});
}	

function sortNote(butt) {
	if (butt.value == 0) {
		butt.value = 1;
	}
	else butt.value = 0;
	renderNotes();
}

function deleteNote() {
	if (document.getElementById("noteSidebar").innerHTML != "") {
		$.ajax({
			url: '/deleteNote',
			data: {
				id: document.getElementById("currNote").getElementsByClassName("noteId")[0].value
			},
			type: 'GET',
			success: function(res) {
				openNotes();	
			},
			error: function(e) {
				console.log("Notes maker fucked up");
			} 
		});
	}
}




/* TIME */

function dateJStoSQL(dateStr) {
	var date = new Date(dateStr);
	return date.toISOString();
}

function dateJStoNum(dateStr) {
	var months = {
		Jan: 0,
		Feb: 1,
		Mar: 2,
		Apr: 3,
		May: 4,
		Jun: 5,
		Jul: 6,
		Aug: 7,
		Sep: 8,
		Oct: 9,
		Nov: 10,
		Dec: 11
	}
	var dmy = [];
	dmy.push(parseInt(dateStr.substring(5,7)));
	var month = dateStr.substring(8,11);
	dmy.push(months[month]);
	dmy.push(parseInt(dateStr.substring(12,16)));
	return dmy;
}

function dateSQLtoJS(dateStr) {
	return new Date(dateStr);
}

function dateSQLtoNorm(dateStr) {
	var date = dateSQLtoJS(dateStr);
	var str = date.toString();
	var dateDisp = str.substring(0,16);

	var hr = date.getHours();
	var min = date.getMinutes();
	var time = milConvert(hr, min);

	return [dateDisp, time];
}

function dateSQLtoSlim(dateStr) {
	var date = dateSQLtoJS(dateStr);

	var months = [
		'Jan',
		'Feb',
		'Mar',
		'Apr',
		'May',
		'Jun',
		'Jul',
		'Aug',
		'Sep',
		'Oct',
		'Nov',
		'Dec'
	]

	var days = [
		'Sun',
		'Mon',
		'Tue',
		'Wed',
		'Thu',
		'Fri',
		'Sat'
	]
	var day = days[date.getDay()];
	var month = months[date.getMonth()];
	var d = date.getDate();
	var m = date.getMonth();
	var y = date.getFullYear();
	var hr = date.getHours();
	var min = date.getMinutes();
	var time = milConvert(hr, min);

	var today = new Date();

	if (date<today) {
		return month + " " + d + " " + y;
	}
	else if ((Math.abs(today.getFullYear())-y) > 0) {
		return month + " " + y;
	}
	else if ((Math.abs(today.getMonth())-m) > 0) {
		return month + " " + d;
	}
	else if ((Math.abs(today.getDate())-d) > 6) {
		return month + " " + d;
	}
	else {
		return day + " " + time;
	}
}

function milConvert(hr, min) {
	min = (min < 10) ? '0' + min.toString() : min.toString();

	if (hr == 0 && min == "00") {
		return "";
	}
	else if (hr == 0) {
	  return "12:" + min + "AM";
	}
	else if (hr > 0 && hr < 12) {
	  return hr + ":" + min + "AM";
	} 
	else if (hr == 12) {
		return "12:" + min + "PM";
	}
	else {
		return (hr-12) + ":" + min + "PM";
	}
}