export const documentPreviewModalStyles = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999,
  },

  modal: {
    background: "#020617",
    borderRadius: "16px",
    padding: "20px",
    width: "90%",
    maxWidth: "720px",
    boxShadow: "0 30px 80px rgba(0,0,0,0.6)",
  },

  title: {
    marginBottom: "12px",
    color: "#e5e7eb",
    fontSize: "18px",
    fontWeight: "600",
  },

  previewBox: {
    maxHeight: "420px",
    overflow: "auto",
    borderRadius: "10px",
    border: "1px solid #334155",
  },

  iframe: {
    width: "100%",
    height: "420px",
    border: "none",
  },

  image: {
    width: "100%",
    borderRadius: "10px",
  },

  actions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "12px",
    marginTop: "16px",
  },

  cancelBtn: {
    background: "transparent",
    border: "1px solid #475569",
    color: "#cbd5f5",
    padding: "8px 14px",
    borderRadius: "8px",
    cursor: "pointer",
  },

  confirmBtn: {
    background: "#0f766e",
    border: "none",
    color: "white",
    padding: "8px 18px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "500",
  },
};
