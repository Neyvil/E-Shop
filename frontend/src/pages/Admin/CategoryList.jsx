import { useEffect, useState } from "react";
import {
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useUpdateCategoryMutation,
  useFetchCategoriesQuery,
} from "../../redux/api/categoryApisSlice";
import { useToast } from "../../components/Toast/ToastProvider";
import { Trash, FilePenLine } from "lucide-react";

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
      console.log(result)
      if (result.error) {
        addToast("error", result.error);
      } else {
        addToast("success", `${result. categoryDeleted.name} is deleted.`);
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
        categoryId: selectedCategory._id, //** here the arguments are used */
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
      addToast("error", "updating Category failed");
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
      <section className="w-[85%] bg-[#1B1C30] shadow-xl p-[2rem] flex flex-col items-center text-center rounded-xl">
        <h1 className="text-4xl font-serif font-bold text-white lg:mt-0 mb-8">
          Manage <span className="text-[#7303c0]">Categories</span>
        </h1>
        <form className="w-[60%] flex text-xl font-serif justify-around items-center">
          <input
            type="text"
            placeholder="Write Categories Name"
            className=" pl-8 border border-[#292B4B] rounded-full text-slate-300 w-[78%] h-14 bg-[#1B1C30] focus:bg-white focus:outline-none focus:text-black focus:border-[#fff]"
            value={selectedCategory ? updatingName : name}
            onChange={(e) => {
              selectedCategory
                ? setUpdatingName(e.target.value)
                : setName(e.target.value);
            }}
          />
          {selectedCategory ? (
            <button
              onClick={updateHandler}
              className="w-[10rem]  h-[3rem] rounded-full text-bold text-white text-xl bg-purple-700 hover:bg-purple-800 cursor-pointer"
            >
              Update
            </button>
          ) : (
            <button
              onClick={handleCreateCategory}
              className="w-[10rem]  h-[3rem] rounded-full text-bold text-white text-xl bg-purple-700 hover:bg-purple-800 cursor-pointer"
            >
              Submit
            </button>
          )}
        </form>
        <hr className=" w-full m-5 border rounded-full border-[#292B4B]" />

        <div className="w-full flex justify-center mt-4 max-h-[40vh] lg:max-h-[60vh] overflow-auto border-collapse">
          <table className="w-[80%]">
            <thead className="sticky top-0 bg-[#2A2C4A] z-10">
              <tr>
                <th className="text-white font-bold m-4 font-serif text-xl">
                  id
                </th>
                <th className="text-white font-bold m-4 font-serif text-xl">
                  Categories
                </th>
                <th className="text-white font-bold m-4 font-serif text-xl">
                  Operation
                </th>
              </tr>
            </thead>
            <tbody>
              {categories &&
                categories.map((category) => (
                  <tr key={category._id} className="bg-[#24253C]">
                    <td className="border-b-2 border-solid border-[#7303c0] text-white font-sans p-4 text-center align-middle">
                      {category._id ? category._id.slice(-8) : category._id}
                    </td>
                    <td className="border-b-2 border-solid border-[#7303c0] text-white font-sans p-4 text-center align-middle">
                      {category.name}
                    </td>
                    <td className="border-b-2 border-solid border-[#7303c0] text-white font-sans p-4 text-center align-middle">
                      <div className="w-full flex items-center  lg:justify-center lg:flex-row flex-col space-x-5">
                        <button
                          onClick={() => deleteCategoryHandler(category._id)}
                        >
                          <Trash color="#7303c0" size={30} />
                        </button>
                        <button
                          onClick={() => {
                            userClickHandler(category);
                          }}
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
