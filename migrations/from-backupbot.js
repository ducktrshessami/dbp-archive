"use strict";
/** @type {import("sequelize-cli").Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn("Channels", "hidden", {
            type: Sequelize.DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false
        });
        await queryInterface.addColumn("Messages", "break", {
            type: Sequelize.DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn("Channels", "hidden");
        await queryInterface.removeColumn("Messages", "break");
    }
};
