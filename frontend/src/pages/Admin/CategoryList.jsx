import { useEffect, useState } from "react";
import {
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useUpdateCategoryMutation,
  useFetchCategoriesQuery,
} from "../../redux/api/categoryApisSlice";
import { useToast } from "../../components/Toast/ToastProvider";
import { Trash, FilePenLine } from "lucide-react";
import AdminMenu from "./AdminMenu";

const CategoryList = () => {
  const { data: categories } = useFetchCategoriesQuery();
  const [name, setName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [updatingName, setUpdatingName] = useState("");
  const addToast = useToast();

  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  const deleteCategoryHandler = async (id) => {
    try {
      const result = await deleteCategory({ categoryId: id }).unwrap();
      if (result.error) {
        addToast("error", result.error);
      } else {
        addToast("success", `${result.categoryDeleted.name} is deleted.`);
      }
    } catch (error) {
      addToast("error", error.message);
    }
  };

  const userClickHandler = async (category) => {
    setSelectedCategory(category);
    setUpdatingName(category.name);
  };

  const updateHandler = async (e) => {
    e.preventDefault();

    if (!updatingName) {
      addToast("error", "Category name required");
      return;
    }

    try {
      const result = await updateCategory({
        categoryId: selectedCategory._id,
        updateCategory: {
          name: updatingName,
        },
      }).unwrap();

      if (result.error) {
        addToast("error", result.error);
      } else {
        setSelectedCategory(null);
        setName("");
        addToast("success", `${result.name} is updated`);
      }
    } catch (error) {
      console.error(error);
      addToast("error", "Updating Category failed");
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();

    if (!name) {
      addToast("error", "Category Name is required ");
      return;
    }
    try {
      const result = await createCategory({ name }).unwrap();
      if (result.error) {
        addToast("error", result.error);
      } else {
        setName("");
        addToast("success", `${result.name} is created`);
      }
    } catch (error) {
      console.error(error);
      addToast("error", "Creating category failed, try again");
    }
  };

  return (
    <div className="h-screen flex justify-center items-center bg-[#292B4B] overflow-y-auto">
      <div className="relative m-16 ">
       <AdminMenu/> 
      </div>
      <section className="w-[85%] bg-[#1B1C30] shadow-xl p-[2rem] flex flex-col items-center text-center rounded-xl">
        <h1 className="text-4xl font-serif font-bold text-white lg:mt-0 mb-8">
          Manage <span className="text-[#7303c0]">Categories</span>
        </h1>
        <form className="w-full lg:w-[60%] flex flex-col md:flex-row text-xl font-serif justify-around items-center space-y-4 md:space-y-0">
          <input
            type="text"
            placeholder="Write Category Name"
            className="pl-8 border border-[#292B4B] rounded-full text-slate-300 w-full md:w-[78%] h-14 bg-[#1B1C30] focus:bg-white focus:outline-none focus:text-black focus:border-[#fff] transition-all duration-300 ease-in-out"
            value={selectedCategory ? updatingName : name}
            onChange={(e) => {
              selectedCategory
                ? setUpdatingName(e.target.value)
                : setName(e.target.value);
            }}
          />
          <button
            onClick={selectedCategory ? updateHandler : handleCreateCategory}
            className="w-full md:w-[10rem] h-[3rem] rounded-full font-bold text-white text-xl bg-purple-700 hover:bg-purple-800 transition-all duration-300 ease-in-out"
          >
            {selectedCategory ? "Update" : "Submit"}
          </button>
        </form>
        <hr className="w-full m-5 border rounded-full border-[#292B4B]" />

        <div className="w-full flex justify-center mt-4 max-h-[40vh] lg:max-h-[60vh] overflow-auto">
          <table className="w-[90%] border-collapse">
            <thead className="sticky top-0 bg-[#2A2C4A] z-10">
              <tr>
                <th className="text-white font-bold p-4 font-serif text-xl">ID</th>
                <th className="text-white font-bold p-4 font-serif text-xl">Categories</th>
                <th className="text-white font-bold p-4 font-serif text-xl">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories &&
                categories.map((category, index) => (
                  <tr key={category._id} className={`bg-[#24253C] ${index % 2 === 0 ? 'bg-opacity-75' : 'bg-opacity-50'} hover:bg-opacity-90 transition-all duration-200 ease-in-out`}>
                    <td className="border-b-2 border-solid border-[#7303c0] text-white font-sans p-4 text-center align-middle">
                      {category._id ? category._id.slice(-8) : category._id}
                    </td>
                    <td className="border-b-2 border-solid border-[#7303c0] text-white font-sans p-4 text-center align-middle">
                      {category.name}
                    </td>
                    <td className="border-b-2 border-solid border-[#7303c0] text-white font-sans p-4 text-center align-middle">
                      <div className="w-full flex justify-center space-x-4">
                        <button
                          onClick={() => deleteCategoryHandler(category._id)}
                          className="hover:scale-110 transition-transform duration-200"
                        >
                          <Trash color="#7303c0" size={30} />
                        </button>
                        <button
                          onClick={() => {
                            userClickHandler(category);
                          }}
                          className="hover:scale-110 transition-transform duration-200"
                        >
                          <FilePenLine color="#7303c0" size={30} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default CategoryList;
