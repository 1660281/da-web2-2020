const bcrypt = require('bcrypt');
const Sequelize = require('sequelize');
const db = require('./db');
const Model = Sequelize.Model;
const asyncHandler = require('express-async-handler');

class Account extends Model {
    static async findAccountById(id) {
        return User.findByPk(id);
    }

    static async findAccountBySTK(stk) {
        var result = User.findOne({
            where: {
                stk: stk
            }
        });
        return result;
    }

    static async createAccount(account) {
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
}

// tạo bảng và các cột trong bảng
Account.init({
    uid:{
        type:Sequelize.INTEGER,
        unique:true
    },
    stk: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    money: {
        type: Sequelize.FLOAT,
        defaultValue: 0
    },
    moneyType: {
        type: Sequelize.STRING,
        defaultValue: "VNĐ"
    },
    status:{
        type: Sequelize.TINYINT,
        defaultValue: 0
    },
    openDate:{
        type: Sequelize.DATE,
    },
    closeDate:{     // ngày đóng tài khoản
        type: Sequelize.DATE,
    },
    expireDate:{    // ngày đáo hạn
        type: Sequelize.DATE,
    }
}, {
    sequelize: db,
    modelName: 'account'
})

module.exports = Account;