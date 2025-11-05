import fs from "fs";
import path from "path";

import { Request, Response } from "express";
import { Artwork, User } from "../models";
import { Op } from "sequelize";

interface AuthRequest extends Request {
  user?: any;
}

// @desc    Get all artworks
// @route   GET /api/artworks
// @access  Public
export const getArtworks = async (req: Request, res: Response) => {
  const all = req.query.all === "true";

  const page = parseInt(req.query.page as string, 10) || 1;
  const limit = parseInt(req.query.limit as string, 10) || 10;
  const offset = (page - 1) * limit;

  try {
    // Build filters
    let whereClause: any = {};

    if (req.query.search) {
      whereClause[Op.or] = [
        { title: { [Op.like]: `%${req.query.search}%` } },
        { description: { [Op.like]: `%${req.query.search}%` } },
      ];
    }

    if (req.query.category) {
      whereClause.category = req.query.category;
    }

    if (req.query.sold !== undefined) {
      whereClause.sold = req.query.sold === "true";
    }

    // If "all" is true, return all artworks without pagination
    if (all) {
      const artworks = await Artwork.findAll({
        where: whereClause,
        include: [
          {
            model: User,
            as: "artist",
          },
        ],
        order: [["createdAt", "DESC"]],
      });

      return res.status(200).json({
        artworks,
        pagination: null,
      });
    }

    // Paginated query
    const { count: totalCount, rows: artworks } = await Artwork.findAndCountAll(
      {
        where: whereClause,
        include: [
          {
            model: User,
            as: "artist",
          },
        ],
        order: [["createdAt", "DESC"]],
        limit,
        offset,
      }
    );

    // Return response in same structure as getAllCategories
    res.status(200).json({
      artworks,
      pagination: {
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: page,
      },
    });
  } catch (error: any) {
    console.error("Error fetching artworks:", error);
    res.status(500).json({
      message: "An error occurred while fetching artworks",
    });
  }
};

// @desc    Get single artwork
// @route   GET /api/artworks/:id
// @access  Public
export const getArtwork = async (req: Request, res: Response) => {
  try {
    const artwork = await Artwork.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: "artist",
        },
      ],
    });

    if (!artwork) {
      return res.status(404).json({
        success: false,
        message: "Artwork not found",
      });
    }

    res.json({
      success: true,
      data: artwork,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create new artwork
// @route   POST /api/artworks
// @access  Private (Artist)
export const createArtwork = async (req: Request, res: Response) => {
  try {
    const {
      title,
      categoryId,
      size,
      media,
      printNumber,
      inventoryNumber,
      status,
      price,
      location,
      notes,
    } = req.body;

    const thumbnail =
      req.files && (req.files as any).thumbnail
        ? (req.files as any).thumbnail[0]
        : null;
    const images =
      req.files && (req.files as any).images ? (req.files as any).images : [];

    const artwork = await Artwork.create({
      title,
      categoryId,
      size,
      media,
      printNumber,
      inventoryNumber,
      status,
      price,
      location,
      notes,
      artistId: (req as any).user.id,
      thumbnail: thumbnail ? thumbnail.filename : null,
      images: images.map((img: Express.Multer.File) => img.filename),
    });

    return res.status(201).json({
      success: true,
      data: artwork,
    });
  } catch (error: any) {
    console.error("Error creating artwork:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update artwork
// @route   PUT /api/artworks/:id
// @access  Private (Artist/Owner or Super Admin)
export const updateArtwork = async (req: AuthRequest, res: Response) => {
  try {
    const artwork = await Artwork.findByPk(req.params.id);

    if (!artwork) {
      return res.status(404).json({
        success: false,
        message: "Artwork not found",
      });
    }

    // Make sure user is artwork owner or super admin
    if (artwork.artistId !== req.user!.id && req.user!.role !== "super_admin") {
      return res.status(401).json({
        success: false,
        message: "Not authorized to update this artwork",
      });
    }

    const uploadDir = path.join(__dirname, "../public/artworks");
    const deleteFile = (filename: string | null | undefined) => {
      if (!filename) {
        return;
      }

      const filePath = path.join(uploadDir, filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    };

    const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
    const thumbnailFile = files?.thumbnail?.[0];
    let galleryFiles: Express.Multer.File[] = files?.images ?? [];

    const currentImages = Array.isArray(artwork.images) ? [...artwork.images] : [];

    let requestedExistingImages: string[] | undefined;
    if (typeof req.body.existingImages === "string") {
      try {
        const parsed = JSON.parse(req.body.existingImages);
        if (Array.isArray(parsed)) {
          requestedExistingImages = parsed
            .map((image) => (typeof image === "string" ? image : null))
            .filter((image): image is string => Boolean(image));
        }
      } catch (error) {
        requestedExistingImages = undefined;
      }
    }

    const imagesToKeepSource = requestedExistingImages ?? currentImages;
    const imagesToKeep = imagesToKeepSource.filter((filename) => currentImages.includes(filename));
    const uniqueImagesToKeep = Array.from(new Set(imagesToKeep));

    const imagesToDelete = currentImages.filter(
      (filename) => !uniqueImagesToKeep.includes(filename)
    );
    imagesToDelete.forEach((filename) => deleteFile(filename));

    const galleryMaxFiles = 4;
    if (uniqueImagesToKeep.length + galleryFiles.length > galleryMaxFiles) {
      const allowedNewFiles = Math.max(galleryMaxFiles - uniqueImagesToKeep.length, 0);
      const excessFiles = galleryFiles.slice(allowedNewFiles);
      excessFiles.forEach((file) => deleteFile(file.filename));
      galleryFiles = galleryFiles.slice(allowedNewFiles);
    }

    const newGalleryFilenames = galleryFiles.map((img) => img.filename);
    const finalImages = [...uniqueImagesToKeep, ...newGalleryFilenames];

    const removeExistingThumbnail = req.body.removeExistingThumbnail === "true";
    let thumbnailFilename = artwork.thumbnail as string | null;

    if (thumbnailFile) {
      deleteFile(thumbnailFilename);
      thumbnailFilename = thumbnailFile.filename;
    } else if (removeExistingThumbnail) {
      deleteFile(thumbnailFilename);
      thumbnailFilename = null;
    }

    const updatableFields = [
      "title",
      "categoryId",
      "size",
      "media",
      "printNumber",
      "inventoryNumber",
      "status",
      "price",
      "location",
      "notes",
    ] as const;

    const payload: any = {};
    updatableFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        payload[field] = req.body[field];
      }
    });

    payload.thumbnail = thumbnailFilename;
    payload.images = finalImages;

    await artwork.update(payload);

    const updatedArtwork = await Artwork.findByPk(req.params.id);

    res.json({
      success: true,
      data: updatedArtwork,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete artwork
// @route   DELETE /api/artworks/:id
// @access  Private (Artist/Owner or Super Admin)
export const deleteArtwork = async (req: AuthRequest, res: Response) => {
  try {
    const artwork = await Artwork.findByPk(req.params.id);

    if (!artwork) {
      return res.status(404).json({
        success: false,
        message: "Artwork not found",
      });
    }

    // Make sure user is artwork owner or super admin
    if (artwork.artistId !== req.user!.id && req.user!.role !== "super_admin") {
      return res.status(401).json({
        success: false,
        message: "Not authorized to delete this artwork",
      });
    }

    // Folder where artwork files are stored
    const uploadDir = path.join(__dirname, "../public/artworks");

    // Safely delete file function
    const deleteFile = (filename: string | null) => {
      if (!filename) return;
      const filePath = path.join(uploadDir, filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    };

    // Delete thumbnail
    deleteFile(artwork.thumbnail);

    // Delete images array
    if (Array.isArray(artwork.images)) {
      artwork.images.forEach((img) => deleteFile(img));
    }

    // Delete from DB
    await Artwork.destroy({
      where: { id: req.params.id },
    });

    return res.json({
      success: true,
      message: "Artwork deleted successfully",
    });
  } catch (error: any) {
    console.error("Delete artwork error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

// @desc    Get artworks by artist
// @route   GET /api/artworks/artist/:artistId
// @access  Public
export const getArtworksByArtist = async (req: Request, res: Response) => {
  try {
    const artworks = await Artwork.findAll({
      where: { artistId: req.params.artistId },
      include: [
        {
          model: User,
          as: "artist",
          attributes: ["id", "name", "email", "profileImage"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json({
      success: true,
      data: artworks,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
