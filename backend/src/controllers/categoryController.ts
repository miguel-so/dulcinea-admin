import { Request, Response } from "express";
import Category from "../models/Category";
import Artwork from "../models/Artwork";
import { Op, Sequelize } from "sequelize";

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
export const getAllCategories = async (req: Request, res: Response) => {
  const all = req.query.all === "true";

  const page = parseInt(req.query.page as string, 10) || 1;
  const limit = parseInt(req.query.limit as string, 10) || 10;
  const offset = (page - 1) * limit;

  try {
    let whereClause: any = {};

    if (req.query.searchKeyword) {
      const keyword = req.query.searchKeyword as string;

      whereClause = {
        [Op.or]: [
          { name: { [Op.like]: `%${keyword}%` } },
          { description: { [Op.like]: `%${keyword}%` } },
        ],
      };
    }

    const categories = await Category.findAll({
      where: whereClause,
      offset: all ? undefined : offset,
      limit: all ? undefined : limit,
      order: [["name", "ASC"]],
    });

    // Attach random artwork thumbnail for each category
    const categoriesWithThumbs = await Promise.all(
      categories.map(async (cat) => {
        const art = await Artwork.findOne({
          where: { categoryId: cat.id },
          order: [Sequelize.literal("RAND()")], // random artwork
        });

        return {
          ...cat.toJSON(),
          thumbnail: art ? art.thumbnail : null, // attach thumbnail
        };
      })
    );

    if (all) {
      return res.status(200).json({
        categories: categoriesWithThumbs,
        pagination: null,
      });
    }

    // Count total records
    const totalCount = await Category.count();

    res.status(200).json({
      categories: categoriesWithThumbs,
      pagination: {
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: page,
      },
    });
  } catch (error: any) {
    console.error("Error fetching categories:", error);
    res.status(500).json({
      message: "An error occurred while fetching categories",
    });
  }
};

// @desc    Get single category by ID
// @route   GET /api/categories/:id
// @access  Public
export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error: any) {
    console.error("Get category error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch category",
    });
  }
};

// @desc    Create new category
// @route   POST /api/categories
// @access  Private (Admin only)
export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;

    // Validate name length
    if (!name || name.length > 50) {
      return res.status(400).json({
        success: false,
        message: "Category name cannot exceed 50 characters",
      });
    }

    // Check if category already exists
    const existingCategory = await Category.findOne({ where: { name } });
    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: "Category with this name already exists",
      });
    }

    const category = await Category.create({
      name,
      description,
    });

    res.status(201).json({
      success: true,
      data: category,
      message: "Category created successfully",
    });
  } catch (error: any) {
    console.error("Create category error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create category",
    });
  }
};

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private (Admin only)
export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    if (!name || name.length > 50) {
      return res.status(400).json({
        success: false,
        message: "Category name cannot exceed 50 characters",
      });
    }

    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Check if name is being changed and if it already exists
    if (name && name !== category.name) {
      const existingCategory = await Category.findOne({ where: { name } });
      if (existingCategory) {
        return res.status(400).json({
          success: false,
          message: "Category with this name already exists",
        });
      }
    }

    await category.update({
      name: name || category.name,
      description:
        description !== undefined ? description : category.description,
    });

    res.json({
      success: true,
      data: category,
      message: "Category updated successfully",
    });
  } catch (error: any) {
    console.error("Update category error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update category",
    });
  }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private (Admin only)
export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Check if any artwork is using this category
    const artworkCount = await Artwork.count({ where: { categoryId: id } });

    if (artworkCount > 0) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete category. Artwork exists using this category.",
        artworkCount,
      });
    }

    await category.destroy();

    res.json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error: any) {
    console.error("Delete category error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete category",
    });
  }
};
