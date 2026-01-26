import { useEffect } from "react";

function DocumentPreviewModal({ file, onClose }) {
  if (!file) return null;

  const fileURL = URL.createObjectURL(file);
  const isPDF = file.type.includes("pdf");

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <span>Document Preview</span>
          <button onClick={onClose} style={styles.closeBtn}>✕</button>
        </div>

        <div style={styles.content}>
          {isPDF ? (
            <iframe
              src={fileURL}
              title="PDF Preview"
              style={styles.iframe}
            />
          ) : (
            <img
              src={fileURL}
              alt="Document Preview"
              style={styles.image}
            />
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.65)",
    backdropFilter: "blur(6px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999,
  },

  modal: {
    width: "90%",
    maxWidth: "900px",
    height: "80vh",
    background: "#020617",
    borderRadius: "14px",
    overflow: "hidden",
    boxShadow: "0 30px 80px rgba(0,0,0,0.6)",
    display: "flex",
    flexDirection: "column",
  },

  header: {
    padding: "14px 18px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    color: "#e5e7eb",
    fontWeight: "500",
    borderBottom: "1px solid #1f2937",
  },

  closeBtn: {
    background: "transparent",
    border: "none",
    color: "#9ca3af",
    fontSize: "18px",
    cursor: "pointer",
  },

  content: {
    flex: 1,
    background: "#000",
  },

  iframe: {
    width: "100%",
    height: "100%",
    border: "none",
  },

  image: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },
};

export default DocumentPreviewModal;
