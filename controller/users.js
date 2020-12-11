const user = require('../model/user');
const User = require('../model/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');



const loginUser = async(request, response) => {
    const saltRounds = 10;
    const { name, email, password } = request.body;


    let user = await User.findOne({ email });
    if (!user) {
        return response.status(422).send({
            succes: false,
            message: 'Wrong credentials'
        });
    }

    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) {
        return res.status(422).json({
            succes: false,
            message: 'Wrong credentials'
        });
    }



    //generate JWT
    var token = jwt.sign({ user }, process.env.SEED, { expiresIn: '2h' });



    response.json({
        succes: true,
        message: 'Token created successfully',
        token
    });

}

const createUser = async(request, response) => {
    const { name, email, password } = request.body;

    let user = new User({ name, email, password });

    user.password = bcrypt.hashSync(user.password, 10);

    try {
        await user.save();
    } catch (err) {
        if (err.name === 'MongoError' && err.code === 11000) {
            return response.status(422).send({
                succes: false,
                message: 'User already exist!'
            });
        }
    }

    response.json({
        succes: true,
        message: 'User created successfully'
    });
}
const listUsers = async(request, response) => {
    await User.find({}, 'name email').then(u => {
        response.status(200).json(u);
    })
}

const updateUser = async(request, response) => {
    const { name, email } = request.body;

    try {
        await User.updateOne({ email }, { name, email });
    } catch (err) {
        return response.status(422).send({
            succes: false,
            message: 'Cannot update!'
        });
    }
    response.json({
        succes: true,
        message: 'User updated successfully'
    });

}

const deleteUser = async(request, response) => {
    const { email } = request.body;

    try {
        await User.deleteOne({ email });
    } catch (err) {
        return response.status(422).send({
            succes: false,
            message: 'Cannot delete!'
        });
    }
    response.json({
        succes: true,
        message: 'User deleted successfully'
    });
}

module.exports = {
    loginUser,
    createUser,
    listUsers,
    updateUser,
    deleteUser
};