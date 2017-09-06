from flask import Flask, render_template, jsonify, request
from flaskext.mysql import MySQL

app = Flask(__name__)
mysql = MySQL()
app.config['MYSQL_DATABASE_USER'] = 'root'
app.config['MYSQL_DATABASE_PASSWORD'] = 'mysql'
app.config['MYSQL_DATABASE_DB'] = 'Resolve'
app.config['MYSQL_DATABASE_HOST'] = 'localhost'
mysql.init_app(app)

conn = mysql.connect()
cursor = conn.cursor()

@app.route('/')
def index():
	user = ""

	return render_template('index.html', user=user)

@app.route('/getTask')
def getTask():
	x = request.args.get('id', 0, type=str)
	cursor.execute("SELECT * from Tasks WHERE id=%s", x)
	task = cursor.fetchone()
	return jsonify(task)

@app.route('/getSubTasks')
def getSubTasks():
	x = request.args.get('id', 0, type=str)
	y = request.args.getlist('filter[]')
	cursor.execute("SELECT * from Tasks WHERE parentId=%s ORDER BY time", x)
	tasks = cursor.fetchall()
	if y != ['']:
		for filt in y:
			tasks = [x for x in tasks if (filt in x[2]) or (filt in x[3])]
	return jsonify(tasks)

@app.route('/getCrumbs')
def getCrumbs():
	x = int(request.args.get('id', 0, type=str))
	crumbs = []
	while x:
		cursor.execute("SELECT * from Tasks WHERE id=%s", x)
		curr = cursor.fetchone()
		crumbs.insert(0, {
			"id" : curr[0], 
			"name" : curr[2]})
		x = curr[1]
	return jsonify(crumbs)

@app.route('/checkTask')
def checkTask():
	x = request.args.get('check', 0, type=int)
	y = request.args.get('id', 0, type=int)
	cursor.execute("UPDATE Tasks SET status=%s WHERE id=%s", [x, y])
	conn.commit()
	return "Yes"

@app.route('/addTask')
def addTask():
	parentId = request.args.get('parentId', 0, type=int)
	name = request.args.get('name', 0, type=str)
	desc = request.args.get('desc', 0, type=str)
	time = request.args.get('time', 0, type=str)
	ae = request.args.get('ae', 0, type=int)

	if ae:
		cursor.execute("SELECT MAX(id) AS newId FROM Tasks");
		newId = cursor.fetchone()[0];
		if (not newId):
			newId = 0

		cursor.execute("INSERT INTO Tasks (id, parentId, name, description, time, status) VALUES (%s, %s, %s, %s, %s, %s)", [newId+1, parentId, name, desc, time, 0])
		conn.commit()
	else:
		cursor.execute("UPDATE Tasks SET name=%s, description=%s, time=%s WHERE id=%s", [name, desc, time, parentId])
		conn.commit()
	return "Yes"

@app.route('/deleteTask')
def deleteTask():
	x = request.args.get('id', 0, type=int)
	recurDeleteTask(x)
	return "Yes"

def recurDeleteTask(taskId):
	cursor.execute("SELECT * FROM Tasks WHERE parentId=%s", taskId)
	subTasks = cursor.fetchall()
	for subs in subTasks:
		recurDeleteTask(subs[0])
	cursor.execute("DELETE FROM Tasks WHERE id=%s", taskId)
	conn.commit()

@app.route('/getNotes')
def getNotes():
	y = request.args.getlist('filter[]')

	cursor.execute("SELECT * FROM Notes ORDER BY date DESC")
	recNotes = cursor.fetchall()

	if y != ['']:
		for filt in y:
			recNotes = [x for x in recNotes if (filt in x[1]) or (filt in x[3])]

	cursor.execute("SELECT * FROM Notes ORDER BY topic, date")
	topNotes = cursor.fetchall()

	if y != ['']:
		for filt in y:
			topNotes = [x for x in topNotes if (filt in x[1]) or (filt in x[3])]

	return jsonify((recNotes,topNotes))

@app.route('/addNote')
def addNote():
	x = request.args.get('time', 0, type=str)
	cursor.execute("SELECT MAX(id) AS newId FROM Notes");
	newId = cursor.fetchone()[0];
	if (not newId):
		newId = 0
	cursor.execute("INSERT INTO Notes VALUES (%s, '', %s, '')", [newId+1, x])
	conn.commit()
	return "Yes"

@app.route('/editNote')
def editNote():
	noteId = request.args.get('id', 0, type=str)
	topic = request.args.get('topic', 0, type=str)
	desc = request.args.get('desc', 0, type=str)
	date = request.args.get('time', 0, type=str)
	cursor.execute("UPDATE Notes SET topic=%s, content=%s, date=%s WHERE id=%s", [topic, desc, date, noteId])
	conn.commit()
	return "Yes"

@app.route('/deleteNote')
def deleteNote():
	x = request.args.get('id', 0, type=str)
	cursor.execute("DELETE FROM Notes WHERE id=%s", x)
	conn.commit()
	return "Yes"

if __name__ == "__main__":
	app.run(debug=True)




