const User = require('../models/users.js');
const { authenticate } = require('../utils/authenticate')
const { createToken } = require('../utils/createToken')

const signUp = async (req, res) => {
    console.log(req.body)

    if(!req.body) {
        return res.status(400).send({
            message: "User content can not be empty"
        });
    }

	const user = await User.create(req.body).catch(e => {
        console.log(e)
        res.status(400).json(e) 
    })
	if (!user) res.status(400).json(e)
	res.status(202).json(user)
}

const signin = async (req, res) => {
	authenticate(req.body).then((user) => {
		if (!user) res.send(404).json({ message: "User not found" });
		const token = createToken(user);
		res.status(200).json({ token });
    }).catch(e => {
        console.log(e)
        res.status(400).json({e})
}); 
}

const addContact = async (req, res) => {
    if(!req.body) {
        return res.status(400).send({
            message: "User content can not be empty"
        });
    }

    User.findByIdAndUpdate(req.params.userId, 
        { 
            "$push": {
                "contacts": req.body
            }
        }
        , {new: true})
    .then(user => {
        if(!user) {
            return res.status(404).send({
                message: "User not found with id " + req.params.userId
            });
        }
        res.send(user);
    }).catch(err => {
        console.log(err)
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "User not found with id " + req.params.userId
            });                
        }
        return res.status(500).send({
            message: "Error updating company with id " + req.params.userId
        });
    });
}

module.exports = {
    signUp,
    signin,
    addContact
}