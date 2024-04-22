const FirtPage = require('../database/models/FirtPage');
const { mData } = require('../messages/response.json');


exports.firstPage = async (req, res, next) => {
    const firstPageData = await FirtPage.find({ location: { $ne: 0 } }).populate({
        path: 'data',
        model: 'Post',
        populate: {
            path: 'category_id',
            model: 'Category',
            select: 'name'
        }
    });

    if (firstPageData) {
        res.send(firstPageData);
    } else {
        res.status(422).json({ message: mData.fail });
    }
}

exports.updateFirstPage = async (req, res, next) => {
    const { location, data, customData } = req.body;

    const updateResult = await FirtPage.updateOne({ location }, { data, customData });

    if (updateResult.modifiedCount == 1) {
        res.send({ message: mData.ok });
    } else {
        res.status(422).json({ message: mData.update_fail });
    }
}