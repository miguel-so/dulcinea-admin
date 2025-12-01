import { Request, Response } from "express";
import SiteContent from "../models/SiteContent";

export const getAllSiteContents = async (req: Request, res: Response) => {
  const all = req.query.all === "true";

  const page = parseInt(req.query.page as string, 10) || 1;
  const limit = parseInt(req.query.limit as string, 10) || 10;
  const offset = (page - 1) * limit;

  try {
    let siteContents = await SiteContent.findAll({
      offset: all ? undefined : offset,
      limit: all ? undefined : limit,
      order: [["item", "ASC"]],
    });

    if (all) {
      return res.status(200).json({
        siteContents: siteContents,
        pagination: null,
      });
    }

    // Count total records
    const totalCount = await SiteContent.count();

    res.status(200).json({
      siteContents: siteContents,
      pagination: {
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: page,
      },
    });
  } catch (error: any) {
    console.error("Error fetching site contents:", error);
    res.status(500).json({
      message: "An error occurred while fetching site contents",
    });
  }
};

export const getSiteContentById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const siteContent = await SiteContent.findByPk(id);
    if (!siteContent) {
      return res.status(404).json({
        success: false,
        message: "Site Content not found",
      });
    }

    res.status(200).json({
      success: true,
      data: siteContent,
    });
  } catch (error: any) {
    console.error("Get site content error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch site content",
    });
  }
};

export const createSiteContent = async (req: Request, res: Response) => {
  try {
    const { item, value } = req.body;

    const existingSiteContent = await SiteContent.findOne({ where: { item } });
    if (existingSiteContent) {
      return res.status(400).json({
        success: false,
        message: "Site content with this item already exists",
      });
    }

    const siteContent = await SiteContent.create({
      item,
      value,
    });

    res.status(201).json({
      success: true,
      data: siteContent,
      message: "Site Content created successfully",
    });
  } catch (error: any) {
    console.error("Create Site Content error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create Site Content",
    });
  }
};

export const updateSiteContent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { item, value } = req.body;

    const siteContent = await SiteContent.findByPk(id);
    if (!siteContent) {
      return res.status(404).json({
        success: false,
        message: "Site content not found",
      });
    }

    // Check if name is being changed and if it already exists
    if (item && item !== siteContent.item) {
      const existingSiteContent = await SiteContent.findOne({
        where: { item },
      });
      if (existingSiteContent) {
        return res.status(400).json({
          success: false,
          message: "Site content with this item already exists",
        });
      }
    }

    await siteContent.update({
      item: item || siteContent.item,
      value: value !== undefined ? value : siteContent.value,
    });

    res.json({
      success: true,
      data: siteContent,
      message: "Site content updated successfully",
    });
  } catch (error: any) {
    console.error("Update site content error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update site content",
    });
  }
};

export const deleteSiteContent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const siteContent = await SiteContent.findByPk(id);
    if (!siteContent) {
      return res.status(404).json({
        success: false,
        message: "Site Content not found",
      });
    }

    await siteContent.destroy();

    res.json({
      success: true,
      message: "Site Content deleted successfully",
    });
  } catch (error: any) {
    console.error("Delete site content error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete site content",
    });
  }
};
