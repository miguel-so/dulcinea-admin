import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";
import User from "./User";
import { ArtworkStatus } from "../utils/types";

interface ArtworkAttributes {
  id: number;
  title: string;
  thumbnail?: string; // single main image
  images?: string[]; // multiple image filenames
  size: string;
  media?: string;
  printNumber?: string;
  inventoryNumber?: string;
  status: ArtworkStatus;
  price?: number | null;
  location?: string;
  notes?: string;
  artistId: number;
  categoryId?: string;
  createdAt: Date;
  updatedAt: Date;
  isSpotlight: boolean;
}

interface ArtworkCreationAttributes
  extends Optional<
    ArtworkAttributes,
    | "id"
    | "thumbnail"
    | "images"
    | "media"
    | "printNumber"
    | "inventoryNumber"
    | "price"
    | "location"
    | "notes"
    | "categoryId"
    | "createdAt"
    | "updatedAt"
    | "isSpotlight"
  > {}

class Artwork
  extends Model<ArtworkAttributes, ArtworkCreationAttributes>
  implements ArtworkAttributes
{
  public id!: number;
  public title!: string;
  public thumbnail!: string;
  public images?: string[];
  public size!: string;
  public media?: string;
  public printNumber?: string;
  public inventoryNumber?: string;
  public status!: ArtworkStatus;
  public price?: number | null;
  public location?: string;
  public notes?: string;
  public artistId!: number;
  public categoryId?: string;
  public isSpotlight!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Artwork.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    title: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Title is required",
        },
        len: {
          args: [1, 100],
          msg: "Title must be between 1 and 100 characters",
        },
      },
    },

    thumbnail: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },

    images: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },

    size: {
      type: DataTypes.STRING(50),
      allowNull: true, // ✅ made optional
      defaultValue: "",
      validate: {
        len: {
          args: [0, 50],
          msg: "Size must not exceed 50 characters",
        },
      },
    },

    media: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: "",
      validate: {
        len: {
          args: [0, 100],
          msg: "Media must not exceed 100 characters",
        },
      },
    },

    printNumber: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "",
      validate: {
        len: {
          args: [0, 50],
          msg: "Print number must not exceed 50 characters",
        },
      },
    },

    inventoryNumber: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "",
      validate: {
        len: {
          args: [0, 50],
          msg: "Inventory number must not exceed 50 characters",
        },
      },
    },

    status: {
      type: DataTypes.ENUM(
        ArtworkStatus.AVAILABLE,
        ArtworkStatus.ON_HOLD,
        ArtworkStatus.ON_EXHIBIT,
        ArtworkStatus.SOLD
      ),
      allowNull: false,
      defaultValue: ArtworkStatus.AVAILABLE,
    },

    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },

    location: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: "",
      validate: {
        len: {
          args: [0, 255],
          msg: "Location must not exceed 255 characters",
        },
      },
    },

    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: "",
    },

    artistId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },

    categoryId: {
      type: DataTypes.STRING(50),
      allowNull: true, // DB level can be null
      defaultValue: "",
    },

    isSpotlight: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },

    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },

    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "Artwork",
    tableName: "artworks",
    timestamps: true,
    indexes: [
      { fields: ["artistId"] },
      { fields: ["categoryId"] },
      { type: "FULLTEXT", fields: ["title", "description"] },
    ],
  }
);

// Define associations
User.hasMany(Artwork, { foreignKey: "artistId", as: "artworks" });
Artwork.belongsTo(User, { foreignKey: "artistId", as: "artist" });

export default Artwork;
