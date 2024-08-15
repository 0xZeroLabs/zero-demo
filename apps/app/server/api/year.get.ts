export default defineEventHandler(async (event) => {
  const response = new Date().getFullYear();
  return {
    response: response,
  };
});
