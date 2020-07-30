const bcrypt = require('bcrypt');
const Sequelize = require('sequelize');
const db = require('./db');
const Model = Sequelize.Model;
const asyncHandler = require('express-async-handler');

class User extends Model {
    static async findUserById(id) {
        return User.findByPk(id);
    }

    static async findUserByEmail(email) {
        var result = User.findOne({
            where: {
                email: email
            }
        });
        return result;
    }

    static async auth(email, password) {
        var user = await this.findUserByEmail(email);
        if (user != null && User.verifyPassword(password, user.password)) {
            return user.id;
        }
        return null;
    }

    static async createUser(user) {
        try {
            // tạo một transaction để kiểm soát dữ liệu
            transaction = await Sequelize.transaction();
            await User.create(user, { transaction });
            await transaction.commit();
            return { success: true, error: null };
        } catch (err) {
            // nếu có lỗi xảy ra thì rollback transaction
            if (transaction) {
                await transaction.rollback();
            }
            return { success: false, error: error };
        }
    }

    static hashPassword(password) {
        return bcrypt.hashSync(password, 10);  //hash password 10 lần
    }

    static verifyPassword(password, passwordHash) {
        return password == passwordHash;
    }

}

// tạo bảng và các cột trong bảng
User.init({
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    displayName: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    role:{
        type: Sequelize.STRING,
        defaultValue: 'user'
    }
}, {
    sequelize: db,
    modelName: 'user'
})

// const users = [
//     { userName: 'admin', email: 'admin@gmail.com', displayName: 'Quản trị viên', password: '123', role: 'admin' },
//     { userName: 'lamngoc', email: 'lamngoc@gmail.com', displayName: 'Trần Lam Ngọc', password: '123', role: 'guest' },
// ];

module.exports = User;
