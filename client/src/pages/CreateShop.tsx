import React from "react";
import { useNavigate } from "react-router";
import { useShopStore } from "../store/useShopStore";

function CreateShop() {
  const { createShop, isCreatingShop } = useShopStore();

  const navigate = useNavigate();

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries()) as unknown;

    await createShop(data);
    navigate("/");
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" required placeholder="Name" />
        <button type="submit" disabled={isCreatingShop}>
          {isCreatingShop ? "Creating Shop" : "Create"}
        </button>
      </form>
    </div>
  );
}

export default CreateShop;
