const Note = require('../models/Note')
const {validationResult} = require('express-validator')
const shortid = require('shortid')

exports.createEditeNote = async (req, res) => {
    const errors = validationResult(req); //validation
    if (!errors.isEmpty()) {
        return res.status(202).json({
            errors: errors.array(),
            details: "data_send_incomplete",
            msg: "Datos enviados incorrectos"
        });
    }

    const {language, code, theme, noteId} = req.body;
    try {

        let note;
        if (noteId) note = await Note.findOne({key: noteId});
        else {
            note = new Note(req.body);
            note.key = shortid.generate({length: 10})
        }

        note.language = language;
        note.code = code;
        note.theme = theme;
        await note.save();

        return res.status(200).json({
            note,
            details: "success"
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({msg: e.message, details: "error"});
    }
}

exports.getNote = async (req, res) => {
    let {noteId} = req.params;

    let note = await Note.findOne({key: noteId});

    if (!note) {
        return res.status(200).json({
            msg: "Esta Note no existe",
            details: "note_doesnt_exists",
            res: false
        });
    }
    return res.status(200).json({note, res: true});
}
