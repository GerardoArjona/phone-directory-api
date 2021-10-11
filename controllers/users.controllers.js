const ObjectId = require('mongodb').ObjectID;
const User = require('../models/users.js');
const { authenticate } = require('../utils/authenticate')
const { createToken } = require('../utils/createToken')

const signUp = async (req, res) => {
    console.log(req.body)
    res.setHeader('Content-Type', 'application/json');

    if(!req.body) {
        return res.status(400).send({
            message: "User info cannot be empty"
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
    res.setHeader('Content-Type', 'application/json');

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
    res.setHeader('Content-Type', 'application/json');

    if(!req.body) {
        return res.status(400).send({
            message: "Contact can not be empty"
        });
    }

    User.findByIdAndUpdate(req.user._id, 
        { 
            "$push": {
                "contacts": req.body
            }
        }
        , {new: true})
    .then(user => {
        if(!user) {
            return res.status(404).send({
                message: `User not found with id ${req.user._id}. Contact not added.`
            });
        }
        res.status(202).send(user);
    }).catch(err => {
        console.log(err)
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: `User not found with id ${req.user._id}. Contact not added.`
            });                
        }
        return res.status(500).send({
            message: `Error adding contact to user with id ${req.user._id}. Contact not added.`
        });
    });
}

const listContactsFromUser = async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    let userWithContacts = await User.findOne({ _id: req.user._id })
                                .select('contacts');
    if(!userWithContacts) {
        return res.status(404).send({
            message: `Contacts not found`
        });                
    }
    userWithContacts.contacts.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0))                         
	res.status(200).json(userWithContacts)
}

const getContactById = async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    const userWithContacts = await User.findOne({ _id: req.user._id })
                                .select('contacts');
    if(!userWithContacts) {
        return res.status(404).send({
            message: `Contacts not found`
        });                
    }
    let foundContact = userWithContacts.contacts.find(contact => contact._id.toString() === req.params.contactId)
    if(!foundContact) {
        return res.status(404).send({
            message: `Contact not found`
        });                
    }                         
	res.status(200).json(foundContact)
}

const deleteContactById = async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    const userWithContacts = await User.findByIdAndUpdate({ _id: req.user._id }, {
      '$pull': {
          'contacts':{ '_id': new ObjectId(req.params.contactId) }
      }
    }, {new: true}).select('contacts');
  console.log(userWithContacts);
    if(!userWithContacts) {
        return res.status(404).send({
            message: `Contacts not found`
        });                
    }
    res.status(204);
}

module.exports = {
    signUp,
    signin,
    addContact,
    listContactsFromUser,
    getContactById,
    deleteContactById
}