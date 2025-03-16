export const connectRustFun = async (username, password, operation) => {
  try {
    const response = await fetch(
      "https://licicophotosbackend-production.up.railway.app/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "auth",
          username: username,
          password: password,
          operation: operation,
        }),
      }
    );
    const data = await response.json();
    return { success: true, Result: data };
  } catch (err) {
    console.error("Error:", err.message);
    return { success: false, error: err.message };
  }
};
