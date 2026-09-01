const connection = require('./connection');

async function getAllTractors() {
    let selectSql = `SELECT * FROM tractor_tractors`;
    return await connection.query(selectSql);
}

async function getTractorById(id) {
    let selectSql = `SELECT 
                            tt.tractor_name AS name,
                            tcm.clue_text AS clue,
                            tqm.question,
                            tqm.answer
                    FROM tractor_tractors tt
                    LEFT JOIN tractor_clues_master tcm ON tt.id = tcm.tractor_id
                    LEFT JOIN tractor_questions_master tqm ON tt.id = tqm.tractor_id
                    WHERE tt.id = ?`;
    return await connection.query(selectSql, [id]);
}

async function addTractor(parameters = {}) {
    let insertSql = "INSERT INTO tractor_tractors (`tractor_name`) VALUES (?)";
    let tractorId = await connection.getLastInsertId(insertSql, [parameters.name]);

    console.log([tractorId, parameters.clue]);
    let letSecondSql = "INSERT INTO `tractor_clues_master` (`tractor_id`, `clue_text`) VALUES (?, ?)";
    let secondSqlResult = await connection.query(letSecondSql, [tractorId, parameters.clue]);

    let letThirdSql = "INSERT INTO `tractor_questions_master` (`tractor_id`, `question`, `answer`) VALUES (?, ?, ?)";
    let thirdSqlResult = await connection.query(letThirdSql, [tractorId, parameters.question, parameters.answer]);

    return secondSqlResult.id > 0 && thirdSqlResult > 0;
}

async function updateTractorById(id, parameters = {}) {
    parameters.id = id;
    let updateSql = `UPDATE tractor_tractors tt
                        LEFT JOIN tractor_clues_master tcm ON tt.id = tcm.tractor_id
                        LEFT JOIN tractor_questions_master tqm ON tt.id = tqm.tractor_id 
                    SET tt.tractor_name = ?,
                        tcm.clue_text = ?,
                        tqm.question = ?,
                        tqm.answer = ?
                    WHERE tt.id = ?`;
    return await connection.query(
        updateSql,
        [
            parameters.name,
            parameters.clue,
            parameters.question,
            parameters.answer,
            id
        ]
    );
}

module.exports = {
    getAllTractors,
    getTractorById,
    addTractor,
    updateTractorById
}