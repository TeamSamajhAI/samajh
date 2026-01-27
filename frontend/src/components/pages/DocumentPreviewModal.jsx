import { useEffect, useMemo } from "react";
import { documentPreviewModalStyles as styles } from "./DocumentPreviewModal.style";

function DocumentPreviewModal({ file, onConfirm, onCancel }) {
  if (!file) return null;

  const isPDF = file.type.includes("pdf");

  // ✅ useMemo prevents unnecessary re-creation
  const fileURL = useMemo(() => URL.createObjectURL(file), [file]);

  // ✅ IMPORTANT: cleanup to prevent memory leaks
  useEffect(() => {
    return () => URL.revokeObjectURL(fileURL);
  }, [fileURL]);

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h3 style={styles.title}>Document Preview</h3>

        <div style={styles.previewBox}>
          {isPDF ? (
            <iframe
              src={fileURL}
              title="PDF Preview"
              style={styles.iframe}
            />
          ) : (
            <img
              src={fileURL}
              alt="Document preview"
              style={styles.image}
            />
          )}
        </div>

        <div style={styles.actions}>
          <button style={styles.cancelBtn} onClick={onCancel}>
            Cancel
          </button>
          <button style={styles.confirmBtn} onClick={onConfirm}>
            Proceed
          </button>
        </div>
      </div>
    </div>
  );
}

export default DocumentPreviewModal;
