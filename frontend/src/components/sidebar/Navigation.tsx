import { List, ListItem } from "@chakra-ui/react";
import { useLocation } from "react-router-dom";
import { MdOutlinePeople, MdOutlineCategory, MdPalette } from "react-icons/md";

import { NavItem } from "./NavItem";
import { Path } from "../../lib/constants/path.constants";
import { useAuth } from "../../lib/contexts/AuthContext";

const items: NavbarItem[] = [
  {
    type: "link",
    label: "Users",
    icon: MdOutlinePeople,
    path: Path.USERS,
  },
  {
    type: "link",
    label: "Categories",
    icon: MdOutlineCategory,
    path: Path.CATEGORIES,
  },
  {
    type: "link",
    label: "Artworks",
    icon: MdPalette,
    path: Path.ARTWORKS,
  },
];

interface NavigationProps {
  collapse: boolean;
}

export const Navigation = ({ collapse }: NavigationProps) => {
  const location = useLocation();
  const { user } = useAuth();

  // Filter items based on user role
  const filteredItems = items.filter((item) => {
    if (!user) return false;
    if (user.role === undefined || user.role === null) return true;

    // Assuming role is a string ('artist' or 'admin'), adjust if numeric
    if (user.role === "artist") {
      return item.label !== "Users" && item.label !== "Categories";
    }

    return true; // admin sees everything
  });

  return (
    <List w="full" my={8}>
      {filteredItems.map((item, index) => (
        <ListItem key={index}>
          <NavItem
            item={item}
            isActive={location.pathname === item.path}
            collapse={collapse}
          />
        </ListItem>
      ))}
    </List>
  );
};
