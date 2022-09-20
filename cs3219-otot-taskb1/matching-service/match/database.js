import { Sequelize, Model, DataTypes} from "sequelize";
import { getTime } from './time.js'
import { config } from 'dotenv'

if (process.env.NODE_ENV !== 'production') { 
    config(); 
} 

// const user = process.env.AWS_DB_USER;
// const host = process.env.AWS_DB_ENDPOINT;
// const database = process.env.AWS_DB;
// const password = process.env.AWS_DB_PASSWORD;
// const port = process.env.AWS_DB_PORT;

const user = 'postgres';
const host = 'localhost';
const database = 'matchdb';
const password = 'postgres';
const port = '5432';

console.log(user);

export class Waiting extends Model {
}

function connectPostgres() {
    const sequelize = new Sequelize(database, user, password, {
        host,
        port,
        dialect:'postgres',
        logging: false
    })
    return sequelize;
}

function initWaitingModel(sequelize) {
    Waiting.init({
        uuid: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true
        },
        difficulty: {
            type: DataTypes.STRING,
            allowNull:false
        },
        time: {
            type: DataTypes.TIME,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'waiting',
        freezeTableName: true,
        timestamps: false
    })
}

export async function readWaitingQuery(difficultyField) {
    const sequelize = connectPostgres(); 
    initWaitingModel(sequelize);
    const waitingUsers = await Waiting.findAll({
        order: [['time', 'ASC']],
        where: {
            difficulty: difficultyField
        }
    });
    return waitingUsers;
}

export async function updateWaitingQuery(uuidField, difficultyField) {
    const sequelize = connectPostgres();
    initWaitingModel(sequelize);
    const timeField = getTime();
    const waitee = await Waiting.findByPk(uuidField);
    if (waitee != null) {
        const waitee = await Waiting.update({difficulty: difficultyField, time: timeField }, {
            where: {
                uuid: uuidField
            }
        })
        return waitee
    }
    return null;
}

export async function insertWaitingQuery(uuidField, difficultyField) {
    const sequelize = connectPostgres();
    initWaitingModel(sequelize);
    const timeField = getTime();
    const waitee = await Waiting.findByPk(uuidField);
    if (waitee == null) {
        const waitee = await Waiting.create({uuid: uuidField, difficulty: difficultyField, time: timeField});
        return waitee;
    }
    return null;
}

export async function deleteWaitingQuery(uuidField) {
    const sequelize = connectPostgres();
    initWaitingModel(sequelize);
    const waitee = await Waiting.findByPk(uuidField);
    if (waitee == null) {
        return null;
    } 
    await waitee.destroy({
        where: {
            uuid: uuidField
        }
    })
    return waitee;
}