/** Shared cache so request handlers stay synchronous after startup. */
export const memory = {
  enabled: false,
  content: null,
  enquiries: null,
  adminHash: "",
};
