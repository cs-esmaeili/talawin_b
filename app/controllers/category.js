const Category = require('../database/models/Category');
const Post = require('../database/models/Post');
const FirtPage = require('../database/models/FirtPage');
const { mCreateCategory, mDeleteCategory, mUpdateCategory } = require('../messages/response.json');
const { mData } = require('../messages/response.json');

exports.createCategory = async (req, res, next) => {
    try {
        const { name, image } = req.body;
        const result = await Category.create({ name, image });
        if (result) {
            res.send({ message: mCreateCategory.ok });
            return;
        }
        throw { message: mCreateCategory.fail, statusCode: 401 };
    } catch (err) {
        res.status(err.statusCode || 422).json(err);
    }
}

exports.categoryList = async (req, res, next) => {
    try {
        const { page, perPage } = req.body;
        let categorys = await Category.find({}).select('_id name image updatedAt').skip((page - 1) * perPage).limit(perPage).lean();
        const categorysCount = await Category.countDocuments({});
        res.send({ categorysCount, categorys });
    } catch (err) {
        res.status(err.statusCode || 500).json(err);
    }
}

exports.deleteCategory = async (req, res, next) => {
    const { category_id, newCategory_id } = req.body;
    try {
        const deletedResult = await Category.deleteOne({ _id: category_id });
        if (deletedResult.deletedCount == 0) {
            throw { message: mDeleteCategory.fail, statusCode: 500 };
        }
        if (newCategory_id != null && newCategory_id != "") {
            await Post.updateMany({ category_id }, { category_id: newCategory_id });
        }
        res.send({ message: mDeleteCategory.ok });
    } catch (err) {
        res.status(err.statusCode || 422).json(err);
    }
}

exports.updateCategory = async (req, res, next) => {
    try {
        const { category_id, name, image } = req.body;
        const updateResult = await Category.updateOne({ _id: category_id }, { name, image });
        if (updateResult.modifiedCount == 1) {
            res.send({ message: mUpdateCategory.ok });
            return;
        }
        throw { message: mUpdateCategory.fail, statusCode: 500 };
    } catch (err) {
        res.status(err.statusCode || 422).json(err);
    }
}

exports.getCategoryData = async (req, res, next) => {
    try {
        const { name, page, perPage } = req.body;
        const category = await Category.findOne({ name });
        const posts = await Post.find({ category_id: category._id }).populate('category_id').skip((page - 1) * perPage).limit(perPage).lean();
        const postsCount = await Post.countDocuments({ category_id: category._id }).lean();
        res.send({ category, postsCount, posts });
    } catch (err) {
        res.status(err.statusCode || 422).json(err.errors || err.message);
    }
}


exports.categorys = async (req, res, next) => {
    const chosenCategorys = await FirtPage.findOne({ location: 0 }).populate({
        path: 'data',
        model: 'Category',
    });;

    if (chosenCategorys) {
        res.send(chosenCategorys.data);
    } else {
        res.status(422).json({ message: mData.fail });
    }
}