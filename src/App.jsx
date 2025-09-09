import React, { useState, useEffect } from "react";

function getOrCreateUserId() {
  let id = localStorage.getItem("user_id");
  if (!id) {
    id = "u_" + Math.random().toString(36).slice(2, 10);
    localStorage.setItem("user_id", id);
  }
  return id;
}

function chooseVariant() {
  return Math.random() < 0.5 ? "A" : "B";
}

export default function App() {
  const [variant, setVariant] = useState(null);
  const userId = getOrCreateUserId();

  useEffect(() => {
    let v = localStorage.getItem("variant");
    if (!v) {
      v = chooseVariant();
      localStorage.setItem("variant", v);
      console.log("Assigned variant:", v);
      window.posthog?.capture("assignment", { userId, variant: v });
    }
    setVariant(v);
  }, [userId]);

  if (!variant) return <div>Loading...</div>;

  const buttonText = variant === "A" ? "Buy Now" : "Invest Now";

  const handleClick = () => {
    console.log("CTA Clicked:", buttonText);
    window.posthog?.capture("cta_click", { userId, variant });
    alert(`You clicked: ${buttonText}`);
  };

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h1>A/B Test Demo</h1>
      <p>Variant: {variant}</p>
      <button
        onClick={handleClick}
        style={{ padding: "10px 20px", fontSize: "18px" }}
      >
        {buttonText}
      </button>
    </div>
  );
}