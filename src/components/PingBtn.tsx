"use client";

import React from "react";

const PingBtn: React.FC<{ endpoint: string; title: string }> = ({
  endpoint,
  title,
}) => {
  async function pingBackendAPI() {
    try {
      const data = await fetch(endpoint);
      const response = await data.json();
      const { message } = response;
      alert(message);
    } catch (err: unknown) {
      alert("Requested failed, check the console.");
      console.error(err);
    }
  }

  return (
    <button type="button" onClick={pingBackendAPI}>
      {title}
    </button>
  );
};
export default PingBtn;
