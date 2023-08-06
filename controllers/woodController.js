const _1D_1 = require('../node_modules/stock-cutting/lib/1D.js');
// const { howToCutBoards1D } = require("../node_modules/stock-cutting/lib/1D.js")

class WoodController {
    async get(req, res, next) {
        const bladeSize = 0;
        const stockSizes = [
            { size: 3000, cost: 1 },
            { size: 12 * 2, cost: 1 / 4 },
        ];

        const input1 = [
            { size: 2000, count: 100 },
            { size: 800, count: 100 },
            { size: 1100, count: 200 },
            { size: 500, count: 200 },
        ];
        const output1 = (0, _1D_1.howToCutBoards1D)({
            stockSizes: stockSizes,
            bladeSize: bladeSize,
            requiredCuts: input1,
        });

        // const output2 = howToCutBoards1D({
        //     stockSizes: stockSizes,
        //     bladeSize: bladeSize,
        //     requiredCuts: input1,
        // })

        res.json(output1);
    }
}

module.exports = new WoodController();
