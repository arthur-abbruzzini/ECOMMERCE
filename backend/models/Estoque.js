const { DataTypes } = require('sequelize')
const db = require('../db/conn')

const Estoque = db.define('estoque',{
    codEstoque: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    idUsuario: {
        type: DataTypes.INTEGER,
        allowNull: true, // Pode ser null para movimentações automáticas
        references: {
            key: 'codUsuario',
            model: 'usuarios'
        }
    },
    idProduto: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            key: 'codProduto',
            model: 'produtos'
        }
    },
    data: {
        type: DataTypes.DATEONLY,  // somente data
        allowNull: false,
    },
    tipo: {
        type: DataTypes.ENUM('ENTRADA','SAIDA'),
        allowNull: false
    },
    qtdeMovimento: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
},{
    timestamps: false,
    tableName: 'estoques'
})

module.exports = Estoque