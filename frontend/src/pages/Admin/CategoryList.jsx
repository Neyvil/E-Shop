import { useEffect, useState } from "react";
import {
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useUpdateCategoryMutation,
  useFetchCategoriesQuery,
} from "../../redux/api/categoryApisSlice";
import { useToast } from "../../components/Toast/ToastProvider";
import { Trash, FilePenLine, ChevronDown, ChevronUp } from "lucide-react";
import AdminMenu from "./AdminMenu";

const CategoryList = () => {
  const { data: categories } = useFetchCategoriesQuery();
  const [name, setName] = useState("");
  const [parentCategory, setParentCategory] = useState("");
  const [gender, setGender] = useState("");
  const [updatingCategory, setUpdatingCategory] = useState(null);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [flattenedCategories, setFlattenedCategories] = useState([]);
  const addToast = useToast();

  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  useEffect(() => {
    if (categories) {
      const flattened = flattenCategories(categories);
      setFlattenedCategories(flattened);
    }
  }, [categories]);

  // MOST NEW THING I EVER DO NESTING CATEGORY SERCHING
  const flattenCategories = (cats, level = 0, prefix = "") => {
    return cats?.reduce((acc, cat) => {
      const indentedName = prefix + "—".repeat(level) + cat.name;
      acc.push({ _id: cat._id, name: indentedName });
      if (cat.subcategories?.length) {
        acc = acc.concat(flattenCategories(cat.subcategories, level + 1, prefix + "—".repeat(level)));
      }
      return acc;
    }, []) || [];
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!name) {
      addToast("error", "Category Name is required");
      return;
    }

    try {
      const result = await createCategory({
        name,
        parentCategory: parentCategory || null,
        gender: gender || null,
      }).unwrap();

      if (result.error) {
        addToast("error", result.error);
      } else {
        setName("");
        setParentCategory("");
        setGender("");
        addToast("success", `${result.name} is created`);
      }
    } catch (error) {
      console.error(error);
      addToast("error", "Creating category failed");
    }
  };

  const deleteCategoryHandler = async (id) => {
    try {
      const result = await deleteCategory({ categoryId: id }).unwrap();
      if (result.error) {
        addToast("error", result.error);
      } else {
        addToast("success", `${result.category.name} is deleted.`);
      }
    } catch (error) {
      addToast("error", error.message);
    }
  };

  const updateCategoryHandler = async (e) => {
    e.preventDefault();
    if (!name || !updatingCategory) {
      addToast("error", "Category Name is required");
      return;
    }

    try {
      const result = await updateCategory({
        categoryId: updatingCategory._id,
        name,
        parentCategory: parentCategory || null,
        gender: gender || null,
      }).unwrap();

      if (result.error) {
        addToast("error", result.error);
      } else {
        setName("");
        setParentCategory("");
        setGender("");
        setUpdatingCategory(null);
        addToast("success", `${result.name} is updated`);
      }
    } catch (error) {
      console.error(error);
      addToast("error", "Updating category failed");
    }
  };

  const toggleExpandCategory = (categoryId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const renderCategories = (categoryList, level = 0) => {
    return categoryList?.map((category) => (
      <li
        key={category._id}
        className={`p-4 bg-[#24253C] rounded-lg text-white flex flex-col ${
          level > 0 ? `ml-2 sm:ml-4 md:ml-6 mt-2` : ""
        }`}
      >
        <div className="flex justify-between items-center">
          <span className="text-sm sm:text-base">{category.name}</span>
          <div className="flex space-x-2 sm:space-x-4">
            <button onClick={() => setUpdatingCategory(category)}>
              <FilePenLine color="#7303c0" size={16} />
            </button>
            <button onClick={() => deleteCategoryHandler(category._id)}>
              <Trash color="#ff0066" size={16} />
            </button>
            {category.subcategories?.length > 0 && (
              <button onClick={() => toggleExpandCategory(category._id)}>
                {expandedCategories[category._id] ? (
                  <ChevronUp color="#ff0066" size={16} />
                ) : (
                  <ChevronDown color="#ff0066" size={16} />
                )}
              </button>
            )}
          </div>
        </div>
        {expandedCategories[category._id] && category.subcategories?.length > 0 && (
          <ul className="mt-2">
            {renderCategories(category.subcategories, level + 1)}
          </ul>
        )}
      </li>
    ));
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-[#292B4B]">
      <AdminMenu />
      <div className="w-full max-w-4xl mx-auto mt-8 sm:mt-16 bg-[#1B1C30] p-4 sm:p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl sm:text-4xl font-bold text-white text-center mb-4 sm:mb-8">
          Manage Categories
        </h1>
        <form
          onSubmit={updatingCategory ? updateCategoryHandler : handleCreateCategory}
          className="flex flex-col space-y-4"
        >
          <input
            type="text"
            placeholder="Category Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-[#2C2F48] text-white placeholder-gray-400 text-sm sm:text-base"
          />
          <select
            value={parentCategory}
            onChange={(e) => setParentCategory(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-[#2C2F48] text-white text-sm sm:text-base"
          >
            <option value="">Select Parent Category (optional)</option>
            {flattenedCategories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-[#2C2F48] text-white text-sm sm:text-base"
          >
            <option value="">Select Gender (optional)</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="unisex">Unisex</option>
          </select>
          <button
            type="submit"
            className="self-start px-4 sm:px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:bg-gradient-to-l transition-all text-sm sm:text-base"
          >
            {updatingCategory ? "Update Category" : "Create Category"}
          </button>
        </form>

        <div className="mt-6 sm:mt-8">
          <h2 className="text-xl sm:text-3xl font-semibold text-white mb-4">Categories List</h2>
          <ul className="space-y-4">{renderCategories(categories)}</ul>
        </div>
      </div>
    </div>
  );
};

export default CategoryList;