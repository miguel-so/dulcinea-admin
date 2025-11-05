// components/Categories.tsx
import { Box, Container, Heading, SimpleGrid } from "@chakra-ui/react";
import { CategoryCard } from "./CategoryCard";

interface Category {
  image: string;
  title: string;
  description: string;
}

const categories: Category[] = [
  {
    image: "/art1.png",
    title: "Category Name",
    description: "Lorem ipsum",
  },
  {
    image: "/art2.png",
    title: "Category Name",
    description: "Lorem ipsum",
  },
  {
    image: "/art3.png",
    title: "Category Name",
    description: "Lorem ipsum",
  },
  {
    image: "/art4.png",
    title: "Category Name",
    description: "Lorem ipsum",
  },
];

export const Categories = () => {
  return (
    <Box py={20} bg="gray.50">
      <Container maxW="container">
        <Box textAlign="center" mb={10}>
          <Heading
            as="h2"
            fontSize={{ base: "3xl", md: "4xl" }}
            fontWeight="bold"
            color="gray.800"
          >
            Categories
          </Heading>
        </Box>

        <SimpleGrid
          columns={{ base: 1, md: 2, lg: 4 }}
          spacing={{ base: 6, lg: 8 }}
          mt={8}
        >
          {categories.map((category, index) => (
            <CategoryCard
              key={index}
              image={category.image}
              title={category.title}
              description={category.description}
            />
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
};
