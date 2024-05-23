import categoryModel from "../models/categoryModel.js"
import slugify from "slugify";

// create category controller
export const createCategoryController = async (req, res) => {
    try {
        const { name } = req.body;
        // validation
        if (!name) {
            return res.status(401).send({ message: "Name is required" })
        }

        const existingCategory = await categoryModel.findOne({ name });
        if (existingCategory) {
            return res.status(200).send({
                success: false,
                message: "Category Already Exists"
            })
        }

        const category = await new categoryModel({ name, slug: slugify(name) }).save()
        res.status(201).send({
            success: true,
            message: "New Category Created",
            category
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error while creating catagory"
        })
    }
}


// update category controller
export const updateCategoryController = async (req, res) => {
    try {
        const { name } = req.body;
        const { id } = req.params;

        if (!name) {
            return res.status(401).send({ message: "Name is required" })
        }

        const updatedCategory = await categoryModel.findByIdAndUpdate(id, { name, slug: slugify(name) })
        res.status(200).send({
            success: true,
            message: "Category updated successfully",
            updatedCategory
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error while updating catagory"
        })
    }
}

// Get all categories controller
export const allCategoriesController = async (req, res) => {
    try {
        const categories = await categoryModel.find({});
        res.status(200).send({
            success: true,
            message: "Categories fetch successfully!",
            categories
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error while fatchig categories"
        })
    }
}

// Get single category controller
export const singleCategoryController = async (req, res) => {
    try {
        const { slug } = req.params;
        const category = await categoryModel.findOne({ slug })
        res.status(200).send({
            success: true,
            message: "Single Category get successfully",
            category
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error while fatchig category"
        })
    }
}

// delete category controller
export const deleteCategoryController = async (req, res) => {
    try {
        const { id } = req.params;
        await categoryModel.findByIdAndDelete(id);
        res.status(200).send({
            success: true,
            message: "Category deleted successfully"
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error while deleting category"
        })
    }
}