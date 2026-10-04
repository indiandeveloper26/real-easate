"use client";

import toast from "react-hot-toast";

export default function page() {
  return (
    <button
      onClick={() => toast.success("Property added successfully!")}
    >
      Add Property
    </button>
  );
}