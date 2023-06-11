

const db = require("../db");

exports.getAllTasks = function(req, res) {
    const UID = req.user_id; // Get from middleware
    
    try {
        db.query(`SELECT * FROM get_all_tasks(${UID})`, 
            (err, dbres) => {
                if (err) {
                    console.log(err.stack);
                } else {
                    res.status(200).json(dbres.rows);
                }
            }
        )
    }
    catch(err) {
        res.status(500).json({ error: err });
    }
}
exports.getAllTaskByNames = function(req, res) {
    const UID = req.user_id; // Get from middleware
    const task_name = req.query.task_name;
    
    try {
        db.query(`SELECT * FROM get_tasks_by_uid_and_name(${UID}, '${task_name}')`, 
            (err, dbres) => {
                if (err) {
                    console.log(err.stack);
                } else {
                    res.status(200).json(dbres.rows);
                }
            }
        )
    }
    catch(err) {
        res.status(500).json({ error: err });
    }
}

exports.editTask = function(req, res) {
    const tid = req.body.task_id;
    const tdata = req.body.task_data;
    try {
        db.query(
            `SELECT edit_task(
                '${tid}', 
                '${tdata.status}', 
                '${JSON.stringify(tdata.tags)}', 
                '${tdata.task_name}', 
                '${tdata.description}', 
                '${tdata.due_date}', 
                '${tdata.priority}'
            )`, (err, dbres) => {
                if (err) {
                    console.log(err.stack);
                } else {
                    res.status(200).json(dbres);
                }
            }
        )
    }
    catch(err) {
        res.status(500).json({ error: err });
    }
}

exports.createNewTask = function(req, res) {
    const uid = req.user_id;
    const tdata = req.body.task_data;
    try {
        db.query(
            `SELECT create_task(
                '${uid}',
                '${tdata.status}', 
                '${JSON.stringify(tdata.tags)}', 
                '${tdata.task_name}', 
                '${tdata.description}', 
                '${tdata.due_date}', 
                '${tdata.priority}'
            )`, (err, dbres) => {
                if (err) {
                    console.log(err.stack);
                } else {
                    res.status(200).json(dbres);
                }
            }
        )
    }
    catch(err) {
        res.status(500).json({ error: err });
    }
}

exports.deleteTask = function(req, res) {
    const task_id = req.body.tid;
    try {
        db.query(`SELECT delete_task('${task_id}')`,
            (err, dbres) => {
                if (err) {
                    console.log(err.stack);
                } else {
                    res.status(200).json(dbres);
                }
            }
        )
    }
    catch(err) {
        res.status(500).json({ error: err });
    }
}
