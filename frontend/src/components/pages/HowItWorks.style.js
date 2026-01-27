export const howItWorksStyles = {
  wrapper: {
    marginTop: "80px",
    padding: "0 24px",
    textAlign: "center",
  },

  heading: {
    fontSize: "26px",
    fontWeight: "800",
    color: "#e5e7eb",
    letterSpacing: "-0.01em",
  },

  subheading: {
    marginTop: "10px",
    color: "#9ca3af",
    fontSize: "15px",
    maxWidth: "640px",
    marginInline: "auto",
    lineHeight: "1.6",
  },

  steps: {
    marginTop: "42px",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "26px",
    maxWidth: "1000px",
    marginInline: "auto",
  },

  card: {
    background: "#020617",
    border: "1px solid #1f2937",
    borderRadius: "16px",
    padding: "28px 22px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.35)",
    transition: "transform 0.25s ease, box-shadow 0.25s ease",
  },

  cardHover: {
    transform: "translateY(-6px)",
    boxShadow: "0 30px 60px rgba(0,0,0,0.45)",
  },

  icon: {
    fontSize: "38px",
    marginBottom: "14px",
  },

  title: {
    fontSize: "16px",
    fontWeight: "700",
    color: "#e5e7eb",
    marginBottom: "8px",
  },

  desc: {
    fontSize: "14px",
    lineHeight: "1.6",
    color: "#9ca3af",
  },
};
