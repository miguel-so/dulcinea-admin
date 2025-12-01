import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

interface SiteContentAttributes {
  id: number;
  item: string;
  value?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface SiteContentCreationAttributes
  extends Optional<SiteContentAttributes, "id" | "createdAt" | "updatedAt"> {}

class SiteContent
  extends Model<SiteContentAttributes, SiteContentCreationAttributes>
  implements SiteContentAttributes
{
  public id!: number;
  public item!: string;
  public value?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

SiteContent.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    item: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    value: {
      type: DataTypes.TEXT,
      allowNull: true,
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
    modelName: "SiteContent",
    tableName: "site_content",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["item"],
      },
    ],
  }
);

export default SiteContent;
