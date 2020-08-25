const bcrypt = require('bcrypt');
const Sequelize = require('sequelize');
const db = require('./db');
const Model = Sequelize.Model;

class User extends Model {
    static async findUserById(id) {
        return User.findByPk(id);
    }

    static async findAllUser(offset = 0, limit = 5, order = 'id', desc = 'DESC') {
        const rs = await User.findAll({
            order: [
                [order, desc]
            ],
            offset: offset,
            limit: limit
        });
        return rs;
    }

    static async findUserByEmail(email, cb) {
        var result = await User.findOne({
            where: {
                email: email
            }
        }, cb);
        return result;
    }

    static async findAllUserByEmail(email, cb) {
        var result = await User.findOne({
            where: {
                email: {
                    [Sequelize.Op.iLike]: `'%${email}'%`
                }
            }
        }, cb);
        return result;
    }

    static async findAllUserByFullName(fullName, cb) {
        var result = await User.findAll({
            where: {
                fullName: {
                    [Sequelize.Op.iLike]: `%${fullName}%`
                }
            }
        }, cb);
        return result;
    }

    // static async findUserByProp(propName, propValue, cb) {
    //     var result = await User.findAll({
    //         where: {
                
    //             val : {
    //                 [Sequelize.Op.iLike]: `%${propValue}%`
    //             }
    //         }
    //     }, cb);
    //     return result;
    // }

    static async createUser(user) {
        try {
            user.password = User.hashPassword(user.password);
            console.log('User.createUser ...');
            console.log(user);
            // var user = await User.create(user, { transaction });
            // await transaction.commit();
            var user = await User.create(user);
            return { success: true, error: null, data: user };
        } catch (err) {
            // // nếu có lỗi xảy ra thì rollback transaction
            // if (transaction) {
            //     await transaction.rollback();
            // }
            return { success: false, error: err, data: null };
        }
    }

    static async updateUserState(id, state) {
        console.log('User.updateUserState: ' + id + ' ' + state);
        var user = await User.findByPk(id);
        var rowUpdate = 0;
        if (user != null) {
            user.state = state;
            await user.save();
            rowUpdate = 1;
        }
        return rowUpdate;
    }

    static async updateUser(u) {
        console.log(`User.updateUser: id=${u.id}, fullName=${u.fullName}, creType=${u.creType}, creID=${u.creID}, creGrantDate=${u.creGrantDate}, crePic=${u.crePic}, email=${u.email}, state=${u.state}`);
        var user = await User.findByPk(u.id);
        var rowUpdate = 0;
        try {
            if (user != null) {
                user.fullName = u.fullName;
                user.creType = u.creType;
                user.creID = u.creID;
                user.creGrantDate = u.creGrantDate;
                user.email = u.email;
                user.state = u.state;
                if (u.crePic != null)
                    user.crePic = u.crePic;
                await user.save();
                rowUpdate = 1;
            }
            return rowUpdate;
        } catch (error) {
            console.log(error);
            return rowUpdate;
        }
    }

    static hashPassword(password) {
        var saltRounds = 10;
        const salt = bcrypt.genSaltSync(saltRounds);
        const hash = bcrypt.hashSync(password, salt);
        return hash;
    }

    static verifyPassword(password, passwordHash) {
        return bcrypt.compareSync(password, passwordHash);
    }
}

// tạo bảng và các cột trong bảng
User.init({
    fullName: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    creID: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    creType: {                   // 1: CMND,  2: CCCD,  3: Hộ chiếu
        type: Sequelize.STRING,
        allowNull: false,
    },
    creGrantDate: {
        type: Sequelize.DATE,
        allowNull: false
    },
    crePic: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    role: {
        type: Sequelize.SMALLINT,
        defaultValue: 0     // khách hàng, 1: nhân viên
    },
    state: {
        type: Sequelize.SMALLINT,
        defaultValue: 0     // chưa xác thực, 1: đã xác thực, -1 khóa
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
